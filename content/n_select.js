/* 단원 N: tibble 만들기와 select() */
RS.units.push({
  id: 'n',
  title: 'dplyr ①: birds 만들기와 select()',
  short: 'tibble(), 열 고르기·순서·범위·빼기, ! 와 - 의 차이, 이름 바꾸기, 결과는 저장해야 남는다',
  desc: 'wk4_dplyr.R 1–70행. select()는 **세로(열)**를 고르는 함수예요. (수업 주석: "잘 안씀" — 그래도 원리는 filter·ggplot과 같아요.)',
  setup: 'birds',
  lessons: [
    {
      id: 'n-tibble',
      title: 'tibble()로 표 직접 만들기: birds',
      src: 'wk4_dplyr.R 10–16행',
      key: '`tibble(열이름 = 값들, 열이름 = 값들, …)` — 열 하나씩 벡터로 준다. 모든 열의 길이가 같아야 한다.',
      setup: [],
      body: [
        { code: `birds <- tibble(bird = rep(c("owl", "crow", "oriole"), ## owl (올빼미), crow (까마귀), oriole (꾀꼬리)
                                times =  c(3,3,2)),
                color = rep(c("orange","black","black"),
                                times = c(3,3,2)),
                inches = c(23, 25, 26, 7, 8, 8.5, 11.5, 12),
                is.sparrow = rep(c(F, T),    ## 참새목: crow (까마귀), oriole (꾀꼬리)
                                times=c(3,5)))
birds` },
        '각 열이 길이 8인지 세어 보세요: bird(3+3+2), color(3+3+2), inches(값 8개), is.sparrow(3+5). 하나라도 다르면:',
        { code: `tibble(a = 1:3, b = c(1, 2))`, expect: 'error' },
        '(`1:3`은 1, 2, 3을 만드는 줄임이에요.)',
      ],
      quiz: [
        { type: 'mcq', q: 'birds의 크기는?', opts: [
          { t: '8행 × 4열', ok: true, why: '열 4개(bird, color, inches, is.sparrow), 각 길이 8.' },
          { t: '4행 × 8열', why: '열이 인자 하나씩이에요.' },
          { t: '3행 × 4열', why: '새 종류가 3개일 뿐, 행은 8마리.' },
        ] },
        { type: 'mcq', q: 'inches를 `c(23, 25, 26, 7, 8, 8.5, 11.5)`(7개)로 잘못 쓰면?', opts: [
          { t: '"Tibble columns must have compatible sizes" 에러', ok: true, why: '다른 열은 8, 이 열만 7.' },
          { t: '마지막 칸이 NA로 채워진다', why: 'tibble은 조용히 채우지 않아요.' },
          { t: '7행짜리 tibble', why: '에러로 멈춰요.' },
        ] },
      ],
    },
    {
      id: 'n-look',
      title: 'birds 살펴보기 복습',
      src: 'wk4_dplyr.R 19–30행',
      key: 'glimpse → head → view → summary → n_distinct: 새 데이터를 만나면 이 순서로 확인한다 (C단원 복습).',
      body: [
        { code: `glimpse(birds)` },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `n_distinct(birds$color)`, opts: [
          { t: '`[1] 2`', ok: true, why: 'orange, black.' },
          { t: '`[1] 8`', why: '서로 다른 값의 수예요.' },
          { t: '`[1] 3`', why: '새 종류는 3이지만 색은 2가지.' },
        ] },
        { type: 'mcq', q: '`glimpse(birds)`에서 inches의 표시는?', opts: [
          { t: '`<dbl>`', ok: true, why: '8.5, 11.5 같은 소수.' },
          { t: '`<int>`', why: 'c()로 만든 숫자는 기본이 double이에요.' },
          { t: '`<chr>`', why: '따옴표 없이 만들었어요.' },
        ] },
      ],
    },
    {
      id: 'n-select',
      title: 'select(데이터, 열, 열, …): 열 고르기',
      src: 'wk4_dplyr.R 36–38행 "the first one = the object"',
      key: 'select의 **첫 인자는 데이터**, 그다음은 남길 **열 이름들**(따옴표 없이). 행은 그대로다.',
      body: [
        { code: `select(birds, bird, color, inches)` },
        'dplyr의 모든 함수(select, filter, mutate, summarise, arrange)가 이 모양이에요: **첫 인자 = 데이터, 결과 = 새 데이터**. 이 규칙 덕분에 파이프(`%>%`, P단원)로 이을 수 있어요.',
        { note: 'Python과 비교', kind: 'py', t: 'pandas `birds[["bird", "color", "inches"]]`와 같아요. 열 이름을 따옴표 없이 쓰는 게 dplyr의 특징이에요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과의 열은?', code: `select(birds, inches, bird)`, opts: [
          { t: 'inches, bird (이 순서)', ok: true, why: '적은 순서대로 열이 놓여요 (다음 레슨).' },
          { t: 'bird, inches (원래 순서)', why: 'select는 적은 순서를 따라요.' },
          { t: 'bird, color, inches, is.sparrow', why: '고른 두 열만 남아요.' },
        ] },
        { type: 'mcq', q: '`select(birds, bird)`의 행 수는?', opts: [
          { t: '8', ok: true, why: 'select는 열만 고르고 행은 그대로.' },
          { t: '3', why: '중복을 없애지 않아요.' },
          { t: '1', why: '열 1개, 행 8개.' },
        ] },
      ],
    },
    {
      id: 'n-order',
      title: '순서 바꾸기와 범위(:)',
      src: 'wk4_dplyr.R 39, 43행',
      key: 'select는 **적은 순서대로** 열을 놓는다(재배열). `bird:inches`는 bird부터 inches까지 **연속된 열 전부**.',
      body: [
        { code: `select(birds, color, bird, inches)` },
        { code: `select(birds, bird:inches)` },
        '`:`는 열의 **위치** 기준이에요: birds의 열 순서가 bird(1), color(2), inches(3), is.sparrow(4)라서 `bird:inches` = 1~3번 열.',
      ],
      quiz: [
        { type: 'predict', q: '결과의 열은?', code: `select(birds, color:is.sparrow)`, opts: [
          { t: 'color, inches, is.sparrow', ok: true, why: '2번부터 4번 열.' },
          { t: 'color, is.sparrow', why: '`:`는 사이의 열도 모두 포함해요.' },
          { t: 'bird, color, inches, is.sparrow', why: 'bird는 범위 밖.' },
        ] },
        { type: 'fill', q: 'bird부터 inches까지 고르세요.', code: 'select(birds, ▢)', ans: [['bird:inches']], why: '범위 연산자 `:`.', full: 'select(birds, bird:inches)' },
      ],
    },
    {
      id: 'n-minus',
      title: '-열: 빼고 나머지',
      src: 'wk4_dplyr.R 45행 `nosparrow <- select(birds, -is.sparrow)`',
      key: '열 이름 앞에 `-`를 붙이면 **그 열만 빼고** 나머지를 남긴다.',
      body: [
        { code: `select(birds, -is.sparrow)` },
        '수업 주석엔 "excluding the row"라고 되어 있지만 정확히는 **열(column)**을 빼는 거예요. 행을 빼는 건 filter()예요.',
      ],
      quiz: [
        { type: 'predict', q: '결과의 열은?', code: `select(birds, -bird, -inches)`, opts: [
          { t: 'color, is.sparrow', ok: true, why: '두 열을 뺐어요.' },
          { t: 'bird, inches', why: '`-`는 빼기예요.' },
          { t: '에러', why: '여러 개를 뺄 수 있어요.' },
        ] },
        { type: 'tf', q: '`select(birds, -is.sparrow)`는 is.sparrow가 TRUE인 **행**을 뺀다.', ans: false, why: '열을 빼요. TRUE인 행을 빼는 건 `filter(birds, !is.sparrow)` 같은 filter의 일.' },
      ],
    },
    {
      id: 'n-bang',
      title: '!(범위) 와 -(범위): 혼자 쓰면 같다',
      src: 'wk4_dplyr.R 47–53행',
      key: '`-(color:is.sparrow)`와 `!(color:is.sparrow)`는 **혼자 쓸 때** 같은 결과(bird만 남음). `-`는 "빼기", `!`는 "그 **밖의 것**(여집합)".',
      body: [
        { compare: [
          { label: '`-(color:is.sparrow)`', code: `select(birds, -(color:is.sparrow))` },
          { label: '`!(color:is.sparrow)`', code: `select(birds, !(color:is.sparrow))` },
        ] },
        '둘 다 bird만 남아요. 그런데 다른 선택과 **섞으면** 달라져요 → 다음 레슨.',
      ],
      quiz: [
        { type: 'mcq', q: '`select(birds, !(bird:color))`의 결과 열은?', opts: [
          { t: 'inches, is.sparrow', ok: true, why: 'bird:color의 여집합.' },
          { t: 'bird, color', why: '`!`는 "그것 말고"예요.' },
        ] },
      ],
    },
    {
      id: 'n-combo',
      title: '섞으면 다르다: color, -(범위) vs color, !(범위)',
      src: 'wk4_dplyr.R 55–62행 (\'\'\' 안의 설명)',
      key: '`-`는 **앞에서 고른 것에서 뺀다**(차집합). `!`는 **새로 "그 밖의 것"을 더한다**(합집합). 그래서 `color, -(…)`은 0열, `color, !(…)`은 color와 bird.',
      body: [
        { compare: [
          { label: '`color, -(color:is.sparrow)`', code: `select(birds, color, -(color:is.sparrow))` },
          { label: '`color, !(color:is.sparrow)`', code: `select(birds, color, !(color:is.sparrow))` },
        ] },
        { table: { head: ['코드', '계산', '결과'], rows: [
          ['`color, -(color:is.sparrow)`', '{color} − {color, inches, is.sparrow}', '**열 없음** (8 × 0)'],
          ['`color, !(color:is.sparrow)`', '{color} ∪ {bird}', 'color, bird'],
        ] } },
        '수업 주석의 설명 그대로예요: "gives you nothing ({color} − {color, …, is.sparrow})", "gives you color and bird ({color} union {bird})".',
      ],
      quiz: [
        { type: 'predict', q: '결과의 열은? (wk4 61행)', code: `select(birds, -color, -is.sparrow)`, opts: [
          { t: 'bird, inches', ok: true, why: '처음이 `-`로 시작하면 "전체에서" 빼기 시작 → 두 열을 뺌.' },
          { t: '열 없음', why: '처음부터 `-`면 전체에서 빼요.' },
          { t: 'color, is.sparrow', why: '빼기예요.' },
        ] },
        { type: 'predict', q: '그럼 이건? (wk4 62행)', code: `select(birds, !color, !is.sparrow)`, opts: [
          { t: 'bird, inches, is.sparrow, color (4개 전부)', ok: true, why: '(color 말고 전부) ∪ (is.sparrow 말고 전부) = 전부. 순서는 먼저 나온 것부터.' },
          { t: 'bird, inches', why: '`!`는 합집합으로 더해져요.' },
          { t: '열 없음', why: '합집합이라 오히려 늘어나요.' },
        ] },
      ],
    },
    {
      id: 'n-rename',
      title: 'select로 이름 바꾸기: 새이름 = 옛이름',
      src: 'wk4_dplyr.R 67–69행 "doesn\'t work;;"',
      key: '`select(birds, species = bird, color)` → bird 열을 species라는 이름으로 골라 온다. **새 이름이 왼쪽**, 원래 열이 오른쪽.',
      body: [
        { code: `select(birds, "species" = bird, color)` },
        '왼쪽의 새 이름은 따옴표가 있어도 없어도 돼요. 거꾸로 쓰면(수업 69행):',
        { code: `select(birds, bird = "species", color)`, expect: 'error' },
        '오른쪽 `"species"`를 **원래 열 이름**으로 찾으려 하는데 그런 열이 없어서 에러. 규칙: `=`의 오른쪽은 항상 **이미 있는 것**. (mutate의 `새열 = 계산식`, aes의 `x = displ`도 오른쪽이 데이터 쪽이에요.)',
      ],
      quiz: [
        { type: 'mcq', q: 'inches 열을 size라는 이름으로 골라 오려면?', opts: [
          { t: '`select(birds, size = inches)`', ok: true, why: '새이름 = 옛이름.' },
          { t: '`select(birds, inches = size)`', why: '방향이 반대 → "size 열이 없다" 에러.' },
          { t: '`select(birds, inches -> size)`', why: 'select 안에서 쓰는 문법이 아니에요.' },
        ] },
        { type: 'predict', q: '결과는?', code: `select(birds, bird = "species", color)`, expect: 'error', opts: [
          { t: '"Column `species` doesn\'t exist" 에러', ok: true, why: '오른쪽을 기존 열로 찾아요.' },
          { t: 'species, color 열', why: '방향이 거꾸로예요.' },
        ] },
      ],
    },
    {
      id: 'n-save',
      title: '결과는 저장해야 남는다',
      src: 'wk4_dplyr.R 41, 45행 `## shortbirds <- …`, `nosparrow <- …`',
      key: 'select·filter·mutate는 **원본을 바꾸지 않고 새 표를 돌려줄 뿐**이다. 계속 쓰려면 `<-`로 이름을 붙인다.',
      body: [
        { code: `select(birds, bird, inches)
birds` },
        'select 뒤에도 birds는 여전히 4열이에요. 결과를 쓰려면:',
        { code: `nosparrow <- select(birds, -is.sparrow)
nosparrow` },
        { note: 'Python과 비교', kind: 'py', t: 'pandas에서 `df.drop(columns=...)`가 새 DataFrame을 돌려주고 원본은 그대로인 것(inplace=False)과 같아요. dplyr에는 inplace가 없어요 — 항상 새로 만들어 할당해요. 같은 이름에 할당하면(`birds <- select(birds, ...)`) 원본을 **덮어써요**.' },
      ],
      quiz: [
        { type: 'predict', q: '마지막 줄 결과의 열 수는?', code: `select(birds, bird)
ncol(birds)`, opts: [
          { t: '`[1] 4`', ok: true, why: 'birds는 바뀌지 않았어요. (`ncol()` = 열 개수)' },
          { t: '`[1] 1`', why: '저장하지 않았으니 원본 그대로예요.' },
        ] },
        { type: 'write', q: 'birds에서 **bird와 inches만** 남긴 표를 `shortbirds`라는 이름으로 저장하세요 (wk4 41행).', checks: [
          { r: 'obj_df("shortbirds")', m: '`shortbirds <- …`로 저장했나요?' },
          { r: 'identical(names(obj("shortbirds")), c("bird", "inches"))', m: '열은 bird, inches (이 순서) 두 개여야 해요.' },
          { r: 'nrow(obj("shortbirds")) == 8', m: '행은 8개 그대로.' },
          { r: 'ncol(birds) == 4', m: 'birds 원본은 그대로 4열이어야 해요 (birds에 덮어쓰지 말기).' },
        ], sol: `shortbirds <- select(birds, bird, inches)
shortbirds` },
      ],
    },
  ],
});
