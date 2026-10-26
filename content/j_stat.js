/* 단원 J: 그래프가 계산하는 것 (stat) */
RS.units.push({
  id: 'j',
  title: '그래프가 대신 계산하는 것 (stat)',
  short: 'geom_bar의 count, 박스플롯 읽기, 바이올린, 밀도와 adjust',
  desc: 'wk2 144–148행 "y = count", wk3 57–59행 "default: y = count", 그리고 박스·바이올린·밀도가 **무엇을 계산해서** 그리는지.',
  lessons: [
    {
      id: 'j-count',
      title: 'geom_bar는 y를 스스로 센다',
      src: 'wk2_ggplot_intro.R 146–148행 `# y = count`',
      key: 'geom_bar에는 **x만** 준다. ggplot이 x의 값마다 **행 개수를 세어(count)** 막대 높이로 쓴다. 그래서 y축 제목이 count.',
      body: [
        { code: `ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut))` },
        '데이터에 "count"라는 열은 없어요. ggplot이 그리기 전에 `stat_count`라는 계산을 거쳐 cut별 개수 표를 만들고, 그 표로 막대를 그려요. 이게 **stat(통계 변환)**이에요.',
        { table: { head: ['geom', '기본 stat', '계산'], rows: [
          ['geom_point', 'identity', '없음 (값 그대로)'],
          ['geom_bar', 'count', 'x값별 행 개수'],
          ['geom_smooth', 'smooth', '추세선 + 신뢰구간'],
          ['geom_boxplot', 'boxplot', '중앙값·사분위수·수염·이상치'],
          ['geom_violin', 'ydensity', '그룹별 밀도'],
          ['geom_density', 'density', '밀도'],
        ] } },
        '이미 계산해 둔 값(평균 등)을 그대로 막대 높이로 쓰는 `geom_col()`은, 요약표 만드는 법(R단원)을 배운 뒤 [[u-errorbar|U단원]]에서 다뤄요.',
      ],
      quiz: [
        { type: 'mcq', q: 'geom_bar의 y축 제목이 "count"인 이유는?', opts: [
          { t: 'ggplot이 x값마다 행 개수를 세어 y로 썼기 때문', ok: true, why: 'stat_count가 만든 열 이름이 count예요.' },
          { t: 'diamonds에 count 열이 있어서', why: '없어요. glimpse(diamonds)로 확인해 보세요.' },
          { t: 'y를 안 줘서 에러 대신 넣은 기본 글자', why: '실제로 계산된 값이에요.' },
        ] },
        { type: 'predict', q: 'geom_bar에 y까지 주면?', code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_bar()`, expect: 'error', opts: [
          { t: 'class별 hwy 합계 막대', why: 'geom_bar는 y를 스스로 세려고 해요.' },
          { t: '"`stat_count()` must only have an x or y aesthetic" 에러', ok: true, why: 'x와 y 둘 다 주면 무엇을 셀지 모호해요.' },
        ] },
      ],
    },
    {
      id: 'j-boxplot',
      title: '박스플롯 읽기: 중앙값, 상자, 수염, 점',
      src: 'wk2 178–181행, wk3 91–97행 (r-graph-gallery 링크)',
      key: '상자 = 가운데 50%(Q1~Q3), 굵은 선 = **중앙값**, 수염 = 상자에서 **1.5×IQR** 안의 가장 먼 값, 수염 밖의 점 = **이상치(outlier)**.',
      body: [
        { code: `ggplot(mpg, aes(x = class, y = hwy)) +
  geom_boxplot()` },
        { table: { head: ['부분', '뜻'], rows: [
          ['상자 아래 변', '1사분위 Q1 (25%)'],
          ['굵은 가로선', '중앙값 (50%)'],
          ['상자 위 변', '3사분위 Q3 (75%)'],
          ['상자 높이', 'IQR = Q3 − Q1'],
          ['수염', '상자에서 1.5 × IQR 이내의 가장 먼 데이터까지'],
          ['점', '수염 밖의 값 (이상치)'],
        ] } },
        'C단원 summary()의 다섯 숫자와 같은 정보예요. 평균은 박스플롯에 **없어요** — 평균을 찍으려면 stat_summary(S단원)가 필요해요.',
        { note: 'Politzer-Ahles & Piccinini (2018)의 교훈', kind: 'src', t: 'Fig. 1: 평균·표준편차가 같은 두 데이터가 막대그래프로는 똑같아 보이지만, 박스플롯에선 조금 달라 보이고, 개별 점(strip plot)으로는 분포 모양이 완전히 다르다는 게 드러나요. 그래서 수업 Practice들이 "boxplots **with individual datapoints on top**"을 요구해요.' },
      ],
      quiz: [
        { type: 'mcq', q: '박스플롯 상자 안의 굵은 가로선은?', opts: [
          { t: '중앙값', ok: true, why: '평균이 아니에요!' },
          { t: '평균', why: '박스플롯에는 평균이 표시되지 않아요.' },
          { t: '최빈값', why: '아니에요.' },
        ] },
        { type: 'mcq', q: '수염 끝 바깥에 따로 찍힌 점들은?', opts: [
          { t: '상자에서 1.5×IQR보다 멀리 떨어진 이상치', ok: true, why: '데이터 속 개별 행이에요.' },
          { t: 'jitter된 데이터 전체', why: '박스플롯은 이상치만 점으로 찍어요.' },
          { t: '평균값', why: '평균은 표시되지 않아요.' },
        ] },
        { type: 'mcq', q: 'summary(birds$inches)의 "1st Qu. 8.375, 3rd Qu. 23.5"로 박스플롯을 그리면 상자의 높이(IQR)는?', opts: [
          { t: '15.125', ok: true, why: '23.5 − 8.375.' },
          { t: '11.75', why: '그건 중앙값.' },
          { t: '19', why: 'Max − Min이에요.' },
        ] },
      ],
    },
    {
      id: 'j-violin',
      title: '바이올린: 분포의 모양',
      src: 'wk3_ggplot_practice.R 9–13행',
      key: '바이올린은 그룹마다 **밀도 곡선을 세워서 좌우 대칭으로** 그린 것. 폭이 넓은 곳 = 데이터가 몰린 곳.',
      body: [
        { code: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin()` },
        '박스플롯이 "다섯 숫자"만 보여 준다면 바이올린은 **봉우리가 몇 개인지, 어디에 몰렸는지**까지 보여 줘요. 예: subcompact는 봉우리가 두 개(위아래)로 나뉘어 보여요. 대신 중앙값 같은 요약값은 안 보여서, **바이올린 + 작은 박스플롯**(wk3 Practice 1)을 함께 쓰는 경우가 많아요.',
      ],
      quiz: [
        { type: 'mcq', q: '바이올린의 폭이 가장 넓은 높이는?', opts: [
          { t: '그 그룹에서 값이 가장 많이 몰린 곳', ok: true, why: '밀도가 높을수록 넓어요.' },
          { t: '평균', why: '평균과는 다를 수 있어요.' },
          { t: '최댓값', why: '끝으로 갈수록 보통 좁아져요.' },
        ] },
        { type: 'mcq', q: '바이올린만으로는 알기 **어려운** 것은?', opts: [
          { t: '정확한 중앙값 위치', ok: true, why: '그래서 박스플롯을 안에 겹쳐 그려요.' },
          { t: '봉우리가 두 개인지', why: '모양으로 바로 보여요.' },
          { t: '값이 어디에 몰렸는지', why: '폭으로 보여요.' },
        ] },
      ],
    },
    {
      id: 'j-density',
      title: 'geom_density와 adjust (얼마나 매끄럽게)',
      src: 'wk3_ggplot_practice.R 33–35행 `geom_density(adjust = 3)`',
      key: 'geom_density는 연속 변수 하나(x)의 **분포 곡선**을 그린다. y축은 density(곡선 아래 넓이가 1). `adjust`가 크면 더 매끄럽게(뭉툭), 작으면 더 울퉁불퉁하게.',
      body: [
        { code: `ggplot(diamonds, aes(x = price)) +
  geom_density(adjust = 3)` },
        { compare: [
          { label: '`adjust = 0.3` (울퉁불퉁)', code: `ggplot(diamonds, aes(x = price)) +
  geom_density(adjust = 0.3)` },
          { label: '`adjust = 1` (기본)', code: `ggplot(diamonds, aes(x = price)) +
  geom_density()` },
        ] },
        'adjust는 "대역폭(bandwidth)에 곱할 배수"예요. 너무 작으면 잡음까지 봉우리로 보이고, 너무 크면 진짜 봉우리가 뭉개져요. Chung et al. (2012) Fig. 4가 언어·모음·연령별 밀도 곡선이에요.',
      ],
      quiz: [
        { type: 'pick', q: '`geom_density(adjust = 3)`의 결과는?', opts: [
          { code: `ggplot(diamonds, aes(x = price)) +
  geom_density(adjust = 3)`, ok: true, why: '가장 매끄러워요.' },
          { code: `ggplot(diamonds, aes(x = price)) +
  geom_density(adjust = 0.3)`, why: '이건 0.3 — 울퉁불퉁.' },
          { code: `ggplot(diamonds, aes(x = price)) +
  geom_density()`, why: '이건 기본(1).' },
        ] },
        { type: 'mcq', q: 'geom_density에 필요한 aes는?', opts: [
          { t: 'x 하나 (연속 변수)', ok: true, why: 'y(density)는 계산돼요.' },
          { t: 'x와 y', why: 'y는 ggplot이 계산해요.' },
          { t: 'fill만', why: 'x가 꼭 필요해요.' },
        ] },
      ],
    },
    {
      id: 'j-densitygroup',
      title: '그룹별 밀도와 facet',
      src: 'wk3_ggplot_practice.R 37–39행',
      key: '`group = cut, fill = cut`으로 cut마다 곡선 하나씩. `facet_wrap(~cut)`을 더하면 패널로 나뉜다.',
      body: [
        { code: `ggplot(diamonds, aes(x=price, group=cut, fill=cut)) +
  geom_density() +
  facet_wrap(~cut)` },
        'fill = cut만 줘도 그룹은 자동으로 나뉘어서 `group = cut`은 사실 없어도 돼요 (G단원 linetype 레슨과 같은 원리). 수업 코드는 명시적으로 적어 둔 거예요. facet으로 나눈 뒤에는 **같은 x축**으로 각 cut의 가격 분포를 비교할 수 있어요.',
      ],
      quiz: [
        { type: 'tf', q: '`aes(x = price, fill = cut)`만 써도 cut마다 곡선이 따로 그려진다.', ans: true, why: '범주형 fill이 그룹을 자동으로 나눠요.' },
        { type: 'write', q: 'mpg의 **hwy** 분포를 drv별로 반투명하게 겹친 밀도 곡선으로 그리세요 (alpha 0.3).', target: `ggplot(mpg, aes(x = hwy, fill = drv)) +
  geom_density(alpha = 0.3)`, checks: [
          { r: 'has_geom("density")', m: 'geom_density() 층' },
          { r: 'maps("x", "hwy", "density")', m: 'x = hwy' },
          { r: 'maps("fill", "drv", "density")', m: 'fill = drv' },
          { r: 'has_param("density", "alpha", 0.3)', m: '`alpha = 0.3`' },
        ], sol: `ggplot(mpg, aes(x = hwy, fill = drv)) +
  geom_density(alpha = 0.3)` },
      ],
    },
  ],
});
