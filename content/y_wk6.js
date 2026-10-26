/* 단원 Y: wk6 데이터 조작 실습 (네덜란드어 어휘판단) */
RS.units.push({
  id: 'y',
  title: 'wk6 실습: 네덜란드어 어휘판단 데이터',
  short: 'trials·stims 두 파일, OLD20, 빈도 그림, 단어별 요약, log10 줄무늬, 두 변수 함께 보기',
  desc: 'wk6_data_manip_practice.pdf와 그 key(wk6_data_manip_practice_key.R). 수업 시간 실습 6문제를 직접 그려요. 같은 데이터로 HW1(Z단원)을 하니, 여기서 데이터와 친해져 두면 숙제가 쉬워요.\n\n실습지의 공통 규칙: **정답 반응만** 쓰기, 그래프 배경은 **흰색**(`theme_bw()`), 축 이름은 변수 이름 말고 **알아볼 수 있게**, 그래프마다 **제목**.',
  setup: 'dutch',
  lessons: [
    {
      id: 'y-data',
      title: '두 파일: 시행마다 한 행(trials), 단어마다 한 행(stims)',
      src: 'wk6_data_manip_practice.pdf 1쪽, key 5–9행',
      key: '`trials`: 반응 50,000개 (참가자 39명). `stims`: 단어 12,849개의 단어 정보. 두 표를 잇는 열쇠는 **spelling**.',
      body: [
        { code: `trials <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_trials.csv")
stims <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_stims.csv")
glimpse(trials)
glimpse(stims)` },
        { table: { head: ['열', '뜻'], rows: [
          ['`participant`, `block`, `order`', '참가자 번호, 블록, 실험 안에서의 순서'],
          ['`spelling`', '화면에 나온 글자열 (= 단어) — **열쇠 열**'],
          ['`lexicality`', '진짜 단어인가: 이 파일은 비단어 시행을 지워서 **전부 W**'],
          ['`response`', '참가자의 답: W(단어), N(비단어), T(시간 초과)'],
          ['`rt.raw`', '반응 시간 (밀리초)'],
          ['`OLD20`', '철자 이웃 밀도: 낮을수록 비슷한 단어가 많음 (아래 레슨)'],
          ['`subtlex.log10.frequency`', '단어 빈도 (자막 말뭉치, log10)'],
          ['`nchar`, `nsyl`', '글자 수, 음절 수 (nsyl이 빈 단어 137개)'],
        ] } },
        '자극이 모두 진짜 단어라서 **정답 = W 반응**이에요. N과 T는 오답이에요.',
      ],
      quiz: [
        { type: 'mcq', q: '이 실험에서 "정답 반응"만 남기는 filter 조건은?', opts: [
          { t: '`response == "W"`', ok: true, why: '자극이 전부 진짜 단어(lexicality W)라서, 단어라고 답한 W가 정답이에요.' },
          { t: '`lexicality == "W"`', why: 'lexicality는 모든 행이 W라서 아무것도 걸러지지 않아요.' },
          { t: '`response != "T"`', why: 'N(비단어라고 답함)도 오답이에요.' },
        ] },
        { type: 'mcq', q: '두 표를 붙일 때 by에 줄 열은?', opts: [
          { t: '`"spelling"`', ok: true, why: '두 표에 모두 있는 단어 이름 열이에요.' },
          { t: '`"participant"`', why: 'stims에는 참가자 열이 없어요.' },
          { t: '`"nchar"`', why: '글자 수가 같은 단어가 많아서 열쇠가 될 수 없어요.' },
        ] },
      ],
    },
    {
      id: 'y-q1',
      title: '실습 1: 빈도와 OLD20의 관계',
      src: 'wk6_data_manip_practice.pdf 문제 1, key 12–21행',
      key: 'x = 빈도, y = OLD20. 점은 **진회색·반투명**, 추세선은 **진한 빨강 선 + 빨간 띠**.',
      body: [
        '**OLD20**은 한 단어에서 가장 비슷한 20개 단어까지의 평균 편집 거리(글자를 넣고·빼고·바꾸는 최소 횟수)예요. 실습지 설명대로 값이 **낮으면 이웃이 많은(dense)** 동네, **높으면 이웃이 적은(sparse)** 동네에 사는 단어예요.',
        '색은 "설정"이니 aes() 밖에 둬요 (E단원). 띠 색은 `fill`, 선 색은 `color`예요 (G단원).',
      ],
      quiz: [
        { type: 'write', q: 'stims로 빈도(x)와 OLD20(y)의 산점도를 그리세요. 진회색 반투명 점, 진한 빨강 추세선과 빨간 띠, 흰 배경, 축 이름, 제목.', target: `ggplot(stims, aes(subtlex.log10.frequency, OLD20)) +
  geom_point(alpha = .3, color = "darkgray") +
  geom_smooth(color = "darkred", fill = "red") +
  xlab("Log10 lexical frequency") +
  ylab("OLD 20 (orthographic neighborhood)") +
  ggtitle("Relationship between lexical frequency and OLD20") +
  theme_bw()`, checks: [
          { r: 'maps("x", "subtlex.log10.frequency") && maps("y", "OLD20")', m: 'x = subtlex.log10.frequency, y = OLD20' },
          { r: 'has_param("point", "colour", "darkgray") || has_param("point", "colour", "darkgrey") || has_param("point", "colour", "gray30") || has_param("point", "colour", "grey30")', m: '점 색: 진회색 (`color = "darkgray"`)' },
          { r: 'param_between("point", "alpha", 0.01, 0.9)', m: '점 반투명 (`alpha = .3` 정도)' },
          { r: 'has_param("smooth", "colour", "darkred")', m: '추세선: `color = "darkred"`' },
          { r: 'has_param("smooth", "fill", "red")', m: '띠: `fill = "red"`' },
          { r: 'theme_is("bw") || theme_is("classic") || theme_is("minimal") || theme_is("light")', m: '흰 배경 (`theme_bw()`)' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '축 이름 두 개와 제목' },
        ], sol: `ggplot(stims, aes(subtlex.log10.frequency, OLD20))+
  geom_point(alpha=.3, color="darkgray")+
  geom_smooth(color="darkred", fill="red")+
  xlab("Log10 lexical frequency")+
  ylab("OLD 20 (orthographic neighborhood)")+
  ggtitle("Relationship between lexical frequency and OLD20")+
  theme_bw()` },
        { type: 'mcq', q: '이 그림의 핵심(take-home point)으로 알맞은 것은?', opts: [
          { t: '빈도가 높은 단어일수록 OLD20이 낮다 — 자주 쓰이는 단어는 비슷한 단어가 많은 동네에 산다', ok: true, why: '추세선이 오른쪽으로 갈수록 내려가요.' },
          { t: '빈도가 높을수록 OLD20이 높다', why: '선이 내려가요.' },
          { t: '두 변수는 관계가 없다', why: '추세선이 뚜렷이 기울어 있어요.' },
        ] },
      ],
    },
    {
      id: 'y-q2',
      title: '실습 2: 음절 수에 따라 — 두 가지 방법',
      src: 'wk6_data_manip_practice.pdf 문제 2, key 26–60행',
      key: '음절 수가 빈 단어를 빼고(`filter(!is.na(nsyl))`), nsyl을 factor로 바꾼 뒤 → ① **패널로 나누기**(facet) 또는 ② **색으로 나누기**(color).',
      body: [
        '실습지 힌트: `summary()`, `glimpse()`로 구조를 보고, nsyl이 빈 행을 빼고, 숫자형인지 확인해서 필요하면 바꾸기. nsyl은 `<dbl>`(숫자)이라 그대로 color에 주면 **연속 색 막대**가 나와요. 1음절·2음절 **두 범주**로 보려면 X단원의 `as_factor()`로 바꿔요.',
        { code: `stims %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl)) %>%
  glimpse()` },
        '파이프로 데이터를 다듬은 뒤 바로 `ggplot()`으로 이어 그릴 수 있어요 (S단원). 그럼 ggplot의 첫 인자(data)는 파이프가 채워 줘요.',
      ],
      quiz: [
        { type: 'write', q: '방법 ①: nsyl이 있는 단어만, 빈도–OLD20 그림을 **nsyl별 패널**로 나눠 그리세요. (점·선 색, 흰 배경, 축 이름, 제목은 실습 1처럼)', target: `stims %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl)) %>%
  ggplot(aes(subtlex.log10.frequency, OLD20)) +
    geom_point(alpha = .3, color = "darkgray") +
    geom_smooth(color = "darkred", fill = "red") +
    xlab("Log10 lexical frequency") +
    ylab("OLD20 (orthographic neighborhood)") +
    ggtitle("Relationship between frequency and OLD20 by syllable") +
    theme_bw() +
    facet_wrap(~nsyl)`, checks: [
          { r: 'data_nrow() == 12712', m: 'nsyl이 빈 137개 단어를 빼기 (12,712행)' },
          { r: 'facet_has("nsyl")', m: 'nsyl로 패널 나누기' },
          { r: 'maps("x", "subtlex.log10.frequency") && maps("y", "OLD20")', m: 'x = 빈도, y = OLD20' },
          { r: 'theme_is("bw") || theme_is("classic") || theme_is("minimal") || theme_is("light")', m: '흰 배경' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title")', m: '축 이름과 제목' },
        ], sol: `stims %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl)) %>%
  ggplot(aes(subtlex.log10.frequency, OLD20))+
    geom_point(alpha=.3, color="darkgray")+
    geom_smooth(color="darkred", fill="red")+
    xlab("Log10 lexical frequency")+
    ylab("OLD20 (orthographic neighborhood)")+
    ggtitle("Relationship between frequency and OLD20 by syllable")+
    theme_bw()+
    facet_wrap(~nsyl)` },
        { type: 'write', q: '방법 ②: 같은 그림을 패널 대신 **점과 선의 색**을 nsyl로 나눠 그리세요. 띠 색도 nsyl별로.', target: `stims %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl)) %>%
  ggplot(aes(subtlex.log10.frequency, OLD20)) +
    geom_point(alpha = .2, aes(color = nsyl)) +
    geom_smooth(aes(color = nsyl, fill = nsyl)) +
    xlab("Log10 lexical frequency") +
    ylab("Neighborhood density") +
    ggtitle("Relationship between frequency and OLD20 by syllable") +
    theme_bw()`, checks: [
          { r: 'data_nrow() == 12712', m: 'nsyl이 빈 단어 빼기' },
          { r: 'maps("colour", "nsyl", "point") && maps("colour", "nsyl", "smooth")', m: '점과 선 모두 color = nsyl' },
          { r: 'maps("fill", "nsyl", "smooth")', m: '띠도 nsyl별 (`fill = nsyl`)' },
          { r: '!is.numeric(data()$nsyl)', m: 'nsyl을 factor로 바꾸기 (`as_factor`) — 안 바꾸면 연속 색 막대가 나와요' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title") && (theme_is("bw") || theme_is("classic") || theme_is("minimal") || theme_is("light"))', m: '축 이름, 제목, 흰 배경' },
        ], sol: `stims %>%
  filter(!is.na(nsyl)) %>%
  mutate(nsyl = as_factor(nsyl)) %>%
  ggplot(aes(subtlex.log10.frequency, OLD20))+
    geom_point(alpha=.2, aes(color=nsyl))+
    geom_smooth(aes(color=nsyl, fill=nsyl))+
    xlab("Log10 lexical frequency")+
    ylab("Neighborhood density")+
    ggtitle("Relationship between frequency and OLD20 by syllable")+
    theme_bw()` },
        { type: 'mcq', q: '실습지 질문 "두 방법 중 무엇이 좋은가?"에 대한 근거로 알맞은 것은?', opts: [
          { t: '색 방법은 두 추세선이 한 패널에 겹쳐 있어 기울기를 바로 비교하기 좋고, 패널 방법은 점이 덜 겹쳐 각 집단의 퍼짐을 보기 좋다', ok: true, why: '정답이 하나인 질문이 아니에요. 무엇을 보여 주고 싶은지에 따라 골라요.' },
          { t: '패널 방법은 항상 틀렸다', why: '둘 다 쓸 수 있는 방법이에요.' },
          { t: '색 방법은 nsyl이 숫자여야만 된다', why: '오히려 factor여야 두 색으로 나뉘어요.' },
        ] },
      ],
    },
    {
      id: 'y-join',
      title: '실습 3 준비: 두 표 붙이고 단어마다 한 점으로 요약',
      src: 'wk6_data_manip_practice.pdf 문제 3 힌트, key 72–80행',
      key: '`left_join`으로 반응마다 단어 정보를 붙이고(W단원) → 정답만 → **단어마다** 평균 반응 시간과 반응 수. "단어 하나에 점 하나"가 되려면 요약이 먼저다.',
      body: [
        { code: `rt_data <- trials %>%
  left_join(stims, by = "spelling")

word_rts <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw),
            N = n(),
            .groups = "drop")
word_rts` },
        '- `group_by(spelling, subtlex.log10.frequency)`: 단어별로 묶는데, 빈도 열도 **같이 묶어야** 요약 뒤에 그 열이 남아요 (summarise는 묶은 열과 새로 만든 열만 남겨요, R단원).\n- `N = n()`: 단어마다 정답 반응 수.\n- `.groups = "drop"`: 요약 뒤 그룹을 풀어요.',
        { note: 'NA 빈도', kind: 'warn', t: 'trials에는 있는데 stims에는 없는 단어가 있어서, 그런 단어는 빈도가 NA예요 (W단원 left_join). 그림을 그리면 ggplot이 "Removed … rows containing missing values" 경고와 함께 빼고 그려요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`group_by(spelling)`만 하고 summarize하면 어떻게 될까요?', opts: [
          { t: '빈도 열이 사라져서 x = 빈도로 그릴 수 없다', ok: true, why: 'summarise는 묶은 열과 새로 만든 열만 남겨요. 단어 정보 열을 남기려면 group_by에 같이 넣어요.' },
          { t: '결과가 똑같다', why: '빈도 열이 남지 않아요.' },
          { t: '에러가 난다', why: '에러는 아니고, 열이 빠질 뿐이에요.' },
        ] },
        { type: 'predict', q: 'word_rts는 몇 행일까요?', setup: ['dutch', 'wk6_rt'], code: `nrow(word_rts)`, opts: [
          { t: '`[1] 12954`', ok: true, why: '정답 반응이 하나라도 있는 단어의 수예요.' },
          { t: '`[1] 41993`', why: '그건 정답 반응(시행)의 수예요. 단어별로 묶었어요.' },
          { t: '`[1] 50000`', why: '전체 시행 수예요.' },
        ] },
      ],
    },
    {
      id: 'y-q3',
      title: '실습 3: 빈도와 반응 시간 — 휘는 선과 곧은 선',
      src: 'wk6_data_manip_practice.pdf 문제 3, key 72–91행',
      key: '단어마다 한 점. 추세선 두 개를 **동시에**: 휘는 것(`geom_smooth()` 기본)과 곧은 것(`geom_smooth(method = "lm")`).',
      body: [
        'G단원에서 본 대로 `geom_smooth()`의 기본은 데이터에 맞춰 휘는 선이고, `method = "lm"`을 주면 직선이에요. 같은 그림에 smooth 층을 두 번 쌓으면 둘 다 그려져요.',
      ],
      quiz: [
        { type: 'write', q: 'trials와 stims를 붙여 **정답 반응만**, 단어마다 평균 반응 시간을 구한 뒤, 빈도(x)–평균 RT(y) 산점도에 휘는 선과 곧은 선을 함께 그리세요. (흰 배경, 축 이름, 제목)', target: `rt_data <- trials %>%
  left_join(stims, by = "spelling")
word_rts <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")
ggplot(word_rts, aes(subtlex.log10.frequency, rt_mean)) +
  geom_point(alpha = .3) +
  geom_smooth() +
  geom_smooth(method = "lm") +
  xlab("Log10 lexical frequency") +
  ylab("Mean reaction time") +
  ggtitle("Lexical decision reaction times by lexical frequency") +
  theme_bw()`, given: `trials <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_trials.csv")
stims <- read_csv("QuantAnalysis_data/QuantAnalysis_dutch_stims.csv")`, checks: [
          { r: 'data_nrow() %in% c(12954, 12302)', m: '정답 반응만, 단어마다 한 행으로 요약 (12,954행; 빈도 NA를 뺐다면 12,302행)' },
          { r: 'maps("x", "subtlex.log10.frequency")', m: 'x = 빈도 (group_by에 빈도 열도 넣어야 남아요)' },
          { r: 'has_geom("smooth", 2)', m: 'smooth 층 두 개' },
          { r: 'has_param("smooth", "method", "lm") && !all(vapply(idx("smooth"), function(i) identical(param_of(i, "method"), "lm"), TRUE))', m: '하나는 곧은 선(`method = "lm"`), 하나는 휘는 선(기본)' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title") && (theme_is("bw") || theme_is("classic") || theme_is("minimal") || theme_is("light"))', m: '축 이름, 제목, 흰 배경' },
        ], sol: `rt_data <- trials %>%
  left_join(stims, by = "spelling")

word_rts <- rt_data %>%
  filter(response=="W") %>%
  group_by(spelling, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw),
            N = n(),
            .groups = "drop")

ggplot(word_rts, aes(subtlex.log10.frequency, rt_mean))+
  geom_point(alpha=.3)+
  geom_smooth()+
  geom_smooth(method="lm")+
  xlab("Log10 lexical frequency")+
  ylab("Mean reaction time")+
  ggtitle("Lexical decision reaction times by lexical frequency")+
  theme_bw()` },
        { type: 'mcq', q: '실습지 질문: 곧은 선(lm)을 고를 이유로 알맞은 것은?', opts: [
          { t: '"빈도가 1 오르면 RT가 몇 ms 줄어든다"처럼 관계를 숫자 하나(기울기)로 요약할 수 있다', ok: true, why: 'wk7 선형회귀([[reg-lm|lm() 레슨]])가 바로 이 직선을 숫자로 구하는 방법이에요. 휘는 선은 반대로, 직선이 놓치는 굽은 모양(예: 빈도가 아주 높은 쪽에서 평평해짐)을 보여 줘요.' },
          { t: '곧은 선은 데이터에 항상 더 잘 맞는다', why: '굽은 관계라면 휘는 선이 더 잘 맞아요.' },
          { t: '휘는 선은 점이 많으면 그릴 수 없다', why: '점이 많아도 그려요 (방법이 gam으로 바뀔 뿐).' },
        ] },
        { type: 'mcq', q: '실습지 질문: **휘는 선**(기본 smooth)을 고를 이유로 알맞은 것은?', opts: [
          { t: '빈도 3.5 정도까지는 반응시간이 가파르게 줄다가 그 뒤로는 거의 평평해지는(약 576ms에서 바닥) 굽은 모양을 보여 준다 — 직선은 이 모양을 놓친다', ok: true, why: '빈도 구간별 평균 RT: 1~1.5 → 691ms, 2~2.5 → 627ms, 3~3.5 → 584ms, 3.5~4 → 576ms, 4~4.5 → 576ms. 아주 고빈도 쪽은 단어가 적어서(5 이상 65개) 선이 흔들려요.' },
          { t: '휘는 선은 "빈도가 1 오르면 몇 ms"처럼 숫자 하나로 요약하기 쉽다', why: '그건 곧은 선(lm)의 장점이에요.' },
          { t: '휘는 선은 신뢰 띠가 항상 더 좁다', why: '띠 폭은 데이터 양에 따라 달라요. 끝자락에서는 오히려 넓어져요.' },
        ] },
      ],
    },
    {
      id: 'y-q4',
      title: '실습 4: 왼쪽의 세로 줄무늬와 geom_vline()',
      src: 'wk6_data_manip_practice.pdf 문제 4, key 96–113행',
      key: '빈도는 "몇 번 나왔나"라는 **정수**라서, 아주 드문 단어들은 몇 개 안 되는 같은 값을 나눠 갖는다. 로그를 씌우면 그 값들 사이가 왼쪽에서 크게 벌어져 **줄무늬**로 보인다.',
      setup: ['dutch', 'wk6_rt'],
      body: [
        { code: `log10(2)
log10(3)
log10(4)` },
        '데이터의 가장 작은 빈도 값이 바로 0.301, 0.4771, 0.6021…이에요. 2와 3 사이(0.176)는 넓은데, 1000과 1001 사이는 거의 0이죠. 그래서 왼쪽 끝에서만 점들이 세로줄로 몰려 보여요.',
        '세로선은 `geom_vline(xintercept = 값)`. 줄마다 한 층씩 쌓아도 되고, `xintercept = c(…)`로 한 번에 줘도 돼요. 점선은 `linetype = 2`(파선)나 `linetype = "dotted"`.',
      ],
      quiz: [
        { type: 'write', q: 'word_rts로 실습 3의 그림을 **추세선 하나만** 남겨 다시 그리고, 가장 왼쪽 줄무늬 세 개(log10(2), log10(3), log10(4))에 빨간 점선 세로선을 그으세요.', given: `word_rts <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")`, target: `word_rts %>%
  ggplot(aes(subtlex.log10.frequency, rt_mean)) +
    geom_point(alpha = .3) +
    geom_smooth(method = "gam") +
    geom_vline(xintercept = log10(2), color = "red", linetype = 2) +
    geom_vline(xintercept = log10(3), color = "red", linetype = 2) +
    geom_vline(xintercept = log10(4), color = "red", linetype = 2) +
    xlab("Log10 lexical frequency") +
    ylab("Mean reaction time") +
    ggtitle("Lexical decision reaction times by lexical frequency") +
    theme_bw()`, checks: [
          { r: 'maps("x", "subtlex.log10.frequency") && maps("y", "rt_mean")', m: 'x = 빈도, y = rt_mean' },
          { r: 'has_geom("smooth") && !has_geom("smooth", 2)', m: '추세선은 하나만' },
          { r: 'isTRUE(all.equal(sort(unlist(lapply(idx("vline"), function(i) layers()[[i]]$data$xintercept))), log10(2:4), tolerance = 1e-3))', m: '세로선 세 개: log10(2), log10(3), log10(4)' },
          { r: 'has_param("vline", "colour", "red")', m: '세로선 빨강' },
          { r: 'has_param("vline", "linetype")', m: '점선 (`linetype = 2` 또는 `"dotted"`)' },
        ], sol: `word_rts %>%
  ggplot(aes(subtlex.log10.frequency, rt_mean))+
    geom_point(alpha=.3)+
    geom_smooth(method="gam")+
    geom_vline(xintercept=log10(2), color="red", linetype=2)+
    geom_vline(xintercept=log10(3), color="red", linetype=2)+
    geom_vline(xintercept=log10(4), color="red", linetype=2)+
    xlab("Log10 lexical frequency")+
    ylab("Mean reaction time")+
    ggtitle("Lexical decision reaction times by lexical frequency")+
    theme_bw()` },
        { type: 'mcq', q: '실습지 질문: 왼쪽에 세로 "줄무늬"가 생기는 이유는?', opts: [
          { t: '드문 단어는 말뭉치에 2번, 3번, 4번…처럼 정수 횟수로만 나와서 빈도 값이 몇 개로 뭉치고, 로그를 씌우면 작은 수 사이의 간격(log10(3) − log10(2) = 0.18)이 크게 벌어지기 때문', ok: true, why: '이 데이터의 가장 작은 빈도 값이 0.3010, 0.4771, 0.6021, 0.6990 = log10(2), log10(3), log10(4), log10(5)예요. 같은 횟수를 가진 단어들이 한 x값에 세로로 쌓여요.' },
          { t: '반응시간 측정 오류 때문', why: '세로줄은 x(빈도) 값이 같은 단어들이에요. y와는 상관없어요.' },
          { t: 'geom_jitter를 안 써서 생긴 착시', why: 'jitter를 하면 줄이 흐려질 뿐, 빈도 값이 뭉쳐 있다는 사실은 그대로예요.' },
        ] },
        { type: 'mcq', q: '줄무늬가 **오른쪽**(빈도가 높은 쪽)에서는 안 보이는 이유는?', opts: [
          { t: '큰 정수끼리는 로그값 차이가 아주 작아서, 점들이 촘촘히 이어져 보이기 때문', ok: true, why: 'log10(1001) − log10(1000) ≈ 0.0004. 간격이 점 크기보다 작아요.' },
          { t: '빈도가 높은 단어는 데이터에 없어서', why: '오른쪽에도 점이 많아요.' },
          { t: 'geom_smooth가 가려서', why: '선은 점 위에 그려지지만 줄무늬와는 상관없어요.' },
        ] },
      ],
    },
    {
      id: 'y-q5',
      title: '실습 5: 고빈도 단어의 log10 반응 시간, 점 크기 = 반응 수',
      src: 'wk6_data_manip_practice.pdf 문제 5, key 118–129행',
      key: '빈도 > 3.5인 단어만 → `mutate(log10_rt_mean = log10(rt_mean))` → `size = N`. 점은 **분홍 속(fill) + 보라 테두리(color)**, 그러려면 `shape = 21`.',
      setup: ['dutch', 'wk6_rt'],
      body: [
        '테두리와 속 색을 따로 주려면 테두리가 있는 모양이 필요해요. 21~25번 모양만 `fill`(속)과 `color`(테두리)를 둘 다 받아요 (E단원 shape).',
        '`size = N`은 데이터의 열(N)에 따라 달라지는 값이라 **aes() 안**에 써요. 반대로 색들은 고정값이라 aes() 밖이에요.',
      ],
      quiz: [
        { type: 'write', q: '빈도가 3.5보다 큰 단어만, x = 빈도, y = **log10 평균 RT**로 그리세요. 점 크기는 반응 수(N), 점은 분홍 속·보라 테두리·반투명, 추세선은 보라 선과 분홍 띠.', given: `word_rts <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")`, target: `word_rts %>%
  filter(subtlex.log10.frequency > 3.5) %>%
  mutate(log10_rt_mean = log10(rt_mean)) %>%
  ggplot(aes(subtlex.log10.frequency, log10_rt_mean)) +
    geom_point(aes(size = N), alpha = .6, shape = 21, color = "purple", fill = "pink") +
    geom_smooth(color = "purple", fill = "pink") +
    xlab("Log10 lexical frequency") +
    ylab("Log10 mean reaction time") +
    ggtitle("Lexical decision reaction times by lexical frequency") +
    theme_bw()`, checks: [
          { r: 'data_nrow() == 810', m: '빈도 > 3.5인 단어만 (810개)' },
          { r: '{ b <- built(); !is.null(b) && max(b$data[[1]]$y, na.rm = TRUE) < 4 }', m: 'y는 log10(평균 RT) (값이 2.5~3 정도)' },
          { r: 'maps("size", "N")', m: '점 크기 = N (aes 안)' },
          { r: 'has_param("point", "shape", 21)', m: '테두리 있는 점 `shape = 21`' },
          { r: 'has_param("point", "fill", "pink") && has_param("point", "colour", "purple")', m: '점: 분홍 속, 보라 테두리' },
          { r: 'param_between("point", "alpha", 0.01, 0.95)', m: '점 반투명' },
          { r: 'has_param("smooth", "colour", "purple") && has_param("smooth", "fill", "pink")', m: '추세선 보라, 띠 분홍' },
        ], sol: `word_rts %>%
  filter(subtlex.log10.frequency > 3.5) %>%
  mutate(log10_rt_mean = log10(rt_mean)) %>%
  ggplot(aes(subtlex.log10.frequency, log10_rt_mean))+
    geom_point(aes(size = N), alpha=.6, shape = 21, color="purple", fill="pink")+
    geom_smooth(color="purple", fill="pink")+
    xlab("Log10 lexical frequency")+
    ylab("Log10 mean reaction time")+
    ggtitle("Lexical decision reaction times by lexical frequency")+
    theme_bw()` },
      ],
    },
    {
      id: 'y-q6',
      title: '실습 6: 빈도와 이웃 밀도를 한 그림에',
      src: 'wk6_data_manip_practice.pdf 문제 6, key 134–148행',
      key: '단어별로 요약할 때 **OLD20도 group_by에 넣어** 남기고 → x = 빈도, y = 평균 RT, **color = OLD20**(연속 색).',
      setup: ['dutch', 'wk6_rt'],
      body: [
        '실습지 힌트 "When summarizing … make sure to retain other word-level variables" — y-join 레슨의 group_by에 OLD20을 하나 더 넣으면 돼요.',
        { code: `word_rts2 <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, OLD20, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")

ggplot(word_rts2, aes(subtlex.log10.frequency, rt_mean, color = OLD20)) +
  geom_point(position = position_jitter(width = 0.3, height = 0.3)) +
  geom_smooth(linewidth = 2, alpha = 0.5) +
  labs(x = "Word Frequency", y = "RT", title = "mean RT by word.frequency and neighborhood density") +
  theme_bw()` },
        'OLD20은 숫자라서 색이 **연속 색 막대**(진한 파랑 → 밝은 파랑)로 나와요. 점이 많아서 색 차이를 한눈에 읽기는 어렵지만, 오른쪽(고빈도)으로 갈수록 반응이 빨라지고 그쪽 점들은 대체로 OLD20이 낮은(진한) 색이에요. 실습 1에서 본 "고빈도 단어 = 이웃이 많은 단어"와 같은 이야기예요.',
        { note: 'position_jitter(width, height)', kind: 'tip', t: 'I단원의 `position = "jitter"`를 숫자로 조절하는 방법이에요. width는 가로, height는 세로로 흔드는 폭. 여기서는 세로(RT)도 0.3ms만큼 흔드는데, 값이 수백 ms라서 눈에 띄지 않아요. HW1 6번처럼 **y값을 바꾸면 안 되는** 그림에서는 `height = 0`이 안전해요.' },
      ],
      quiz: [
        { type: 'write', q: 'OLD20을 남긴 단어별 요약(word_rts2)을 만들고, x = 빈도, y = 평균 RT, 점 색 = OLD20으로 그리세요. (점 흔들기, 추세선, 흰 배경, 축 이름, 제목)', target: `word_rts2 <- rt_data %>%
  filter(response == "W") %>%
  group_by(spelling, OLD20, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw), N = n(), .groups = "drop")
ggplot(word_rts2, aes(subtlex.log10.frequency, rt_mean, color = OLD20)) +
  geom_point(position = position_jitter(width = 0.3, height = 0.3)) +
  geom_smooth(linewidth = 2, alpha = 0.5) +
  labs(x = "Word Frequency", y = "RT", title = "mean RT by word.frequency and neighborhood density") +
  theme_bw()`, checks: [
          { r: 'data_has(c("OLD20", "subtlex.log10.frequency")) && data_nrow() %in% c(12954, 12302)', m: '단어마다 한 행, OLD20과 빈도 열이 남아 있기' },
          { r: 'maps("x", "subtlex.log10.frequency")', m: 'x = 빈도' },
          { r: 'maps("colour", "OLD20", "point")', m: '점 색 = OLD20' },
          { r: 'jittered()', m: '점 흔들기 (jitter)', opt: true },
          { r: 'has_geom("smooth")', m: '추세선' },
          { r: 'lab_set("x") && lab_set("y") && lab_set("title") && (theme_is("bw") || theme_is("classic") || theme_is("minimal") || theme_is("light"))', m: '축 이름, 제목, 흰 배경' },
        ], sol: `word_rts2 <- rt_data %>%
  filter(response=="W") %>%
  group_by(spelling, OLD20, subtlex.log10.frequency) %>%
  summarize(rt_mean = mean(rt.raw),
            N = n(),
            .groups = "drop")

ggplot(word_rts2, aes(subtlex.log10.frequency, rt_mean, color = OLD20)) +
  geom_point(position=position_jitter(width=0.3, height=0.3)) +
  geom_smooth(linewidth = 2, alpha = 0.5) +
  labs(x = "Word Frequency", y = "RT", title = "mean RT by word.frequency and neighborhood density") +
  theme_bw()` },
        { type: 'mcq', q: '실습지 질문: 빈도와 이웃 밀도(OLD20)는 반응시간에 어떻게 함께 작용하나? 이 데이터와 맞는 설명은?', opts: [
          { t: '빈도가 높을수록 확실히 빠르다. OLD20은 그 자체로는 관계가 약하고, 고빈도 단어일수록 이웃이 많은(OLD20 낮은) 경향이 있어 두 변수가 얽혀 있다 — 같은 빈도대 안에서는 OLD20에 따른 차이가 거의 없다', ok: true, why: '단어별 상관: 빈도–RT −0.30, OLD20–RT +0.09, 빈도–OLD20 −0.27. 빈도를 네 구간으로 나눠 그 안에서 보면 OLD20–RT 상관은 0.01~0.03뿐이에요. 그림의 색(OLD20)이 오른쪽(고빈도)으로 갈수록 진해지는 것도 이 얽힘이에요. "한 변수의 효과가 다른 변수에 따라 달라지는가"를 숫자로 검정하는 방법은 wk7–8의 상호작용 회귀예요 → [[mlr-interaction|상호작용 레슨]].' },
          { t: 'OLD20이 낮을수록(이웃이 많을수록) 반응이 훨씬 느리다', why: '방향이 반대이고, 크기도 아주 작아요.' },
          { t: '두 변수는 서로 무관하고, 각자 반응시간에 크게 영향을 준다', why: '두 변수는 상관(−0.27)이 있고, OLD20의 효과는 작아요.' },
        ] },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'y-q1', src: 'wk6 실습', title: '빈도와 OLD20' },
  { lesson: 'y-q2', src: 'wk6 실습', title: '음절 수별 두 가지 그림' },
  { lesson: 'y-q3', src: 'wk6 실습', title: '빈도–RT, 두 추세선' },
  { lesson: 'y-q4', src: 'wk6 실습', title: 'log10 줄무늬와 세로선' },
  { lesson: 'y-q5', src: 'wk6 실습', title: 'log10 RT, 점 크기 = N' },
  { lesson: 'y-q6', src: 'wk6 실습', title: '빈도와 이웃 밀도 함께' },
);
