/* 단원 I: 위치 조정 (position) */
RS.units.push({
  id: 'i',
  title: '위치 조정: jitter, stack, identity, fill, dodge',
  short: '겹친 점 흔들기, 막대 쌓기/겹치기/비율/나란히, 밀도의 position',
  desc: 'wk2_ggplot_intro.R 121–132행(jittering), 159–173행(stacking vs. unstacking), wk3_ggplot_practice.R 42–87행.',
  lessons: [
    {
      id: 'i-overplot',
      title: '겹침(overplotting): 234개인데 점이 적어 보인다',
      src: 'wk2_ggplot_intro.R 123–125행 "allowing for overlap among datapoints"',
      key: 'displ과 hwy는 값이 **반올림**되어 있어서 여러 차가 **정확히 같은 자리**에 찍힌다. 겹친 점은 하나로 보인다.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()` },
        '예를 들어 hwy는 정수, displ은 소수 첫째 자리까지라서 (2.0, 29) 같은 조합에 차가 여러 대 겹쳐요. 그림만 보면 "어디에 데이터가 많은지"를 잘못 읽게 돼요.',
      ],
      quiz: [
        { type: 'mcq', q: '점이 234개보다 적게 보이는 이유는?', opts: [
          { t: '여러 행이 똑같은 (x, y)라서 겹쳐 그려짐', ok: true, why: '값이 반올림되어 있어요.' },
          { t: 'ggplot이 중복 행을 지움', why: '지우지 않고 겹쳐 그려요.' },
          { t: 'NA가 많아서', why: 'mpg의 displ, hwy에는 NA가 없어요.' },
        ] },
      ],
    },
    {
      id: 'i-jitter',
      title: 'position = "jitter": 점을 살짝 흔들기',
      src: 'wk2_ggplot_intro.R 127–132행',
      key: '`position = "jitter"`는 각 점에 **작은 무작위 흔들림**을 더해 겹친 점들을 펼친다. 실행할 때마다 조금씩 다르다.',
      body: [
        { compare: [
          { label: '기본 (identity)', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()` },
          { label: '`position = "jitter"`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(position = "jitter")` },
        ] },
        '`geom_jitter()`는 `geom_point(position = "jitter")`의 줄임말이에요. 흔드는 폭을 정하고 싶으면 `geom_jitter(width = 0.2, height = 0)`처럼 써요 (height = 0이면 y값은 그대로 두고 옆으로만 흔들어요 — 측정값을 건드리지 않아 논문 그림에서 선호돼요).',
        { note: '흔들림은 그림에만', kind: 'tip', t: 'jitter는 데이터 값을 바꾸지 않아요. 그림을 그릴 때만 위치를 살짝 옮겨요. 무작위라서 실행할 때마다 달라지는데, 이 도구의 "▶ 직접 실행"은 `set.seed(1)`로 고정해서 같은 모양이 나오게 했어요.' },
      ],
      quiz: [
        { type: 'mcq', q: '같은 jitter 코드를 두 번 실행하면?', opts: [
          { t: '점의 위치가 조금씩 다르다', ok: true, why: '무작위 흔들림이라서요 (set.seed로 고정 가능).' },
          { t: '완전히 같다', why: '매번 새로 흔들어요.' },
          { t: '두 번째는 에러', why: '에러는 없어요.' },
        ] },
        { type: 'mcq', q: '`geom_jitter()`와 같은 것은?', opts: [
          { t: '`geom_point(position = "jitter")`', ok: true, why: '줄임 함수예요.' },
          { t: '`geom_point(jitter = TRUE)`', why: 'jitter라는 인자는 없어요.' },
          { t: '`geom_point(alpha = 0.5)`', why: '투명도는 겹침을 드러내는 다른 방법이지 흔들기가 아니에요.' },
        ] },
        { type: 'write', q: 'wk2 131–132행: x = cty, y = hwy 산점도를 jitter로 그리세요.', target: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point(position = "jitter")`, checks: [
          { r: 'maps("x", "cty", "point") && maps("y", "hwy", "point")', m: 'x = cty, y = hwy' },
          { r: 'jittered()', m: '점이 흔들려야 해요 (`position = "jitter"` 또는 `geom_jitter()`).' },
        ], sol: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point(position = "jitter")` },
      ],
    },
    {
      id: 'i-stack',
      title: 'geom_bar의 기본: 쌓기 (stack)',
      src: 'wk2 159–161행, wk3 71–73행',
      key: '막대에 fill = 다른 변수를 주면 기본으로 **위로 쌓인다**(position = "stack"). 막대 전체 높이 = 그 x의 총 개수.',
      body: [
        { code: `ggplot(diamonds, aes(x = cut, fill = clarity)) +
  geom_bar()` },
        '각 cut 막대가 clarity 8단계로 층층이 나뉘어 있어요. 전체 높이는 `aes(x = cut)`만 줬을 때와 같아요. 단점: 맨 아래 조각(I1) 말고는 **바닥이 제각각**이라 조각끼리 크기 비교가 어려워요.',
      ],
      quiz: [
        { type: 'mcq', q: 'stack 막대에서 한 막대의 전체 높이는?', opts: [
          { t: '그 cut의 다이아몬드 총 개수', ok: true, why: '조각들을 쌓은 합이에요.' },
          { t: '가장 많은 clarity의 개수', why: '합계예요.' },
          { t: '항상 1', why: '그건 position = "fill".' },
        ] },
        { type: 'tf', q: '`geom_bar()`와 `geom_bar(position = "stack")`은 같다.', ans: true, why: 'stack이 막대의 기본값이에요.' },
      ],
    },
    {
      id: 'i-identity',
      title: 'position = "identity": 겹쳐 그리기',
      src: 'wk2 163–165행, wk3 76–78행 "allowing for overlapping, not ideal"',
      key: '`"identity"`는 조각들을 쌓지 않고 **모두 바닥(0)에서 시작해 겹쳐** 그린다. 뒤의 막대가 앞을 가리므로 alpha가 필요하다.',
      body: [
        { compare: [
          { label: '`position = "identity"`', code: `ggplot(diamonds, aes(x = cut, fill = clarity)) +
  geom_bar(position = "identity")` },
          { label: '`+ alpha = 0.3` (wk3)', code: `ggplot(diamonds, aes(x = cut, fill = clarity)) +
  geom_bar(position = "identity", alpha = 0.3)` },
        ] },
        '왼쪽은 나중에 그린 clarity 막대가 앞의 것을 덮어서 사실상 몇 개만 보여요. 수업 주석 그대로 "not ideal". 막대보다는 **밀도 곡선**에서 겹쳐 비교할 때 더 쓸모 있어요 (아래 밀도 레슨).',
      ],
      quiz: [
        { type: 'mcq', q: 'identity 막대 그림이 "not ideal"인 이유는?', opts: [
          { t: '막대들이 0에서부터 겹쳐 그려져 서로 가리기 때문', ok: true, why: 'alpha를 줘도 8겹이 겹치면 읽기 어려워요.' },
          { t: '막대 높이가 틀리게 계산돼서', why: '높이는 각 조각의 개수로 정확해요.' },
          { t: '범례가 사라져서', why: '범례는 있어요.' },
        ] },
      ],
    },
    {
      id: 'i-fill',
      title: 'position = "fill": 비율로 쌓기',
      src: 'wk2 168–170행, wk3 83–84행 "alternatives to stacking"',
      key: '`"fill"`은 모든 막대를 **높이 1(100%)**로 맞춰 쌓는다. 그룹 간 **구성 비율** 비교용. 단, y축 이름은 여전히 "count"라서 직접 바꿔야 한다.',
      body: [
        { code: `ggplot(data = diamonds, mapping = aes(x = cut, fill = clarity)) +
  geom_bar(position = "fill")` },
        'cut마다 개수는 다르지만 모두 같은 높이예요. 이제 "Ideal 컷일수록 좋은 clarity(IF, VVS1) 비율이 높다" 같은 비교가 돼요. 주의: y축 눈금은 0–1(비율)인데 제목은 **count** 그대로예요 — `labs(y = "proportion")`로 고쳐 주세요 (L단원). Davidson (2016) Fig. 1–3이 바로 이 "비율 막대"예요.',
      ],
      quiz: [
        { type: 'pick', q: '`geom_bar(position = "fill")`의 결과는?', opts: [
          { code: `ggplot(diamonds, aes(x = cut, fill = clarity)) +
  geom_bar(position = "fill")`, ok: true, why: '모든 막대 높이 1.' },
          { code: `ggplot(diamonds, aes(x = cut, fill = clarity)) +
  geom_bar()`, why: '이건 기본 stack (높이 = 개수).' },
          { code: `ggplot(diamonds, aes(x = cut, fill = clarity)) +
  geom_bar(position = "dodge")`, why: '이건 dodge (나란히).' },
        ] },
        { type: 'mcq', q: 'fill 막대의 y축 제목은?', opts: [
          { t: '"count" (값은 비율인데도)', ok: true, why: 'ggplot이 제목을 자동으로 바꿔 주지 않아요. labs(y = "proportion") 권장.' },
          { t: '"proportion"', why: '자동으로 바뀌지 않아요.' },
          { t: '"fill"', why: 'fill은 aes 이름이에요.' },
        ] },
      ],
    },
    {
      id: 'i-dodge',
      title: 'position = "dodge": 나란히',
      src: 'wk2 172–173행, wk3 86–87행',
      key: '`"dodge"`는 조각들을 **옆으로 나란히** 세운다. 모든 조각이 바닥에서 시작해 크기 비교가 쉽다.',
      body: [
        { code: `ggplot(data = diamonds, aes(x = cut, fill = clarity)) +
  geom_bar(position = "dodge")` },
        { table: { head: ['position', '모양', '좋은 비교'], rows: [
          ['`"stack"` (기본)', '위로 쌓기', '전체 개수'],
          ['`"identity"`', '0에서 겹치기', '(막대엔 부적합)'],
          ['`"fill"`', '높이 1로 쌓기', '그룹 안 비율'],
          ['`"dodge"`', '나란히', '조각끼리 개수'],
        ] } },
        'Davidson (2016) Fig. 4(Stops vs Frics 막대가 나란히)가 dodge예요.',
      ],
      quiz: [
        { type: 'mcq', q: '"각 cut 안에서 clarity 단계들의 **개수**를 서로 비교"하기 가장 좋은 position은?', opts: [
          { t: 'dodge', ok: true, why: '모두 바닥에서 시작해 높이 비교가 쉬워요.' },
          { t: 'stack', why: '바닥이 달라 조각 비교가 어려워요.' },
          { t: 'fill', why: '비율 비교용이에요.' },
        ] },
        { type: 'write', q: 'mpg에서 x = class, fill = drv인 막대를 **나란히(dodge)** 그리세요.', target: `ggplot(mpg, aes(x = class, fill = drv)) +
  geom_bar(position = "dodge")`, checks: [
          { r: 'has_geom("bar")', m: 'geom_bar() 층' },
          { r: 'maps("x", "class", "bar") && maps("fill", "drv", "bar")', m: 'x = class, fill = drv' },
          { r: 'pos_is("bar", c("dodge", "dodge2"))', m: '`position = "dodge"`' },
        ], sol: `ggplot(mpg, aes(x = class, fill = drv)) +
  geom_bar(position = "dodge")` },
      ],
    },
    {
      id: 'i-density',
      title: '밀도 곡선의 position: stack / identity / fill',
      src: 'wk3_ggplot_practice.R 42–51행 "how are the plots different from each other?"',
      key: '같은 position 개념이 밀도 곡선에도 적용된다. 밀도에서는 **identity + alpha**(겹쳐 비교)가 가장 자주 쓰인다.',
      body: [
        { code: `ggplot(diamonds, aes(x=price, group=cut, fill=cut)) +
  geom_density(position="stack")`, cap: 'stack: 곡선을 위로 쌓음 — 개별 모양을 읽기 어려움' },
        { code: `ggplot(diamonds, aes(x=price, group=cut, fill=cut)) +
  geom_density(position="identity", alpha = 0.2)`, cap: 'identity + alpha 0.2: 겹쳐서 모양 비교 (wk3 주석: alpha = 1 불투명 ~ 0 투명)' },
        { code: `ggplot(diamonds, aes(x=price, group=cut, fill=cut)) +
  geom_density(position="fill")`, cap: 'fill: 각 가격에서 cut들의 상대 비율' },
        '밀도 곡선의 **기본값은 identity**예요 (막대의 기본값 stack과 다름). 그래서 position을 안 쓰고 fill만 주면 겹쳐서 가려져요.',
      ],
      quiz: [
        { type: 'mcq', q: '각 cut의 가격 분포 **모양**을 겹쳐 비교하려면?', opts: [
          { t: '`geom_density(position = "identity", alpha = 0.2)`', ok: true, why: '반투명하게 겹쳐요.' },
          { t: '`geom_density(position = "stack")`', why: '쌓으면 위쪽 곡선의 모양이 아래 곡선에 얹혀 왜곡돼 보여요.' },
          { t: '`geom_density(position = "fill")`', why: '비율이지 분포 모양이 아니에요.' },
        ] },
        { type: 'mcq', q: 'alpha = 0.2의 뜻은?', opts: [
          { t: '20% 불투명 (꽤 투명)', ok: true, why: '1 = 완전 불투명, 0 = 완전 투명.' },
          { t: '20% 투명', why: '반대예요: 0.2는 불투명도.' },
          { t: '선 굵기 0.2', why: '굵기는 linewidth.' },
        ] },
      ],
    },
  ],
});
