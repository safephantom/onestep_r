/* 단원 S: dplyr와 ggplot 잇기 + Practice에 꼭 필요한 두 도구 */
RS.units.push({
  id: 's',
  title: 'dplyr → ggplot 잇기 (+ Practice용 두 도구)',
  short: '걸러서 바로 그리기, 요약한 데이터 그리기, factor(levels, labels), stat_summary로 평균 점',
  desc: '데이터를 다듬고(wk4) 그리는(wk2–3) 두 흐름을 합쳐요. 뒤의 두 레슨(factor, stat_summary)은 수업 스크립트 본문에는 없지만 **wk4 practice plot을 똑같이 그리는 데 꼭 필요해서** 넣었어요 (factor는 wk3 폴더의 plot_practice.R에 나와요).',
  lessons: [
    {
      id: 's-pipegg',
      title: '걸러서 바로 그리기: 데이터 %>% … %>% ggplot() + …',
      src: 'wk4 filter/%>% + wk2 ggplot',
      key: '`%>%`로 다듬은 결과가 ggplot()의 **첫 인자(data)**로 들어간다. ggplot() 이후로는 `+`.',
      body: [
        { code: `mpg %>%
  filter(class %in% c("compact", "suv")) %>%
  ggplot(aes(x = displ, y = hwy, color = class)) +
  geom_point()` },
        '중간 결과에 이름을 붙이지 않아도 돼요. 같은 그림을 두 단계로 쓰면:',
        { code: `two <- filter(mpg, class %in% c("compact", "suv"))
ggplot(two, aes(x = displ, y = hwy, color = class)) +
  geom_point()`, run: false },
        '**기호 규칙 정리**: 데이터 → 데이터 단계는 `%>%`, 그림에 층을 얹을 땐 `+`. `ggplot(...)` 줄 끝에서 기호가 바뀌어요.',
      ],
      quiz: [
        { type: 'order', q: '"birds 중 참새목만 골라 bird별 inches 박스플롯"을 조립하세요.', lines: ['birds %>%', '  filter(is.sparrow == T) %>%', '  ggplot(aes(x = bird, y = inches)) +', '  geom_boxplot()'], setup: 'birds', why: '%>% → %>% → ggplot +  → geom.' },
        { type: 'write', q: 'mpg에서 **drv가 "f"인 차만** 골라 x = displ, y = hwy 산점도를 그리세요 (파이프 사용).', checks: [
          { re: '%>%|\\|>', m: '파이프(`%>%`)로 데이터를 넘겨 주세요.' },
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: 'identical(unique(data()$drv), "f")', m: '그림의 데이터가 drv == "f"인 행만이어야 해요.' },
          { r: 'maps("x", "displ") && maps("y", "hwy")', m: 'x = displ, y = hwy' },
        ], sol: `mpg %>%
  filter(drv == "f") %>%
  ggplot(aes(x = displ, y = hwy)) +
  geom_point()` },
      ],
    },
    {
      id: 's-summplot',
      title: '요약한 데이터로 그리기: sibimit_means',
      src: 'wk3_Rproject.R 39–52행 (Practice 3 직전)',
      key: '토큰 데이터(sibimit)를 **참가자별 평균**(sibimit_means)으로 줄인 다음 그리면, 점 하나 = **참가자 한 명의 평균**이 된다.',
      setup: ['sibimit', 'sibimit_means'],
      body: [
        { compare: [
          { label: '토큰 데이터: 점 3,223개', code: `ggplot(sibimit, aes(x = Place, y = COGm)) +
  geom_boxplot()` },
          { label: '참가자 평균: 점이 참가자 수만큼', code: `ggplot(sibimit_means, aes(x = Place, y = COGm)) +
  geom_boxplot()` },
        ] },
        '오른쪽은 이상치가 크게 줄었어요. 토큰 하나하나의 흔들림이 평균으로 눌렸기 때문이에요. 논문에서 "by-subject means"를 그리는 이유예요. Practice 3·4는 이 sibimit_means로 그려요.',
      ],
      quiz: [
        { type: 'mcq', q: 'sibimit_means로 그린 박스플롯에서 점(이상치) 하나는 무엇일까요?', opts: [
          { t: '한 참가자 × 조음위치 × 과제 조합의 COGm 평균', ok: true, why: 'group_by 조합 하나 = 1행.' },
          { t: '발화 토큰 하나', why: '그건 sibimit(요약 전).' },
          { t: '참가자 전체 평균', why: '과제·조음위치별로 따로예요.' },
        ] },
      ],
    },
    {
      id: 's-factor',
      title: '[Practice 도구] factor(levels =, labels =): 범주의 순서와 이름',
      src: 'wk3/plot_practice.R 21행 `factor(Category, levels = c(...))` · wk4 practice plot의 x축 (Control, NoComp, NoCont, Context)',
      key: '글자 열은 **알파벳 순**으로 그려진다. 원하는 순서를 주려면 `factor(열, levels = c(원하는 순서))`, 보이는 이름까지 바꾸려면 `labels = c(새 이름들)`.',
      setup: 'sibmerger',
      body: [
        'sib_merger의 condition 값은 `control`, `nc`, `nw`, `yc`예요 (wk4 269행 주석: control = alveolar; nc = No.Context; nw = No.Competitor; yc = Context). 그대로 그리면 알파벳 순 control, nc, nw, yc가 돼요. wk4 practice plot의 순서는 **Control, NoComp, NoCont, Context**:',
        { code: `factor(c("nc", "yc", "control", "nw"),
       levels = c("control", "nw", "nc", "yc"),
       labels = c("Control", "NoComp", "NoCont", "Context"))` },
        '`levels`와 `labels`는 **같은 위치끼리 짝**이에요: control→Control, nw→NoComp, nc→NoCont, yc→Context. (nw가 "No Competitor" = NoComp, nc가 "No Context" = NoCont — 알파벳 순서와 반대라서 짝을 잘못 맞추기 쉬워요!)',
        '데이터에 적용할 땐 mutate 안에서 같은 이름으로 덮어써요:',
        { code: `sibmerger %>%
  filter(task == "interactive") %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context"))) %>%
  ggplot(aes(x = condition, y = midSpecMean)) +
  geom_boxplot()` },
        '`filter(task == "interactive")`가 필요한 이유: read 과제 행은 condition이 NA라서, 빼지 않으면 x축에 NA 범주가 생겨요.',
      ],
      quiz: [
        { type: 'mcq', q: '`levels = c("control", "nw", "nc", "yc")`, `labels = c("Control", "NoComp", "NoCont", "Context")`일 때 "nc"는 무엇으로 보일까요?', opts: [
          { t: 'NoCont', ok: true, why: '세 번째 level(nc) ↔ 세 번째 label(NoCont).' },
          { t: 'NoComp', why: 'NoComp는 두 번째(nw)의 짝.' },
          { t: 'nc 그대로', why: 'labels가 보이는 이름을 바꿔요.' },
        ] },
        { type: 'mcq', q: 'factor 없이 condition을 x축에 두면 순서는?', opts: [
          { t: 'control, nc, nw, yc (알파벳 순)', ok: true, why: '글자 열은 알파벳 순.' },
          { t: '데이터에 처음 나온 순서', why: 'ggplot은 글자 열을 정렬해요.' },
          { t: 'Control, NoComp, NoCont, Context', why: '이름을 바꾸려면 labels가 필요해요.' },
        ] },
        { type: 'write', q: 'sibmerger의 **interactive** 과제만 골라, condition을 Control → NoComp → NoCont → Context 순서·이름으로 바꾼 뒤 x = condition, y = midSpecMean 박스플롯을 그리세요.', checks: [
          { r: 'has_geom("boxplot")', m: 'geom_boxplot() 층' },
          { r: 'maps("y", "midSpecMean")', m: 'y = midSpecMean' },
          { r: 'maps("x", "condition")', m: 'x = condition' },
          { r: 'x_order(c("Control", "NoComp", "NoCont", "Context"))', m: 'x축이 Control, NoComp, NoCont, Context 순서여야 해요 (factor의 levels·labels 짝 확인).' },
          { r: 'cond_ok()', m: '라벨 짝 확인: control → Control, **nw → NoComp**, **nc → NoCont**, yc → Context (levels와 labels는 같은 위치끼리 짝)' },
          { r: 'all(data()$task == "interactive")', m: 'interactive 과제만 (read는 condition이 NA).' },
        ], sol: `sibmerger %>%
  filter(task == "interactive") %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context"))) %>%
  ggplot(aes(x = condition, y = midSpecMean)) +
  geom_boxplot()` },
      ],
    },
    {
      id: 's-mean',
      title: '[Practice 도구] stat_summary(): 그룹 평균을 점으로',
      src: 'wk4 practice plot의 큰 동그라미(평균) · Lee-Kim & Chou (2002) Fig. 6 "filled circles represent the means"',
      key: '`stat_summary(fun = mean, geom = "point")` → x 그룹마다 y의 **평균**을 계산해 점 하나로 찍는다. 박스플롯(중앙값)에는 없는 평균을 보여 줄 때 쓴다.',
      body: [
        { code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  stat_summary(fun = mean, geom = "point", size = 3, color = "red")` },
        'J단원의 "stat"이 여기서 직접 등장해요: geom_bar가 알아서 count를 계산하듯, stat_summary는 **fun에 준 함수(mean)**로 계산한 값을 geom("point")으로 그려요. 빨간 점(평균)이 굵은 선(중앙값)과 다른 곳이 있죠 — 치우친 분포예요.',
        '색 매핑도 돼요: `stat_summary(aes(color = place), fun = mean, geom = "point")` → 그룹의 색을 따라가요.',
      ],
      quiz: [
        { type: 'mcq', q: '`stat_summary(fun = mean, geom = "point")`의 점 하나는?', opts: [
          { t: 'x 그룹 하나의 y 평균', ok: true, why: '그룹마다 점 하나.' },
          { t: '데이터 한 행', why: '행을 그대로 찍는 건 geom_point.' },
          { t: '중앙값', why: 'fun = mean이라 평균이에요. (median을 주면 중앙값)' },
        ] },
        { type: 'write', q: 'mpg로 class별 hwy **바이올린**을 그리고, 그 위에 class별 **평균**을 크기 3의 점으로 찍으세요.', setup: [], checks: [
          { r: 'has_geom("violin")', m: 'geom_violin() 층' },
          { r: 'has_stat("summary")', m: '`stat_summary(fun = mean, geom = "point")` 층' },
          { r: 'has_param("point", "size", 3)', m: '평균 점 크기 3' },
          { r: 'geom_order("violin", "point")', m: '평균 점이 바이올린 **위에**(나중 층) 있어야 보여요.' },
        ], sol: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_violin() +
  stat_summary(fun = mean, geom = "point", size = 3)` },
      ],
    },
  ],
});
