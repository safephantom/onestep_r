/* 단원 C: 데이터 들여다보기 */
RS.units.push({
  id: 'c',
  title: '데이터 들여다보기',
  short: 'tibble, mpg·diamonds, head/View/str/glimpse/summary, 타입 약어, 이산 vs 연속',
  desc: 'wk2 첫 부분(`View(mpg)`, `head(mpg)`, `str(mpg)`, `?mpg`)과 질문 **"what are discrete vs. continuous variables in mpg?"**, wk4의 `glimpse/head/view/summary(birds)`.',
  lessons: [
    {
      id: 'c-tibble',
      title: '데이터프레임과 tibble',
      src: 'wk2 `head(mpg)`, wk4 `tibble(...)`',
      key: '표 = **행(관측 하나)** × **열(변수 하나)**. tibble은 tidyverse식 데이터프레임으로, 출력할 때 크기·열 종류를 요약해 보여 준다.',
      body: [
        { code: `mpg` },
        { table: { head: ['출력 부분', '뜻'], rows: [
          ['`# A tibble: 234 × 11`', '234행 × 11열'],
          ['열 이름 아래 `<chr>`, `<dbl>`…', '각 열의 값 종류 (C단원 뒤에서)'],
          ['`# ℹ 224 more rows`', '화면엔 앞 10행만 — **데이터는 전부 있음**'],
        ] } },
        { note: 'Python과 비교', kind: 'py', t: 'pandas DataFrame과 같은 개념이에요. R 기본형은 `data.frame`이고 tibble은 그걸 조금 더 친절하게 만든 것 (read.csv는 data.frame, read_csv는 tibble — M단원).' },
      ],
      quiz: [
        { type: 'mcq', q: '`# A tibble: 234 × 11`의 뜻은?', opts: [
          { t: '234행, 11열', ok: true, why: '행 × 열 순서예요.' },
          { t: '234열, 11행', why: '행이 먼저예요.' },
          { t: '234개 중 11개만 표시', why: '표시는 10행이고, 234 × 11은 전체 크기예요.' },
        ] },
        { type: 'mcq', q: 'mpg에서 **한 행**은 무엇을 나타낼까요?', opts: [
          { t: '자동차 모델 하나(연식·변속기 조합별)', ok: true, why: '예: 1행은 1999년 audi a4, 1.8L, auto(l5).' },
          { t: '제조사 하나', why: '제조사(audi 등)는 여러 행에 반복돼요.' },
          { t: '변수 하나', why: '변수는 열이에요.' },
        ] },
        { type: 'tf', q: '출력에 10행만 보이면 데이터도 10행만 불러와진 것이다.', ans: false, why: '출력만 줄인 거예요. `nrow(mpg)`는 234.' },
      ],
    },
    {
      id: 'c-mpg',
      title: 'mpg 데이터: 각 열의 뜻',
      src: 'wk2_ggplot_intro.R 4–8행, `?mpg`',
      key: 'mpg = 1999·2008년 미국 자동차 234개의 연비 자료. wk2–3 그림 예제의 절반이 이 데이터다.',
      body: [
        { table: { head: ['열', '뜻', '종류'], rows: [
          ['manufacturer, model', '제조사, 모델명', 'chr'],
          ['displ', '엔진 배기량(리터)', 'dbl'],
          ['year', '연식 (1999 또는 2008)', 'int'],
          ['cyl', '실린더 수 (4, 5, 6, 8)', 'int'],
          ['trans', '변속기 (auto(l5), manual(m5) …)', 'chr'],
          ['drv', '구동 방식: `f` 전륜, `r` 후륜, `4` 사륜', 'chr'],
          ['cty, hwy', '도시/고속도로 연비 (miles per gallon)', 'int'],
          ['fl', '연료 종류', 'chr'],
          ['class', '차종 7가지: 2seater, compact, midsize, minivan, pickup, subcompact, suv', 'chr'],
        ] } },
        'wk2 그림의 핵심 질문: **엔진이 클수록(displ↑) 연비가 나쁜가(hwy↓)?** 그리고 그 관계가 차종(class)·구동 방식(drv)에 따라 어떻게 다른가?',
        { note: '외울 필요 없어요', kind: 'tip', t: '이 표는 사전처럼 쓰는 곳이에요. 뒤 레슨에서 `displ`, `hwy`, `class`, `drv` 같은 열 이름이 나오는데 뜻이 헷갈리면 여기로 돌아와 확인하세요. 그래서 이 레슨에는 퀴즈가 없어요.' },
      ],
    },
    {
      id: 'c-head',
      title: 'head(): 앞부분만 보기',
      src: 'wk2 `head(mpg)`, wk3 `head(sibimit)`, `head(sibimit_means)`, wk4 `head(birds)`',
      key: '`head(데이터)` → 앞 **6행**. `head(데이터, n)` → 앞 n행.',
      setup: 'birds',
      body: [
        { code: `head(birds)` },
        { code: `head(mpg, 3)` },
        '데이터를 불러오거나 새로 만든 직후 "제대로 됐나?" 확인하는 습관 1번이에요. wk3 코드의 주석 "check top of new summary data frame"도 같은 뜻.',
      ],
      quiz: [
        { type: 'mcq', q: 'birds(8행)에 `head(birds)`를 하면 몇 행이 보일까요?', opts: [
          { t: '6', ok: true, why: '기본 6행.' },
          { t: '8', why: 'head는 앞부분만 잘라요.' },
          { t: '10', why: '10행은 tibble 전체 출력의 기본 표시 수예요. head는 6.' },
        ] },
        { type: 'fill', q: 'mpg의 앞 **3**행만 보려면?', code: 'head(mpg, ▢)', ans: [['3', 'n = 3', 'n=3']], why: '두 번째 인자가 행 수(n)예요.', full: 'head(mpg, 3)' },
      ],
    },
    {
      id: 'c-view',
      title: 'View() / view(): 표로 펼쳐 보기',
      src: 'wk2 `View(mpg)`, wk4 `view(birds)`',
      key: 'RStudio에서 데이터를 **스프레드시트처럼** 새 탭에 연다. 데이터를 바꾸지는 않는다.',
      setup: 'birds',
      body: [
        '`View()`(대문자)는 R 기본, `view()`(소문자)는 tidyverse(tibble)의 것이에요. 동작은 같아요. RStudio 표에서는 열 이름을 눌러 정렬하고 Filter 버튼으로 걸러 볼 수 있지만, **보기만** 바뀌고 데이터는 그대로예요.',
        { code: `View(birds)`, cap: '이 도구에서는 View()가 아래에 표로 나와요' },
      ],
      quiz: [
        { type: 'tf', q: 'RStudio의 View 창에서 inches 열을 눌러 정렬하면 birds 데이터의 행 순서도 바뀐다.', ans: false, why: '보기만 정렬돼요. 데이터를 정렬하려면 `arrange()`(R단원) 결과를 저장해야 해요.' },
        { type: 'mcq', q: '`View(mpg)`와 `view(mpg)`는?', opts: [
          { t: '둘 다 된다 (다른 패키지의 비슷한 함수)', ok: true, why: 'View는 R 기본, view는 tidyverse.' },
          { t: '대문자만 된다', why: 'tidyverse를 불렀다면 소문자도 돼요 (wk4처럼).' },
          { t: '소문자만 된다', why: 'View는 R에 기본으로 있어요.' },
        ] },
      ],
    },
    {
      id: 'c-glimpse',
      title: 'str()과 glimpse(): 구조 한눈에',
      src: 'wk2 `str(mpg)`, wk3·wk4 `glimpse(...)`',
      key: '열 이름 · 값 종류 · 앞쪽 값 몇 개를 **열마다 한 줄**로 보여 준다. glimpse는 tidyverse판 str.',
      body: [
        { code: `str(mpg)` },
        { code: `glimpse(mpg)` },
        { table: { head: ['', 'str()', 'glimpse()'], rows: [
          ['크기', '`tibble [234 × 11]`', '`Rows: 234` `Columns: 11`'],
          ['실수형 표시', '`num`', '`<dbl>`'],
          ['정수형', '`int`', '`<int>`'],
          ['글자형', '`chr`', '`<chr>`'],
        ] } },
        '열이 많아 head()로는 옆으로 잘릴 때 glimpse가 특히 좋아요 (sibimit은 17열).',
      ],
      quiz: [
        { type: 'mcq', q: '`glimpse(mpg)`에서 `cyl`의 종류는?', opts: [
          { t: '`<int>`', ok: true, why: '실린더 수는 정수.' },
          { t: '`<chr>`', why: '숫자로 저장돼 있어요.' },
          { t: '`<fct>`', why: 'factor가 아니에요. 그래서 ggplot이 연속으로 취급해요 (이 단원 뒤에서).' },
        ] },
        { type: 'mcq', q: '`str()`에서 `num`은 glimpse의 무엇과 같은가?', opts: [
          { t: '`<dbl>`', ok: true, why: '실수형(double).' },
          { t: '`<int>`', why: 'str은 정수를 `int`로 따로 써요.' },
          { t: '`<lgl>`', why: '논리형은 str에서 `logi`예요.' },
        ] },
      ],
    },
    {
      id: 'c-summary',
      title: 'summary(): 요약 통계',
      src: 'wk4_dplyr.R 25행 `summary(birds)`',
      key: '숫자 열 → 최솟값·1사분위·중앙값·평균·3사분위·최댓값. 논리 열 → TRUE/FALSE 개수. 글자 열 → 개수 정보.',
      setup: 'birds',
      body: [
        { code: `summary(birds)` },
        '`inches` 열을 읽어 볼게요.',
        { table: { head: ['항목', '값', '뜻'], rows: [
          ['Min.', '7.000', '가장 작은 값'],
          ['1st Qu.', '8.375', '작은 쪽에서 25% 지점'],
          ['Median', '11.750', '가운데 (50%)'],
          ['Mean', '15.125', '평균 — owl들이 커서 중앙값보다 큼'],
          ['3rd Qu.', '23.500', '75% 지점'],
          ['Max.', '26.000', '가장 큰 값'],
        ] } },
        '이 다섯 숫자(최소·Q1·중앙값·Q3·최대)가 그대로 **boxplot**의 뼈대예요 (J단원). 글자 열(bird, color)의 `N.unique`는 R 4.6부터 나오는 표시로, 서로 다른 값의 개수예요.',
      ],
      quiz: [
        { type: 'mcq', q: 'birds `inches`의 중앙값은?', opts: [
          { t: '11.75', ok: true, why: '8개 값의 가운데 두 값(11.5, 12)의 평균.' },
          { t: '15.125', why: '그건 평균(Mean).' },
          { t: '8.375', why: '그건 1사분위.' },
        ] },
        { type: 'mcq', q: '`is.sparrow`에 대해 summary가 보여 주는 `TRUE :5`의 뜻은?', opts: [
          { t: 'TRUE가 5개', ok: true, why: 'crow 3 + oriole 2.' },
          { t: '5번째 행이 TRUE', why: '개수예요.' },
          { t: 'TRUE의 비율이 5%', why: '비율이 아니라 개수.' },
        ] },
        { type: 'mcq', q: '평균(15.125)이 중앙값(11.75)보다 큰 이유는?', opts: [
          { t: '큰 값(owl 23–26인치)이 평균을 끌어올려서', ok: true, why: '평균은 극단값에 민감하고 중앙값은 덜 민감해요.' },
          { t: '계산 오류', why: '정상이에요.' },
          { t: '글자 열이 섞여서', why: 'inches만 계산했어요.' },
        ] },
      ],
    },
    {
      id: 'c-types',
      title: '열 종류 약어: <chr> <dbl> <int> <lgl> <fct> <ord>',
      src: 'glimpse / tibble 출력',
      key: '약어 하나로 그 열이 **글자인지, 숫자인지, 범주인지** 안다. ggplot은 이 종류를 보고 색·축을 정한다.',
      body: [
        { table: { head: ['약어', '뜻', '예'], rows: [
          ['`<chr>`', '글자 (character)', 'mpg$class, sibimit$Subject'],
          ['`<dbl>`', '실수 (double)', 'mpg$displ, sibimit$COGm'],
          ['`<int>`', '정수 (integer)', 'mpg$hwy, mpg$cyl'],
          ['`<lgl>`', '논리 (TRUE/FALSE)', 'birds$is.sparrow'],
          ['`<fct>`', '범주 (factor): 정해진 수준(level)들', 'factor(Duration)의 결과'],
          ['`<ord>`', '**순서 있는** 범주 (ordered factor)', 'diamonds$cut: Fair < Good < … < Ideal'],
        ] } },
        '`<chr>`과 `<fct>`의 차이: 글자는 알파벳 순으로 정렬되고, factor는 **정한 순서(level)**를 기억해요. wk4 practice plot의 x축 순서(Control → NoComp → NoCont → Context)를 맞추려면 factor가 필요해요 (S단원).',
      ],
      quiz: [
        { type: 'mcq', q: '`diamonds$cut`이 `<ord>`라는 것은?', opts: [
          { t: '순서가 있는 범주 (Fair < Good < Very Good < Premium < Ideal)', ok: true, why: '막대그래프의 막대도 이 순서로 놓여요.' },
          { t: '숫자로 된 열', why: '범주예요.' },
          { t: '정렬이 끝난 열', why: '행이 정렬됐다는 뜻이 아니라 범주에 순서가 있다는 뜻이에요.' },
        ] },
        { type: 'mcq', q: '`sibimit$Place` ("alveo", "retro")의 종류는?', setup: 'sibimit', opts: [
          { t: '`<chr>`', ok: true, why: 'read_csv는 글자 열을 기본으로 chr로 읽어요.' },
          { t: '`<fct>`', why: 'read_csv는 자동으로 factor를 만들지 않아요.' },
          { t: '`<lgl>`', why: '두 값뿐이지만 TRUE/FALSE가 아니라 글자예요.' },
        ] },
      ],
    },
    {
      id: 'c-discrete',
      title: '이산(discrete) vs 연속(continuous)',
      src: 'wk2_ggplot_intro.R 9행 "what are discrete vs. continuous variables in mpg?"',
      key: 'ggplot은 값이 무슨 뜻인지 모르고 **열의 종류**(`<chr>`·`<int>` 같은 약어)만 본다: 글자·factor → 이산(색 몇 개), 숫자(int·dbl) → 연속(그라데이션). 그래서 cyl(4·5·6·8기통)은 사람이 보기엔 그룹이지만 `<int>`라서 `color = cyl`은 색 4개가 아니라 **그라데이션**이 된다.',
      body: [
        { table: { head: ['mpg 열', '종류', 'ggplot의 판단'], rows: [
          ['manufacturer, model, trans, drv, fl, class', '`<chr>`', '이산'],
          ['displ', '`<dbl>`', '연속'],
          ['year, cyl, cty, hwy', '`<int>`', '연속 (정수라도!)'],
        ] } },
        '같은 color 매핑이라도 열 종류에 따라 결과가 완전히 달라요. `color = cyl`의 범례는 진한 파랑→연한 파랑 **막대 하나**예요: 눈금에 실제로 없는 7기통까지 있고, 점들은 같은 파랑의 진하기만 달라서 그룹이 잘 안 갈려요. `factor(cyl)`의 범례는 **색 4개**예요:',
        { compare: [
          { label: '`color = cyl` (int → 연속: 그라데이션)', code: `ggplot(mpg, aes(x = displ, y = hwy, color = cyl)) +
  geom_point()` },
          { label: '`color = factor(cyl)` (범주: 색 4개)', code: `ggplot(mpg, aes(x = displ, y = hwy, color = factor(cyl))) +
  geom_point()` },
        ] },
        '`factor()`는 숫자를 범주로 바꿔요. wk3 폴더의 `plot_practice.R`이 `fill = factor(Duration)`을 쓰는 이유가 이것이에요: Duration(60, 140, 220, 300, 380)은 `<dbl>`이라 그대로 쓰면 연속 그라데이션이 돼요.',
      ],
      quiz: [
        { type: 'pick', q: '`drv`는 `<chr>`(값 "4", "f", "r")예요. `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) + geom_point()`의 결과는?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point()`, ok: true, why: 'drv는 글자 → 색 3개짜리 범례.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy, color = cty)) +
  geom_point()`, why: '이건 연속 변수(cty) → 파란 그라데이션 막대 범례.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy, color = factor(cyl))) +
  geom_point()`, why: '이건 factor(cyl) → 색 4개.' },
        ] },
        { type: 'mcq', q: 'spectral_imitation_data의 `Duration`(60, 140, 220, 300, 380, `<dbl>`)으로 **5가지 색**의 바이올린을 만들려면?', setup: 'spec', opts: [
          { t: '`fill = Duration`', why: '숫자라서 연속 그라데이션이 되고, violin은 그룹을 못 나눠 fill이 버려져요 (경고).' },
          { t: '`fill = factor(Duration)`', ok: true, why: '범주로 바꿔야 5개의 이산 색이 돼요 (plot_practice.R 26행).' },
          { t: '`fill = "Duration"`', why: '따옴표를 쓰면 "Duration"이라는 글자 하나 → 색 1개.' },
        ] },
      ],
    },
    {
      id: 'c-diamonds',
      title: 'diamonds 데이터',
      src: 'wk2 144행부터 막대그래프, wk3 밀도·막대그래프',
      key: '다이아몬드 53,940개. cut·color·clarity는 **순서 있는 범주**(`<ord>`), price·carat은 연속.',
      body: [
        { code: `glimpse(diamonds)` },
        { table: { head: ['열', '뜻', '수준 (나쁨 → 좋음)'], rows: [
          ['cut', '컷 품질', 'Fair, Good, Very Good, Premium, Ideal'],
          ['color', '색 등급', 'D (최고) … J'],
          ['clarity', '투명도', 'I1, SI2, SI1, VS2, VS1, VVS2, VVS1, IF'],
          ['price', '가격(달러)', '연속'],
        ] } },
        { note: '주의: color라는 열이 있다', kind: 'warn', t: 'diamonds에는 `color`라는 **열**이 있어요 (다이아몬드 색 등급). 그래서 `aes(fill = color)`가 diamonds에서는 동작하고 mpg에서는 에러가 나요. E단원 "fill = 다른 열: 누적 막대"에서 자세히.' },
      ],
      quiz: [
        { type: 'mcq', q: 'diamonds의 행 수는?', opts: [
          { t: '53,940', ok: true, why: '그래서 geom_point 대신 막대·밀도 그림을 주로 써요.' },
          { t: '234', why: 'mpg의 행 수예요.' },
          { t: '10', why: '출력에 보이는 행 수일 뿐.' },
        ] },
        { type: 'mcq', q: '`ggplot(diamonds, aes(x = cut)) + geom_bar()`의 막대 순서는?', opts: [
          { t: 'Fair, Good, Very Good, Premium, Ideal', ok: true, why: '`<ord>`의 수준 순서를 따라요.' },
          { t: '알파벳 순: Fair, Good, Ideal, Premium, Very Good', why: '글자(chr)였다면 알파벳 순이었겠지만 cut은 순서형 factor예요.' },
          { t: '개수가 많은 순', why: 'ggplot은 자동으로 개수 순 정렬을 하지 않아요.' },
        ] },
      ],
    },
  ],
});
