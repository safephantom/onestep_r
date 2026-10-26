/* webR 연결: 브라우저 안에서 진짜 R을 돌린다.
   - 처음 실행할 때 R(WebAssembly)과 ggplot2·dplyr·readr·tibble을 내려받는다.
   - 학습자 코드는 tools/runtime.R 의 .rs$run_file()로 한 식씩 실행된다.
   - 코드 제안/자동완성 기능은 일부러 없다. */
(function () {
  'use strict';
  const WEBR_URL = 'https://webr.r-wasm.org/v0.6.0/webr.mjs';
  const PKGS = ['ggplot2', 'dplyr', 'readr', 'tibble'];
  const HOME = '/home/web_user';
  const PLOT_W = 504, PLOT_H = 324; // 7 x 4.5 in @ 72 px/in (캔버스는 2배 해상도로 그림)

  let webR = null;
  let shelter = null;
  let booting = null;
  let state = { phase: 'off', detail: '' }; // off | loading | ready | error
  const listeners = new Set();
  const enc = new TextEncoder();

  function setState(phase, detail) {
    state = { phase, detail: detail || '' };
    listeners.forEach((fn) => { try { fn(state); } catch (e) { /* ignore */ } });
  }

  async function writeText(path, text) {
    await webR.FS.writeFile(path, enc.encode(text));
  }

  async function boot() {
    if (location.protocol === 'about:' || !('Worker' in window)) {
      throw new Error('이 브라우저에서는 R을 실행할 수 없어요.');
    }
    setState('loading', 'R 엔진 내려받는 중 (처음 한 번 수십 MB)');
    let mod;
    try {
      mod = await import(WEBR_URL);
    } catch (e) {
      throw new Error('R 엔진(webR)을 불러오지 못했어요. 인터넷 연결을 확인해 주세요. claude.ai 공유 페이지에서는 보안 정책 때문에 R 실행이 막혀 있어요 — 내 컴퓨터의 r-study/index.html을 열면 실행돼요.');
    }
    webR = new mod.WebR({ interactive: false });
    await webR.init();
    setState('loading', 'ggplot2 · dplyr · readr · tibble 설치 중');
    await webR.installPackages(PKGS, { quiet: true });
    setState('loading', '수업 데이터 준비 중');
    try { await webR.FS.mkdir(HOME + '/QuantAnalysis_data'); } catch (e) { /* 이미 있음 */ }
    const data = window.RS_DATA || {};
    for (const name of Object.keys(data)) {
      const bytes = enc.encode(data[name]);
      await webR.FS.writeFile(HOME + '/QuantAnalysis_data/' + name, bytes);
      await webR.FS.writeFile(HOME + '/' + name, bytes);
    }
    await writeText('/tmp/rs_runtime.R', window.RS_RUNTIME || '');
    await webR.evalRVoid('source("/tmp/rs_runtime.R", encoding = "UTF-8"); .rs$init(webr = TRUE); setwd("' + HOME + '")');
    shelter = await new webR.Shelter();
    setState('ready', '');
  }

  function ensure() {
    if (!booting) {
      booting = boot().catch((e) => {
        setState('error', (e && e.message) || String(e));
        booting = null;
        throw e;
      });
    }
    return booting;
  }

  // webR 호출은 한 번에 하나씩
  let queue = Promise.resolve();
  function enqueue(fn) {
    const p = queue.then(fn, fn);
    queue = p.catch(() => {});
    return p;
  }

  function setupCode(keys) {
    const S = (window.RS && window.RS.setups) || {};
    return (keys || []).map((k) => S[k] || '').join('\n');
  }

  // wk5–8 패키지는 코드에 쓰일 때 처음 한 번만 설치한다 (처음 켤 때 내려받는 양을 줄이려고)
  // attach: tidyverse 식구라서 library(tidyverse)만 한 코드에서도 바로 쓸 수 있게 붙여 둔다
  const EXTRA = [
    { pkg: 'tidyr', attach: true, re: /\b(pivot_longer|pivot_wider|separate|unite|drop_na|replace_na)\s*\(/ },
    { pkg: 'stringr', attach: true, re: /\bstr_[a-z_]+\s*\(/ },
    { pkg: 'forcats', attach: true, re: /\b(fct_[a-z_]+|as_factor)\s*\(/ },
    { pkg: 'languageR', re: /\blibrary\(\s*languageR\s*\)/ },
    { pkg: 'broom', re: /\blibrary\(\s*broom\s*\)/ },
    { pkg: 'jtools', re: /\blibrary\(\s*jtools\s*\)/ },
    { pkg: 'sjPlot', re: /\blibrary\(\s*sjPlot\s*\)/ },
    { pkg: 'patchwork', re: /\blibrary\(\s*patchwork\s*\)/ },
    { pkg: 'Hmisc', re: /\bmean_cl_(boot|normal)\b/ },
  ];
  const installed = new Set();
  async function needPkgs(code) {
    const want = EXTRA.filter((e) => !installed.has(e.pkg) && e.re.test(code));
    if (!want.length) return;
    setState('loading', want.map((w) => w.pkg).join(' · ') + ' 설치 중 (처음 한 번, sjPlot은 1분 가까이 걸려요)');
    try {
      await webR.installPackages(want.map((w) => w.pkg), { quiet: true });
      for (const w of want) {
        installed.add(w.pkg);
        if (w.attach) await webR.evalRVoid('suppressPackageStartupMessages(library(' + w.pkg + '))');
      }
    } finally {
      setState('ready', '');
    }
  }

  async function run(code, opts) {
    opts = opts || {};
    await ensure();
    return enqueue(async () => {
      await needPkgs(setupCode(opts.setup) + '\n' + code);
      const t0 = performance.now();
      if (opts.setup && opts.setup.length) {
        await writeText('/tmp/rs_setup.R', setupCode(opts.setup));
        await webR.evalRVoid('set.seed(1); .rs$setup_file("/tmp/rs_setup.R")');
      }
      await writeText('/tmp/rs_code.R', code);
      const echo = opts.echo === false ? 'FALSE' : (opts.echo === 'auto' ? 'NA' : 'TRUE');
      const res = await shelter.captureR(
        (opts.seed ? 'set.seed(1); ' : '') + '.rs$run_file("/tmp/rs_code.R", echo = ' + echo + ')',
        {
          captureGraphics: { width: opts.width || PLOT_W, height: opts.height || PLOT_H, bg: 'white' },
          captureConditions: false,
          captureStreams: true,
          withAutoprint: false,
        }
      );
      const text = res.output
        .filter((o) => o.type === 'stdout' || o.type === 'stderr')
        .map((o) => o.data)
        .join('\n');
      const images = res.images || [];
      await shelter.purge();
      return { text, images, ms: performance.now() - t0 };
    });
  }

  async function check(exprs) {
    await ensure();
    return enqueue(async () => {
      await writeText('/tmp/rs_checks.txt', exprs.map((s) => s.replace(/\n/g, ' ')).join('\n'));
      const out = await webR.evalRString('.rs$check_file("/tmp/rs_checks.txt")');
      return out.split('').map((c) => c === '1');
    });
  }

  async function reset() {
    await ensure();
    return enqueue(async () => {
      await webR.evalRVoid('rm(list = ls(envir = globalenv(), all.names = FALSE), envir = globalenv()); .rs$last_gg <- NULL; .rs$ans <- NULL; while (!is.null(dev.list())) dev.off()');
    });
  }

  window.RSR = {
    ensure,
    run,
    check,
    reset,
    get state() { return state; },
    onState(fn) { listeners.add(fn); fn(state); return () => listeners.delete(fn); },
  };
})();
