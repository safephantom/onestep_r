/* 단원 G: geom_smooth와 여러 층 */
RS.units.push({
  id: 'g',
  title: 'geom_smooth와 여러 층',
  short: '추세선과 신뢰 띠, se, group vs linetype vs color, 층 순서, size → linewidth, method = "lm"',
  desc: 'wk2_ggplot_intro.R 73–95행과 wk2_ggplot_ExerciseKey.R (R4DS 3.6 연습문제 해답).',
  lessons: [
    {
      id: 'g-smooth',
      title: 'geom_smooth(): 추세 곡선과 회색 띠',
      src: 'wk2_ggplot_intro.R 73–76행',
      key: 'geom_smooth는 점들의 **전체 경향**을 부드러운 곡선으로 그리고, 회색 띠로 그 곡선의 **불확실성(95% 신뢰구간)**을 보여 준다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  geom_smooth(mapping = aes(x = displ, y = hwy))` },
        '실행하면 `geom_smooth() using method = \'loess\' and formula = \'y ~ x\'`라는 **메시지**가 나와요. 에러가 아니라 "곡선을 loess(국소 회귀) 방법으로 그렸다"는 안내예요. 데이터가 1000행 이상이면 gam이라는 다른 방법을 써요.',
        '- 곡선: 각 x 근처 점들의 평균적인 y를 이은 것\n- 회색 띠: 데이터가 적은 곳(오른쪽 끝)일수록 넓어져요 — "여기는 덜 확실하다"',
      ],
      quiz: [
        { type: 'mcq', q: 'geom_smooth의 회색 띠는 무엇일까요?', opts: [
          { t: '추세선의 신뢰구간 (불확실성)', ok: true, why: '기본 95%. 점이 적은 곳에서 넓어져요.' },
          { t: '데이터의 최솟값~최댓값 범위', why: '점들이 띠 밖에도 많이 있죠.' },
          { t: '그림자 효과', why: '통계적 의미가 있어요.' },
        ] },
        { type: 'mcq', q: '"`geom_smooth()` using method = \'loess\'…"가 뜨면?', opts: [
          { t: '무시해도 되는 안내 메시지', ok: true, why: '어떤 방법을 썼는지 알려 줄 뿐.' },
          { t: '에러라서 고쳐야 한다', why: '그림은 정상적으로 그려졌어요.' },
          { t: '경고: 데이터가 이상하다', why: 'Warning이 아니라 message예요.' },
        ] },
      ],
    },
    {
      id: 'g-se',
      title: 'se = FALSE: 띠 없애기',
      src: 'wk2 117행 `geom_smooth(..., se = FALSE)`, ExerciseKey 8행',
      key: '`se = FALSE` → 신뢰구간 띠를 그리지 않는다. (se = standard error)',
      body: [
        { compare: [
          { label: '기본 (se = TRUE)', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth()` },
          { label: '`se = FALSE`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(se = FALSE)` },
        ] },
        '`se`는 **geom_smooth의 인자**예요. geom_point에 주면 "Ignoring unknown parameters: `se`" 경고가 나요.',
      ],
      quiz: [
        { type: 'fill', q: '띠 없는 추세선을 만드세요.', code: 'geom_smooth(▢ = FALSE)', ans: [['se']], why: 'standard error를 그리지 말라는 뜻.', full: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(se = FALSE)` },
        { type: 'predict', q: '실수로 se를 geom_point에 넣으면?', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(se = FALSE) +
  geom_smooth()`, opts: [
          { t: '에러로 멈춘다', why: '경고만 나고 그려져요.' },
          { t: '"Ignoring unknown parameters: `se`" 경고, 띠는 그대로 있음', ok: true, why: 'geom_point는 se를 몰라서 무시하고, smooth는 기본(띠 있음)으로 그려요.' },
          { t: '띠가 사라진다', why: 'se는 smooth에 줘야 해요.' },
        ] },
      ],
    },
    {
      id: 'g-group',
      title: 'group = drv: 선을 나누되 구분 표시는 없음',
      src: 'wk2_ggplot_intro.R 80–83행 "dividing the smooth lines by group"',
      key: '`group = drv`는 drv 값마다 **따로 계산한 선**을 그리지만, 색·모양은 모두 같고 **범례가 없다**.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  geom_smooth(mapping = aes(x = displ, y = hwy, group = drv))` },
        '파란 선 세 개가 있지만 어느 게 4/f/r인지 알 수 없어요. group은 "묶음 단위"만 정하는 **보이지 않는 aes**예요. 그래서 보통은 color나 linetype처럼 눈에 보이는 aes를 쓰면 group은 **자동으로** 따라 나뉘어요 (다음 레슨).',
      ],
      quiz: [
        { type: 'mcq', q: '`group = drv` 그림에 범례가 없는 이유는?', opts: [
          { t: 'group은 시각적 속성이 없어서 대응표가 필요 없음', ok: true, why: '선을 나누기만 하고 모양·색은 같아요.' },
          { t: 'drv가 3개뿐이라서', why: '개수와 관계없어요.' },
          { t: 'se가 켜져 있어서', why: 'se와 범례는 무관해요.' },
        ] },
        { type: 'write', q: 'ExerciseKey 10–12행: 점(크기 4)과, **drv별로 나뉜** 띠 없는 추세선을 그리세요. 선 색은 모두 같게(파랑 기본) 두세요.', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(aes(group = drv), se = FALSE)`, checks: [
          { r: 'has_geom("point") && has_param("point", "size", 4)', m: '점 크기 4 (`geom_point(size = 4)`)' },
          { r: 'has_geom("smooth")', m: 'geom_smooth() 층' },
          { r: 'maps("group", "drv", "smooth")', m: 'smooth가 drv로 나뉘어야 해요 (`group = drv`).' },
          { r: '!mapped("colour", "smooth") && !mapped("linetype", "smooth")', m: '선은 모두 같은 모양이어야 해요 (color·linetype 매핑 없이).' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(aes(group = drv), se = FALSE)` },
      ],
    },
    {
      id: 'g-linetype',
      title: 'linetype = drv: 선 모양으로 구분 + 범례',
      src: 'wk2_ggplot_intro.R 86–89행',
      key: '`linetype = drv` → drv마다 **실선·파선·점선**이 되고 범례가 생긴다. 선이 나뉘는 건 자동(group 불필요).',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  geom_smooth(mapping = aes(x = displ, y = hwy, linetype = drv))` },
        { table: { head: ['aes', '선이 나뉨?', '구분이 보임?', '범례?'], rows: [
          ['`group = drv`', 'O', 'X', 'X'],
          ['`linetype = drv`', 'O', 'O (선 모양)', 'O'],
          ['`color = drv`', 'O', 'O (색)', 'O'],
        ] } },
        '흑백 논문 그림(Chung et al. 2012 Fig. 4의 실선/파선/점선)이 바로 linetype 매핑이에요.',
      ],
      quiz: [
        { type: 'pick', q: '`geom_smooth(aes(x = displ, y = hwy, linetype = drv))`의 결과는?', opts: [
          { code: `ggplot(data = mpg) +
  geom_smooth(mapping = aes(x = displ, y = hwy, linetype = drv))`, ok: true, why: '선 모양 세 가지 + 범례.' },
          { code: `ggplot(data = mpg) +
  geom_smooth(mapping = aes(x = displ, y = hwy, group = drv))`, why: '이건 group — 같은 모양 세 선, 범례 없음.' },
          { code: `ggplot(data = mpg) +
  geom_smooth(mapping = aes(x = displ, y = hwy))`, why: '이건 나누지 않은 선 하나.' },
        ] },
        { type: 'mcq', q: 'linetype = drv일 때 `group = drv`를 따로 써야 할까요?', opts: [
          { t: '아니다. 범주형 aes를 매핑하면 그 값으로 자동으로 묶인다', ok: true, why: 'color, linetype, fill 등 모두 그래요.' },
          { t: '그렇다. 안 쓰면 선이 하나만 그려진다', why: '자동으로 3개가 돼요.' },
        ] },
      ],
    },
    {
      id: 'g-colorlt',
      title: 'color + linetype 둘 다: 범례가 하나로',
      src: 'wk2_ggplot_intro.R 92–94행',
      key: '같은 변수(drv)를 color와 linetype 둘 다에 매핑하면 ggplot이 **범례 하나**에 색과 선 모양을 함께 보여 준다.',
      body: [
        { code: `ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy, color = drv)) +
  geom_smooth(mapping = aes(x = displ, y = hwy, color = drv, linetype = drv))` },
        '점도 drv 색이라 **같은 색의 점과 선**이 짝을 이루어요. 범례 제목이 같고(drv) 값이 같으니 합쳐졌어요. 만약 color = drv, linetype = class처럼 다른 변수라면 범례가 두 개 생겨요.',
      ],
      quiz: [
        { type: 'mcq', q: '범례가 하나로 합쳐진 이유는?', opts: [
          { t: '두 aes가 **같은 변수**(drv)에 매핑되어 제목과 값이 같아서', ok: true, why: 'ggplot이 자동으로 합쳐요.' },
          { t: 'geom_smooth는 범례를 하나만 만들 수 있어서', why: '다른 변수면 두 개 생겨요.' },
        ] },
        { type: 'write', q: 'ExerciseKey 22–24행 형태: 점과 **띠 없는** 추세선 모두 drv별 색이 되게 그리세요 (점 크기 3).', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(colour = drv), se = FALSE)`, checks: [
          { r: 'maps("colour", "drv", "point")', m: '점 색 = drv' },
          { r: 'maps("colour", "drv", "smooth")', m: '선 색 = drv' },
          { r: 'has_param("point", "size", 3)', m: '점 크기 3' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy, colour = drv)) +
  geom_point(size = 3) +
  geom_smooth(se = FALSE)`, solNote: 'color를 전역(ggplot 안의 aes)에 두면 두 층이 모두 물려받아요 (H단원). ExerciseKey처럼 각 층에 따로 써도 정답이에요.' },
      ],
    },
    {
      id: 'g-order',
      title: '층 순서 = 그리는 순서 (흰 테두리 트릭)',
      src: 'wk2_ggplot_ExerciseKey.R 35–37행',
      key: '먼저 적은 층이 **아래**, 나중 층이 **위**에 그려진다. 큰 흰 점 위에 작은 색 점을 얹으면 흰 테두리가 생긴다.',
      body: [
        { code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(colour = "white", size = 10) +
  geom_point(aes(colour = drv), size = 5)` },
        '1층: 모든 점 자리에 **흰색 큰 점**(size 10). 2층: 그 위에 drv 색의 **작은 점**(size 5). 결과: 흰 테두리가 둘러진 점. 순서를 바꾸면 흰 점이 색 점을 **덮어 버려요**:',
        { code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 5) +
  geom_point(colour = "white", size = 10)`, cap: '순서를 바꾼 경우' },
        'wk3 Practice 1(바이올린 **위에** 박스플롯)도 같은 원리예요: `geom_violin()`을 먼저, `geom_boxplot()`을 나중에.',
      ],
      quiz: [
        { type: 'mcq', q: '바이올린 안에 작은 박스플롯이 **보이게** 하려면 층 순서는?', opts: [
          { t: 'geom_violin() + geom_boxplot()', ok: true, why: '바이올린이 아래, 박스가 위.' },
          { t: 'geom_boxplot() + geom_violin()', why: '바이올린(불투명)이 박스를 덮어요.' },
          { t: '순서는 상관없다', why: 'ggplot은 적은 순서대로 그려요.' },
        ] },
        { type: 'write', q: 'ExerciseKey의 마지막 그림: **흰 테두리**가 있는 drv 색 점을 만드세요 (흰 점 size 10, 색 점 size 5).', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(colour = "white", size = 10) +
  geom_point(aes(colour = drv), size = 5)`, checks: [
          { r: 'has_geom("point", 2)', m: 'geom_point 층이 두 개 필요해요.' },
          { r: 'has_param(1, "colour", "white") && has_param(1, "size", 10)', m: '**첫 번째** 층: 흰색(`colour = "white"`), size 10' },
          { r: 'maps("colour", "drv", 2) && has_param(2, "size", 5)', m: '**두 번째** 층: aes(colour = drv), size 5' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(colour = "white", size = 10) +
  geom_point(aes(colour = drv), size = 5)` },
      ],
    },
    {
      id: 'g-linewidth',
      title: '선 굵기: size → linewidth',
      src: 'wk2_ggplot_ExerciseKey.R 24, 28, 32행 `geom_smooth(..., size = 3, ...)`',
      key: 'ggplot2 3.4.0(2022)부터 **선의 굵기는 `linewidth`**. 선에 `size`를 쓰면 그려지긴 하지만 "deprecated" 경고가 난다. 점의 크기는 여전히 `size`.',
      body: [
        { code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 4) +
  geom_smooth(size = 3, se = FALSE)`, cap: 'ExerciseKey 26–28행 그대로' },
        'ExerciseKey는 예전 버전 기준으로 쓰여서 이 경고가 나요 (lifecycle 경고는 세션당 한 번만 떠요). 요즘 방식:',
        { code: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 4) +
  geom_smooth(linewidth = 3, se = FALSE)` },
        'wk3 `plot_practice.R`의 `geom_smooth(..., linewidth = 1.2)`가 새 방식이에요.',
      ],
      quiz: [
        { type: 'mcq', q: 'geom_smooth의 선을 굵게(3) 만드는 현재 권장 방식은?', opts: [
          { t: '`geom_smooth(linewidth = 3)`', ok: true, why: '3.4.0 이후 선 굵기 인자.' },
          { t: '`geom_smooth(size = 3)`', why: '동작은 하지만 deprecated 경고.' },
          { t: '`geom_smooth(width = 3)`', why: 'width는 막대·박스의 폭 인자예요.' },
        ] },
        { type: 'mcq', q: '`geom_point(size = 3)`에도 경고가 날까요?', opts: [
          { t: '아니다. 점의 크기는 여전히 size', ok: true, why: '바뀐 건 **선**의 굵기뿐이에요.' },
          { t: '그렇다. 이제 모두 linewidth', why: '점은 size가 맞아요.' },
        ] },
      ],
    },
    {
      id: 'g-lm',
      title: 'method = "lm": 곡선 대신 직선',
      src: 'wk3/plot_practice.R 33–34행 `geom_smooth(..., method = "lm", ...)`',
      key: '`method = "lm"`(linear model) → 가장 잘 맞는 **직선**(회귀선)을 그린다. 메시지도 사라진다.',
      body: [
        { compare: [
          { label: '기본 (loess 곡선)', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth()` },
          { label: '`method = "lm"` (직선)', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(method = "lm")` },
        ] },
        'Kim & Clayards (2019) Fig. 6B, 6C, 6E의 빨간 선이 lm 직선이에요. 이 수업 후반(wk9~)에 배울 선형 회귀(lm)가 바로 이 선이에요. (method를 직접 정해도 `formula = \'y ~ x\'` 안내 메시지는 남을 수 있어요.)',
      ],
      quiz: [
        { type: 'pick', q: '`geom_smooth(method = "lm", se = FALSE, color = "firebrick")`의 결과는?', opts: [
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE, color = "firebrick")`, ok: true, why: '띠 없는 빨간 직선.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(se = FALSE, color = "firebrick")`, why: '이건 loess 곡선.' },
          { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth(method = "lm", color = "firebrick")`, why: '이건 se가 켜져 있어 띠가 있어요.' },
        ] },
      ],
    },
  ],
});
