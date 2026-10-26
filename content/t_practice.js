/* 단원 T: 수업 Practice 완수 */
RS.units.push({
  id: 't',
  title: 'Practice 완수 (wk2–4)',
  short: 'R4DS 3.6 연습 6개, wk3 Practice 1·3·4, wk4 mpg 연습, wk4 practice plot',
  desc: '지금까지의 조각을 모아 수업의 Practice를 직접 완성해요. 목표 그림을 보고, 정해진 조건을 모두 통과하면 완료. **모범 답안은 확인 창을 거쳐야 열려요** — 먼저 끝까지 스스로 해 보세요.',
  lessons: [
    {
      id: 't-36',
      title: 'wk2: R4DS 3.6 연습 그림 6개',
      src: 'wk2_ggplot_ExerciseKey.R 전체 (R for Data Science 3.6 Exercise 6)',
      key: '여섯 그림 모두 x = displ, y = hwy. 차이는 **aes를 어디에(전역/지역) 무엇으로(color/group/linetype)** 두었는지뿐이다.',
      body: [
        '막히면 [[g-group|group]], [[g-colorlt|color + linetype]], [[h-extend|지역 매핑]], [[g-order|층 순서]] 레슨으로 돌아가세요. 선 굵기는 ExerciseKey의 `size = 3` 대신 `linewidth = 3`을 써도, 아예 생략해도 통과해요.',
      ],
      quiz: [
        { type: 'write', q: '① 큰 점(size 4) + 전체 추세선 하나 (띠 없음)', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(se = FALSE)`, checks: [
          { r: 'maps("x", "displ") && maps("y", "hwy")', m: 'x = displ, y = hwy' },
          { r: 'has_param("point", "size", 4)', m: '점 크기 4' },
          { r: 'has_geom("smooth") && has_param("smooth", "se", FALSE)', m: '띠 없는 smooth (`se = FALSE`)' },
          { r: '!mapped("group", "smooth") && !mapped("colour", "smooth") && !mapped("linetype", "smooth")', m: '선은 하나 (smooth를 나누는 aes 없이)' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(se = FALSE)` },
        { type: 'write', q: '② 큰 점(size 4) + drv별로 나뉜 추세선 3개 (모두 같은 색, 띠 없음)', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(aes(group = drv), se = FALSE)`, checks: [
          { r: 'has_param("point", "size", 4) && !mapped("colour", "point")', m: '점: 크기 4, 색 매핑 없음' },
          { r: 'maps("group", "drv", "smooth")', m: 'smooth를 drv로 나누기 (`group = drv`)' },
          { r: '!mapped("colour", "smooth") && !mapped("linetype", "smooth")', m: '선 색·모양은 모두 같게' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(size = 4) +
  geom_smooth(aes(group = drv), se = FALSE)` },
        { type: 'write', q: '③ 점과 선 모두 drv 색 (점 size 3, 굵은 선, 띠 없음)', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(colour = drv), linewidth = 3, se = FALSE)`, checks: [
          { r: 'maps("colour", "drv", "point") && has_param("point", "size", 3)', m: '점: colour = drv, 크기 3' },
          { r: 'maps("colour", "drv", "smooth")', m: '선: colour = drv' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(colour = drv), linewidth = 3, se = FALSE)` },
        { type: 'write', q: '④ 점만 drv 색 (size 4), 선은 전체 하나 (굵게, 띠 없음)', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 4) +
  geom_smooth(linewidth = 3, se = FALSE)`, checks: [
          { r: 'maps("colour", "drv", "point") && has_param("point", "size", 4)', m: '점: colour = drv, 크기 4' },
          { r: '!mapped("colour", "smooth") && !mapped("group", "smooth") && !mapped("linetype", "smooth")', m: '선은 하나 — color = drv가 전역에 있으면 선도 3개가 돼요.' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 4) +
  geom_smooth(linewidth = 3, se = FALSE)` },
        { type: 'write', q: '⑤ 점은 drv 색 (size 3), 선은 drv별 **선 모양** (굵게, 띠 없음)', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(linetype = drv), linewidth = 3, se = FALSE)`, checks: [
          { r: 'maps("colour", "drv", "point") && has_param("point", "size", 3)', m: '점: colour = drv, 크기 3' },
          { r: 'maps("linetype", "drv", "smooth")', m: '선: linetype = drv' },
          { r: '!mapped("colour", "smooth")', m: '선 색은 매핑하지 않기 (기본 파랑)' },
          { r: 'has_param("smooth", "se", FALSE)', m: '`se = FALSE`' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(aes(colour = drv), size = 3) +
  geom_smooth(aes(linetype = drv), linewidth = 3, se = FALSE)` },
        { type: 'write', q: '⑥ 흰 테두리가 둘러진 drv 색 점 (흰 점 size 10 위에 색 점 size 5)', target: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(colour = "white", size = 10) +
  geom_point(aes(colour = drv), size = 5)`, checks: [
          { r: 'has_geom("point", 2)', m: 'geom_point 층 두 개' },
          { r: 'has_param(1, "colour", "white") && has_param(1, "size", 10)', m: '첫 층: 흰색, 크기 10' },
          { r: 'maps("colour", "drv", 2) && has_param(2, "size", 5)', m: '둘째 층: colour = drv, 크기 5' },
        ], sol: `ggplot(data= mpg, mapping = aes(x=displ, y=hwy)) +
  geom_point(colour = "white", size = 10) +
  geom_point(aes(colour = drv), size = 5)` },
      ],
    },
    {
      id: 't-p1',
      title: 'wk3 Practice 1: 바이올린 안에 작은 회색 박스플롯',
      src: 'wk3_ggplot_practice.R 107–111행',
      key: '바이올린(반투명, class별 색) → 그 위에 좁고 흰 박스플롯 → theme_bw().',
      body: [
        '필요한 부품: [[e-fill|fill = class]], [[k-violinbox|width·fill·color 설정]], [[g-order|층 순서]], [[l-themes|theme_bw]]. 수업 파일에는 정답 코드가 이미 적혀 있으니, 그 파일을 보지 말고 써 보세요.',
      ],
      quiz: [
        { type: 'write', q: 'mpg로 class별 hwy 바이올린(alpha 0.5, 속 색은 class별)을 그리고, 안에 폭 0.1인 **흰 속·회색 선** 박스플롯(alpha 0.5)을 넣은 뒤 theme_bw()를 적용하세요.', target: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin(alpha=0.5) +
  geom_boxplot(width=0.1, fill="white", color="grey", alpha=0.5) +
  theme_bw()`, checks: [
          { r: 'maps("x", "class") && maps("y", "hwy")', m: 'x = class, y = hwy' },
          { r: 'maps("fill", "class", "violin") && has_param("violin", "alpha", 0.5)', m: '바이올린: fill = class 매핑, alpha 0.5' },
          { r: 'has_geom("boxplot") && geom_order("violin", "boxplot")', m: '박스플롯이 바이올린 **다음** 층이어야 해요.' },
          { r: 'param_between("boxplot", "width", 0.05, 0.2)', m: '박스 폭 `width = 0.1`' },
          { r: 'has_param("boxplot", "fill", "white")', m: '박스 속 `fill = "white"` (설정)' },
          { r: 'has_param("boxplot", "colour", "grey") || has_param("boxplot", "colour", "grey50") || has_param("boxplot", "colour", "grey60")', m: '박스 선 `color = "grey"`' },
          { r: 'theme_is("bw")', m: '`theme_bw()`' },
        ], sol: `ggplot(mpg, aes(x=class, y=hwy, fill=class)) +
  geom_violin(alpha=0.5) +
  geom_boxplot(width=0.1, fill="white", color="grey", alpha=0.5) +
  theme_bw()` },
      ],
    },
    {
      id: 't-p3',
      title: 'wk3 Practice 3: 박스플롯 + 개별 점, MergerStatus × Gender 패널',
      src: 'wk3_Rproject.R 52행 "create boxplots with individual datapoints on top of them, panneled by MergerStatus and Gender"',
      key: 'sibimit_means를 쓰고, boxplot 층 **위에** 점 층, facet은 MergerStatus와 Gender 두 변수.',
      setup: ['sibimit', 'sibimit_means'],
      body: [
        '과제 문장을 요구 조건으로 쪼개 보면:',
        '1. **boxplots**: `geom_boxplot()` (y = COGm)\n2. **individual datapoints on top of them**: 박스 **다음 층**에 점 (겹치지 않게 jitter 권장)\n3. **panelled by MergerStatus and Gender**: [[f-two|facet_grid(MergerStatus ~ Gender) 또는 facet_wrap(~ MergerStatus + Gender)]]',
        'x축에 무엇을 둘지는 과제에 없어서 자유예요. 목표 그림은 **x = Place**(치조 vs 권설)로 그렸어요. 데이터는 준비 코드로 `sibimit`과 `sibimit_means`가 이미 만들어져 있어요 (wk3 39–42행).',
      ],
      quiz: [
        { type: 'write', q: 'Practice 3을 완성하세요. (데이터: `sibimit_means`)', given: `sibimit <- read_csv("QuantAnalysis_data/sib_imit_data.csv")
sibimit_means <- sibimit %>%
  group_by(Subject, Gender, Place, Task, MergerStatus) %>%
  summarise(COGm = mean(COGm))`, target: `ggplot(sibimit_means, aes(x = Place, y = COGm, fill = Place)) +
  geom_boxplot() +
  geom_point(position = "jitter") +
  facet_grid(MergerStatus ~ Gender)`, checks: [
          { r: 'data_has(c("COGm", "MergerStatus", "Gender")) && data_nrow() == nrow(sibimit_means)', m: '데이터는 `sibimit_means`' },
          { r: 'maps("y", "COGm", "boxplot")', m: 'y = COGm' },
          { r: 'has_geom("boxplot")', m: '`geom_boxplot()` 층' },
          { r: 'has_geom("point") && geom_order("boxplot", "point")', m: '점 층이 박스플롯 **다음**(위)에 있어야 해요.' },
          { r: 'facet_has(c("MergerStatus", "Gender"))', m: 'MergerStatus와 Gender **둘 다**로 패널 나누기' },
          { r: 'jittered()', opt: true, m: '점을 jitter해서 겹침 줄이기 — `position = "jitter"`', ok: '점을 jitter했어요' },
        ], sol: `ggplot(sibimit_means, aes(x = Place, y = COGm, fill = Place)) +
  geom_boxplot() +
  geom_point(position = "jitter") +
  facet_grid(MergerStatus ~ Gender)`, solNote: 'x = Task로 두고 fill = Place로 해도 조건만 맞으면 정답이에요. 박스플롯의 이상치 점과 jitter 점이 겹쳐 보이는 건 이 수업 범위에선 그대로 두어도 괜찮아요.' },
      ],
    },
    {
      id: 't-p4',
      title: 'wk3 Practice 4: 바이올린 + 개별 점, MergerStatus × Gender 패널',
      src: 'wk3_Rproject.R 57행',
      key: 'Practice 3에서 **geom_boxplot을 geom_violin으로** 바꾸는 것뿐. 바이올린은 반투명하게 하면 점이 더 잘 보인다.',
      setup: ['sibimit', 'sibimit_means'],
      body: [
        '바이올린이 불투명하면 점이 바이올린 **위**에 있어도 색이 겹쳐 답답해요. [[k-violinpoints|wk3의 violin + jitter 예]]처럼 `alpha = 0.5`를 주면 좋아요.',
      ],
      quiz: [
        { type: 'write', q: 'Practice 4를 완성하세요. (데이터: `sibimit_means`)', given: `sibimit_means  # Practice 3과 같은 데이터가 준비되어 있어요`, target: `ggplot(sibimit_means, aes(x = Place, y = COGm, fill = Place)) +
  geom_violin(alpha = 0.5) +
  geom_point(position = "jitter") +
  facet_grid(MergerStatus ~ Gender)`, checks: [
          { r: 'data_has(c("COGm", "MergerStatus", "Gender")) && data_nrow() == nrow(sibimit_means)', m: '데이터는 `sibimit_means`' },
          { r: 'maps("y", "COGm", "violin")', m: 'y = COGm' },
          { r: 'has_geom("violin")', m: '`geom_violin()` 층' },
          { r: 'has_geom("point") && geom_order("violin", "point")', m: '점 층이 바이올린 **다음**(위)에 있어야 해요.' },
          { r: 'facet_has(c("MergerStatus", "Gender"))', m: 'MergerStatus와 Gender 둘 다로 패널 나누기' },
        ], sol: `ggplot(sibimit_means, aes(x = Place, y = COGm, fill = Place)) +
  geom_violin(alpha = 0.5) +
  geom_point(position = "jitter") +
  facet_grid(MergerStatus ~ Gender)` },
      ],
    },
    {
      id: 't-dplyr',
      title: 'wk4: mpg로 dplyr 연습 5개',
      src: 'wk4_dplyr.R 220–254행 "Now you try! Using the mpg dataframe"',
      key: '각 문장을 동사로 바꾸기: "only columns" → select, "by 무엇" → group_by, "mean" → summarise(mean), "filter out" → filter(!…), "extra column" → mutate.',
      setup: [],
      body: [
        '결과 표를 **마지막 줄에 출력**하면 채점돼요 (이름에 저장만 하면 출력되지 않으니, 저장했다면 그 이름을 마지막 줄에 한 번 더 쓰세요).',
      ],
      quiz: [
        { type: 'write', q: '① "create a new dataframe with the only columns being model, displ, cyl, trans"', checks: [
          { r: 'ans_equals(select(mpg, model, displ, cyl, trans), names = TRUE)', m: '열이 model, displ, cyl, trans (이 순서) 네 개, 234행이어야 해요.' },
        ], sol: `mpg %>%
  select(model, displ, cyl, trans)` },
        { type: 'write', q: '② "…the only columns being model, displ, cyl, trans, hwy"', checks: [
          { r: 'ans_equals(select(mpg, model, displ, cyl, trans, hwy), names = TRUE)', m: '열 다섯 개: model, displ, cyl, trans, hwy' },
        ], sol: `mpg %>%
  select(model, displ, cyl, trans, hwy)` },
        { type: 'write', q: '③ "calculate mean city miles per gallon (cty) by number of cylinders"', checks: [
          { r: 'ans_nrow(4)', m: '실린더 수(4, 5, 6, 8)마다 한 행 → 4행' },
          { r: 'ans_equals(mpg %>% group_by(cyl) %>% summarise(m = mean(cty)), names = FALSE)', m: 'cyl별 cty 평균 (요약 열 이름은 자유)' },
        ], sol: `mpg %>%
  group_by(cyl) %>%
  summarise(new = mean(cty))` },
        { type: 'write', q: '④ "filter out the a4 quattro and then calculate mean engine displacement (displ) by class"', checks: [
          { r: 'ans_nrow(7)', m: 'class 7개 → 7행' },
          { r: 'ans_equals(mpg %>% filter(!(model == "a4 quattro")) %>% group_by(class) %>% summarise(m = mean(displ)), names = FALSE)', m: 'a4 quattro를 **뺀 뒤**(filter 먼저) class별 displ 평균' },
        ], sol: `mpg %>%
  filter(!(model == "a4 quattro")) %>%
  group_by(class) %>%
  summarise(new = mean(displ))`, tips: '"filter out" = **걸러서 없애기**. `filter(model == "a4 quattro")`는 반대로 a4 quattro만 남겨요 ([[o-not|!( )]]).' },
        { type: 'write', q: '⑤ "create a new dataframe that has an extra column for the difference between hwy and cty, then filter out pickups for which that difference is greater than 5"', checks: [
          { r: 'ans_df() && ncol(A()) == 12', m: '원래 11열 + 차이 열 1개 = 12열' },
          { r: 'ans_equals(mpg %>% mutate(d = hwy - cty) %>% filter(!(class == "pickup" & d >= 5)), names = FALSE) || ans_equals(mpg %>% mutate(d = hwy - cty) %>% filter(!(class == "pickup" & d > 5)), names = FALSE)', m: 'pickup이면서 차이가 5보다 큰(또는 5 이상인) 행만 빼야 해요 (다른 차종은 그대로).' },
        ], sol: `mpg %>%
  mutate(diff = hwy - cty) %>%
  filter(!(class == "pickup" & diff >= 5))`, solNote: '과제 문장은 "greater than 5"(> 5)인데 수업 코드는 `diff >= 5`예요. pickup 중 차이가 정확히 5인 차가 있어서 두 결과의 행 수가 달라요. 이 도구는 둘 다 정답으로 받지만, 과제에서는 **문장에 맞춰 `>`**를 쓰거나 어느 쪽을 택했는지 밝히는 게 안전해요.' },
      ],
    },
    {
      id: 't-p4plot',
      title: 'wk4 practice plot: 참가자별 바이올린 + 점 + 평균',
      src: 'wk4_dplyr.R 261–269행, wk4_practice plot.pdf',
      key: '데이터 준비(filter 두 조건 + factor) → 바이올린 → 속 빈 점(jitter) → 평균 점(stat_summary) → facet_wrap(~ subject) → y 라벨.',
      setup: 'sibmerger',
      body: [
        'wk4_practice plot.pdf의 그림을 요소별로 뜯어 보면:',
        { table: { head: ['그림에서 보이는 것', '필요한 코드', '배운 곳'], rows: [
          ['참가자 5명(C21, CSY, E63, TFH, XSJ)만', '`filter(subject %in% c(...))`', '[[o-in|O단원]]'],
          ['condition이 있는 과제만 (read 제외)', '`filter(task == "interactive")`', '[[s-factor|S단원]]'],
          ['x축 Control → NoComp → NoCont → Context', '`factor(condition, levels, labels)`', '[[s-factor|S단원]]'],
          ['y = spectral mean', '`midSpecMean`, `labs(y = "spectral mean (Hz)")`', '[[l-labs|L단원]]'],
          ['흰 바이올린, 회색 윤곽', '`geom_violin(color = "grey60")` (바이올린 기본 속은 흰색)', '[[k-violinpoints|K단원]]'],
          ['속 빈 작은 점, 좁게 흔들림', '`geom_jitter(shape = 1, width = 0.1, height = 0)`', '[[e-fillpoint|E단원]], [[i-jitter|I단원]]'],
          ['큰 동그라미 = 평균', '`stat_summary(fun = mean, geom = "point", size = 3)`', '[[s-mean|S단원]]'],
          ['참가자별 패널 5개', '`facet_wrap(~ subject)`', '[[f-wrap|F단원]]'],
          ['Control 점만 회색 (치조음)', '`aes(color = place)` + 색 지정(선택)', '[[u-manual|U단원]]'],
        ] } },
      ],
      quiz: [
        { type: 'write', q: 'wk4 practice plot을 그리세요. `sibmerger`는 이미 읽어 두었어요.', given: `sibmerger <- read_csv("QuantAnalysis_data/sib_merger.csv")`, target: `sibmerger %>%
  filter(task == "interactive",
         subject %in% c("C21", "CSY", "E63", "TFH", "XSJ")) %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context"))) %>%
  ggplot(aes(x = condition, y = midSpecMean)) +
  geom_violin(color = "grey60") +
  geom_jitter(aes(color = place), shape = 1, width = 0.1, height = 0) +
  stat_summary(aes(color = place), fun = mean, geom = "point", size = 3) +
  scale_color_manual(values = c("grey60", "black")) +
  facet_wrap(~ subject) +
  labs(y = "spectral mean (Hz)") +
  theme(legend.position = "none")`, checks: [
          { r: 'setequal(data_unique("subject"), c("C21", "CSY", "E63", "TFH", "XSJ"))', m: '참가자 5명만 (C21, CSY, E63, TFH, XSJ)' },
          { r: 'all(data()$task == "interactive")', m: 'interactive 과제만 (read 행은 condition이 NA)' },
          { r: 'maps("x", "condition") && maps("y", "midSpecMean")', m: 'x = condition, y = midSpecMean' },
          { r: 'x_order(c("Control", "NoComp", "NoCont", "Context"))', m: 'x축: Control, NoComp, NoCont, Context 순서 (factor의 levels/labels 짝)' },
          { r: 'cond_ok()', m: '라벨 짝 확인: control → Control, **nw → NoComp**, **nc → NoCont**, yc → Context (levels와 labels는 같은 위치끼리 짝)' },
          { r: 'has_geom("violin")', m: '바이올린 층' },
          { r: 'jittered() && geom_order("violin", "point")', m: '흔들린 개별 점이 바이올린 위에' },
          { r: 'has_stat("summary")', m: '평균 점 (`stat_summary(fun = mean, geom = "point")`)' },
          { r: 'facet_has("subject")', m: '`facet_wrap(~ subject)`로 참가자별 패널' },
          { r: 'lab_is("y", "spectral mean (Hz)")', m: 'y축 제목 "spectral mean (Hz)"' },
          { r: 'has_param("point", "shape", 1)', opt: true, m: '속 빈 점 `shape = 1`', ok: '속 빈 점까지 맞췄어요' },
        ], sol: `sibmerger %>%
  filter(task == "interactive",
         subject %in% c("C21", "CSY", "E63", "TFH", "XSJ")) %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context"))) %>%
  ggplot(aes(x = condition, y = midSpecMean)) +
  geom_violin(color = "grey60") +
  geom_jitter(aes(color = place), shape = 1, width = 0.1, height = 0) +
  stat_summary(aes(color = place), fun = mean, geom = "point", size = 3) +
  scale_color_manual(values = c("grey60", "black")) +
  facet_wrap(~ subject) +
  labs(y = "spectral mean (Hz)") +
  theme(legend.position = "none")`, solNote: '`scale_color_manual()`(치조음 = 회색, 권설음 = 검정)과 `theme(legend.position = "none")`은 원본과 색까지 똑같이 맞추기 위한 선택 사항이에요. 채점에는 들어가지 않아요.', tips: '한 번에 다 쓰지 말고 **한 층씩**: 먼저 filter + mutate 결과를 `head()`로 확인 → 바이올린만 → 점 추가 → 평균 추가 → facet → 라벨.' },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 't-36', src: 'wk2 ExerciseKey', title: 'R4DS 3.6 연습 그림 6개' },
  { lesson: 't-p1', src: 'wk3 ggplot_practice', title: 'Practice 1: 바이올린 + 작은 박스플롯' },
  { lesson: 't-p3', src: 'wk3 Rproject', title: 'Practice 3: 박스플롯 + 점, 2×2 패널' },
  { lesson: 't-p4', src: 'wk3 Rproject', title: 'Practice 4: 바이올린 + 점, 2×2 패널' },
  { lesson: 't-dplyr', src: 'wk4 dplyr', title: 'mpg dplyr 연습 5개' },
  { lesson: 't-p4plot', src: 'wk4 practice plot', title: 'sib_merger 참가자별 바이올린' },
);
