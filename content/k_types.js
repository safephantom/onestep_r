/* 단원 K: 그래프 종류와 조합 */
RS.units.push({
  id: 'k',
  title: '그래프 조합: 박스·바이올린·점',
  short: 'boxplot + coord_flip, abline + coord_fixed, violin + 점, violin + 작은 boxplot',
  desc: 'wk2 178–192행, wk3_ggplot_practice.R 9–24행과 Practice 1.',
  lessons: [
    {
      id: 'k-flip',
      title: 'coord_flip(): 가로·세로 뒤집기',
      src: 'wk2_ggplot_intro.R 184–186행, wk3 95행 `#coord_flip()`',
      key: '`coord_flip()`은 x축과 y축을 **바꿔서** 그린다. 범주 이름이 길거나 많을 때 가로 박스플롯이 읽기 좋다.',
      body: [
        { compare: [
          { label: '기본', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot()` },
          { label: '`+ coord_flip()`', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  coord_flip()` },
        ] },
        'aes는 그대로(x = class)인데 그림만 옆으로 누웠어요. 그래서 축 제목도 같이 옮겨 가요: 세로축에 class, 가로축에 hwy.',
      ],
      quiz: [
        { type: 'mcq', q: '`coord_flip()`을 더하면 `labs(x = "차종")`의 "차종"은 어느 축에 나타날까요?', opts: [
          { t: '세로축 (class가 세로로 가니까)', ok: true, why: 'x 매핑과 x 라벨이 함께 세로축으로 가요.' },
          { t: '가로축', why: '뒤집히면 x는 세로축에 그려져요.' },
        ] },
        { type: 'write', q: 'mpg로 class별 hwy 박스플롯을 **가로로** 그리세요.', target: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  coord_flip()`, checks: [
          { r: 'has_geom("boxplot")', m: 'geom_boxplot() 층' },
          { r: 'maps("x", "class", "boxplot") && maps("y", "hwy", "boxplot")', m: 'aes(x = class, y = hwy)는 그대로 두고…' },
          { r: 'coord() == "flip"', m: '`+ coord_flip()`으로 뒤집어요.' },
        ], sol: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot() +
  coord_flip()` },
      ],
    },
    {
      id: 'k-abline',
      title: 'geom_abline() + coord_fixed(): y = x 기준선',
      src: 'wk2_ggplot_intro.R 189–192행',
      key: '`geom_abline()`은 인자 없이 쓰면 **y = x 대각선**(절편 0, 기울기 1)을 긋는다. `coord_fixed()`는 x와 y의 **1단위 길이를 같게** 해서 45°가 진짜 45°로 보이게 한다.',
      body: [
        { code: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point() +
  geom_abline() +
  coord_fixed()` },
        '모든 점이 대각선 **위쪽**에 있어요 → 모든 차가 **고속도로 연비 > 도시 연비**. 기준선 하나가 "hwy가 cty보다 얼마나 큰가"를 읽게 해 줘요 (wk4 연습의 `diff = hwy - cty`로 이어져요).',
        'coord_fixed가 없으면 그림 창 비율에 따라 대각선이 30°도 되고 60°도 돼요. abline의 기본값은 `?geom_abline`의 Usage에 적혀 있어요 (intercept, slope).',
      ],
      quiz: [
        { type: 'mcq', q: '인자 없는 `geom_abline()`이 긋는 선은?', opts: [
          { t: 'y = x (절편 0, 기울기 1)', ok: true, why: '기본값.' },
          { t: '회귀선', why: '회귀선은 geom_smooth(method = "lm").' },
          { t: 'y = 평균', why: '데이터와 무관한 기준선이에요.' },
        ] },
        { type: 'mcq', q: '점들이 모두 대각선 위에 있다는 것은?', opts: [
          { t: '모든 차에서 hwy > cty', ok: true, why: 'y(hwy)가 x(cty)보다 커요.' },
          { t: 'cty와 hwy가 같다', why: '같다면 선 위에 있겠죠.' },
          { t: '데이터에 오류가 있다', why: '고속도로 연비가 더 좋은 건 자연스러워요.' },
        ] },
        { type: 'tf', q: 'coord_fixed()를 빼도 대각선은 항상 45°로 보인다.', ans: false, why: '그림 창의 가로세로 비율에 따라 달라져요.' },
      ],
    },
    {
      id: 'k-violinpoints',
      title: '바이올린 + 개별 점 (jitter)',
      src: 'wk3_ggplot_practice.R 17–21행 "adding datapoints"',
      key: '바이올린(분포 모양) 위에 **jitter한 점**(개별 데이터)을 얹는다. 바이올린은 alpha로 흐리게, 점은 나중 층으로.',
      body: [
        { code: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin(alpha = 0.5) +
  geom_point(aes(color = class), position="jitter") +
  labs(x = "class", y = "highway miles", title = "A Violin with individual datapoints")` },
        '한 줄씩 역할을 보면:',
        '- `fill=class` (전역): 바이올린 속 색\n- `geom_violin(alpha = 0.5)`: 반투명 바이올린\n- `geom_point(aes(color = class), position = "jitter")`: 같은 색 계열의 점을 흔들어 겹침 방지\n- `labs(...)`: 축 제목과 그림 제목 (L단원)',
        '`position = "jitter"`는 기본으로 **옆과 위아래 모두** 조금씩 흔들어요. 바이올린 폭보다 넓게 퍼지면 `geom_jitter(width = 0.2)`처럼 폭을 줄이세요.',
      ],
      quiz: [
        { type: 'mcq', q: '이 그림에서 점을 바이올린 **뒤에** 가려지지 않게 하는 요소는?', opts: [
          { t: 'geom_point가 geom_violin보다 **나중에** 적혀 있다', ok: true, why: '나중 층이 위에 그려져요.' },
          { t: 'alpha = 0.5', why: 'alpha는 바이올린을 흐리게 할 뿐이에요.' },
          { t: 'position = "jitter"', why: '흔들기는 점끼리의 겹침 문제예요.' },
        ] },
        { type: 'mcq', q: '점의 색이 바이올린과 같은 계열인 이유는?', opts: [
          { t: '점은 color = class, 바이올린은 fill = class로 같은 변수를 썼기 때문', ok: true, why: '같은 변수 → 같은 팔레트.' },
          { t: '점이 fill을 물려받아서', why: '기본 점은 fill을 쓰지 않아요. color를 따로 매핑했어요.' },
        ] },
      ],
    },
    {
      id: 'k-legendnone',
      title: '범례가 x축과 중복될 때: legend.position = "none"',
      src: 'wk3_ggplot_practice.R 14, 23행 `# theme(legend.position="none")`',
      key: 'x = class이면서 fill = class면 범례는 **x축 이름과 같은 정보**라 공간만 차지한다. `theme(legend.position = "none")`으로 뺀다.',
      body: [
        { code: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin() +
  theme(legend.position="none")` },
        'wk3 파일에서는 이 줄이 주석 처리되어 있어요. 켜려면 앞 줄 끝에 `+`를 붙이는 것 잊지 마세요 (A단원).',
      ],
      quiz: [
        { type: 'fill', q: '범례를 없애세요.', code: 'theme(legend.position = ▢)', ans: [['"none"']], why: '글자 값 "none" — 따옴표 필요.', full: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin() +
  theme(legend.position="none")` },
      ],
    },
    {
      id: 'k-violinbox',
      title: '바이올린 + 작은 박스플롯 (Practice 1의 부품)',
      src: 'wk3_ggplot_practice.R 107–111행 Practice 1',
      key: '`geom_boxplot(width = 0.1, fill = "white", color = "grey", alpha = 0.5)` — 폭을 좁혀 바이올린 안에 쏙 들어가게, 색은 **설정**으로 고정.',
      body: [
        '부품 하나씩 확인해요. `width`: 박스의 폭 (기본은 0.9에 가까운 넓은 폭). 0.1이면 아주 가늘어요.',
        { compare: [
          { label: 'width 기본', code: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin(alpha=0.5) +
  geom_boxplot()` },
          { label: '`width = 0.1`, 흰 속, 회색 선', code: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin(alpha=0.5) +
  geom_boxplot(width=0.1, fill="white", color="grey", alpha=0.5)` },
        ] },
        '왼쪽은 넓은 박스가 바이올린을 덮고, 박스 속도 class 색(전역 fill 상속)이에요. 오른쪽은 박스 층에 `fill = "white"`를 **설정**으로 따로 정해서, 이 층에서는 ggplot() 안의 fill = class 대신 흰색이 쓰였어요 (H단원: 층에서 다시 정한 값은 그 층에서 우선한다).',
      ],
      quiz: [
        { type: 'mcq', q: 'Practice 1에서 박스 속이 class 색이 아니라 흰색인 이유는?', opts: [
          { t: 'geom_boxplot에 `fill = "white"`를 **설정**해서 전역 fill 매핑보다 우선했기 때문', ok: true, why: '층에서 준 고정값이 이겨요.' },
          { t: 'alpha = 0.5라서', why: '투명도는 색을 바꾸지 않아요.' },
          { t: '박스플롯은 fill을 못 받아서', why: '받아요 (왼쪽 그림).' },
        ] },
        { type: 'mcq', q: '`width = 0.1`은?', opts: [
          { t: '박스 폭을 좁게', ok: true, why: '범주 간격 1 중 0.1만 차지해요.' },
          { t: '선 굵기', why: '선 굵기는 linewidth.' },
          { t: '투명도', why: 'alpha예요.' },
        ] },
      ],
    },
  ],
});
