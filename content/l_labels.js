/* 단원 L: 라벨과 테마 */
RS.units.push({
  id: 'l',
  title: '제목·축 이름·테마',
  short: 'labs(), xlab()+ylab()=labs(x, y), 나중 것이 이긴다, xlab(""), theme_bw, 테마 순서',
  desc: 'wk3_ggplot_practice.R 18–26행 "giving a title to the plot & change axis titles" (labs 문서 링크), Practice 1의 `theme_bw()`, plot_practice.R의 `theme_minimal()`.',
  lessons: [
    {
      id: 'l-labs',
      title: 'labs(x =, y =, title =)',
      src: 'wk3_ggplot_practice.R 21행',
      key: '`labs()` 한 번으로 축 제목(x, y)과 그림 제목(title)을 정한다. 안 쓰면 **aes에 쓴 열 이름**이 그대로 축 제목이 된다.',
      body: [
        { compare: [
          { label: 'labs 없음: 열 이름이 제목', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot()` },
          { label: 'labs 사용', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  labs(x = "class", y = "highway miles", title = "Highway mileage by class")` },
        ] },
        'labs는 **데이터를 바꾸지 않아요**. 보이는 글자만 바꿔요. 그래서 B단원의 `aes(x = "Target vowel duration (ms)")` 실수는 이렇게 고쳐요: aes에는 열 이름(`x = factor(Duration)`), 제목은 `labs(x = "Target vowel duration (ms)")`.',
      ],
      quiz: [
        { type: 'mcq', q: 'labs() 없이 그린 그림의 y축 제목은?', opts: [
          { t: 'aes의 y에 쓴 열 이름 (예: hwy)', ok: true, why: '자동 라벨.' },
          { t: '"y"', why: '열 이름이 쓰여요.' },
          { t: '없음', why: '기본으로 표시돼요.' },
        ] },
        { type: 'write', q: 'x = displ, y = hwy 산점도에 축 제목 "Engine displacement (L)", "Highway MPG"와 그림 제목 "Bigger engines, lower mileage"를 붙이세요.', target: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  labs(x = "Engine displacement (L)", y = "Highway MPG", title = "Bigger engines, lower mileage")`, checks: [
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: 'lab_is("x", "Engine displacement (L)")', m: 'x축 제목 "Engine displacement (L)"' },
          { r: 'lab_is("y", "Highway MPG")', m: 'y축 제목 "Highway MPG"' },
          { r: 'lab_is("title", "Bigger engines, lower mileage")', m: '그림 제목 "Bigger engines, lower mileage"' },
          { r: 'maps("x", "displ")', m: 'aes의 x는 여전히 displ **열**이어야 해요 (제목은 labs에).' },
        ], sol: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  labs(x = "Engine displacement (L)", y = "Highway MPG",
       title = "Bigger engines, lower mileage")` },
      ],
    },
    {
      id: 'l-xlab',
      title: 'xlab() + ylab() = labs(x =, y =)',
      src: 'wk3_ggplot_practice.R 24행 `#xlab("")`',
      key: '`xlab("…")`은 `labs(x = "…")`의 줄임, `ylab("…")`은 `labs(y = "…")`의 줄임. 둘을 **합치면** `labs(x = "…", y = "…")` 하나와 같다.',
      body: [
        { compare: [
          { label: '`xlab() + ylab()`', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  xlab("class") +
  ylab("highway miles")` },
          { label: '`labs(x =, y =)`', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  labs(x = "class", y = "highway miles")` },
        ] },
        '두 그림은 완전히 같아요. 비슷하게 `ggtitle("…")` = `labs(title = "…")`. 한 곳에 모아 쓰는 labs()가 관리하기 편해요.',
      ],
      quiz: [
        { type: 'mcq', q: '`xlab("A") + ylab("B")`와 같은 것은?', opts: [
          { t: '`labs(x = "A", y = "B")`', ok: true, why: '둘을 합친 것.' },
          { t: '`labs("A", "B")`', why: 'labs는 이름 붙인 인자(x =, y =)로 써야 해요.' },
          { t: '`xylab("A", "B")`', why: '그런 함수는 없어요.' },
        ] },
        { type: 'fill', q: '`labs()` 없이 xlab·ylab으로 축 제목을 "vowel", "F1 (Hz)"로 하세요.', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  ▢("vowel") +
  ▢("F1 (Hz)")`, ans: [['xlab'], ['ylab']], why: 'x축 = xlab, y축 = ylab.', full: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  xlab("vowel") +
  ylab("F1 (Hz)")` },
      ],
    },
    {
      id: 'l-lastwins',
      title: '같은 라벨을 두 번 정하면: 나중 것이 이긴다',
      src: 'wk3 21–24행의 labs(x = "class") 다음에 xlab("")를 켜는 경우',
      key: 'ggplot은 `+`로 더한 순서대로 설정을 덮어쓴다. `labs(x = "A") + xlab("B")`면 x축 제목은 **B**.',
      body: [
        { code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  labs(x = "class", y = "highway miles") +
  xlab("")` },
        'wk3 코드에서 주석을 모두 켜면 정확히 이 상황이에요: `labs(x = "class", …)` 뒤에 `xlab("")`가 와서 **x축 제목이 지워져요**. 그래서 그 줄은 "x축 제목을 없애고 싶을 때" 쓰는 선택지로 주석 처리해 둔 것이에요.',
      ],
      quiz: [
        { type: 'predict', q: 'x축 제목은 무엇이 될까요?', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  xlab("Engine size") +
  labs(x = "Displacement")`, reveal: true, opts: [
          { t: '"Displacement"', ok: true, why: '나중에 더한 labs가 이겨요.' },
          { t: '"Engine size"', why: '먼저 적은 쪽이 덮어써져요.' },
          { t: '"displ"', why: '둘 다 기본 제목을 덮어써요.' },
        ] },
      ],
    },
    {
      id: 'l-empty',
      title: 'xlab(""): 축 제목 지우기',
      src: 'wk3_ggplot_practice.R 24행 `#xlab("")`',
      key: '`xlab("")`은 x축 제목을 **빈 글자**로 바꾼다. 눈금 이름(compact, suv …)은 그대로 남는다.',
      body: [
        { compare: [
          { label: '기본', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot()` },
          { label: '`+ xlab("")`', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  xlab("")` },
        ] },
        'x축 범주 이름이 이미 충분히 설명적일 때 제목을 지워요. `""`는 "글자가 하나도 없는 문자열"이에요.',
      ],
      quiz: [
        { type: 'tf', q: '`xlab("")`를 쓰면 x축 눈금 이름(compact, suv …)도 사라진다.', ans: false, why: '축 **제목**만 지워져요. 눈금 이름은 그대로.' },
      ],
    },
    {
      id: 'l-themes',
      title: '완성 테마: theme_bw(), theme_minimal(base_size =)',
      src: 'Practice 1 `theme_bw()`, plot_practice.R `theme_minimal(base_size = 13)`, practice.R `theme_bw(base_size=14)`',
      key: '`theme_*()`은 배경·격자·테두리 같은 **데이터와 무관한 모양**을 한 번에 바꾸는 완성 테마. `base_size`로 글자 크기를 정한다.',
      body: [
        { compare: [
          { label: '기본 theme_grey', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot()` },
          { label: '`theme_bw()`', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  theme_bw()` },
          { label: '`theme_minimal(base_size = 13)`', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  theme_minimal(base_size = 13)` },
        ] },
        '논문 그림은 흰 배경을 많이 써서 theme_bw가 인기예요. Lee-Kim & Chou (2002) Fig. 6과 wk4 practice plot은 기본(회색) 테마 그대로예요.',
      ],
      quiz: [
        { type: 'pick', q: '`theme_bw()`를 더한 그림은?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  theme_bw()`, ok: true, why: '흰 배경, 회색 격자, 검은 테두리.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()`, why: '이건 기본 회색 배경.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  theme_minimal()`, why: '이건 minimal — 테두리 없음.' },
        ] },
        { type: 'mcq', q: '`theme_bw(base_size = 14)`의 14는?', opts: [
          { t: '기본 글자 크기(pt)', ok: true, why: '축 제목, 눈금 글자 등이 이 크기를 기준으로 커져요.' },
          { t: '그림 폭', why: '그림 크기는 ggsave나 창 크기로 정해요.' },
          { t: '격자선 수', why: '아니에요.' },
        ] },
      ],
    },
    {
      id: 'l-themeorder',
      title: '순서 함정: theme(...) 뒤에 theme_bw()를 쓰면',
      src: 'wk3 22–23행의 순서 `theme_bw() + theme(legend.position="none")`',
      key: '`theme_bw()` 같은 **완성 테마는 모든 테마 설정을 새로 덮어쓴다**. 그래서 세부 설정 `theme(...)`은 완성 테마 **뒤에** 와야 한다.',
      body: [
        { compare: [
          { label: 'theme_bw() → theme(): 범례 사라짐 ✓', code: `ggplot(mpg, aes(x = class, y = hwy, fill = class)) +
  geom_violin() +
  theme_bw() +
  theme(legend.position = "none")` },
          { label: 'theme() → theme_bw(): 범례 되살아남 ✗', code: `ggplot(mpg, aes(x = class, y = hwy, fill = class)) +
  geom_violin() +
  theme(legend.position = "none") +
  theme_bw()` },
        ] },
        '오른쪽은 legend.position = "none"을 정한 다음에 theme_bw()가 "범례 위치: 오른쪽"을 포함한 **모든 설정**을 다시 깔아 버려요. wk3 코드의 주석 순서(theme_bw 먼저, theme 나중)가 올바른 순서예요.',
      ],
      quiz: [
        { type: 'predict', q: '범례가 보일까요?', code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point() +
  theme(legend.position = "none") +
  theme_minimal()`, reveal: true, opts: [
          { t: '보인다 (theme_minimal이 설정을 덮어씀)', ok: true, why: '완성 테마가 나중에 와서 legend.position이 기본값(right)으로 돌아가요.' },
          { t: '안 보인다', why: '순서 때문에 "none"이 지워졌어요.' },
        ] },
        { type: 'order', q: '범례 없는 흰 배경 바이올린이 되도록 층을 순서대로 놓으세요.', lines: ['ggplot(mpg, aes(x = class, y = hwy, fill = class)) +', '  geom_violin() +', '  theme_bw() +', '  theme(legend.position = "none")'], why: '완성 테마 → 세부 조정 순서.' },
      ],
    },
  ],
});
