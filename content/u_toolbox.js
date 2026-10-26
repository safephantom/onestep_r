/* 단원 U: Practice 2(논문 그림)용 도구 상자 — 그림에 꼭 필요한 것만 */
RS.units.push({
  id: 'u',
  title: 'Practice 2 도구 상자 (논문 그림용)',
  short: '색 직접 정하기, viridis, 축 뒤집기, 타원, 오차 막대, dodge 맞추기, facet 축 따로, group = 1',
  desc: 'wk3 Practice 2(논문 그림 따라 그리기)에서 **수업 범위 밖이지만 꼭 필요한 것만** 모았어요. 각 레슨 위에 어느 그림에 쓰이는지 적었어요. 인자 하나하나를 다 다루지 않고, 그 그림에 필요한 모양 하나만 익혀요.',
  lessons: [
    {
      id: 'u-manual',
      title: '색을 직접 정하기: scale_fill_manual / scale_color_manual',
      src: 'wk3/practice.R 11행 · Kpogo & Chang Fig. 5(노랑/보라), Davidson Fig. 1–4(회색조), wk4 practice plot(회색/검정)',
      key: '`scale_fill_manual(values = c(색1, 색2, …))` — 범주 순서대로 색을 준다. 매핑이 **fill**이면 scale_**fill**_manual, **color**면 scale_**color**_manual.',
      body: [
        { code: `ggplot(mpg, aes(x = drv, y = hwy, fill = drv)) +
  geom_boxplot() +
  scale_fill_manual(values = c("grey20", "grey60", "grey90"))` },
        '색은 범주의 **순서**(글자면 알파벳 순: 4, f, r)대로 배정돼요. 색 개수가 범주보다 적으면 "Insufficient values in manual scale" 에러. 이름을 붙여 주면 순서와 무관하게 맞출 수 있어요: `values = c(f = "grey20", r = "grey60", "4" = "grey90")`.',
        { note: '연속 변수에는 못 쓴다', kind: 'warn', t: 'wk3/practice.R처럼 `fill = Duration`(숫자)에 scale_fill_manual을 쓰면 "Continuous value supplied to a discrete scale" 에러가 나요. `fill = factor(Duration)`로 바꿔야 해요 ([[c-discrete|C단원]]).' },
      ],
      quiz: [
        { type: 'mcq', q: '`aes(color = place)`로 매핑한 점의 색을 회색·검정으로 정하려면?', opts: [
          { t: '`scale_color_manual(values = c("grey60", "black"))`', ok: true, why: 'color 매핑 → color scale.' },
          { t: '`scale_fill_manual(values = c("grey60", "black"))`', why: 'fill scale은 fill 매핑에만 적용돼요 — 점 색은 안 바뀌어요.' },
          { t: '`geom_point(color = c("grey60", "black"))`', why: '설정(aes 밖)은 모든 점에 같은 값을 주는 용도예요.' },
        ] },
      ],
    },
    {
      id: 'u-viridis',
      title: 'viridis 팔레트: scale_fill_viridis_d / _c',
      src: 'wk3/plot_practice.R 38행 `scale_fill_viridis_d()` · Adem Fig. 13 (plasma 색 막대)',
      key: '`_d` = discrete(범주), `_c` = continuous(연속). `option = "plasma"` 등으로 색 계열을 고른다.',
      body: [
        { compare: [
          { label: '범주: `scale_fill_viridis_d()`', code: `ggplot(mpg, aes(x = drv, y = hwy, fill = drv)) +
  geom_violin() +
  scale_fill_viridis_d()` },
          { label: '연속: `scale_color_viridis_c(option = "plasma")`', code: `ggplot(mpg, aes(x = displ, y = hwy, color = cty)) +
  geom_point() +
  scale_color_viridis_c(option = "plasma")` },
        ] },
        '범주/연속을 틀리게 고르면 "Discrete/Continuous value supplied to …" 에러가 나요. diamonds의 cut이 기본으로 viridis였던 것(E단원)도 이 팔레트예요.',
      ],
      quiz: [
        { type: 'mcq', q: 'Adem Fig. 13처럼 연속 변수 Accuracy를 plasma 색으로 점에 칠하려면?', opts: [
          { t: '`scale_color_viridis_c(option = "plasma")`', ok: true, why: '연속(_c) + color.' },
          { t: '`scale_color_viridis_d(option = "plasma")`', why: '_d는 범주용 → 연속 변수에는 에러.' },
          { t: '`scale_fill_viridis_c(option = "plasma")`', why: '점의 색은 fill이 아니라 color.' },
        ] },
      ],
    },
    {
      id: 'u-reverse',
      title: '축 뒤집기: scale_x_reverse / scale_y_reverse',
      src: 'Strandberg et al. (2021) Fig. 2 — 모음 도표 (F2는 오른쪽→왼쪽으로 커지고, F1은 위→아래로 커짐)',
      key: '모음 공간 그림은 조음 위치와 맞추려고 **F2를 x축에 거꾸로**, **F1을 y축에 거꾸로** 놓는다.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  scale_x_reverse() +
  scale_y_reverse()` },
        '데이터는 그대로이고 축 방향만 뒤집혀요 (왼쪽이 큰 값, 위쪽이 작은 값). 그래서 모음 도표에서 앞모음(F2 큼)이 왼쪽, 고모음(F1 작음)이 위에 와요.',
      ],
      quiz: [
        { type: 'mcq', q: '`scale_y_reverse()`를 쓰면 y축 맨 위에 오는 값은?', opts: [
          { t: '가장 작은 값', ok: true, why: '위아래가 뒤집혀요 (F1 300이 위, 550이 아래).' },
          { t: '가장 큰 값', why: '그건 기본 방향이에요.' },
          { t: '0', why: '범위는 데이터에 맞춰져요.' },
        ] },
      ],
    },
    {
      id: 'u-ellipse',
      title: '신뢰 타원: stat_ellipse()',
      src: 'Strandberg et al. (2021) Fig. 2 "95% confidence ellipses"',
      key: '`stat_ellipse()`는 그룹마다 점들을 둘러싼 **95% 타원**을 그린다 (기본 level = 0.95). 그룹은 color 매핑을 따라간다.',
      body: [
        { code: `ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point() +
  stat_ellipse()` },
      ],
      quiz: [
        { type: 'mcq', q: '위 그림에서 타원이 세 개 그려진 이유는?', opts: [
          { t: 'color = drv가 전역 매핑이라 stat_ellipse도 drv별로 나뉘어서', ok: true, why: 'G단원의 "범주형 aes가 그룹을 나눈다"와 같은 원리.' },
          { t: 'stat_ellipse는 항상 세 개를 그려서', why: '그룹 수만큼 그려요.' },
        ] },
      ],
    },
    {
      id: 'u-errorbar',
      title: '요약표로 막대 + 오차 막대: geom_col + geom_errorbar',
      src: 'Davidson (2016) Fig. 4 "Error bars show standard error" · Politzer-Ahles & Piccinini (2018) Fig. 1–2',
      key: '평균과 오차가 **이미 계산된 표**라면, y 값을 **그대로** 막대 높이로 쓰는 `geom_col(aes(y = 평균))`에 `geom_errorbar(aes(ymin = 평균 - 오차, ymax = 평균 + 오차))`를 더한다.',
      setup: 'birds',
      body: [
        '평균 ± 표준오차(SE) 막대는 먼저 요약표를 만들고 그려요 (R단원 summarise). `sd()`는 표준편차 함수예요.',
        '막대는 `geom_bar()`가 아니라 `geom_col()`로 그려요. geom_bar는 x의 값마다 **행 개수를 세서** 막대 높이로 쓰고(J단원), geom_col은 **y 값을 그대로** 막대 높이로 써요. `geom_col()`은 `geom_bar(stat = "identity")`와 같아요. 수업 코드에서는 wk5에서 이 둘을 나란히 보여 줘요 ([[w-col|W단원]]).',
        { code: `bird_sum <- birds %>%
  group_by(bird) %>%
  summarise(m = mean(inches),
            se = sd(inches) / sqrt(n()))

ggplot(bird_sum, aes(x = bird, y = m)) +
  geom_col(fill = "grey70") +
  geom_errorbar(aes(ymin = m - se, ymax = m + se), width = 0.2)` },
        'geom_errorbar의 `width`는 막대 끝 가로선의 폭이에요. ymin/ymax는 **데이터에 따라 달라지니 aes() 안**에 써요 (E단원 매핑).',
        { note: '요약표에 geom_bar를 쓰면', kind: 'warn', t: 'bird_sum에 y 없이 `geom_bar(aes(x = bird))`를 쓰면, 새마다 **행이 하나**뿐이라 막대 높이가 모두 1이 돼요 (행 개수를 셌으니까요). 막대가 나타내는 것이 **개수**인지 **값**인지 늘 확인하세요. 또 geom_col은 평균을 내 주지 않아요. 같은 x에 행이 여러 개 있으면 막대가 쌓여서 **합**이 되니, 평균 막대는 꼭 요약표를 먼저 만드세요.' },
      ],
      quiz: [
        { type: 'fill', q: '평균 ± SD 오차 막대를 완성하세요 (요약표 열: m, sd).', code: 'geom_errorbar(aes(ymin = ▢, ymax = ▢), width = 0.2)', ans: [['m - sd', 'm-sd'], ['m + sd', 'm+sd']], why: '아래 끝 = 평균 − SD, 위 끝 = 평균 + SD.' },
        { type: 'mcq', q: '`geom_col(aes(x = bird, y = m))`와 같은 것은?', opts: [
          { t: '`geom_bar(aes(x = bird, y = m), stat = "identity")`', ok: true, why: 'geom_col은 stat이 identity(값 그대로)인 막대예요.' },
          { t: '`geom_bar(aes(x = bird, y = m))`', why: 'geom_bar는 기본으로 개수를 세려 해서, y까지 주면 에러가 나요.' },
          { t: '`geom_bar(aes(x = bird))`', why: '이건 개수 막대예요. 요약표에서는 새마다 높이가 1이 돼요.' },
        ] },
        { type: 'mcq', q: '`geom_col()`의 막대 높이는?', opts: [
          { t: '데이터의 y 값 그대로', ok: true, why: 'identity = 변환하지 않음.' },
          { t: 'y 값의 개수', why: '세지 않아요.' },
          { t: 'y 값의 평균', why: '평균을 내 주지 않아요. 같은 x에 행이 여러 개면 쌓여서 합이 되니, 미리 요약해야 해요.' },
        ] },
      ],
    },
    {
      id: 'u-meanse',
      title: '원자료에서 바로 평균 ± SE: stat_summary(fun.data = mean_se)',
      src: 'Lee-Kim & Chou (2002) Fig. 6 "error bars represent one standard error"',
      key: '요약표 없이 원자료에서 `stat_summary(fun.data = mean_se, geom = "errorbar")` → 그룹마다 평균 ± 1 SE 막대.',
      body: [
        { code: `ggplot(mpg, aes(x = drv, y = hwy)) +
  geom_jitter(width = 0.1, height = 0, alpha = 0.3) +
  stat_summary(fun = mean, geom = "point", size = 3) +
  stat_summary(fun.data = mean_se, geom = "errorbar", width = 0.2)` },
        '[[s-mean|S단원]]의 평균 점과 짝이에요: `fun =`은 값 하나(평균), `fun.data =`는 **y, ymin, ymax 세 값**(평균과 위아래 끝)을 계산하는 함수를 받아요.',
      ],
      quiz: [
        { type: 'mcq', q: '`fun.data = mean_se`가 계산하는 것은?', opts: [
          { t: '평균, 평균 − SE, 평균 + SE', ok: true, why: '오차 막대의 가운데와 두 끝.' },
          { t: '중앙값과 사분위수', why: '그건 boxplot의 stat.' },
          { t: '95% 신뢰구간', why: 'mean_se는 ±1 SE예요.' },
        ] },
      ],
    },
    {
      id: 'u-dodge',
      title: '나란히 선 막대·바이올린에 다른 층 맞추기: position_dodge(0.9)',
      src: 'Kpogo & Chang (2025) Fig. 5 (바이올린 옆 평균 동그라미) · Davidson Fig. 4 (막대 위 오차 막대)',
      key: 'fill로 나란히(dodge) 선 막대·바이올린 위에 점이나 오차 막대를 얹으려면, 그 층에도 `position = position_dodge(width = 0.9)`를 줘서 **같은 폭으로** 비켜 세운다.',
      body: [
        { compare: [
          { label: 'dodge 없음: 평균이 가운데로 몰림', code: `ggplot(mpg, aes(x = drv, y = hwy, fill = factor(year))) +
  geom_violin() +
  stat_summary(fun = mean, geom = "point", shape = 1)` },
          { label: '`position_dodge(0.9)`: 각 바이올린 위에', code: `ggplot(mpg, aes(x = drv, y = hwy, fill = factor(year))) +
  geom_violin() +
  stat_summary(fun = mean, geom = "point", shape = 1,
               position = position_dodge(width = 0.9))` },
        ] },
        'I단원의 `position = "dodge"`와 같은 것에 **폭(0.9)**을 직접 준 형태예요. 바이올린·막대의 기본 dodge 폭이 0.9라서 같은 값을 맞춰요.',
      ],
      quiz: [
        { type: 'mcq', q: '오른쪽 그림에서 평균 점이 각 바이올린 위에 정확히 놓인 이유는?', opts: [
          { t: '평균 점 층도 같은 폭(0.9)으로 dodge했기 때문', ok: true, why: '두 층이 같은 규칙으로 옆으로 비켜 서요.' },
          { t: 'shape = 1이라서', why: 'shape는 모양일 뿐.' },
        ] },
      ],
    },
    {
      id: 'u-free',
      title: '패널마다 y축 따로: facet_wrap(scales = "free_y")',
      src: 'Lee-Kim & Chou (2002) Fig. 6 (참가자마다 y축 범위가 다름)',
      key: '`scales = "free_y"` → 패널마다 y축 범위를 **각자의 데이터에 맞춘다**. 패널끼리 높이 비교는 어려워지지만 각 패널 안의 차이는 잘 보인다.',
      body: [
        { compare: [
          { label: '기본: 모든 패널 같은 y축', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ drv)` },
          { label: '`scales = "free_y"`', code: `ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ drv, scales = "free_y")` },
        ] },
        'wk4 practice plot은 기본(공통 y축), 같은 데이터의 Lee-Kim & Chou Fig. 6은 free_y예요. 무엇을 비교하게 하고 싶은지에 따라 골라요.',
      ],
      quiz: [
        { type: 'tf', q: '`scales = "free_y"`를 쓰면 패널 사이의 높낮이를 눈으로 바로 비교하기 쉬워진다.', ans: false, why: '패널마다 눈금이 달라서 오히려 어려워져요. 대신 패널 **안**의 차이가 잘 보여요.' },
      ],
    },
    {
      id: 'u-group1',
      title: '범주형 x에 회귀선 하나: aes(group = 1)',
      src: 'Kim & Clayards (2019) Fig. 6B·6E (바이올린 위 빨간 직선) · wk3/plot_practice.R 33행',
      key: 'x가 범주(factor)면 geom_smooth는 x값마다 그룹이 갈려 선을 못 긋는다. `aes(group = 1)`로 **전체를 한 그룹**으로 묶으면 범주 순서(1, 2, 3, …)를 따라 직선 하나를 긋는다.',
      setup: 'spec',
      body: [
        { code: `ggplot(df, aes(x = factor(Duration), y = SpectralImitation_Hz)) +
  geom_violin() +
  geom_smooth(aes(group = 1), method = "lm", se = FALSE, color = "firebrick")` },
        '[[g-group|G단원]]의 group을 반대 방향으로 쓴 거예요: 거기서는 선을 **나누려고**, 여기서는 **하나로 묶으려고**. Duration 간격(60, 140, 220, 300, 380)이 일정해서, 범주 위치(1–5)로 그은 직선이 실제 duration에 대한 직선과 같은 모양이에요.',
      ],
      quiz: [
        { type: 'mcq', q: '`aes(group = 1)`에서 1의 뜻은?', opts: [
          { t: '모든 행을 같은 그룹(이름이 1)으로 묶으라는 것', ok: true, why: '값은 무엇이든 하나면 돼요.' },
          { t: '첫 번째 범주만 쓰라는 것', why: '모든 행을 쓰되 한 그룹으로.' },
          { t: '선 굵기 1', why: '굵기는 linewidth.' },
        ] },
      ],
    },
  ],
});
