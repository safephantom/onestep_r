/* 단원 p7 (실습): wk7 연습 — 스크립트의 빈칸 그림 세 개 (정답: wk7 key) */
RS.units.push({
  id: 'p7',
  title: 'wk7 연습: 회귀 그림 세 개',
  short: 'young 빈도–반응시간 직선, 나이 집단 평균 점, 나이별 직선 두 개 (key와 같은 답이면 통과)',
  desc: '`wk7_linear reg intro_rmld_freq.R`의 빈칸 연습 그림 세 개를 직접 그려요 (정답: wk7 key). 그림이 뜻하는 바는 [[reg-lm|단순 회귀]]와 [[mlr-mlr|다중 회귀]] 레슨의 표와 이어져요.',
  setup: 'english',
  lessons: [
    {
      id: 'reg-plot',
      title: '연습 1: young 참가자의 빈도–반응시간 직선',
      src: 'wk7 19–36행 (Practice), 정답: wk7 key 30–37행',
      key: '회귀는 점들을 **가장 잘 지나는 직선 하나**를 찾는 일. `geom_smooth(method = "lm")`이 그 직선(과 95% 신뢰띠)을 그려 준다.',
      body: [
        { code: `(ggplot(english_young, aes(WrittenFrequency, RTlexdec)) +
    geom_point(size = 3, alpha=0.2, color = "darkgrey") +
    geom_smooth(method = "lm", color = 'black', fill = "darkgrey") +
    labs(x= "Word frequency", y= "Reaction time (log msec)") +
    ggtitle("Young subjects only"))` },
        '**읽는 법:** 직선이 오른쪽 아래로 기울어 있어요 → 빈도가 높은 단어일수록 반응시간이 짧다(더 빨리 알아본다).',
        '**"가장 잘 지나는"의 뜻:** 각 점에서 직선까지의 **세로 거리**(잔차)를 제곱해서 모두 더한 값이 가장 작은 직선이에요(최소제곱법). `lm()`이 하는 일이 바로 이 직선의 절편과 기울기를 계산하는 거예요.',
        '지시를 짝지으면: "straight smoothing line" → `method = "lm"`, "Black smoothing line" → `color = "black"`, "grey confidence band" → `fill = "grey"`(또는 `"darkgrey"`).',
        { note: '바깥 괄호', kind: 'tip', t: '스크립트처럼 `( ... )`로 전체를 감싸면 "만들고 바로 출력"이에요. 괄호가 없어도 할당(`<-`)이 없으면 그대로 그려지니 결과는 같아요.' },
      ],
      quiz: [
        { type: 'mcq', q: '이 그림에서 `method = "lm"`을 빼면?', opts: [
          { t: '직선 대신 구불구불한 곡선(gam)이 그려진다', ok: true, why: '데이터가 1,000행 이상이면 기본 방법이 gam이에요 (적으면 loess). `"lm"`이어야 회귀 직선.' },
          { t: '선이 사라진다', why: 'geom_smooth는 기본 방법으로라도 선을 그려요.' },
          { t: '에러가 난다', why: '기본값이 있어서 에러는 아니에요.' },
        ] },
        { type: 'write', q: '스크립트 21–27행 Practice: `english_young`을 **직접 만들고**(빈칸이었던 29–30행), young 참가자의 빈도(x)–반응시간(y) 산점도에 직선을 그리세요.\n\n1. 진회색, 반투명한 점\n2. 검은 직선 + 회색 신뢰띠\n3. 축 이름', setup: ['languageR'], given: `library(languageR)`, checks: [
          { r: 'data_nrow() == 2284', m: 'young 참가자 행만 (`filter(AgeSubject == "young")`, 2,284행)' },
          { r: 'maps("x", "WrittenFrequency") && maps("y", "RTlexdec")', m: 'x = WrittenFrequency, y = RTlexdec' },
          { r: 'any(vapply(c("darkgray", "darkgrey", "gray40", "grey40", "gray30", "grey30", "dimgray", "dimgrey"), function(v) has_param("point", "colour", v), TRUE))', m: '점: 진회색 (`color = "darkgrey"`)' },
          { r: 'param_between("point", "alpha", 0.01, 0.9)', m: '점: 반투명 (`alpha`)' },
          { r: 'has_param("smooth", "method", "lm") && has_param("smooth", "colour", "black")', m: '검은 직선 (`method = "lm"`, `color = "black"`)' },
          { r: 'any(vapply(c("grey", "gray", "darkgrey", "darkgray", "grey50", "grey60", "grey70", "lightgrey", "lightgray"), function(v) has_param("smooth", "fill", v), TRUE))', m: '회색 띠 (`fill = "grey"`)' },
          { r: 'lab_set("x") && lab_set("y")', m: '축 이름 (`labs(x = , y = )`)' },
        ], sol: `english_young <- english %>%
  filter(AgeSubject == "young")

(ggplot(english_young, aes(WrittenFrequency, RTlexdec)) +
  geom_point(size = 3, alpha=0.2, color = "darkgrey") +
  geom_smooth(method = "lm", color = 'black', fill = "darkgrey") +
  labs(x= "Word frequency", y= "Reaction time (log msec)") +
  ggtitle("Young subjects only"))`, solNote: 'wk7 key 30–37행 그대로예요.' },
        { type: 'mcq', q: '스크립트 24행 "take-home point"로 알맞은 한 문장은?', opts: [
          { t: '자주 쓰이는 단어일수록 young 참가자가 더 빨리 알아본다 (빈도↑ → 반응시간↓)', ok: true, why: '직선이 오른쪽 아래로 내려가요.' },
          { t: '빈도가 높을수록 느리다', why: '선이 내려가요.' },
          { t: '빈도와 반응시간은 관계없다', why: '기울기가 뚜렷해요.' },
        ] },
      ],
    },
    {
      id: 'mlr-practice-age',
      title: '연습 2: 나이 집단과 반응시간 (jitter + 평균 점)',
      src: 'wk7 91–99행 Practice, 정답: wk7 key 101–105행',
      key: 'x가 범주형이면 점이 두 줄로 겹치니 `geom_jitter()`. 평균은 `stat_summary(fun = "mean", geom = "point", color = "deeppink")`. key는 4,568개 점이 평균 점을 가리지 않게 **아주 작고(size 0.25) 옅게(alpha 0.1)** 그렸다.',
      body: [
        '`stat_summary(fun = "mean", geom = "point")`는 x 범주마다 y의 평균을 계산해 점으로 찍어요 (J단원). 수업 파일이 안내한 블로그의 그 함수예요. `geom_jitter(width = 0.1, height = 0)`은 옆으로만 흔들어서 반응시간 값은 그대로 둬요.',
        { note: '지시문과 key가 다른 곳', kind: 'warn', t: '지시문에는 "Impose a straight smoothing line"이 있지만 **key에는 직선이 없어요.** 아래 채점에서도 직선은 선택 조건이에요. 그리고 싶다면 아래처럼 `aes(group = 1)`이 필요해요.' },
        '`geom_smooth(method = "lm")`은 **그룹마다** 선을 그어요. x가 범주형이면 old 칸, young 칸이 각각 별도 그룹이 되는데, 한 칸 안에는 x값이 하나뿐이라 선을 그을 수 없어요 → **경고도 없이 선이 안 나와요**. `aes(group = 1)`로 "전체를 한 그룹으로" 묶어야 old 평균과 young 평균을 잇는 직선이 그려져요.',
        { compare: [
          { label: '`group` 없이', code: `ggplot(english, aes(AgeSubject, RTlexdec)) +
  geom_jitter(alpha = 0.2, color = "darkgrey") +
  geom_smooth(method = "lm")` },
          { label: '`aes(group = 1)`', code: `ggplot(english, aes(AgeSubject, RTlexdec)) +
  geom_jitter(alpha = 0.2, color = "darkgrey") +
  geom_smooth(aes(group = 1), method = "lm")` },
        ] },
        '이 직선의 양 끝 높이가 바로 old 평균(6.661)과 young 평균(6.439)이에요. 즉 범주형 예측변수 회귀의 "기울기"는 두 평균 사이를 잇는 선의 기울기 = **평균의 차이**예요.',
      ],
      quiz: [
        { type: 'write', q: '스크립트 92–98행 Practice: `english`로 x = 나이 집단, y = 반응시간.\n\n1. 진회색(또는 key처럼 작고 옅은), 반투명, jitter된 점\n2. 각 나이 집단의 평균을 **deeppink** 점으로\n3. 축 이름 (key: "Subject age", "Reaction time (log msec)")', checks: [
          { r: 'maps("x", "AgeSubject") && maps("y", "RTlexdec")', m: 'x = AgeSubject, y = RTlexdec' },
          { r: 'data_nrow() == 4568', m: '`english` 전체 (old + young)' },
          { r: 'jittered()', m: '점을 jitter (`geom_jitter()`)' },
          { r: 'param_between("point", "alpha", 0.01, 0.9)', m: '흔든 점: 반투명' },
          { r: 'has_stat("summary") && has_param("point", "colour", "deeppink")', m: '평균 점: `stat_summary(fun = "mean", geom = "point", color = "deeppink")`' },
          { r: 'lab_set("x") && lab_set("y")', m: '축 이름' },
          { r: 'any(vapply(c("darkgray", "darkgrey", "gray40", "grey40", "gray30", "grey30"), function(v) has_param("point", "colour", v), TRUE))', m: '흔든 점: 진회색 (key는 색 대신 작고 옅은 점)', opt: true },
          { r: 'has_param("smooth", "method", "lm") && maps("group", "1", "smooth")', m: '직선 (`aes(group = 1)`, `method = "lm"`) — key에는 없어요', opt: true },
        ], sol: `english %>% ggplot(aes(AgeSubject, RTlexdec)) +
  geom_jitter(width = 0.1, height = 0, size = 0.25, alpha=0.1) +
  stat_summary(fun = 'mean', geom = 'point', color= 'deeppink', size = 3) +
  labs(x= "Subject age", y= "Reaction time (log msec)") +
  ggtitle("All subjects")`, solNote: 'wk7 key 101–105행 그대로예요. `stat_summary`를 마지막에 두어야 분홍 점이 다른 층에 가려지지 않아요.', tips: '[[s-mean|stat_summary() 레슨]], [[i-jitter|jitter 레슨]], [[u-group1|aes(group = 1) 레슨]]을 참고하세요.' },
        { type: 'mcq', q: '범주형 x에서 `geom_smooth(method = "lm")`만 쓰면 선이 안 나오는 이유는?', opts: [
          { t: 'x 수준마다 따로 그룹이 되는데, 한 그룹 안에 x값이 하나뿐이라 직선을 그을 수 없다', ok: true, why: '`aes(group = 1)`로 한 그룹으로 묶어요.' },
          { t: 'lm은 범주형 변수를 못 다룬다', why: '`lm(RTlexdec ~ AgeSubject)`처럼 잘 다뤄요. 문제는 ggplot의 그룹 나누기.' },
          { t: 'alpha가 너무 낮아서', why: '점 투명도와 선은 무관해요.' },
        ] },
        { type: 'mcq', q: '이 그림의 take-home point는?', opts: [
          { t: '젊은 집단이 나이 든 집단보다 반응이 빠르다', ok: true, why: 'young의 평균 점이 더 아래(짧은 RT)에 있어요.' },
          { t: '나이 든 집단이 더 빠르다', why: 'old 평균이 더 위(긴 RT)예요.' },
          { t: '집단 차이가 없다', why: '두 평균 점이 확실히 떨어져 있어요.' },
        ] },
      ],
    },
    {
      id: 'mlr-practice-mlr',
      title: '연습 3: 빈도 × 나이, 색 + 직선 두 개',
      src: 'wk7 119–124행 Practice, 정답: wk7 key 128–132행',
      key: '`color = AgeSubject`를 넣으면 점도 선도 집단별로 나뉜다. 이때 geom_smooth는 집단마다 **기울기를 따로** 구한다.',
      body: [
        '그림을 그려 보면 두 선이 거의 평행해요. 그런데 ggplot은 집단마다 따로 회귀를 해서 기울기도 따로 구해요. 이건 사실 `mlr_mod_1`(같은 기울기 강제)이 아니라 **상호작용 모델**과 같은 그림이에요([[mlr-interaction|상호작용 레슨]]). 기울기 차이가 0에 가까워서 평행해 보이는 거예요.',
      ],
      quiz: [
        { type: 'write', q: '스크립트 120–123행 Practice: x = 빈도, y = 반응시간. 두 나이 집단을 **다른 색**으로, 집단마다 **직선 추세선**을 하나씩.', checks: [
          { r: 'maps("x", "WrittenFrequency")', m: 'x = WrittenFrequency' },
          { r: 'maps("y", "RTlexdec")', m: 'y = RTlexdec' },
          { r: 'data_nrow() == 4568', m: '`english` 전체' },
          { r: 'has_geom("point")', m: '점 층' },
          { r: 'maps("colour", "AgeSubject", "point")', m: '점 색 = AgeSubject' },
          { r: 'has_param("smooth", "method", "lm")', m: '직선 (`method = "lm"`)' },
          { r: 'maps("colour", "AgeSubject", "smooth")', m: '선도 집단별 색 → 직선 두 개' },
          { r: 'param_between("point", "alpha", 0.01, 0.99)', m: '반투명한 점 (4,568개라 겹쳐요)', opt: true },
        ], sol: `english %>%
  ggplot(aes(WrittenFrequency, RTlexdec, color = AgeSubject)) +
  geom_point(size = 0.2, alpha=0.5) +
  geom_smooth(method = "lm") +
  labs(x = "Frequency", y = "Reaction time (log msec)")`, solNote: 'wk7 key 128–132행 그대로예요.' },
        { type: 'mcq', q: '두 직선이 거의 **평행**하다는 것의 뜻은?', opts: [
          { t: '빈도 효과(기울기)는 두 집단에서 비슷하고, 집단 차이(높이 차)는 빈도와 관계없이 일정하다', ok: true, why: '[[mlr-mlr|다중 회귀]]·[[mlr-interaction|상호작용]] 레슨의 표가 이걸 숫자로 확인해요.' },
          { t: '두 집단의 반응시간이 같다', why: '높이가 달라요 (young이 아래).' },
          { t: '빈도 효과가 없다', why: '두 선 모두 내려가요.' },
        ] },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'reg-plot', src: 'wk7 연습', title: '1. young 빈도–반응시간 직선' },
  { lesson: 'mlr-practice-age', src: 'wk7 연습', title: '2. 나이 집단과 평균 점' },
  { lesson: 'mlr-practice-mlr', src: 'wk7 연습', title: '3. 빈도 × 나이, 직선 두 개' },
);
