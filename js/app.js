/* 한 층씩 R — 화면 전체 */
(function () {
  'use strict';
  const RS = window.RS;
  const OUT = window.RS_OUT || {};
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  // ---------------------------------------------------------------- 유틸
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    }
    return el;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function fnv(str) {
    let x = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      x ^= str.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
    }
    return ('0000000' + x.toString(16)).slice(-8);
  }
  const asArr = (s) => (s == null ? [] : Array.isArray(s) ? s : [s]);
  const keyOf = (setup, code) => fnv(asArr(setup).join(',') + '\u0000' + code);

  // 인라인 마크다운: `code`, **굵게**, 줄바꿈, "- " 목록
  function inline(s) {
    let t = esc(s);
    // `코드` 안의 *** 같은 글자가 굵게 표시로 먹히지 않도록 코드 조각을 먼저 빼 둔다
    const codes = [];
    t = t.replace(/`([^`]+)`/g, (m, c) => '\u0000' + (codes.push(c) - 1) + '\u0000');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a href="#/l/$1">$2</a>');
    t = t.replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    t = unitRefs(t);
    t = t.replace(/\u0000(\d+)\u0000/g, (m, i) => '<code>' + codes[+i] + '</code>');
    return t.replace(/\n/g, '<br>');
  }
  // 콘텐츠 원문의 "O단원"(단원 id 글자) → 화면의 단원 번호 "15단원" (단원 목록의 01, 02 … 와 같은 번호), 누르면 그 단원으로
  function unitNo(id) { return RS.units.findIndex((u) => u.id === id) + 1; }
  function unitRefs(t) {
    return t.replace(/\b([A-Z]{1,2}(?:·[A-Z]{1,2})*)단원/g, (m, letters) => {
      const ids = letters.split('·').map((L) => L.toLowerCase());
      if (!ids.every((id) => unitNo(id) > 0)) return m;
      return ids.map((id) => '<a href="#/u/' + id + '" title="' + esc(RS.units[unitNo(id) - 1].title) + '">' + unitNo(id) + '</a>').join('·') + '단원';
    });
  }
  function md(s) {
    const blocks = String(s).trim().split(/\n\s*\n/);
    return blocks.map((b) => {
      const lines = b.split('\n');
      if (lines.every((l) => /^\s*- /.test(l))) {
        return '<ul>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*- /, '')) + '</li>').join('') + '</ul>';
      }
      if (lines.every((l) => /^\s*\d+\. /.test(l))) {
        return '<ol>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*\d+\. /, '')) + '</li>').join('') + '</ol>';
      }
      return '<p>' + lines.map(inline).join('<br>') + '</p>';
    }).join('');
  }
  const mdEl = (s, cls) => h('div', { class: 'md ' + (cls || ''), html: md(s) });
  const inl = (s, tag, cls) => h(tag || 'span', { class: cls || null, html: inline(s) });

  // ---------------------------------------------------------------- R 문법 색칠
  const KW = new Set(['function', 'if', 'else', 'for', 'in', 'while', 'return', 'TRUE', 'FALSE', 'T', 'F', 'NULL', 'NA', 'Inf', 'NaN']);
  function hl(code) {
    const re = /(#[^\n]*)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(`[^`]*`)|(%[^%\s]*%|<-|->|\|>|==|!=|>=|<=|&&|\|\||[+\-*/^~=<>!&|$:])|(\b\d+\.?\d*(?:e[+-]?\d+)?L?\b|\.\d+\b)|([A-Za-z_.][A-Za-z0-9_.]*)(\s*\()?|(▢)/g;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      last = re.lastIndex;
      if (m[1]) out += '<span class="t-com">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="t-str">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="t-bq">' + esc(m[3]) + '</span>';
      else if (m[4]) out += '<span class="t-op">' + esc(m[4]) + '</span>';
      else if (m[5]) out += '<span class="t-num">' + esc(m[5]) + '</span>';
      else if (m[6]) {
        if (KW.has(m[6])) out += '<span class="t-kw">' + esc(m[6]) + '</span>' + esc(m[7] || '');
        else if (m[7]) out += '<span class="t-fn">' + esc(m[6]) + '</span>' + esc(m[7]);
        else out += esc(m[6]);
      } else if (m[8]) out += '<span class="t-blank">▢</span>';
    }
    return out + esc(code.slice(last));
  }
  const codePre = (code, cls) => h('pre', { class: 'code ' + (cls || ''), html: hl(code) });

  // ---------------------------------------------------------------- 저장 (브라우저에만)
  const STORE_KEY = 'hanchung-r.v1';
  let P = { quiz: {}, seen: {}, code: {}, play: '', last: null };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) P = Object.assign(P, JSON.parse(raw));
  } catch (e) { /* 저장소 사용 불가: 진도는 이 탭에서만 유지 */ }
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(P)); } catch (e) { /* ignore */ }
    }, 150);
  }

  // ---------------------------------------------------------------- 진도 파일 (여러 컴퓨터에서 git으로 주고받기)
  // r-study/progress.js 가 window.RS_PROGRESS 를 정의하면, 열 때마다 이 브라우저의 진도와 합친다.
  // 합치기는 더하기만 한다: 어느 쪽에서든 맞힌 문제는 맞힘, 본 레슨은 본 것으로 남는다.
  const SHARED = !!window.RS_SHARED; // claude.ai 공유 페이지 (진도 파일 기능 끔)
  function mergeProgress(dst, src) {
    let added = 0;
    if (!src || typeof src !== 'object') return added;
    for (const [id, s] of Object.entries(src.quiz || {})) {
      const d = dst.quiz[id];
      if (!d) { dst.quiz[id] = { ok: !!s.ok, first: s.first == null ? null : s.first, n: s.n || 0 }; if (s.ok) added++; continue; }
      if (s.ok && !d.ok) { d.ok = true; added++; }
      if (d.first == null) d.first = s.first == null ? null : s.first;
      else if (s.first === false) d.first = false; // 한쪽에서라도 첫 시도에 틀렸으면 복습 목록에 남긴다
      d.n = Math.max(d.n || 0, s.n || 0);
    }
    for (const [id, t] of Object.entries(src.seen || {})) {
      if (!dst.seen[id]) added++;
      if (!dst.seen[id] || t > dst.seen[id]) dst.seen[id] = t;
    }
    for (const [id, c] of Object.entries(src.code || {})) if (dst.code[id] == null) dst.code[id] = c;
    if (!dst.last && src.last) dst.last = src.last;
    return added;
  }
  const FILE_P = SHARED ? null : (window.RS_PROGRESS || null);
  const fileMerged = FILE_P ? mergeProgress(P, FILE_P) : 0;
  if (fileMerged) save();
  function progressFileText() {
    const data = { savedAt: new Date().toISOString(), quiz: P.quiz, seen: P.seen, code: P.code, last: P.last };
    return '/* 한 층씩 R 진도 파일 — "진도 옮기기" 화면의 [진도 파일로 저장]이 만든다. 직접 고치지 마세요. */\n' +
      'window.RS_PROGRESS = ' + JSON.stringify(data, null, 1) + ';\n';
  }
  async function saveProgressFile() {
    const text = progressFileText();
    if (window.showSaveFilePicker) {
      try {
        const fh = await window.showSaveFilePicker({ id: 'rs-progress', suggestedName: 'progress.js',
          types: [{ description: '진도 파일 (progress.js)', accept: { 'text/javascript': ['.js'] } }] });
        const w = await fh.createWritable();
        await w.write(text);
        await w.close();
        return { how: 'saved', name: fh.name };
      } catch (e) {
        if (e && e.name === 'AbortError') return { how: 'cancel' };
      }
    }
    const a = h('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/javascript' })), download: 'progress.js' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    return { how: 'download' };
  }
  function parseProgressText(text) {
    const i = text.indexOf('{');
    const j = text.lastIndexOf('}');
    if (i < 0 || j < i) throw new Error('진도 파일 모양이 아니에요.');
    return JSON.parse(text.slice(i, j + 1));
  }

  // ---------------------------------------------------------------- 코스 인덱스
  const LESSONS = [];
  const BY_ID = {};
  RS.units.forEach((u, ui) => {
    u.lessons.forEach((l, li) => {
      l.unit = u;
      if (l.setup == null && u.setup != null) l.setup = u.setup;
      l.ui = ui;
      l.li = li;
      l.n = LESSONS.length;
      l.quiz = l.quiz || [];
      l.quiz.forEach((q, qi) => { q.id = l.id + ':' + qi; q.lesson = l; });
      LESSONS.push(l);
      BY_ID[l.id] = l;
    });
  });
  const qState = (q) => P.quiz[q.id] || null;
  function lessonStatus(l) {
    if (!l.quiz.length) return P.seen[l.id] ? 'done' : 'todo';
    const ok = l.quiz.filter((q) => qState(q) && qState(q).ok).length;
    if (ok === l.quiz.length) return 'done';
    if (ok > 0 || P.seen[l.id]) return 'doing';
    return 'todo';
  }
  function unitStats(u) {
    const done = u.lessons.filter((l) => lessonStatus(l) === 'done').length;
    return { done, total: u.lessons.length };
  }
  function recordAnswer(q, ok) {
    const s = P.quiz[q.id] || { ok: false, first: null, n: 0 };
    s.n += 1;
    if (s.first === null) s.first = ok;
    if (ok) s.ok = true;
    P.quiz[q.id] = s;
    save();
    refreshChrome();
  }

  // ---------------------------------------------------------------- 출력 렌더링
  function parseOut(text) {
    const lines = String(text || '').split('\n');
    const segs = [];
    let view = null;
    for (const raw of lines) {
      let type = 'O';
      let line = raw;
      if (raw.charCodeAt(0) === 30) {
        if (raw[1] === 'V') { type = raw.slice(1, 3); line = raw.slice(3); } else { type = raw[1]; line = raw.slice(2); }
      }
      if (type === 'VH') { view = { title: line, rows: [], n: 0 }; segs.push({ type: 'V', view }); continue; }
      if (type === 'VR') { if (view) view.rows.push(line.split('\t')); continue; }
      if (type === 'VN') { if (view) view.n = +line; view = null; continue; }
      const lastSeg = segs[segs.length - 1];
      if (lastSeg && lastSeg.type === type) lastSeg.lines.push(line);
      else segs.push({ type, lines: [line] });
    }
    return segs.filter((s) => s.type === 'V' || s.lines.some((l) => l.trim() !== ''));
  }

  function renderOut(text, opts) {
    opts = opts || {};
    const box = h('div', { class: 'out' });
    const segs = parseOut(text);
    let condText = '';
    for (const s of segs) {
      if (s.type === 'V') {
        const v = s.view;
        const head = v.rows[0] || [];
        const tb = h('table', null,
          h('thead', null, h('tr', null, h('th', { class: 'rn' }, ''), head.map((c) => h('th', null, c)))),
          h('tbody', null, v.rows.slice(1).map((r, i) => h('tr', null, h('td', { class: 'rn' }, String(i + 1)), r.map((c) => h('td', null, c))))));
        box.appendChild(h('div', { class: 'o-view' },
          h('div', { class: 'o-view-bar' }, h('strong', null, 'View: ' + v.title), h('span', null, v.n + '행 × ' + head.length + '열' + (v.n > 300 ? ' (앞 300행만 표시)' : ''))),
          h('div', { class: 'o-view-scroll' }, tb)));
        continue;
      }
      const cls = { O: 'o-out', C: 'o-echo', M: 'o-msg', W: 'o-warn', E: 'o-err' }[s.type] || 'o-out';
      box.appendChild(h('pre', { class: cls }, s.lines.join('\n')));
      if (s.type === 'E' || s.type === 'W' || s.type === 'M') condText += s.lines.join('\n') + '\n';
    }
    if (condText && opts.explain !== false && window.RS_ERRORS) {
      const ex = window.RS_ERRORS.explain(condText);
      ex.forEach((r) => {
        box.appendChild(h('div', { class: 'o-explain k-' + r.kind },
          h('div', { class: 'o-explain-t' }, (r.kind === 'E' ? '에러 풀이 · ' : r.kind === 'W' ? '경고 풀이 · ' : '메시지 풀이 · ') + r.title),
          inl(r.t, 'div')));
      });
    }
    return box;
  }

  function staticResult(setup, code, opts) {
    const o = OUT[keyOf(setup, code)];
    if (!o) return null;
    const wrap = h('div', { class: 'result' });
    const hasText = parseOut(o.t).length > 0;
    if (hasText && !(opts && opts.noText)) wrap.appendChild(renderOut(o.t));
    (o.i || []).forEach((src) => wrap.appendChild(h('img', { class: 'plot', src: 'img/' + src, alt: 'R이 그린 그림', loading: 'lazy' })));
    return wrap;
  }
  const hasImage = (setup, code) => { const o = OUT[keyOf(setup, code)]; return !!(o && o.i && o.i.length); };
  function imgOf(setup, code) {
    const o = OUT[keyOf(setup, code)];
    if (!o || !o.i || !o.i.length) return h('div', { class: 'plot-missing' }, '(그림 없음 — 이 코드는 에러가 나요)');
    return h('img', { class: 'plot', src: 'img/' + o.i[0], alt: '그림', loading: 'lazy' });
  }

  function liveResult(res) {
    const wrap = h('div', { class: 'result live' });
    if (parseOut(res.text).length) wrap.appendChild(renderOut(res.text));
    res.images.forEach((bmp) => {
      const c = h('canvas', { class: 'plot', width: bmp.width, height: bmp.height });
      c.getContext('2d').drawImage(bmp, 0, 0);
      wrap.appendChild(c);
    });
    if (!parseOut(res.text).length && !res.images.length) wrap.appendChild(h('div', { class: 'o-none' }, '(출력 없음 — 할당(<-)만 하면 아무것도 보이지 않아요)'));
    return wrap;
  }

  function runErrorBox(e) {
    return h('div', { class: 'o-explain k-E' }, h('div', { class: 'o-explain-t' }, 'R을 실행할 수 없어요'), h('div', null, (e && e.message) || String(e)));
  }

  // ---------------------------------------------------------------- 코드 블록
  function codeFigure(b, lesson) {
    const setup = b.setup != null ? b.setup : lesson.setup;
    const fig = h('figure', { class: 'codefig' + (b.wide ? ' wide' : '') });
    if (b.cap) fig.appendChild(h('figcaption', { class: 'cap', html: inline(b.cap) }));
    if (!b.hideCode) fig.appendChild(codePre(b.code));
    const bar = h('div', { class: 'codebar' });
    const live = h('div', { class: 'live-slot' });
    const stat = b.run === false ? null : staticResult(setup, b.code);
    if (b.run !== false) {
      bar.appendChild(h('button', { class: 'btn sm', onclick: async (ev) => {
        const btn = ev.currentTarget;
        btn.disabled = true;
        btn.textContent = '실행 중…';
        live.innerHTML = '';
        try {
          const res = await RSR.run(b.code, { setup: asArr(setup), echo: 'auto', seed: true });
          live.appendChild(liveResult(res));
          if (stat) stat.hidden = true;
        } catch (e) { live.appendChild(runErrorBox(e)); }
        btn.disabled = false;
        btn.textContent = '▶ 다시 실행';
      } }, '▶ 직접 실행'));
    }
    bar.appendChild(h('button', { class: 'btn sm ghost', onclick: () => openPlay(b.code, asArr(setup)) }, '연습장에서 고쳐 보기'));
    if (stat) bar.appendChild(h('span', { class: 'hint' }, '아래 결과는 로컬 R 4.6로 미리 실행한 것'));
    fig.appendChild(bar);
    if (stat) fig.appendChild(stat);
    fig.appendChild(live);
    return fig;
  }

  // ---------------------------------------------------------------- 본문 블록
  function tableEl(t, cap) {
    return h('div', { class: 'tablewrap' },
      cap ? h('div', { class: 'cap', html: inline(cap) }) : null,
      h('table', { class: 'tbl' },
        h('thead', null, h('tr', null, t.head.map((c) => h('th', { html: inline(c) })))),
        h('tbody', null, t.rows.map((r) => h('tr', null, r.map((c) => h('td', { html: inline(String(c)) })))))));
  }
  function renderBlock(b, lesson) {
    if (typeof b === 'string') return mdEl(b);
    if (b.code != null) return codeFigure(b, lesson);
    if (b.note != null) {
      return h('aside', { class: 'note n-' + (b.kind || 'tip') }, h('div', { class: 'note-t' }, b.note), mdEl(b.t || ''));
    }
    if (b.table) return tableEl(b.table);
    if (b.compare) {
      const grid = h('div', { class: 'compare' });
      b.compare.forEach((c) => {
        const setup = c.setup != null ? c.setup : lesson.setup;
        grid.appendChild(h('div', { class: 'cmp' },
          c.label ? h('div', { class: 'cmp-l', html: inline(c.label) }) : null,
          codePre(c.code),
          staticResult(setup, c.code) || h('div', { class: 'plot-missing' }, '')));
      });
      return grid;
    }
    if (b.anno != null) return annoFigure(b);
    if (b.html) return h('div', { class: 'md', html: b.html });
    return h('div');
  }

  // 출력 해부: R 출력 글자 위에 번호 표시를 달고, 누르면 아래 설명이 강조된다
  // { anno: '출력 원문', cap, marks: [{ s: '찾을 글자', n: 몇 번째(기본 1), t: '설명' }] }
  function annoSpans(text, marks) {
    const spans = [];
    marks.forEach((m, k) => {
      let at = -1;
      for (let c = 0; c < (m.n || 1); c++) at = text.indexOf(m.s, at + 1);
      if (at >= 0) spans.push({ k, at, end: at + m.s.length });
    });
    return spans.sort((a, b) => a.at - b.at).filter((s, i, arr) => i === 0 || s.at >= arr[i - 1].end);
  }
  function annoFigure(b) {
    const fig = h('figure', { class: 'anno' });
    if (b.cap) fig.appendChild(h('figcaption', { class: 'cap', html: inline(b.cap) }));
    const pre = h('pre', { class: 'anno-pre' });
    const list = h('ol', { class: 'anno-list' });
    const marks = [], items = [];
    function pick(k) {
      marks.forEach((el) => el.classList.toggle('on', +el.dataset.k === k));
      items.forEach((el, j) => el.classList.toggle('on', j === k));
      items[k].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    let pos = 0;
    annoSpans(b.anno, b.marks).forEach((s) => {
      pre.appendChild(document.createTextNode(b.anno.slice(pos, s.at)));
      const el = h('button', { class: 'am', type: 'button', 'data-k': String(s.k), onclick: () => pick(s.k) },
        b.anno.slice(s.at, s.end), h('sup', null, String(s.k + 1)));
      marks.push(el);
      pre.appendChild(el);
      pos = s.end;
    });
    pre.appendChild(document.createTextNode(b.anno.slice(pos)));
    b.marks.forEach((m, k) => {
      const li = h('li', { class: 'anno-i' },
        h('button', { class: 'anno-n', type: 'button', onclick: () => pick(k) }, String(k + 1)),
        h('div', null, h('code', { class: 'anno-s' }, m.label || m.s.trim()), mdEl(m.t)));
      items.push(li);
      list.appendChild(li);
    });
    fig.appendChild(pre);
    fig.appendChild(h('div', { class: 'hint' }, '번호가 붙은 부분을 누르면 아래 설명이 강조돼요.'));
    fig.appendChild(list);
    return fig;
  }

  // ---------------------------------------------------------------- 퀴즈 공통
  const LETTERS = 'ABCDEFGH';
  function seededShuffle(arr, seedStr) {
    const a = arr.slice();
    let s = parseInt(fnv(seedStr), 16) || 1;
    for (let i = a.length - 1; i > 0; i--) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      const j = s % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function quizShell(q, n, total, kindLabel) {
    const st = qState(q);
    const card = h('section', { class: 'quiz' + (st && st.ok ? ' solved' : ''), id: 'q-' + q.id.replace(':', '-') });
    card.appendChild(h('div', { class: 'quiz-head' },
      h('span', { class: 'quiz-n' }, '퀴즈 ' + n + '/' + total),
      h('span', { class: 'quiz-kind' }, kindLabel),
      h('span', { class: 'quiz-state' }, st && st.ok ? (st.first ? '한 번에 맞힘' : '맞힘') : '')));
    card.appendChild(mdEl(q.q, 'quiz-q'));
    // 퀴즈를 풀려면 데이터 값을 봐야 할 때: data: 'birds' → RS.tables.birds 표를 보여 준다
    const t = q.data && RS.tables[q.data];
    if (t) card.appendChild(tableEl(t, t.cap));
    return card;
  }
  function feedback(ok, text, extra) {
    return h('div', { class: 'fb ' + (ok ? 'fb-ok' : 'fb-bad') },
      h('div', { class: 'fb-t' }, ok ? '정답' : '아니에요'),
      text ? mdEl(text) : null,
      extra || null);
  }
  function markSolved(card, q) {
    card.classList.add('solved');
    const s = $('.quiz-state', card);
    const st = qState(q);
    if (s) s.textContent = st && st.first ? '한 번에 맞힘' : '맞힘';
  }

  // 선택형 (mcq, predict, tf, pick, codepick)
  function choiceQuiz(q, n, total) {
    const kind = q.type;
    const label = { mcq: '고르기', predict: '결과 예측', tf: 'O / X', pick: '그림 고르기', codepick: '코드 고르기' }[kind] || '고르기';
    const card = quizShell(q, n, total, label);
    const setup = q.setup != null ? q.setup : q.lesson.setup;
    if (q.code && kind !== 'codepick') card.appendChild(codePre(q.code));
    if (q.showImg && q.code) card.appendChild(imgOf(setup, q.code));
    if (kind === 'codepick') {
      const target = q.target || (q.opts.find((o) => o.ok) || {}).code;
      card.appendChild(h('div', { class: 'target' }, imgOf(setup, target)));
    }
    const opts = q.shuffle === false ? q.opts : seededShuffle(q.opts, q.id);
    const list = h('div', { class: 'opts ' + (kind === 'pick' ? 'opts-img' : kind === 'codepick' ? 'opts-code' : '') });
    const fbSlot = h('div', { class: 'fb-slot' });
    let solved = !!(qState(q) && qState(q).ok);
    const buttons = [];
    opts.forEach((o, i) => {
      let body;
      if (kind === 'pick') body = h('div', { class: 'opt-img' }, imgOf(o.setup != null ? o.setup : setup, o.code), h('div', { class: 'opt-code', hidden: true }, codePre(o.code)));
      else if (kind === 'codepick') body = codePre(o.code);
      else body = inl(o.t, 'span', 'opt-t');
      const btn = h('button', { class: 'opt', type: 'button' }, h('span', { class: 'opt-l' }, LETTERS[i]), body);
      btn.addEventListener('click', () => {
        const ok = !!o.ok;
        if (!solved) recordAnswer(q, ok);
        buttons.forEach((b) => b.classList.remove('pick-bad'));
        btn.classList.add(ok ? 'pick-ok' : 'pick-bad');
        fbSlot.innerHTML = '';
        const extra = h('div');
        if (ok) {
          solved = true;
          markSolved(card, q);
          buttons.forEach((b) => b.classList.add('locked'));
          $$('.opt-code', list).forEach((c) => { c.hidden = false; });
          if (kind === 'pick') {
            opts.forEach((oo, j) => { if (oo.why && !oo.ok) buttons[j].appendChild(h('div', { class: 'opt-why', html: inline(oo.why) })); });
          }
          if ((kind === 'predict' || q.reveal) && q.code) {
            const r = staticResult(setup, q.code);
            if (r) extra.appendChild(h('div', { class: 'reveal' }, h('div', { class: 'reveal-t' }, '실제 R 결과'), r));
          }
        }
        fbSlot.appendChild(feedback(ok, (o.why || '') + (ok && q.exp ? '\n\n' + q.exp : ''), extra));
        if (!ok && !solved) {
          fbSlot.appendChild(h('button', { class: 'linkbtn', onclick: () => {
            const right = buttons[opts.findIndex((x) => x.ok)];
            if (right) right.click();
          } }, '정답 보기'));
        }
      });
      buttons.push(btn);
      list.appendChild(btn);
    });
    card.appendChild(list);
    card.appendChild(fbSlot);
    return card;
  }

  // 빈칸 채우기
  const normAns = (s) => String(s).trim().replace(/\s+/g, ' ').replace(/'/g, '"').replace(/\s*([(),=~+])\s*/g, '$1');
  function fillQuiz(q, n, total) {
    const card = quizShell(q, n, total, '빈칸 채우기');
    const setup = q.setup != null ? q.setup : q.lesson.setup;
    const parts = q.code.split('▢');
    const pre = h('pre', { class: 'code fill' });
    const inputs = [];
    parts.forEach((p, i) => {
      pre.appendChild(h('span', { html: hl(p) }));
      if (i < parts.length - 1) {
        const w = Math.max(4, ...asArr(q.ans[i]).map((a) => a.length)) + 1;
        const inp = h('input', { class: 'blank', type: 'text', size: String(w), autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': '빈칸 ' + (i + 1) });
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); checkBtn.click(); } });
        inputs.push(inp);
        pre.appendChild(inp);
      }
    });
    card.appendChild(pre);
    const fbSlot = h('div', { class: 'fb-slot' });
    let solved = !!(qState(q) && qState(q).ok);
    const checkBtn = h('button', { class: 'btn', onclick: () => {
      const results = inputs.map((inp, i) => asArr(q.ans[i]).map(normAns).includes(normAns(inp.value)));
      inputs.forEach((inp, i) => { inp.classList.toggle('bad', !results[i]); inp.classList.toggle('ok', results[i]); });
      const ok = results.every(Boolean);
      if (!solved) recordAnswer(q, ok);
      fbSlot.innerHTML = '';
      const extra = h('div');
      if (ok) {
        solved = true;
        markSolved(card, q);
        if (q.full) {
          const r = staticResult(setup, q.full);
          if (r) extra.appendChild(h('div', { class: 'reveal' }, h('div', { class: 'reveal-t' }, '완성된 코드의 결과'), codePre(q.full), r));
        }
      }
      fbSlot.appendChild(feedback(ok, ok ? q.why : (q.hint || '빨간 칸을 다시 보세요. 철자·대소문자·따옴표까지 R은 정확히 구분해요.'), extra));
      if (!ok) {
        fbSlot.appendChild(h('button', { class: 'linkbtn', onclick: () => {
          inputs.forEach((inp, i) => { inp.value = asArr(q.ans[i])[0]; });
          checkBtn.click();
        } }, '정답 보기'));
      }
    } }, '확인');
    card.appendChild(h('div', { class: 'row' }, checkBtn));
    card.appendChild(fbSlot);
    return card;
  }

  // 순서 맞추기
  function orderQuiz(q, n, total) {
    const card = quizShell(q, n, total, '순서 맞추기');
    const pool = h('div', { class: 'ord-pool' });
    const ans = h('div', { class: 'ord-ans' });
    const fbSlot = h('div', { class: 'fb-slot' });
    let picked = [];
    const shuffled = seededShuffle(q.lines.map((t, i) => ({ t, i })), q.id);
    function draw() {
      pool.innerHTML = '';
      ans.innerHTML = '';
      shuffled.forEach((it) => {
        if (picked.includes(it)) return;
        pool.appendChild(h('button', { class: 'tile', type: 'button', onclick: () => { picked.push(it); draw(); } }, codePre(it.t, 'tile-code')));
      });
      if (!picked.length) ans.appendChild(h('div', { class: 'ord-empty' }, '아래 조각을 순서대로 누르세요'));
      picked.forEach((it, k) => {
        ans.appendChild(h('button', { class: 'tile in', type: 'button', title: '빼기', onclick: () => { picked.splice(k, 1); draw(); } }, codePre(it.t, 'tile-code')));
      });
    }
    draw();
    let solved = !!(qState(q) && qState(q).ok);
    card.appendChild(ans);
    card.appendChild(pool);
    card.appendChild(h('div', { class: 'row' },
      h('button', { class: 'btn', onclick: () => {
        if (picked.length !== q.lines.length) { fbSlot.innerHTML = ''; fbSlot.appendChild(feedback(false, '조각을 모두 놓아 주세요.')); return; }
        const ok = picked.every((it, k) => q.lines[it.i] === q.lines[k]);
        if (!solved) recordAnswer(q, ok);
        fbSlot.innerHTML = '';
        if (ok) { solved = true; markSolved(card, q); }
        fbSlot.appendChild(feedback(ok, ok ? q.why : (q.hint || '어느 조각이 먼저 있어야 다음 조각이 동작할지 생각해 보세요.')));
        if (!ok) fbSlot.appendChild(h('button', { class: 'linkbtn', onclick: () => { picked = q.lines.map((t, i) => shuffled.find((s) => s.i === i)); draw(); } }, '정답 순서 보기'));
      } }, '확인'),
      h('button', { class: 'btn ghost', onclick: () => { picked = []; draw(); fbSlot.innerHTML = ''; } }, '다시')));
    card.appendChild(fbSlot);
    return card;
  }

  // ---------------------------------------------------------------- 코드 작성 문제
  function editor(value, onChange, rows) {
    const ta = h('textarea', { class: 'editor', spellcheck: 'false', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', rows: String(rows || 6), 'aria-label': 'R 코드 입력' });
    ta.value = value || '';
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        insertAt(ta, '  ');
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        insertAt(ta, ' %>% ');
      } else if (e.altKey && e.key === '-') {
        e.preventDefault();
        insertAt(ta, ' <- ');
      }
    });
    ta.addEventListener('input', () => { autoGrow(ta); onChange && onChange(ta.value); });
    requestAnimationFrame(() => autoGrow(ta));
    return ta;
  }
  function insertAt(ta, text) {
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + text + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.dispatchEvent(new Event('input'));
  }
  function autoGrow(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight + 4, 520) + 'px';
  }

  function writeQuiz(q, n, total) {
    const card = quizShell(q, n, total, '직접 써 보기');
    card.classList.add('write');
    const setup = q.setup != null ? q.setup : q.lesson.setup;
    if (q.target) {
      card.appendChild(h('div', { class: 'target' }, h('div', { class: 'target-t' }, '목표 그림 (이렇게 나오면 성공)'), imgOf(setup, q.target)));
    }
    if (q.given) card.appendChild(h('div', { class: 'given' }, h('div', { class: 'given-t' }, '미리 실행되는 준비 코드'), codePre(q.given)));
    const ta = editor(P.code[q.id] != null ? P.code[q.id] : (q.starter || ''), (v) => { P.code[q.id] = v; save(); }, 5);
    const out = h('div', { class: 'live-slot' });
    const checklist = h('ul', { class: 'checks' });
    const fbSlot = h('div', { class: 'fb-slot' });
    let solved = !!(qState(q) && qState(q).ok);

    async function runAndCheck(btn) {
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = RSR.state.phase === 'ready' ? '실행 중…' : 'R 준비 중…';
      out.innerHTML = '';
      checklist.innerHTML = '';
      fbSlot.innerHTML = '';
      try {
        const code = ta.value;
        const res = await RSR.run(code, { setup: asArr(setup), echo: true, seed: true });
        out.appendChild(liveResult(res));
        const rChecks = q.checks.filter((c) => c.r);
        const rRes = rChecks.length ? await RSR.check(rChecks.map((c) => c.r)) : [];
        let k = 0;
        const all = q.checks.map((c) => {
          let pass;
          if (c.r) pass = rRes[k++];
          else if (c.re) { const hit = new RegExp(c.re, c.flags || '').test(code); pass = c.not ? !hit : hit; }
          else pass = true;
          return { c, pass };
        });
        all.forEach(({ c, pass }) => checklist.appendChild(h('li', { class: pass ? 'ck-ok' : (c.opt ? 'ck-opt' : 'ck-bad') },
          h('span', { class: 'ck-i' }, pass ? '✓' : (c.opt ? '–' : '✗')),
          inl((pass ? (c.ok || c.m) : c.m) + (c.opt && !pass ? ' (선택 — 채점에는 안 들어가요)' : ''), 'span'))));
        const ok = all.every((x) => x.pass || x.c.opt);
        if (!solved) recordAnswer(q, ok);
        if (ok) { solved = true; markSolved(card, q); }
        fbSlot.appendChild(feedback(ok, ok ? (q.why || '모든 조건을 통과했어요.') : '✗ 표시된 조건을 보고 고쳐서 다시 실행해 보세요. (채점은 정해진 규칙으로만 해요)'));
      } catch (e) {
        out.appendChild(runErrorBox(e));
        out.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn ghost sm', onclick: () => {
          if (!solved) recordAnswer(q, true);
          solved = true; markSolved(card, q);
          fbSlot.innerHTML = '';
          fbSlot.appendChild(feedback(true, 'RStudio에서 직접 확인한 것으로 표시했어요.'));
        } }, 'RStudio에서 해 봤고 성공했어요')));
      }
      btn.disabled = false;
      btn.textContent = old;
    }
    const runBtn = h('button', { class: 'btn', onclick: (e) => runAndCheck(e.currentTarget) }, '▶ 실행하고 채점');
    ta.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runBtn.click(); } });
    card.appendChild(ta);
    const solBox = h('div', { class: 'sol', hidden: true });
    card.appendChild(h('div', { class: 'row' },
      runBtn,
      h('button', { class: 'btn ghost', onclick: () => { ta.value = q.starter || ''; P.code[q.id] = ta.value; save(); autoGrow(ta); } }, '처음으로'),
      q.sol ? h('button', { class: 'btn ghost', onclick: () => {
        if (!solBox.hidden) { solBox.hidden = true; return; }
        if (!solved && !confirm('모범 답안을 볼까요? 스스로 먼저 끝까지 해 보는 걸 권해요.')) return;
        solBox.hidden = false;
      } }, '모범 답안') : null,
      h('span', { class: 'hint' }, 'Ctrl+Enter 실행 · Ctrl+Shift+M → %>% · Alt+- → <-')));
    if (q.sol) {
      solBox.appendChild(h('div', { class: 'sol-t' }, '모범 답안 (한 가지 예 — 다른 답도 조건만 맞으면 정답)'));
      solBox.appendChild(codePre(q.sol));
      if (q.solNote) solBox.appendChild(mdEl(q.solNote));
    }
    card.appendChild(solBox);
    if (q.tips) card.appendChild(h('details', { class: 'tips' }, h('summary', null, '막히면: 관련 개념 다시 보기'), mdEl(q.tips)));
    card.appendChild(out);
    card.appendChild(checklist);
    card.appendChild(fbSlot);
    return card;
  }

  function renderQuiz(q, n, total) {
    if (q.type === 'fill') return fillQuiz(q, n, total);
    if (q.type === 'order') return orderQuiz(q, n, total);
    if (q.type === 'write') return writeQuiz(q, n, total);
    if (q.type === 'tf' && !q.opts) {
      q.opts = [{ t: 'O (맞다)', ok: q.ans === true, why: q.why }, { t: 'X (틀리다)', ok: q.ans === false, why: q.why }];
      q.shuffle = false;
    }
    return choiceQuiz(q, n, total);
  }

  // ---------------------------------------------------------------- 화면: 레슨
  function viewLesson(id) {
    const l = BY_ID[id];
    if (!l) return viewHome();
    P.seen[l.id] = Date.now();
    P.last = l.id;
    save();
    const main = $('#main');
    main.innerHTML = '';
    const art = h('article', { class: 'lesson' });
    art.appendChild(h('div', { class: 'crumb' },
      h('a', { href: '#/u/' + l.unit.id }, (l.ui + 1) + '단원 ' + l.unit.title),
      h('span', null, ' · ' + (l.ui + 1) + '-' + (l.li + 1) + ' (' + (l.li + 1) + ' / ' + l.unit.lessons.length + ')')));
    art.appendChild(h('h1', { class: 'l-title' }, l.title));
    if (l.src) art.appendChild(h('div', { class: 'src' }, h('span', { class: 'src-k' }, '출처'), inl(l.src, 'span')));
    if (l.key) art.appendChild(h('p', { class: 'key', html: inline(l.key) }));
    (l.body || []).forEach((b) => art.appendChild(renderBlock(b, l)));
    if (l.quiz.length) {
      art.appendChild(h('h2', { class: 'q-h' }, '확인 퀴즈'));
      l.quiz.forEach((q, i) => art.appendChild(renderQuiz(q, i + 1, l.quiz.length)));
    }
    const prev = LESSONS[l.n - 1];
    const next = LESSONS[l.n + 1];
    art.appendChild(h('nav', { class: 'pager' },
      prev ? h('a', { class: 'pg prev', href: '#/l/' + prev.id }, h('small', null, '이전'), h('span', null, prev.title)) : h('span'),
      next ? h('a', { class: 'pg next', href: '#/l/' + next.id }, h('small', null, next.ui !== l.ui ? '다음 단원' : '다음'), h('span', null, next.title)) : h('a', { class: 'pg next', href: '#/' }, h('small', null, '끝'), h('span', null, '처음 화면으로'))));
    main.appendChild(art);
    main.scrollTop = 0;
    window.scrollTo(0, 0);
    refreshChrome();
    if (pendingHit) { jumpToHit(art, pendingHit); pendingHit = null; }
  }

  // ---------------------------------------------------------------- 화면: 단원
  function viewUnit(id) {
    const u = RS.units.find((x) => x.id === id);
    if (!u) return viewHome();
    const main = $('#main');
    main.innerHTML = '';
    const st = unitStats(u);
    const art = h('article', { class: 'lesson unit-page' },
      h('div', { class: 'crumb' }, h('a', { href: '#/' }, '처음'), h('span', null, ' · ' + unitNo(u.id) + '단원')),
      h('h1', { class: 'l-title' }, u.title),
      u.desc ? mdEl(u.desc, 'lead') : null,
      h('div', { class: 'unit-meter' }, bar(st.done, st.total), h('span', null, st.done + ' / ' + st.total + ' 레슨 완료')));
    const ol = h('ol', { class: 'unit-list' });
    u.lessons.forEach((l) => {
      const s = lessonStatus(l);
      ol.appendChild(h('li', { class: 'ul-item s-' + s }, h('a', { href: '#/l/' + l.id },
        h('span', { class: 'ul-dot' }), h('span', { class: 'ul-t' }, l.title),
        h('span', { class: 'ul-q' }, l.quiz.length ? l.quiz.length + '문제' : '읽기'))));
    });
    art.appendChild(ol);
    main.appendChild(art);
    window.scrollTo(0, 0);
    refreshChrome(u.id);
  }

  function bar(done, total) {
    const b = h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(done) });
    b.appendChild(h('div', { class: 'bar-fill', style: 'width:' + (total ? (100 * done / total) : 0) + '%' }));
    return b;
  }

  // ---------------------------------------------------------------- 화면: 처음
  function viewHome() {
    const main = $('#main');
    main.innerHTML = '';
    const totalQ = LESSONS.reduce((s, l) => s + l.quiz.length, 0);
    const okQ = LESSONS.reduce((s, l) => s + l.quiz.filter((q) => qState(q) && qState(q).ok).length, 0);
    const doneL = LESSONS.filter((l) => lessonStatus(l) === 'done').length;
    const nextL = LESSONS.find((l) => lessonStatus(l) !== 'done') || LESSONS[0];
    const lastL = P.last && BY_ID[P.last];
    const art = h('article', { class: 'home' });
    art.appendChild(h('header', { class: 'hero' },
      h('div', { class: 'hero-k' }, '양적 언어자료 분석 · wk2–8 (중간고사 범위)'),
      h('h1', null, '한 층씩 R'),
      mdEl('ggplot 그림이 `+`로 **한 층씩** 쌓이듯, wk2–8 스크립트에 나온 것만 **한 조각씩** 짚어요. 각 조각마다 설명 → 실제 R 결과 → 퀴즈. 수업의 Practice와 숙제(HW1)는 직접 풀어서 채점받고, wk7–8은 **회귀 결과 표를 해석**하는 연습까지 해요.', 'lead'),
      h('div', { class: 'hero-stats' },
        stat(doneL + ' / ' + LESSONS.length, '레슨 완료'),
        stat(okQ + ' / ' + totalQ, '퀴즈 맞힘'),
        stat(String(Object.values(P.quiz).filter((s) => s.first === false).length), '복습할 문제', '#/review')),
      h('div', { class: 'row' },
        h('a', { class: 'btn big', href: '#/l/' + nextL.id }, doneL ? '이어서 하기 → ' + nextL.title : '1단원부터 시작'),
        lastL && lastL !== nextL ? h('a', { class: 'btn ghost', href: '#/l/' + lastL.id }, '마지막으로 본 곳: ' + lastL.title) : null)));

    // 목표 보드
    const goals = RS.goals || [];
    if (goals.length) {
      const gb = h('section', { class: 'goals' }, h('h2', null, '최종 목표: Practice · 숙제 완수'), mdEl('아래 연습과 숙제 문제를 웹 연습장(진짜 R)에서 풀어 채점까지 통과하면 완료로 표시돼요.', 'muted'));
      const grid = h('div', { class: 'goal-grid' });
      goals.forEach((g) => {
        const l = BY_ID[g.lesson];
        if (!l) return;
        const s = lessonStatus(l);
        grid.appendChild(h('a', { class: 'goal s-' + s, href: '#/l/' + l.id },
          h('span', { class: 'goal-src' }, g.src),
          h('span', { class: 'goal-t' }, g.title),
          h('span', { class: 'goal-s' }, s === 'done' ? '완료' : s === 'doing' ? '진행 중' : '아직')));
      });
      gb.appendChild(grid);
      art.appendChild(gb);
    }

    // 단원 목록
    const us = h('section', { class: 'units' }, h('h2', null, '단원'));
    RS.units.forEach((u, i) => {
      const st = unitStats(u);
      us.appendChild(h('a', { class: 'unit-card', href: '#/u/' + u.id },
        h('span', { class: 'uc-n' }, String(i + 1).padStart(2, '0')),
        h('span', { class: 'uc-body' }, h('span', { class: 'uc-t' }, u.title), u.short ? h('span', { class: 'uc-d' }, u.short) : null),
        h('span', { class: 'uc-p' }, bar(st.done, st.total), h('small', null, st.done + '/' + st.total))));
    });
    art.appendChild(us);

    art.appendChild(h('section', { class: 'about' }, h('h2', null, '이 도구에 대해'), mdEl(RS.about || '')));
    main.appendChild(art);
    window.scrollTo(0, 0);
    refreshChrome();
  }
  function stat(v, label, href) {
    const inner = [h('strong', null, v), h('span', null, label)];
    return href ? h('a', { class: 'stat', href }, inner) : h('div', { class: 'stat' }, inner);
  }

  // ---------------------------------------------------------------- 화면: 복습
  function viewReview() {
    const main = $('#main');
    main.innerHTML = '';
    const art = h('article', { class: 'lesson' },
      h('div', { class: 'crumb' }, h('a', { href: '#/' }, '처음'), h('span', null, ' · 복습')),
      h('h1', { class: 'l-title' }, '복습: 처음에 틀린 문제'),
      mdEl('첫 시도에서 틀렸던 문제만 모았어요. 다시 풀어도 기록(첫 시도)은 바뀌지 않아요.', 'lead'));
    const wrong = [];
    LESSONS.forEach((l) => l.quiz.forEach((q) => { const s = qState(q); if (s && s.first === false) wrong.push(q); }));
    if (!wrong.length) art.appendChild(mdEl('아직 없어요. 퀴즈를 풀다 틀리면 여기에 모여요.', 'muted'));
    let cur = null;
    wrong.forEach((q) => {
      if (cur !== q.lesson) {
        cur = q.lesson;
        art.appendChild(h('h2', { class: 'rv-h' }, h('a', { href: '#/l/' + q.lesson.id }, q.lesson.title)));
      }
      art.appendChild(renderQuiz(q, q.lesson.quiz.indexOf(q) + 1, q.lesson.quiz.length));
    });
    main.appendChild(art);
    window.scrollTo(0, 0);
    refreshChrome();
  }

  // ---------------------------------------------------------------- 화면: 진도 옮기기
  function viewSync() {
    const main = $('#main');
    main.innerHTML = '';
    const totalQ = LESSONS.reduce((s, l) => s + l.quiz.length, 0);
    const okQ = LESSONS.reduce((s, l) => s + l.quiz.filter((q) => qState(q) && qState(q).ok).length, 0);
    const doneL = LESSONS.filter((l) => lessonStatus(l) === 'done').length;
    const art = h('article', { class: 'lesson' },
      h('div', { class: 'crumb' }, h('a', { href: '#/' }, '처음'), h('span', null, ' · 진도 옮기기')),
      h('h1', { class: 'l-title' }, '진도 옮기기 (여러 컴퓨터에서 이어 하기)'));
    if (SHARED) {
      art.appendChild(mdEl('이 공유 페이지의 진도는 **지금 쓰는 브라우저에만** 저장돼요. 같은 컴퓨터, 같은 브라우저로 다시 들어오면 이어서 할 수 있어요.', 'lead'));
      main.appendChild(art);
      window.scrollTo(0, 0);
      refreshChrome();
      return;
    }
    art.appendChild(mdEl('진도는 원래 브라우저 안에만 저장돼요. 그래서 `r-study/progress.js` 파일에 진도를 담아 **git으로 주고받아요.** index.html을 열 때마다 이 파일의 진도를 이 브라우저의 진도와 **합쳐요** (더하기만 해서, 어느 컴퓨터에서 푼 문제든 사라지지 않아요).', 'lead'));
    const fileTxt = FILE_P
      ? (FILE_P.savedAt ? new Date(FILE_P.savedAt).toLocaleString('ko-KR') + '에 저장한 파일' : '있음') + (fileMerged ? ' — 이번에 열면서 새 기록 ' + fileMerged + '개를 합쳤어요' : ' — 이 브라우저에 이미 다 있어요')
      : '없음 (아직 저장한 적이 없거나 파일이 비어 있어요)';
    art.appendChild(tableEl({ head: ['', '상태'], rows: [
      ['이 브라우저', '레슨 ' + doneL + ' / ' + LESSONS.length + ' 완료 · 퀴즈 ' + okQ + ' / ' + totalQ + ' 맞힘'],
      ['진도 파일 `progress.js`', fileTxt],
    ] }));
    const msg = h('div', { class: 'hint' });
    art.appendChild(h('h2', null, '이 컴퓨터에서 끝낼 때'));
    art.appendChild(mdEl('1. 아래 **[진도 파일로 저장]**을 누르고, 저장 창에서 `r-study` 폴더의 `progress.js`를 골라 **덮어쓰기**해요. (처음 한 번만 폴더를 찾아가면, 다음부터는 같은 폴더가 열려요.)\n2. git으로 commit, push 해요. (Claude에게 "진도 push해 줘"라고 해도 돼요.)'));
    art.appendChild(h('div', { class: 'row' },
      h('button', { class: 'btn', onclick: async () => {
        const r = await saveProgressFile();
        msg.textContent = r.how === 'saved' ? r.name + '에 저장했어요. 이제 commit, push 하면 돼요.'
          : r.how === 'download' ? '이 브라우저는 폴더에 바로 저장할 수 없어서 내려받기 폴더에 progress.js로 받았어요. 그 파일을 r-study 폴더로 옮겨 덮어쓰기 해 주세요.'
          : '저장을 취소했어요.';
      } }, '진도 파일로 저장'), msg));
    art.appendChild(h('h2', null, '다른 컴퓨터에서 이어 할 때'));
    art.appendChild(mdEl('1. git pull 해요.\n2. index.html을 열면(이미 열려 있으면 새로고침) **저절로 합쳐져요.** 위 표에서 합친 기록 수를 확인할 수 있어요.'));
    const inp = h('input', { type: 'file', accept: '.js,.json,text/javascript,application/json', hidden: true });
    const msg2 = h('div', { class: 'hint' });
    inp.addEventListener('change', async () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      try {
        const n = mergeProgress(P, parseProgressText(await f.text()));
        save();
        msg2.textContent = f.name + '에서 새 기록 ' + n + '개를 합쳤어요.';
        buildSide();
        refreshChrome();
      } catch (e) {
        msg2.textContent = '읽을 수 없는 파일이에요: ' + ((e && e.message) || e);
      }
      inp.value = '';
    });
    art.appendChild(mdEl('git 없이 파일만 옮겨 왔다면 직접 불러와도 돼요.', 'muted'));
    art.appendChild(h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: () => inp.click() }, '진도 파일 불러오기'), inp, msg2));
    main.appendChild(art);
    window.scrollTo(0, 0);
    refreshChrome();
  }

  // ---------------------------------------------------------------- 검색
  // 레슨마다 글자를 모아 두고, 낱말이 모두 들어 있는 레슨을 찾는다. 어디에 나왔는지(제목 > 핵심 > 코드 > 본문 > 퀴즈)로 순위를 매긴다.
  const CODE_KEYS = new Set(['code', 'sol', 'target', 'starter', 'full', 'lines']);
  const SKIP_KEYS = new Set(['id', 'type', 'kind', 'setup', 'expect', 'r', 'ok', 'shuffle', 'lesson']);
  const plain = (s) => String(s).replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, '$1').replace(/<[^>]+>/g, ' ').replace(/\*\*|`/g, '');
  function collectText(x, w, wCode, out, key) {
    if (x == null || SKIP_KEYS.has(key)) return;
    if (typeof x === 'string') { out.push({ w: CODE_KEYS.has(key) ? wCode : w, t: plain(x) }); return; }
    if (Array.isArray(x)) { x.forEach((y) => collectText(y, w, wCode, out, CODE_KEYS.has(key) ? key : undefined)); return; }
    if (typeof x === 'object') Object.entries(x).forEach(([k, v]) => collectText(v, w, wCode, out, k));
  }
  let SEARCH_IDX = null;
  function searchIndex() {
    if (SEARCH_IDX) return SEARCH_IDX;
    SEARCH_IDX = LESSONS.map((l) => {
      const f = [{ w: 10, t: plain(l.title) }];
      if (l.key) f.push({ w: 6, t: plain(l.key) });
      if (l.src) f.push({ w: 2, t: plain(l.src) });
      collectText(l.body || [], 3, 4, f);
      l.quiz.forEach((q) => collectText(Object.assign({}, q, { lesson: null }), 1, 1, f));
      f.forEach((x) => { x.lo = x.t.toLowerCase(); });
      return { l, f };
    });
    return SEARCH_IDX;
  }
  function searchLessons(query) {
    const toks = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return [];
    const res = [];
    searchIndex().forEach(({ l, f }) => {
      let score = 0;
      for (const tk of toks) {
        const hits = f.filter((x) => x.lo.includes(tk));
        if (!hits.length) return;
        score += Math.max(...hits.map((x) => x.w)) + Math.min(hits.length, 5) * 0.2;
      }
      const tk0 = toks[0];
      const snip = f.filter((x) => x.w < 10 && x.lo.includes(tk0)).sort((a, b) => b.w - a.w)[0];
      res.push({ l, score, snip });
    });
    return res.sort((a, b) => b.score - a.score || a.l.n - b.l.n);
  }
  function markText(text, toks) {
    let out = esc(text);
    toks.forEach((tk) => {
      const re = new RegExp(esc(tk).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      out = out.replace(re, (m) => '<mark>' + m + '</mark>');
    });
    return out;
  }
  function snippetOf(t, tk) {
    const flat = t.replace(/\s+/g, ' ');
    const i = flat.toLowerCase().indexOf(tk);
    const a = Math.max(0, i - 28);
    return (a > 0 ? '…' : '') + flat.slice(a, i + tk.length + 50) + (i + tk.length + 50 < flat.length ? '…' : '');
  }
  let searchQ = '';
  let pendingHit = null;
  function renderSearch() {
    const box = $('#searchRes');
    const side = $('#side');
    if (!box) return;
    box.innerHTML = '';
    const q = searchQ.trim();
    side.classList.toggle('searching', !!q);
    if (!q) return;
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    const res = searchLessons(q);
    box.appendChild(h('div', { class: 'sr-n' }, res.length ? res.length + '개 레슨' : '찾는 낱말이 들어 있는 레슨이 없어요.'));
    res.slice(0, 40).forEach(({ l, snip }) => {
      const href = '#/l/' + l.id;
      box.appendChild(h('a', { class: 'sr-item', href, onclick: (e) => {
        e.preventDefault();
        pendingHit = toks[0];
        if (location.hash === href) route(); else location.hash = href;
      } },
        h('span', { class: 'sr-t' }, h('small', null, (l.ui + 1) + '-' + (l.li + 1)), h('span', { html: markText(l.title, toks) })),
        snip ? h('span', { class: 'sr-s', html: markText(snippetOf(snip.t, toks[0]), toks) }) : null));
    });
  }
  // 검색 결과로 레슨을 열면, 그 낱말이 처음 보이는 곳으로 내려가 잠깐 표시한다
  function jumpToHit(root, tk) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const i = node.nodeValue.toLowerCase().indexOf(tk);
      if (i < 0 || !node.parentElement || !node.parentElement.offsetParent) continue;
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + tk.length);
      const mark = h('mark', { class: 'hit' });
      range.surroundContents(mark);
      mark.scrollIntoView({ block: 'center' });
      return;
    }
  }

  // ---------------------------------------------------------------- 사이드바·상단
  function buildSide() {
    const side = $('#side');
    side.innerHTML = '';
    side.appendChild(h('div', { class: 'side-top' },
      h('a', { href: '#/', class: 'side-link' }, '처음 화면'),
      h('a', { href: '#/review', class: 'side-link' }, '복습'),
      SHARED ? null : h('a', { href: '#/sync', class: 'side-link' }, '진도 옮기기')));
    const inp = h('input', { type: 'search', id: 'searchInp', class: 'search-inp', placeholder: '검색 (예: linewidth, group)', 'aria-label': '레슨 검색', autocomplete: 'off', spellcheck: 'false', value: searchQ });
    inp.addEventListener('input', () => { searchQ = inp.value; renderSearch(); });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { inp.value = ''; searchQ = ''; renderSearch(); inp.blur(); }
      if (e.key === 'Enter') { const first = $('#searchRes .sr-item'); if (first) first.click(); }
    });
    side.appendChild(h('div', { class: 'search' }, inp));
    side.appendChild(h('div', { class: 'search-res', id: 'searchRes' }));
    RS.units.forEach((u, i) => {
      const st = unitStats(u);
      const det = h('details', { class: 'side-unit', 'data-unit': u.id },
        h('summary', null,
          h('span', { class: 'su-n' }, String(i + 1).padStart(2, '0')),
          h('span', { class: 'su-t' }, u.title),
          h('span', { class: 'su-c' }, st.done + '/' + st.total)),
        h('ol', null, u.lessons.map((l) => h('li', null, h('a', { href: '#/l/' + l.id, 'data-lesson': l.id, class: 's-' + lessonStatus(l) }, h('span', { class: 'sd' }), h('span', null, l.title))))));
      side.appendChild(det);
    });
    renderSearch();
  }
  function refreshChrome(unitId) {
    const cur = (location.hash.match(/^#\/l\/(.+)$/) || [])[1];
    const curL = cur && BY_ID[decodeURIComponent(cur)];
    $$('#side a[data-lesson]').forEach((a) => {
      const l = BY_ID[a.dataset.lesson];
      a.className = 's-' + lessonStatus(l) + (curL === l ? ' cur' : '');
    });
    $$('#side details.side-unit').forEach((d) => {
      const u = RS.units.find((x) => x.id === d.dataset.unit);
      const st = unitStats(u);
      $('.su-c', d).textContent = st.done + '/' + st.total;
      if ((curL && curL.unit === u) || unitId === u.id) {
        if (!d.open) d.open = true;
      }
    });
    const act = $('#side a.cur');
    if (act && !act.dataset.scrolled) { act.scrollIntoView({ block: 'nearest' }); act.dataset.scrolled = '1'; }
    const total = LESSONS.length;
    const done = LESSONS.filter((l) => lessonStatus(l) === 'done').length;
    const tp = $('#topProgress');
    tp.innerHTML = '';
    tp.appendChild(bar(done, total));
    tp.appendChild(h('span', null, done + '/' + total));
  }

  // ---------------------------------------------------------------- 연습장
  let playSetup = [];
  function openPlay(code, setup) {
    const panel = $('#play');
    panel.hidden = false;
    document.body.classList.add('play-open');
    if (code != null) {
      const ta = $('#playEd');
      ta.value = code;
      P.play = code;
      save();
      autoGrow(ta);
      playSetup = setup || [];
      $('#playSetup').textContent = playSetup.length ? '준비 코드 함께 실행: ' + playSetup.join(', ') : '';
    }
    $('#playEd').focus();
  }
  function closePlay() {
    $('#play').hidden = true;
    document.body.classList.remove('play-open');
  }
  function buildPlay() {
    const panel = $('#play');
    const ta = editor(P.play || '# 여기에 자유롭게 R 코드를 써 보세요.\n# Ctrl+Enter: 실행 (선택한 부분만 실행도 가능)\n\nggplot(mpg, aes(x = displ, y = hwy)) +\n  geom_point()\n', (v) => { P.play = v; save(); }, 10);
    ta.id = 'playEd';
    const out = h('div', { class: 'play-out', id: 'playOut' });
    async function runPlay() {
      const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
      const code = sel.trim() ? sel : ta.value;
      const runBtn = $('#playRun');
      runBtn.disabled = true;
      runBtn.textContent = RSR.state.phase === 'ready' ? '실행 중…' : 'R 준비 중…';
      try {
        const res = await RSR.run(code, { setup: playSetup, echo: true });
        playSetup = [];
        $('#playSetup').textContent = '';
        const item = h('div', { class: 'play-item' }, liveResult(res));
        out.appendChild(item);
        item.scrollIntoView({ block: 'end', behavior: 'smooth' });
      } catch (e) {
        out.appendChild(runErrorBox(e));
      }
      runBtn.disabled = false;
      runBtn.textContent = '▶ 실행';
    }
    ta.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runPlay(); } });
    panel.appendChild(h('div', { class: 'play-head' },
      h('strong', null, '연습장'),
      h('span', { class: 'play-sub' }, '브라우저 안의 진짜 R (webR) · 자동완성·코드 제안 없음'),
      h('button', { class: 'iconbtn', 'aria-label': '연습장 닫기', onclick: closePlay }, '×')));
    panel.appendChild(ta);
    panel.appendChild(h('div', { class: 'row' },
      h('button', { class: 'btn', id: 'playRun', onclick: runPlay }, '▶ 실행'),
      h('button', { class: 'btn ghost sm', onclick: () => { out.innerHTML = ''; } }, '출력 지우기'),
      h('button', { class: 'btn ghost sm', onclick: async () => {
        if (!confirm('R 세션의 모든 객체를 지울까요? (mpg, diamonds는 그대로 남아요)')) return;
        try { await RSR.reset(); out.appendChild(h('div', { class: 'o-none' }, '세션을 초기화했어요.')); } catch (e) { out.appendChild(runErrorBox(e)); }
      } }, '세션 초기화'),
      h('span', { class: 'hint', id: 'playSetup' })));
    panel.appendChild(h('details', { class: 'play-info' }, h('summary', null, '쓸 수 있는 데이터'), mdEl(RS.playInfo || '')));
    panel.appendChild(out);
  }

  // ---------------------------------------------------------------- R 상태 표시
  function bindRState() {
    const el = $('#rState');
    RSR.onState((s) => {
      el.className = 'rstate p-' + s.phase;
      const lbl = $('.lbl', el);
      lbl.textContent = { off: 'R 켜기', loading: 'R 준비 중…', ready: 'R 준비됨', error: 'R 사용 불가' }[s.phase];
      el.title = s.detail || (s.phase === 'off' ? '누르면 R(webR)을 미리 켭니다. 처음엔 수십 MB를 내려받아요.' : '');
      const d = $('#rDetail');
      if (d) { d.textContent = s.detail; d.hidden = !s.detail; }
    });
    el.addEventListener('click', () => { if (RSR.state.phase === 'off' || RSR.state.phase === 'error') RSR.ensure().catch(() => {}); });
  }

  // ---------------------------------------------------------------- 라우터
  function route() {
    const hsh = location.hash || '#/';
    let m;
    document.body.classList.remove('side-open');
    if ((m = hsh.match(/^#\/l\/(.+)$/))) return viewLesson(decodeURIComponent(m[1]));
    if ((m = hsh.match(/^#\/u\/(.+)$/))) return viewUnit(decodeURIComponent(m[1]));
    if (hsh === '#/review') return viewReview();
    if (hsh === '#/sync') return viewSync();
    return viewHome();
  }

  // ---------------------------------------------------------------- 테마 (자동 → 밝게 → 어둡게)
  const THEME_KEY = 'hanchung-r.theme';
  let theme = null;
  let themeSetByUs = false;
  try { theme = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  function applyTheme() {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') { root.dataset.theme = theme; themeSetByUs = true; }
    else if (themeSetByUs) { delete root.dataset.theme; themeSetByUs = false; }
    const btn = $('#themeBtn');
    btn.textContent = { light: '밝게', dark: '어둡게' }[theme] || '자동';
    btn.setAttribute('aria-label', '테마 바꾸기 (지금: ' + btn.textContent + ')');
  }
  function cycleTheme() {
    theme = theme === 'light' ? 'dark' : theme === 'dark' ? null : 'light';
    try { if (theme) localStorage.setItem(THEME_KEY, theme); else localStorage.removeItem(THEME_KEY); } catch (e) { /* ignore */ }
    applyTheme();
  }

  function init() {
    applyTheme();
    $('#themeBtn').addEventListener('click', cycleTheme);
    buildSide();
    buildPlay();
    bindRState();
    $('#playBtn').addEventListener('click', () => ($('#play').hidden ? openPlay() : closePlay()));
    $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('side-open'));
    $('#scrim').addEventListener('click', () => document.body.classList.remove('side-open'));
    window.addEventListener('hashchange', route);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !$('#play').hidden && document.activeElement !== $('#playEd')) closePlay();
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        document.body.classList.add('side-open');
        $('#searchInp').focus();
      }
    });
    route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.RS_APP = { keyOf, fnv };
})();
