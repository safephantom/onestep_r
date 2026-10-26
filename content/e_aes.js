/* 단원 E: 미적 속성 (aes) — 매핑 vs 설정, color vs fill */
RS.units.push({
  id: 'e',
  title: '미적 속성: color·fill·size·shape',
  short: '매핑 vs 설정, aes(color = "blue")의 함정, color vs fill, fill = 다른 열(누적 막대)',
  desc: 'wk2_ggplot_intro.R 33–51행과 wk3 막대그래프의 "what is the difference between color and fill?". 이 단원의 핵심 문장: **aes() 안은 데이터에 따라 바뀌고(매핑), 밖은 고정된다(설정).**',
  lessons: [
    {
      id: 'e-color',
      title: 'color = class: 범주를 색으로',
      src: 'wk2_ggplot_intro.R 35–37행',
      key: '범주형 열을 color에 매핑하면, ggplot이 **범주마다 색을 자동 배정**하고 **범례**를 만든다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = class))` },
        '여기서 ggplot이 대신 해 준 일 세 가지:',
        '1. class의 서로 다른 값 7개를 찾아서\n2. 색 7개(기본 "hue" 팔레트: 색상환을 7등분)를 배정하고\n3. 오른쪽에 **범례**(어떤 색이 어떤 값인지)를 그림',
        '이게 바로 "scale"이 하는 일이에요. 색을 직접 고르고 싶으면 `scale_color_manual()`(U단원)을 써요.',
        '그림을 보면 displ이 큰데 hwy도 높은 이상한 점들(오른쪽 위)이 **2seater**(스포츠카)라는 게 한눈에 보여요. 이게 색 매핑의 목적이에요: 세 번째 변수를 드러내기.',
      ],
      quiz: [
        { type: 'mcq', q: '범례(legend)는 왜 생겼을까요?', opts: [
          { t: 'color를 aes() 안에서 열(class)에 매핑했기 때문', ok: true, why: '매핑 = 데이터 값과 색의 대응표가 필요 → 범례.' },
          { t: 'geom_point는 항상 범례를 그린다', why: '매핑이 없으면 범례도 없어요.' },
          { t: 'class가 7개라서', why: '개수와 관계없이 매핑하면 생겨요.' },
        ] },
        { type: 'write', q: 'mpg로 x = displ, y = hwy 산점도를 그리되, **구동 방식(drv)**에 따라 점 색이 달라지게 하세요.', target: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point()`, checks: [
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: 'maps("x", "displ", "point") && maps("y", "hwy", "point")', m: 'x = displ, y = hwy' },
          { r: 'maps("colour", "drv", "point")', m: 'color가 **aes() 안에서** drv에 매핑되어야 해요.' },
        ], sol: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = drv))` },
      ],
    },
    {
      id: 'e-continuous',
      title: '연속 변수를 색으로 매핑하면: 그라데이션',
      src: 'C단원 "이산 vs 연속"의 color판',
      key: '숫자 열을 color에 매핑하면 색 **몇 개**가 아니라 **연속된 그라데이션**(기본: 짙은 파랑 → 밝은 파랑)과 막대 모양 범례가 생긴다.',
      body: [
        { compare: [
          { label: '`color = class` (글자 → 이산)', code: `ggplot(mpg, aes(x = displ, y = hwy, color = class)) +
  geom_point()` },
          { label: '`color = cty` (숫자 → 연속)', code: `ggplot(mpg, aes(x = displ, y = hwy, color = cty)) +
  geom_point()` },
        ] },
        '범례 모양만 봐도 그 변수가 이산인지 연속인지 알 수 있어요: **네모 칸 목록** = 이산, **색 막대** = 연속.',
      ],
      quiz: [
        { type: 'pick', q: '`color = year`(연식 1999/2008, `<int>`)로 매핑하면 범례는 어떻게 생길까요?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy, color = year)) +
  geom_point()`, ok: true, why: 'year는 정수(int) → 연속 그라데이션. 값이 두 개뿐이어도요!' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy, color = factor(year))) +
  geom_point()`, why: '이건 factor(year)로 바꿔서 색 두 개가 된 경우예요.' },
        ] },
        { type: 'mcq', q: '범례가 "색 막대(그라데이션)" 모양이면, 매핑된 변수는?', opts: [
          { t: '연속(숫자)', ok: true, why: '값 사이사이의 모든 색이 가능하다는 표시예요.' },
          { t: '이산(범주)', why: '이산이면 칸마다 색 하나.' },
        ] },
      ],
    },
    {
      id: 'e-size',
      title: 'size = class: 경고가 뜨는 이유',
      src: 'wk2_ggplot_intro.R 39–40행',
      key: '크기는 **많다/적다**를 뜻하는 속성이라, 순서 없는 범주(class)에 쓰면 ggplot이 "권장하지 않음" 경고를 낸다 (그림은 그려진다).',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, size = class))` },
        '경고(Warning)는 에러와 달리 **그림이 그려져요**. 하지만 보는 사람은 "큰 점 = 더 많은/큰 무엇"으로 읽기 쉬워서 2seater와 suv 사이에 크기 순서가 있는 것처럼 오해하게 돼요. `alpha = class`(투명도)도 같은 이유로 경고가 나요.',
      ],
      quiz: [
        { type: 'mcq', q: '`Using size for a discrete variable is not advised.`는?', opts: [
          { t: '에러: 그림이 안 그려진다', why: 'Warning이라 그림은 그려져요.' },
          { t: '경고: 그려지긴 하지만 범주에 크기를 쓰는 건 오해를 부른다는 조언', ok: true, why: '맞아요.' },
          { t: '메시지: 단순 정보', why: 'Warning은 "문제일 수 있음" 수준이에요.' },
        ] },
        { type: 'mcq', q: 'size 매핑이 **잘 어울리는** 변수는?', opts: [
          { t: 'cyl이나 cty처럼 크기 순서가 있는 숫자', ok: true, why: '크기의 크고 작음이 값의 크고 작음과 일치해요.' },
          { t: 'class', why: '순서 없는 범주.' },
          { t: 'manufacturer', why: '순서 없는 범주.' },
        ] },
      ],
    },
    {
      id: 'e-shape',
      title: 'shape = drv: 점 모양으로 구분 (최대 6개)',
      src: 'wk3_Rproject.pdf "Assign colors or shapes to points by levels of a predictor"',
      key: 'shape는 범주마다 점 모양(●▲■…)을 배정한다. 자동 배정은 **6개까지**라서 7개인 class에 쓰면 한 범주의 점이 **사라진다**.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy, shape = drv)) +
  geom_point()` },
        '흑백 인쇄 논문에서 색 대신 자주 써요. 하지만 class(7개)에 쓰면:',
        { code: `ggplot(mpg, aes(x = displ, y = hwy, shape = class)) +
  geom_point()` },
        '두 개의 경고가 연달아 나와요. 첫째: 모양은 6개까지. 둘째: 그래서 7번째 범주(suv) 62행이 **빠졌다**. 그림을 보면 suv 점들이 정말 없어요 — 경고를 무시하면 데이터가 조용히 사라지는 예예요.',
      ],
      quiz: [
        { type: 'mcq', q: '`shape = class` 그림에서 "Removed 62 rows" 경고가 뜬 이유는?', opts: [
          { t: 'class에 NA가 62개 있어서', why: 'class에는 NA가 없어요.' },
          { t: '7번째 범주(suv)에 배정할 모양이 없어서 그 행들을 뺐기 때문', ok: true, why: 'suv가 62대예요.' },
          { t: '점이 겹쳐서', why: '겹친 점은 그려지긴 해요 (안 보일 뿐).' },
        ] },
        { type: 'write', q: 'x = displ, y = hwy 산점도에서 **drv**를 색과 모양 **둘 다**로 구분하세요. (범례가 하나로 합쳐지는지 보세요)', target: `ggplot(mpg, aes(x = displ, y = hwy, color = drv, shape = drv)) +
  geom_point()`, checks: [
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: 'maps("colour", "drv", "point")', m: 'color = drv 매핑' },
          { r: 'maps("shape", "drv", "point")', m: 'shape = drv 매핑' },
        ], sol: `ggplot(mpg, aes(x = displ, y = hwy, color = drv, shape = drv)) +
  geom_point()`, why: '같은 변수를 두 속성에 매핑하면 ggplot이 범례를 **하나로 합쳐요** (G단원 color + linetype도 같은 원리).' },
      ],
    },
    {
      id: 'e-setting',
      title: 'aes() 밖의 color = "blue": 설정 (setting)',
      src: 'wk2_ggplot_intro.R 45–46행',
      key: 'aes() **밖**에 쓴 속성은 데이터와 무관하게 **모든 점에 똑같이** 적용된다. 범례가 없다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = "blue")` },
        '괄호를 잘 보세요: `aes(x = displ, y = hwy)`가 닫힌 **뒤에** `color = "blue"`가 geom_point의 인자로 들어가 있어요. 이런 "설정"에 쓰는 값들:',
        { table: { head: ['속성', '값의 형식', '예'], rows: [
          ['color / fill', '색 이름(글자) 또는 "#RRGGBB"', '`"blue"`, `"grey"`, `"#3288BD"`'],
          ['size', '숫자 (mm 단위)', '`size = 4` (ExerciseKey)'],
          ['alpha', '0(투명) ~ 1(불투명)', '`alpha = 0.5`'],
          ['shape', '숫자 0–25', '`shape = 1` (속 빈 원)'],
          ['width (boxplot 등)', '숫자', '`width = 0.1`'],
        ] } },
      ],
      quiz: [
        { type: 'mcq', q: '`geom_point(aes(x = displ, y = hwy), color = "blue")`에 범례가 **없는** 이유는?', opts: [
          { t: '색이 데이터와 무관하게 하나로 고정(설정)됐기 때문', ok: true, why: '대응표가 필요 없으니 범례도 없어요.' },
          { t: 'blue가 기본 색이라서', why: '기본 점 색은 검정이에요.' },
          { t: '범례는 theme()으로 켜야 해서', why: '매핑이 있으면 기본으로 생겨요.' },
        ] },
        { type: 'fill', q: '모든 점을 크기 4로 설정하세요 (wk2 ExerciseKey 7행).', code: 'ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +\n  geom_point(▢)', ans: [['size = 4', 'size=4']], why: 'aes() 밖이니 모든 점이 같은 크기.', full: `ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point(size = 4)` },
        { type: 'write', q: 'x = displ, y = hwy 산점도의 모든 점을 **빨간색(red)**, **반투명(alpha 0.5)**으로 설정하세요. 범례가 없어야 해요.', target: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(color = "red", alpha = 0.5)`, checks: [
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: 'has_param("point", "colour", "red")', m: '`color = "red"`가 **aes() 밖**(geom_point의 인자)에 있어야 해요.' },
          { r: 'has_param("point", "alpha", 0.5)', m: '`alpha = 0.5` 설정' },
          { r: '!mapped("colour")', m: 'color가 aes() 안에 있으면 매핑이 되어 버려요 (다음 레슨).' },
        ], sol: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(color = "red", alpha = 0.5)` },
      ],
    },
    {
      id: 'e-blue',
      title: 'aes() 안의 color = "blue": 왜 파랗지 않을까',
      src: 'wk2_ggplot_intro.R 49–51행 "What\'s gone wrong with this code? Why are the points not blue?"',
      key: 'aes() 안에 `"blue"`를 넣으면 **"blue"라는 글자 값**을 가진 가상의 범주 하나를 만든 셈이다. ggplot은 그 범주에 **기본 팔레트의 첫 색(분홍빛 빨강 #F8766D)**을 배정하고, 범례에 "blue"라고 적는다.',
      body: [
        { compare: [
          { label: 'aes 밖: 설정 → 진짜 파랑', code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = "blue")` },
          { label: 'aes 안: 매핑 → "blue"라는 범주', code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = "blue"))` },
        ] },
        'aes() 안에서 R이 생각하는 과정을 따라가 봐요:',
        '1. `color = "blue"` → "색을 이 **값**에 따라 정하라" (매핑)\n2. 값이 무엇이냐면: 모든 행에서 똑같은 글자 `"blue"` → 범주 1개짜리 변수\n3. 범주 1개에 기본 팔레트의 첫 색 `#F8766D`(연어색) 배정\n4. 범례 제목은 `colour`, 항목은 `blue`',
        '즉 "blue"는 **색 이름이 아니라 범주 이름**으로 쓰였어요. `color = "hello"`라고 해도 똑같은 연어색 점이 나와요.',
        { note: '기억법', kind: 'map', t: '**"데이터에 따라 달라져야 하나?"** → 예: aes() 안에 **열 이름**. 아니오(다 같은 색): aes() 밖에 **색 값**.' },
      ],
      quiz: [
        { type: 'pick', q: '`geom_point(mapping = aes(x = displ, y = hwy, color = "blue"))`의 결과는?', opts: [
          { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = "blue"))`, ok: true, why: '연어색 점 + "blue"라고 적힌 범례.' },
          { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = "blue")`, why: '진짜 파란 점은 aes() 밖에 썼을 때예요.' },
          { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy))`, why: '이건 색 지정이 없는 기본(검정) 점이에요.' },
        ] },
        { type: 'predict', q: '`aes(color = "hello")`로 바꾸면 점 색은?', code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = "hello"))`, reveal: true, opts: [
          { t: '에러: hello라는 색은 없음', why: '색 이름으로 쓰이지 않으니 에러가 안 나요.' },
          { t: '"blue" 때와 똑같은 연어색, 범례에 "hello"', ok: true, why: '어떤 글자든 범주 1개 → 첫 번째 기본 색.' },
          { t: '검은색', why: '매핑이 있으니 팔레트 색이 배정돼요.' },
        ] },
        { type: 'mcq', q: 'wk2의 질문 "Why are the points not blue?"에 대한 가장 정확한 답은?', opts: [
          { t: '"blue"가 aes() 안에 있어서, 색 값이 아니라 범주 이름(상수 변수)으로 매핑되었기 때문', ok: true, why: '그래서 ggplot이 기본 팔레트 색을 배정했어요.' },
          { t: 'ggplot은 "blue" 대신 "Blue"라고 써야 해서', why: '"blue"는 정상적인 색 이름이에요 (aes 밖에서는 파랗게 나와요).' },
          { t: 'geom_point는 color를 지원하지 않아서', why: '지원해요.' },
        ] },
        { type: 'write', q: 'wk2 49–50행의 코드를 **고쳐서** 점이 정말 파랗게 나오게 하세요.', starter: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = "blue"))`, target: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = "blue")`, checks: [
          { r: 'has_geom("point")', m: 'geom_point() 층' },
          { r: '!mapped("colour")', m: 'color가 아직 aes() 안에 있어요 (매핑).' },
          { r: 'has_param("point", "colour", "blue")', m: '`color = "blue"`를 aes() 밖, geom_point()의 인자로.' },
        ], sol: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = "blue")` },
      ],
    },
    {
      id: 'e-colour',
      title: 'color = colour (영국식 철자도 같다)',
      src: 'wk2_ggplot_intro.R 151행 `colour = cut`, ExerciseKey `aes(colour = drv)`',
      key: '`color`와 `colour`는 ggplot에서 **완전히 같은** 인자다. 수업 코드도 둘을 섞어 쓴다.',
      body: [
        'ggplot2를 만든 해들리 위컴이 뉴질랜드 출신이라 원래 이름은 `colour`예요. 미국식 `color`도 자동으로 `colour`로 바뀌어요. 그래서 범례 제목이나 채점 메시지에 `colour`가 보여도 놀라지 마세요.',
        { compare: [
          { label: '`color = drv`', code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point()` },
          { label: '`colour = drv`', code: `ggplot(mpg, aes(x = displ, y = hwy, colour = drv)) +
  geom_point()` },
        ] },
      ],
      quiz: [
        { type: 'tf', q: '`geom_point(aes(colour = drv))`와 `geom_point(aes(color = drv))`는 같은 그림을 만든다.', ans: true, why: '둘은 같은 인자예요.' },
        { type: 'mcq', q: '`fill`에도 영국식 철자가 따로 있을까요?', opts: [
          { t: '없다. fill은 fill', ok: true, why: '철자 차이가 있는 건 colour/color뿐이에요.' },
          { t: 'fil', why: '그런 인자는 없어요.' },
        ] },
      ],
    },
    {
      id: 'e-fill',
      title: 'color vs fill: 테두리 vs 속',
      src: 'wk2 150–155행, wk3_ggplot_practice.R 62–67행 "what is the difference between color and fill for geom_bar?"',
      key: '**color = 선·점·테두리** 색, **fill = 면의 안쪽** 색. 막대·바이올린·박스·밀도처럼 "면"이 있는 geom은 둘 다 가진다.',
      body: [
        { compare: [
          { label: '`color = cut`: 테두리만 색칠', code: `ggplot(diamonds, aes(x = cut, color = cut)) +
  geom_bar()` },
          { label: '`fill = cut`: 속을 색칠', code: `ggplot(diamonds, aes(x = cut, fill = cut)) +
  geom_bar()` },
        ] },
        '왼쪽은 막대 속이 기본 회색 그대로이고 **테두리 선**만 색이 들어갔어요. 오른쪽은 막대 안쪽이 채워졌어요.',
        { table: { head: ['geom', 'color가 칠하는 곳', 'fill이 칠하는 곳'], rows: [
          ['point (기본 모양)', '점 전체', '(없음)'],
          ['smooth', '선', '신뢰 띠'],
          ['bar / col', '막대 테두리', '막대 속'],
          ['boxplot', '상자 선·수염·중앙선·이상치', '상자 속'],
          ['violin / density', '윤곽선', '속'],
        ] } },
        { note: '왜 색이 무지개가 아니라 보라→노랑일까', kind: 'tip', t: 'diamonds의 cut은 **순서 있는 범주**(`<ord>`)라서, ggplot이 기본으로 순서가 느껴지는 **viridis** 팔레트(보라→청록→노랑)를 써요. 순서 없는 글자 열(mpg의 class 등)은 무지개 같은 hue 팔레트.' },
      ],
      quiz: [
        { type: 'pick', q: '`ggplot(mpg, aes(x = class, fill = class)) + geom_bar()`의 결과는?', opts: [
          { code: `ggplot(mpg, aes(x = class, fill = class)) +
  geom_bar()`, ok: true, why: '막대 속이 class별 색으로 채워져요.' },
          { code: `ggplot(mpg, aes(x = class, color = class)) +
  geom_bar()`, why: '이건 color — 테두리만 색이 있고 속은 회색이에요.' },
          { code: `ggplot(mpg, aes(x = class)) +
  geom_bar()`, why: '이건 색 매핑이 없는 기본 회색 막대예요.' },
        ] },
        { type: 'mcq', q: '바이올린의 **속**을 class별 색으로 채우려면? (wk3 12행)', opts: [
          { t: '`aes(x = class, y = hwy, fill = class)`', ok: true, why: '면의 속 = fill.' },
          { t: '`aes(x = class, y = hwy, color = class)`', why: '윤곽선만 색이 바뀌어요.' },
          { t: '`aes(x = class, y = hwy, inside = class)`', why: 'inside라는 aes는 없어요.' },
        ] },
        { type: 'mcq', q: 'geom_smooth에서 `fill = "blue"`를 설정하면 무엇이 파래질까요?', opts: [
          { t: '곡선', why: '선은 color.' },
          { t: '곡선 주위의 신뢰 띠(회색 영역)', ok: true, why: '띠는 면이라 fill.' },
          { t: '점', why: 'smooth에는 점이 없어요.' },
        ] },
      ],
    },
    {
      id: 'e-fillcolor',
      title: 'fill = 다른 열: 누적 막대 (fill = color도)',
      src: 'wk2_ggplot_intro.R 154–160행 (fill = cut 다음에 fill = clarity로 쌓기), diamonds의 `color` 열',
      key: '막대에 x와 **다른 열**을 fill로 주면, 막대 하나가 그 열의 값별 조각으로 나뉘어 **쌓인다**(누적 막대). `fill = color`의 color도 aes 이름이 아니라 **열 이름**으로 읽혀서, 그 열이 있으면 그 열로 쌓고 없으면 에러다.',
      setup: 'birds',
      body: [
        '앞 레슨의 `fill = cut`은 x와 **같은 열**이라 막대마다 색이 하나였어요. fill에 **다른 열**을 주면 그림의 뜻이 달라져요.',
        { compare: [
          { label: '`fill = cut` (x와 같은 열): 막대마다 한 색', setup: [], code: `ggplot(diamonds, aes(x = cut, fill = cut)) +
  geom_bar()` },
          { label: '`fill = color` (다른 열): 색 등급별로 쌓임', setup: [], code: `ggplot(diamonds, aes(x = cut, fill = color)) +
  geom_bar()` },
        ] },
        '오른쪽 읽는 법: 막대 **전체 높이**는 그 cut의 다이아몬드 수예요 (왼쪽과 같아요). 막대 안의 **색 조각 하나**는 그 cut 중 해당 색 등급(D–J)의 개수예요. 쌓지 않고 나란히 놓거나 비율로 맞추는 방법은 위치 조정 단원(stack·dodge·fill)에서 다뤄요.',
        '그런데 `fill = color`의 color는 aes 이름이 아니에요. `=`의 **왼쪽**은 aes 이름(fill), **오른쪽**은 데이터 속 **열 이름**이라, R은 color라는 **열**을 찾아요. diamonds에는 색 등급 열 `color`가 있어서 동작했고, mpg에는 없어서 에러가 나요:',
        { code: `ggplot(mpg, aes(x = class, fill = color)) +
  geom_bar()`, expect: 'error', cap: 'mpg에는 color 열이 없음 → 에러' },
        { note: '참고: 에러는 안 나지만 의미 없는 경우', kind: 'tip', t: '`fill = "color"`처럼 **따옴표**를 쓰면 열이 아니라 글자 값 하나라서, 모든 막대가 연어색 한 가지가 되고 의미 없는 범례 한 줄이 생겨요 (aes 안의 `"blue"`와 같은 원리). 열 값이 `"orange"`·`"black"`처럼 색 이름이어도 막대가 그 색이 되지는 않아요. 값은 범주 이름일 뿐이에요.' },
      ],
      quiz: [
        { type: 'pick', q: '`ggplot(diamonds, aes(x = cut, fill = color)) + geom_bar()`의 결과는?', setup: [], opts: [
          { code: `ggplot(diamonds, aes(x = cut, fill = color)) +
  geom_bar()`, ok: true, why: 'diamonds에는 color(D–J) 열이 있어서, cut 막대마다 색 등급별로 쌓여요.' },
          { code: `ggplot(diamonds, aes(x = cut, fill = cut)) +
  geom_bar()`, why: '이건 fill = cut이에요.' },
          { code: `ggplot(diamonds, aes(x = cut, color = cut)) +
  geom_bar()`, why: '이건 color = cut (테두리)이에요.' },
        ] },
        { type: 'mcq', q: 'mpg로 class별 막대를 그리되, 막대마다 **drv별 조각으로 나뉘어 쌓이게** 하려면?', opts: [
          { t: '`aes(x = class, fill = drv)`', ok: true, why: 'x와 다른 열을 fill로 → 누적 막대.' },
          { t: '`aes(x = class, fill = class)`', why: 'x와 같은 열이라 막대마다 한 색일 뿐 쪼개지지 않아요.' },
          { t: '`aes(x = class, color = drv)`', why: '조각으로 나뉘긴 하지만 속은 회색이고 테두리만 색이 들어가요. 색으로 채우려면 fill.' },
        ] },
        { type: 'mcq', q: '`ggplot(mpg, aes(x = class, fill = drv)) + geom_bar()`에서 suv 막대의 **전체 높이**는?', opts: [
          { t: 'suv 차의 총 대수 (fill이 없을 때와 같은 높이)', ok: true, why: '조각들(4·f·r)을 쌓은 합이에요.' },
          { t: 'suv 중 가장 많은 drv의 대수', why: '그건 가장 큰 조각 하나의 크기예요.' },
          { t: '항상 1', why: '그건 position = "fill"(비율로 쌓기)일 때예요.' },
        ] },
        { type: 'predict', q: 'mpg에서 이렇게 쓰면?', setup: [], code: `ggplot(mpg, aes(x = class, fill = colour)) +
  geom_bar()`, expect: 'error', opts: [
          { t: '막대가 기본 색으로 그려진다', why: 'mpg에는 colour라는 열이 없어요.' },
          { t: '"object \'colour\' not found" 에러', ok: true, why: 'aes 오른쪽의 colour는 열 이름으로 찾아져요.' },
          { t: '테두리가 칠해진다', why: 'fill = colour는 "colour라는 열로 속을 채워라"라는 뜻이에요.' },
        ] },
      ],
    },
    {
      id: 'e-fillpoint',
      title: '점에 fill을 쓰면? (기본 점에는 속이 없다)',
      src: 'E단원 fill 개념 + wk4 practice plot의 속 빈 동그라미 점',
      key: '기본 점(●)은 **통째로 color**로 칠해져서 fill을 줘도 보이지 않는다. 속 빈 동그라미(○)는 `shape = 1`이고, 이것도 **color**로 테두리 색을 정한다.',
      body: [
        { compare: [
          { label: '기본 점 + `fill = drv`: 변화 없음', code: `ggplot(mpg, aes(x = displ, y = hwy, fill = drv)) +
  geom_point()` },
          { label: '`shape = 1` + `color = drv`: 속 빈 원', code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point(shape = 1)` },
        ] },
        '왼쪽도 범례는 생기지만 점은 모두 검정이에요. 수업에서 이 지식이 필요한 곳은 **wk4 practice plot**의 속 빈 동그라미 점 하나예요.',
      ],
      quiz: [
        { type: 'mcq', q: '`geom_point(aes(fill = drv))`인데 점이 모두 검정인 이유는?', opts: [
          { t: '기본 점 모양에는 fill 부분이 없어서', ok: true, why: 'color가 점 전체를 칠해요.' },
          { t: 'drv가 글자라서', why: '글자여도 color = drv면 색이 들어가요.' },
          { t: 'fill은 geom_bar 전용이라서', why: 'bar·violin·boxplot·density처럼 면이 있는 geom이 fill을 써요. 기본 점에는 면이 없을 뿐이에요.' },
        ] },
        { type: 'mcq', q: '속 빈 동그라미 점을 찍으려면?', opts: [
          { t: '`geom_point(shape = 1)`', ok: true, why: 'shape 1 = 테두리만 있는 원.' },
          { t: '`geom_point(fill = NA)`', why: '기본 점은 애초에 fill이 없어서 변화가 없어요.' },
          { t: '`geom_point(alpha = 0)`', why: '완전히 투명해져서 안 보여요.' },
        ] },
      ],
    },
  ],
});
