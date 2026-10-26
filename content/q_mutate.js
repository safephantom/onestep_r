/* 단원 Q: mutate() */
RS.units.push({
  id: 'q',
  title: 'dplyr ③: mutate()로 열 만들기',
  short: '새 열 = 계산식, 여러 열, 방금 만든 열 쓰기, 논리 열, 타입 섞인 비교, [ ,1] 해부, .after',
  desc: 'wk4_dplyr.R 124–214행. "mutate(): adding a new column that is a function of other columns, will keep all the rows".',
  setup: 'birds',
  lessons: [
    {
      id: 'q-basic',
      title: 'mutate(데이터, 새열 = 계산)',
      src: 'wk4_dplyr.R 126–129행',
      key: '`mutate(birds, sqrt.inch = sqrt(inches))` → 기존 열은 그대로 두고 **맨 오른쪽에 새 열**을 붙인다. 행 수는 그대로.',
      body: [
        { code: `birds %>%
  mutate(sqrt.inch = sqrt(inches))` },
        '`=` 왼쪽이 **새 열 이름**, 오른쪽이 **계산식**(기존 열 이용). 계산은 벡터 연산이라 8행에 한꺼번에 들어가요 (B단원).',
        { note: 'Python과 비교', kind: 'py', t: 'pandas `birds.assign(sqrt_inch = np.sqrt(birds["inches"]))`와 같아요 — 새 표를 돌려줘요. `birds["x"] = ...`처럼 원본을 바꾸지 않아요.' },
      ],
      quiz: [
        { type: 'mcq', q: '위 결과의 크기는?', opts: [
          { t: '8행 × 5열', ok: true, why: '열 하나 추가.' },
          { t: '8행 × 1열', why: 'mutate는 기존 열을 모두 남겨요.' },
          { t: '1행 × 5열', why: '요약(summarise)이 아니라 행이 그대로예요.' },
        ] },
        { type: 'fill', q: 'inches를 센티미터로 바꾼 cm 열을 만드세요 (1인치 = 2.54cm).', code: 'birds %>%\n  mutate(▢ = inches * 2.54)', ans: [['cm']], why: '새 열 이름이 = 왼쪽.', full: `birds %>%
  mutate(cm = inches * 2.54)` },
      ],
    },
    {
      id: 'q-multi',
      title: '여러 열을 한 번에, 그리고 방금 만든 열 쓰기',
      src: 'wk4_dplyr.R 131–143행 "the order inside mutate can be further computed"',
      key: 'mutate 안의 계산은 **위에서부터 차례로** 된다. 그래서 앞에서 만든 열(sqrt.inch)을 바로 다음 계산에 쓸 수 있다.',
      body: [
        { code: `birds %>%
  mutate(sqrt.inch = sqrt(inches),
         in.less2 = inches - 2,
         sqrt.inch.less2 = sqrt.inch - 2,
         newval = sqrt.inch - sqrt.inch.less2
         )` },
        '`newval`이 모두 2인 이유: sqrt.inch − (sqrt.inch − 2) = 2. 계산 순서를 거꾸로(newval을 먼저) 쓰면 "object \'sqrt.inch.less2\' not found"가 나요.',
      ],
      quiz: [
        { type: 'predict', q: 'newval 열의 값은?', code: `birds %>%
  mutate(a = inches * 2,
         newval = a - inches) %>%
  select(inches, newval)`, opts: [
          { t: 'inches와 같은 값', ok: true, why: '2·inches − inches = inches.' },
          { t: '모두 0', why: 'a는 inches의 두 배예요.' },
          { t: '에러: a를 아직 모름', why: '같은 mutate 안에서도 앞 줄에서 만든 열을 써요.' },
        ] },
        { type: 'predict', q: '순서를 바꾸면?', code: `birds %>%
  mutate(newval = a - inches,
         a = inches * 2)`, expect: 'error', opts: [
          { t: '같은 결과', why: '계산은 위에서부터예요.' },
          { t: '"object \'a\' not found" 에러', ok: true, why: 'newval을 계산할 때는 a가 아직 없어요.' },
        ] },
      ],
    },
    {
      id: 'q-logical',
      title: '논리 열 만들기: is.black = color == "black"',
      src: 'wk4_dplyr.R 204행',
      key: '비교식을 그대로 mutate에 넣으면 **TRUE/FALSE 열**이 생긴다.',
      body: [
        { code: `birds %>%
  mutate(is.black = color == "black")` },
        '`=`와 `==`가 한 줄에 같이 있는 게 헷갈릴 수 있어요: `is.black =`(새 열 이름) `color == "black"`(비교 계산). 이렇게 만든 열로 나중에 `filter(is.black)`이나 `group_by(is.black)`을 할 수 있어요.',
      ],
      quiz: [
        { type: 'mcq', q: '`is.black` 열에서 TRUE는 몇 개?', opts: [
          { t: '5', ok: true, why: 'crow 3 + oriole 2.' },
          { t: '3', why: 'black은 5마리.' },
          { t: '8', why: 'owl은 orange.' },
        ] },
        { type: 'write', q: 'birds에 `big` 열을 추가하세요: inches가 **20 이상**이면 TRUE.', checks: [
          { r: 'ans_df() && "big" %in% names(A())', m: '결과에 big 열이 있어야 해요 (mutate 결과를 출력).' },
          { r: 'identical(A()$big, birds$inches >= 20)', m: 'big은 `inches >= 20`의 결과(TRUE/FALSE)여야 해요.' },
          { r: 'ncol(A()) == 5 && nrow(A()) == 8', m: '기존 4열 + big = 5열, 8행.' },
        ], sol: `birds %>%
  mutate(big = inches >= 20)` },
      ],
    },
    {
      id: 'q-coerce',
      title: 'is.same = bird == inches: 종류가 다른 것끼리 비교하면',
      src: 'wk4_dplyr.R 205행',
      key: '글자(bird)와 숫자(inches)를 `==`로 비교하면 R이 숫자를 **글자로 바꿔서** 비교한다. "owl"과 "23"은 다르니 **모두 FALSE**. 에러는 나지 않는다.',
      body: [
        { code: `birds %>%
  mutate(is.same = bird == inches)` },
        'B단원 `c(1, "a")`에서 본 자동 변환과 같은 원리예요. R은 종류가 섞이면 조용히 한쪽으로 맞춰 버려서, 의미 없는 비교도 에러 없이 실행돼요. 결과가 전부 FALSE(또는 전부 TRUE)라면 식을 의심해 보세요.',
      ],
      quiz: [
        { type: 'mcq', q: '`bird == inches`가 에러가 아니라 FALSE를 내는 이유는?', opts: [
          { t: 'inches를 글자로 바꿔 "owl" == "23"처럼 비교했기 때문', ok: true, why: '자동 형 변환(coercion).' },
          { t: 'bird를 숫자로 바꿔서 NA가 됐기 때문', why: 'NA였다면 결과도 NA예요. 글자 쪽으로 맞춰요.' },
          { t: '열 이름끼리 비교해서', why: '열의 **값**끼리 행마다 비교해요.' },
        ] },
      ],
    },
    {
      id: 'q-bracket',
      title: 'eval = birds[ ,1] == birds[ ,3]: 이상한 열 이름의 정체',
      src: 'wk4_dplyr.R 206–208행 `## [row,column]`',
      key: '`birds[ ,1]`은 벡터가 아니라 **1열짜리 tibble**이라서, 비교 결과가 **행렬**이 되고 새 열 이름이 `eval[,"bird"]`처럼 이상하게 표시된다. 값은 결국 bird == inches와 같다(모두 FALSE).',
      body: [
        { code: `birds %>%
  mutate(is.black = color =="black",
         is.same = bird == inches,
         eval = birds[ ,1] == birds[ ,3],
        )` },
        '해부하면:',
        '1. `birds[ ,1]` = bird 열만 든 8 × 1 tibble, `birds[ ,3]` = inches 열만 든 8 × 1 tibble (B단원)\n2. tibble == tibble → 8 × 1 **행렬** (값: 모두 FALSE)\n3. mutate가 행렬을 열로 받아서 이름을 `eval[,"bird"]`로 표시',
        '벡터로 꺼내려면 `birds$bird == birds$inches` 또는 그냥 `bird == inches`(mutate 안에서는 열 이름만으로 충분). 마지막 줄의 **꼬리 쉼표** `,` 뒤에 아무것도 없어도 dplyr는 봐줘요 (R 기본 함수에서는 보통 에러).',
      ],
      quiz: [
        { type: 'mcq', q: 'mutate 안에서 bird 열 값을 쓰는 가장 자연스러운 방법은?', opts: [
          { t: '`bird`', ok: true, why: 'mutate는 데이터의 열 이름을 바로 알아요.' },
          { t: '`birds[ ,1]`', why: '동작은 하지만 tibble(행렬)이 들어가 결과가 이상해요.' },
          { t: '`"bird"`', why: '따옴표면 글자 값 "bird"예요.' },
        ] },
        { type: 'mcq', q: '`birds[ ,1]`의 결과는?', opts: [
          { t: '8행 1열짜리 tibble', ok: true, why: 'tibble에 [ , ]를 쓰면 tibble이 나와요.' },
          { t: '길이 8인 글자 벡터', why: '그건 `birds$bird`.' },
          { t: '첫 번째 행', why: '첫 행은 `birds[1, ]`.' },
        ] },
      ],
    },
    {
      id: 'q-after',
      title: '.after: 새 열의 위치 정하기',
      src: 'wk4_dplyr.R 212–214행',
      key: '`mutate(…, .after = inches)` → 새 열을 맨 끝이 아니라 **inches 바로 뒤**에 놓는다.',
      body: [
        { code: `birds %>%
  mutate(sqrt.in = sqrt(inches), .after=inches)` },
        '`.after`는 점(.)으로 시작해요 — 새 열 이름과 헷갈리지 않게 dplyr가 붙인 표시예요. 열 위치는 보기 편의일 뿐, 계산이나 그림에는 영향이 없어요.',
      ],
      quiz: [
        { type: 'predict', q: '결과의 열 순서는?', code: `birds %>%
  mutate(cm = inches * 2.54, .after = bird)`, opts: [
          { t: 'bird, cm, color, inches, is.sparrow', ok: true, why: 'bird 바로 뒤.' },
          { t: 'bird, color, inches, is.sparrow, cm', why: '.after가 없으면 이렇게 맨 끝이에요.' },
          { t: 'cm, bird, color, inches, is.sparrow', why: '새 열이 맨 앞으로 가지는 않아요.' },
        ] },
      ],
    },
    {
      id: 'q-mpg',
      title: 'mpg 연습: diff = hwy - cty',
      src: 'wk4_dplyr.R 249–254행',
      key: '두 열의 차이를 새 열로 만들고(mutate), 그 열로 걸러낸다(filter). mutate 다음 단계에서는 새 열을 바로 쓸 수 있다.',
      setup: [],
      body: [
        { code: `mpg %>%
  mutate(diff = hwy - cty) %>%
  select(model, cty, hwy, diff) %>%
  head()` },
        'K단원 abline 그림에서 "모든 점이 대각선 위"였던 것이 여기서 **diff가 모두 양수**로 확인돼요.',
      ],
      quiz: [
        { type: 'mcq', q: '`mutate(diff = hwy - cty) %>% filter(diff >= 5)`가 에러 없이 동작하는 이유는?', opts: [
          { t: 'mutate 결과(다음 단계의 입력)에 diff 열이 있기 때문', ok: true, why: '파이프의 각 단계는 앞 단계 결과를 받아요.' },
          { t: 'diff가 R 내장 함수라서', why: 'diff()라는 함수가 있긴 하지만, 여기서는 방금 만든 열이에요.' },
        ] },
      ],
    },
  ],
});
