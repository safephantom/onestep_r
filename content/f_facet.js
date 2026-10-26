/* 단원 F: facet — 패널 나누기 */
RS.units.push({
  id: 'f',
  title: 'facet: 패널로 나누기',
  short: 'facet_wrap(~ class), nrow, facet_grid(행 ~ 열), . 의 뜻, ~ 를 빼먹으면',
  desc: 'wk2_ggplot_intro.R 55–69행. Practice 3·4("panelled by MergerStatus and Gender")와 wk4 practice plot("panelled by Subject")의 기초.',
  lessons: [
    {
      id: 'f-wrap',
      title: 'facet_wrap(~ class): 범주마다 작은 그림',
      src: 'wk2_ggplot_intro.R 55–58행',
      key: '`facet_wrap(~ 변수)`는 그 변수의 값마다 **작은 그림(패널)**을 하나씩 만들어 줄줄이 늘어놓는다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_wrap(~ class, nrow = 2)` },
        '- 패널 위의 회색 띠(**strip**)에 값 이름이 적혀요.\n- 모든 패널이 **같은 축 범위**를 써서 패널끼리 비교하기 쉬워요.\n- `~`(물결표)는 "이 변수에 따라"라는 뜻의 **공식(formula)** 기호예요. 꼭 붙여야 해요.',
        'color로 7개 범주를 한 판에 겹쳐 그리는 것(E단원)과 비교해 보세요. 범주가 많고 점이 겹칠수록 facet이 더 읽기 좋아요.',
      ],
      quiz: [
        { type: 'mcq', q: '`facet_wrap(~ class)`의 패널 수는?', opts: [
          { t: '7', ok: true, why: 'class의 값 7개.' },
          { t: '234', why: '행 수가 아니라 값의 종류 수예요.' },
          { t: '2', why: '2는 nrow(줄 수)예요.' },
        ] },
        { type: 'write', q: 'x = displ, y = hwy 산점도를 **drv**별 패널로 나누세요.', target: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ drv)`, checks: [
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: 'facet() %in% c("wrap", "grid")', m: 'facet 층이 필요해요 (`+ facet_wrap(~ …)`).' },
          { r: 'facet_has("drv")', m: 'drv로 나눠야 해요.' },
          { r: 'identical(facet_vars(), "drv")', m: 'drv 하나로만 나눠요.' },
        ], sol: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ drv)` },
      ],
    },
    {
      id: 'f-nrow',
      title: 'nrow / ncol: 패널 배치',
      src: 'wk2_ggplot_intro.R 58행 `facet_wrap(~ class, nrow = 2)`',
      key: '`nrow = 2` → 패널을 **2줄**로. `ncol = 4` → **4칸** 폭으로. 안 주면 ggplot이 정사각형에 가깝게 알아서.',
      body: [
        { compare: [
          { label: '`nrow = 2`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ class, nrow = 2)` },
          { label: '`nrow = 1`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ class, nrow = 1)` },
        ] },
        'wk3 `plot_practice.R`은 `facet_wrap(~Category, nrow = 1)`로 세 범주를 가로 한 줄에 놓아요 (Kim & Clayard Fig. 6E 스타일).',
      ],
      quiz: [
        { type: 'pick', q: '`facet_wrap(~ class, ncol = 2)`의 배치는?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ class, ncol = 2)`, ok: true, why: '2칸 폭 → 7개 패널이 4줄.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ class, nrow = 2)`, why: '이건 nrow = 2 (2줄).' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ class)`, why: '이건 기본 배치 (3 × 3).' },
        ] },
        { type: 'mcq', q: '7개 패널을 `nrow = 2`로 놓으면 한 줄에 최대 몇 개?', opts: [
          { t: '4', ok: true, why: '위 줄 4개, 아래 줄 3개.' },
          { t: '2', why: '2는 줄 수예요.' },
          { t: '7', why: '그건 nrow = 1일 때.' },
        ] },
      ],
    },
    {
      id: 'f-grid',
      title: 'facet_grid(drv ~ cyl): 두 변수로 격자',
      src: 'wk2_ggplot_intro.R 61–64행',
      key: '`facet_grid(행 ~ 열)`: `~` **왼쪽 변수는 가로줄(행)**, **오른쪽 변수는 세로칸(열)**. 모든 조합이 격자로 놓인다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_grid(drv ~ cyl)` },
        '읽는 법: 오른쪽 띠(4, f, r) = drv = 행, 위쪽 띠(4, 5, 6, 8) = cyl = 열. **빈 패널**도 보여요 — 예: 후륜(r) 4기통 차는 데이터에 없어요. facet_grid는 없는 조합도 자리를 비워 두어서, "이 조합은 없다"는 것까지 보여 줘요.',
        { note: 'Practice 3·4와 연결', kind: 'src', t: '"panelled by MergerStatus and Gender" → `facet_grid(MergerStatus ~ Gender)`면 MERGED/DISTINCT가 행, F/M이 열인 2 × 2 격자가 돼요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`facet_grid(drv ~ cyl)`에서 **행(가로줄)**을 나누는 변수는?', opts: [
          { t: 'drv', ok: true, why: '`~` 왼쪽 = 행.' },
          { t: 'cyl', why: '`~` 오른쪽 = 열.' },
        ] },
        { type: 'pick', q: '`facet_grid(cyl ~ drv)`(순서 바꿈)의 결과는?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_grid(cyl ~ drv)`, ok: true, why: 'cyl 4줄 × drv 3칸.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_grid(drv ~ cyl)`, why: '이건 원래 순서 (drv 3줄 × cyl 4칸).' },
        ] },
        { type: 'mcq', q: 'facet_grid에 빈 패널이 생기는 이유는?', opts: [
          { t: '그 조합의 데이터가 없어서', ok: true, why: '격자는 모든 조합의 자리를 만들어요.' },
          { t: '에러가 나서', why: '정상 동작이에요.' },
          { t: 'nrow를 안 줘서', why: 'facet_grid의 배치는 변수 값의 수로 정해져요.' },
        ] },
      ],
    },
    {
      id: 'f-dot',
      title: 'facet_grid(. ~ cyl): 점(.)은 "나누지 않음"',
      src: 'wk2_ggplot_intro.R 67–69행',
      key: '`.`은 그 방향으로는 **나누지 않는다**는 자리 표시. `. ~ cyl` → 열로만(가로로 나란히), `drv ~ .` → 행으로만(세로로 쌓기).',
      body: [
        { compare: [
          { label: '`facet_grid(. ~ cyl)`: 가로로 나란히', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_grid(. ~ cyl)` },
          { label: '`facet_grid(drv ~ .)`: 세로로 쌓기', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_grid(drv ~ .)` },
        ] },
        '세로로 쌓으면 **x축(displ)이 한 줄로 정렬**되어 x값 비교가 쉽고, 가로로 놓으면 **y축(hwy)이 정렬**되어 y값 비교가 쉬워요. 무엇을 비교하고 싶은지에 따라 고르세요.',
      ],
      quiz: [
        { type: 'mcq', q: 'drv별 패널을 **위아래로 쌓으려면**?', opts: [
          { t: '`facet_grid(drv ~ .)`', ok: true, why: '왼쪽 = 행.' },
          { t: '`facet_grid(. ~ drv)`', why: '이건 가로로 나란히.' },
          { t: '`facet_grid(drv)`', why: '`~`가 없으면 에러예요.' },
        ] },
        { type: 'fill', q: 'cyl별 패널을 가로 한 줄로 놓으세요.', code: 'facet_grid(▢ ~ cyl)', ans: [['.']], why: '`.` = 행 방향으로는 나누지 않음.', full: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_grid(. ~ cyl)` },
      ],
    },
    {
      id: 'f-two',
      title: '두 변수로 나누는 두 방법: grid vs wrap',
      src: 'Practice 3·4 "panelled by MergerStatus and Gender"',
      key: '`facet_grid(A ~ B)`는 A×B **격자**(축 제목이 행·열 가장자리에), `facet_wrap(~ A + B)`는 조합들을 **줄줄이**(띠에 두 값이 함께) 놓는다.',
      body: [
        { compare: [
          { label: '`facet_grid(drv ~ year)`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_grid(drv ~ year)` },
          { label: '`facet_wrap(~ drv + year)`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ drv + year)` },
        ] },
        '격자는 "행끼리, 열끼리" 비교가 한눈에 되고, wrap은 공간을 덜 차지하고 없는 조합은 아예 빼요. 과제 문장이 "panelled by A and B"라면 둘 다 정답이에요 — 이 도구의 채점도 두 변수가 facet에 모두 들어 있는지만 봐요.',
      ],
      quiz: [
        { type: 'mcq', q: '`facet_wrap(~ drv + year)`의 띠(strip)에는 무엇이 적힐까요?', opts: [
          { t: '두 값이 위아래로 (예: 4 / 1999)', ok: true, why: '조합마다 두 값을 함께 표시해요.' },
          { t: 'drv 값만', why: '두 변수의 조합이에요.' },
          { t: '"drv + year"라는 글자', why: '변수 이름이 아니라 값이 적혀요.' },
        ] },
        { type: 'mcq', q: 'Practice 3의 "panelled by MergerStatus and Gender"를 만족하는 코드는? (둘 다 골라도 되는 상황에서 가장 알맞은 설명)', opts: [
          { t: '`facet_grid(MergerStatus ~ Gender)`와 `facet_wrap(~ MergerStatus + Gender)` 모두 가능', ok: true, why: '두 변수로 패널을 나누기만 하면 돼요.' },
          { t: '`facet_wrap(~ MergerStatus)`만', why: 'Gender가 빠졌어요.' },
          { t: '`facet_grid(MergerStatus, Gender)`', why: '`~`가 필요해요.' },
        ] },
      ],
    },
    {
      id: 'f-pitfalls',
      title: 'facet 실수 모음: ~ 빠뜨리기, 연속 변수로 나누기',
      src: 'facet 에러와 경고',
      key: '`~`를 빠뜨리면 에러, 이름 오타는 "faceting variables" 에러, **연속 변수**로 나누면 값마다 패널이 생겨 폭발한다.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(drv)`, expect: 'error', cap: '① ~ 빠뜨림: drv를 (데이터 밖의) 객체로 찾음' },
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ Class)`, expect: 'error', cap: '② 대소문자 오타: Class ≠ class' },
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ displ)`, cap: '③ 연속 변수(displ)로 나누기: 서로 다른 값 35개 → 패널 35개' },
        '③은 에러는 아니지만 의미 없는 그림이에요. facet은 **범주형** 변수(값 종류가 적은 것)에 써요. mpg에서 무난한 것: class, drv, cyl(값 4개), year(2개), fl.',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(class)`, expect: 'error', opts: [
          { t: 'class별 7개 패널', why: '`~`가 없어요.' },
          { t: '에러 (class를 R 내장 함수로 읽음)', ok: true, why: '`class`는 R의 함수 이름이기도 해서, ~ 없이 쓰면 "함수는 벡터가 아니다"라는 이상한 에러가 나요.' },
          { t: '패널 1개', why: '에러로 멈춰요.' },
        ] },
        { type: 'mcq', q: '다음 중 facet 변수로 **적당하지 않은** 것은?', opts: [
          { t: 'hwy', ok: true, why: '연속 변수(값 27종) → 패널이 너무 많아요.' },
          { t: 'drv', why: '3개 범주 — 적당해요.' },
          { t: 'year', why: '2개 값 — 적당해요.' },
        ] },
      ],
    },
  ],
});
