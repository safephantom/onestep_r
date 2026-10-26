/* 단원 D: ggplot 기본 구조 */
RS.units.push({
  id: 'd',
  title: 'ggplot 기본 구조',
  short: '빈 캔버스, + 로 층 쌓기, aes()의 뜻, geom_point, + 와 %>% 의 자리',
  desc: 'wk2_ggplot_intro.R 13–17행: `ggplot(data = mpg) + geom_point(mapping = aes(x = displ, y = hwy))`. 이 한 문장을 조각조각 뜯어 봐요.',
  lessons: [
    {
      id: 'd-canvas',
      title: 'ggplot(data = mpg): 빈 캔버스',
      src: 'wk2_ggplot_intro.R 15행 앞부분',
      key: '`ggplot()`은 **도화지(좌표 공간)**만 준비한다. 데이터를 알려 줘도, 무엇을 그릴지(geom)를 더하지 않으면 회색 판뿐이다.',
      body: [
        { compare: [
          { label: '`ggplot(data = mpg)`: 회색 판만', code: `ggplot(data = mpg)` },
          { label: 'aes까지 주면: 축은 생기지만 점은 없음', code: `ggplot(mpg, aes(x = displ, y = hwy))` },
        ] },
        '오른쪽은 x·y 축이 어느 열인지 알기 때문에 **눈금과 축 제목**까지 그려요. 하지만 점을 찍으라는 명령(geom)이 없어요. 회색 바탕에 흰 격자선은 ggplot의 기본 테마(`theme_grey`)예요.',
      ],
      quiz: [
        { type: 'pick', q: '`ggplot(data = mpg)`만 실행하면?', opts: [
          { code: `ggplot(data = mpg)`, ok: true, why: '데이터만 알고 축도 층도 없어서 빈 회색 판.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy))`, why: '이건 aes까지 줘서 축이 생긴 경우예요.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()`, why: '점이 찍히려면 geom_point()가 필요해요.' },
        ] },
        { type: 'mcq', q: '`ggplot(mpg, aes(x = displ, y = hwy))`에서 축은 있는데 점이 없는 이유는?', opts: [
          { t: '데이터가 비어 있어서', why: 'mpg에는 234행이 있어요.' },
          { t: '무엇으로 그릴지(geom 층)를 더하지 않아서', ok: true, why: '`+ geom_point()`를 붙여야 해요.' },
          { t: 'aes가 틀려서', why: 'aes가 맞으니 축 제목(displ, hwy)이 제대로 나왔어요.' },
        ] },
      ],
    },
    {
      id: 'd-plus',
      title: '+ 로 층(layer) 쌓기',
      src: 'wk2_ggplot_intro.R 15–16행',
      key: '`ggplot(...) + geom_point(...)` — `+`는 도화지 위에 **층을 하나 얹는다**. 층은 여러 개 얹을 수 있고, 적은 순서대로 그려진다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy))` },
        'R for Data Science의 템플릿(수업 교재 Ch3)을 외워 두세요:',
        { code: `ggplot(data = <DATA>) +
  <GEOM_FUNCTION>(mapping = aes(<MAPPINGS>))`, run: false },
        '이 수업의 모든 그림은 이 뼈대에 층(geom_smooth, facet_wrap, labs, theme …)을 `+`로 더한 것이에요. 이 도구의 이름 "한 층씩"도 여기서 왔어요.',
        { note: 'Python과 비교', kind: 'py', t: 'matplotlib의 `ax.scatter(...)`, `ax.plot(...)`을 차례로 부르는 것과 비슷하지만, ggplot은 `+`로 **하나의 그림 객체**를 만들어 두었다가 마지막에 한 번에 그려요.' },
      ],
      quiz: [
        { type: 'fill', q: '템플릿대로 mpg의 displ–hwy 산점도를 완성하세요.', code: 'ggplot(data = ▢) +\n  ▢(mapping = aes(x = displ, y = hwy))', ans: [['mpg'], ['geom_point']], why: '데이터는 mpg, 점 그래프는 geom_point.', full: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy))` },
        { type: 'mcq', q: '`+`의 역할은?', opts: [
          { t: '두 그림을 합친 새 그림을 연다', why: '하나의 그림에 층을 더해요.' },
          { t: '앞의 ggplot 객체에 층(또는 설정)을 더한다', ok: true, why: 'geom, facet, labs, theme 모두 `+`로 더해요.' },
          { t: '숫자 덧셈', why: 'ggplot 객체 사이의 `+`는 특별한 의미예요.' },
        ] },
      ],
    },
    {
      id: 'd-aes',
      title: 'aes(): 열 → 그림 속성 연결 (mapping)',
      src: 'wk2_ggplot_intro.R 33–37행 "function aes", "color: aes의 미적 속성"',
      key: 'aes = aesthetic(미적 속성). `aes(x = displ)`은 "displ 열의 값을 **x 위치**로 표현하라"는 **연결 규칙**이다. 그림을 그리는 함수가 아니다.',
      body: [
        '그림의 시각 속성과 데이터 열을 짝지어 주는 게 aes()의 전부예요.',
        { table: { head: ['aes 이름', '시각 속성', '수업 속 예'], rows: [
          ['`x`, `y`', '가로·세로 위치', '`x = displ, y = hwy`'],
          ['`color` (= `colour`)', '점·선·테두리 색', '`color = class`'],
          ['`fill`', '면(막대·바이올린·박스) 채움 색', '`fill = cut`'],
          ['`size`', '크기', '`size = class` (경고)'],
          ['`shape`', '점 모양', '"shapes to points by levels"'],
          ['`alpha`', '투명도', ''],
          ['`linetype`', '선 모양(실선/점선)', '`linetype = drv`'],
          ['`group`', '묶음(보이는 속성 없음)', '`group = drv`'],
        ] } },
        { note: '매핑(mapping)과 설정(setting)', kind: 'map', t: '**aes() 안**: "데이터에 따라 달라져라" (매핑). 범례가 생겨요.\n\n**aes() 밖**: "모두 이 값으로 고정" (설정). 범례가 없어요.\n\n이 둘의 구분이 E단원 전체의 핵심이에요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`aes(x = displ, y = hwy)`의 뜻으로 가장 정확한 것은?', opts: [
          { t: 'displ과 hwy를 계산해서 그림을 그린다', why: 'aes는 그리지 않아요. 연결 규칙만 만들어요.' },
          { t: 'displ 값은 가로 위치로, hwy 값은 세로 위치로 표현하라는 규칙', ok: true, why: '맞아요. 실제로 그리는 건 geom이에요.' },
          { t: 'x와 y라는 새 변수를 만든다', why: '괄호 안의 `=`는 인자 이름이에요.' },
        ] },
        { type: 'tf', q: '`aes()`만 실행해도 그림이 나온다.', ans: false, why: 'aes()는 매핑 목록을 돌려줄 뿐이에요. ggplot()과 geom이 있어야 그려져요.' },
        { type: 'mcq', q: 'aes() 안에 들어갈 수 **없는** 것은?', opts: [
          { t: '`color = class`', why: '열을 색에 매핑 — 정상.' },
          { t: '`data = mpg`', ok: true, why: '데이터는 ggplot()이나 geom의 `data =` 인자로 줘요. aes는 "열 → 속성" 짝만.' },
          { t: '`y = hwy`', why: '정상.' },
        ] },
      ],
    },
    {
      id: 'd-xy',
      title: 'x와 y: 무엇을 어느 축에',
      src: 'wk2 `aes(x = displ, y = hwy)`, `aes(x = cty, y = hwy)`',
      key: 'x = 가로, y = 세로. 보통 **설명하는 변수**(원인 쪽)를 x, **궁금한 결과**를 y에 둔다.',
      body: [
        { compare: [
          { label: '`x = displ, y = hwy`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()` },
          { label: '`x = hwy, y = displ` (뒤바꿈)', code: `ggplot(mpg, aes(x = hwy, y = displ)) +
  geom_point()` },
        ] },
        '데이터는 같고 축만 바뀌었어요. "배기량이 연비에 영향을 준다"는 이야기를 하려면 왼쪽처럼 displ을 x에 두는 게 자연스러워요.',
      ],
      quiz: [
        { type: 'codepick', q: '이 그림을 만든 코드는?', opts: [
          { code: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point()`, ok: true, why: 'x축 제목 cty, y축 제목 hwy.' },
          { code: `ggplot(mpg, aes(x = hwy, y = cty)) +
  geom_point()`, why: '축 제목을 보세요: 가로축이 cty예요.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point()`, why: '가로축이 displ이 아니에요.' },
        ] },
        { type: 'mcq', q: 'wk2 131행 `aes(x = cty, y = hwy)` 그림에서 점들이 대각선으로 늘어선 이유는?', opts: [
          { t: '도시 연비가 좋은 차는 고속도로 연비도 좋아서', ok: true, why: '두 연비는 강하게 비례해요 (K단원 geom_abline에서 다시).' },
          { t: 'jitter 때문에', why: 'jitter는 점을 살짝 흔들 뿐, 패턴을 만들지 않아요.' },
          { t: 'x와 y가 같은 열이라서', why: 'cty와 hwy는 다른 열이에요.' },
        ] },
      ],
    },
    {
      id: 'd-point',
      title: 'geom_point: 행마다 점 하나',
      src: 'wk2_ggplot_intro.R 17행 `## "geom_point" for plotting scatter plots`',
      key: 'geom = geometric object(기하 객체). geom_point는 **데이터의 행마다** (x, y) 위치에 점을 하나씩 찍는다.',
      body: [
        '`geom_` 뒤의 이름이 모양을 정해요. 이 수업에 나오는 geom들:',
        { table: { head: ['geom', '모양', '행과의 관계'], rows: [
          ['`geom_point`', '점', '행 1개 = 점 1개'],
          ['`geom_smooth`', '추세 곡선 + 신뢰 띠', '행들을 요약해 선 하나'],
          ['`geom_bar`', '막대', '행 **개수**를 세어 막대'],
          ['`geom_boxplot`', '상자 수염', '그룹마다 요약 통계'],
          ['`geom_violin`', '바이올린', '그룹마다 분포 모양'],
          ['`geom_density`', '밀도 곡선', '분포 모양'],
          ['`geom_abline`', '직선', '데이터와 무관한 기준선'],
        ] } },
        'point만 **데이터를 그대로** 찍고, 나머지는 대부분 데이터를 **계산(요약)**해서 그려요. 이 차이는 J단원(stat)에서 다시 나와요.',
      ],
      quiz: [
        { type: 'mcq', q: '`ggplot(mpg, aes(x = displ, y = hwy)) + geom_point()`에는 점이 몇 개 찍힐까요?', opts: [
          { t: '234개 (겹친 것 포함)', ok: true, why: '행마다 하나. 같은 위치에 겹친 점이 많아서 눈에는 적어 보여요 (I단원 jitter).' },
          { t: '38개', why: '모델 수가 아니라 행 수만큼이에요.' },
          { t: '11개', why: '열 수와는 관계없어요.' },
        ] },
        { type: 'mcq', q: '다음 중 데이터를 **요약·계산해서** 그리는 geom은?', opts: [
          { t: 'geom_point', why: '행을 그대로 찍어요.' },
          { t: 'geom_boxplot', ok: true, why: '중앙값·사분위수를 계산해 그려요.' },
        ] },
      ],
    },
    {
      id: 'd-plusline',
      title: '+ 는 줄 끝에 (줄 맨 앞에 두면?)',
      src: 'B단원 "여러 줄 코드" 규칙의 ggplot판',
      key: '`+`가 **윗줄 끝**에 있어야 R이 다음 줄을 이어 읽는다. 줄 맨 앞에 두면 윗줄은 이미 끝난 명령이 된다.',
      body: [
        { code: `ggplot(data = mpg)
  + geom_point(mapping = aes(x = displ, y = hwy))`, expect: 'error' },
        '무슨 일이 일어났는지 순서대로:',
        '1. 첫 줄 `ggplot(data = mpg)`가 **완결된 명령**이라 먼저 실행 → 빈 회색 판이 그려짐\n2. 둘째 줄은 `+geom_point(...)` — 앞에 아무것도 없는 `+` → ggplot2가 친절한 에러: "Did you accidentally put `+` on a new line?"',
        { note: '규칙', kind: 'tip', t: '이어지는 층이 있으면 **줄 끝에 `+`**, 마지막 층은 `+` 없이. 이 도구의 채점 문제에서도 제일 흔한 실수예요.' },
      ],
      quiz: [
        { type: 'predict', q: '실행 결과는?', code: `ggplot(mpg, aes(x = displ, y = hwy))
+ geom_point()`, expect: 'error', opts: [
          { t: '산점도가 정상적으로 그려진다', why: '첫 줄에서 명령이 끝나요.' },
          { t: '축만 있는 빈 그림 + "Cannot use `+` with a single argument" 에러', ok: true, why: '첫 줄은 따로 실행되어 빈 그림, 둘째 줄은 에러.' },
          { t: '아무것도 안 그려지고 문법 에러', why: '문법 에러가 아니라 두 명령으로 나뉘어 각각 실행돼요.' },
        ] },
        { type: 'mcq', q: '고치는 방법은?', opts: [
          { t: '`+`를 첫 줄 끝으로 옮긴다', ok: true, why: '`ggplot(mpg, aes(x = displ, y = hwy)) +` 다음 줄 `  geom_point()`.' },
          { t: '둘째 줄 앞에 공백을 더 넣는다', why: '들여쓰기는 의미가 없어요.' },
          { t: '`+`를 `%>%`로 바꾼다', why: 'ggplot 층은 `+`로만 이어요 (다음 레슨).' },
        ] },
      ],
    },
    {
      id: 'd-pipeplus',
      title: 'ggplot 층을 %>% 로 이으면?',
      src: 'wk4에서 %>%를 배운 뒤 가장 자주 섞어 쓰는 실수',
      key: '**dplyr 단계는 `%>%`**, **ggplot 층은 `+`**. 데이터가 ggplot()에 들어가는 순간부터는 `+`.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) %>%
  geom_point()`, expect: 'error' },
        '`%>%`는 "왼쪽 결과를 오른쪽 함수의 **첫 인자**로" 넣어요. geom_point의 첫 인자는 mapping이라서, ggplot 객체가 mapping 자리에 들어가 에러가 나요. ggplot2가 "Did you use `%>%` or `|>` instead of `+`?"라고 콕 짚어 줘요.',
        '올바른 연결 (S단원에서 자세히):',
        { code: `mpg %>%
  filter(class == "suv") %>%
  ggplot(aes(x = displ, y = hwy)) +
  geom_point()` },
      ],
      quiz: [
        { type: 'predict', q: '실행 결과는?', code: `ggplot(mpg, aes(x = displ, y = hwy)) %>%
  geom_smooth()`, expect: 'error', opts: [
          { t: '곡선이 그려진다', why: 'ggplot 층은 `+`로 이어야 해요.' },
          { t: '"`mapping` must be created by `aes()`" … "Did you use `%>%` … instead of `+`?"', ok: true, why: 'ggplot 객체가 geom_smooth의 mapping 자리로 들어갔어요.' },
        ] },
        { type: 'mcq', q: '`mpg %>% filter(drv == "f") %>% ggplot(aes(x = displ, y = hwy)) + geom_point()`에서 `%>%`와 `+`의 자리는 맞을까요?', opts: [
          { t: '맞다: 데이터 → filter → ggplot까지는 %>%, 그 뒤 층은 +', ok: true, why: 'filter 결과(데이터)가 ggplot()의 첫 인자(data)로 들어가요.' },
          { t: '틀리다: 전부 +여야 한다', why: 'filter 단계는 데이터 → 데이터라 %>%가 맞아요.' },
          { t: '틀리다: 전부 %>%여야 한다', why: 'geom_point는 +로 이어요.' },
        ] },
      ],
    },
    {
      id: 'd-first-write',
      title: '첫 그림 직접 쓰기',
      src: 'wk2_ggplot_intro.R 15–16행',
      key: '보고 따라 쓰지 말고, 템플릿만 떠올리며 직접 써 보세요.',
      body: [
        '이제부터 곳곳에 **직접 써 보기** 문제가 나와요. 브라우저 안의 진짜 R이 코드를 실행하고, 정해진 조건(예: "점 층이 있는가", "x가 displ인가")으로 채점해요. 처음 실행할 때 R을 내려받느라 30초~1분 걸려요.',
      ],
      quiz: [
        { type: 'write', q: 'mpg로 x축 `displ`, y축 `hwy`인 산점도를 그리세요.', starter: '', target: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy))`,
          checks: [
            { r: 'is_gg()', m: 'ggplot 그림이 만들어져야 해요 (`ggplot(...)`로 시작).' },
            { r: 'identical(data_nrow(), 234L)', m: '데이터는 mpg (234행)여야 해요.' },
            { r: 'has_geom("point")', m: '`geom_point()` 층이 필요해요.' },
            { r: 'maps("x", "displ", "point")', m: 'x에 displ을 매핑했나요?' },
            { r: 'maps("y", "hwy", "point")', m: 'y에 hwy를 매핑했나요?' },
          ],
          sol: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy))`,
          why: '첫 ggplot 완성! `ggplot(mpg, aes(x = displ, y = hwy)) + geom_point()`처럼 써도 똑같이 통과해요.' },
        { type: 'write', q: '같은 데이터로 x축 `cty`, y축 `hwy`인 산점도를 그리세요.', target: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point()`,
          checks: [
            { r: 'has_geom("point")', m: '`geom_point()` 층이 필요해요.' },
            { r: 'maps("x", "cty", "point")', m: 'x = cty' },
            { r: 'maps("y", "hwy", "point")', m: 'y = hwy' },
          ],
          sol: `ggplot(mpg, aes(x = cty, y = hwy)) +
  geom_point()` },
      ],
    },
  ],
});
