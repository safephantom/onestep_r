/* 단원 mlr: wk7 뒷부분 — 범주형 예측변수, 다중 회귀, 상호작용, plot_model */
(function () {

RS.setups.age = `slr_mod_age <- lm(RTlexdec ~ AgeSubject, data = english)`;
RS.setups.mlr1 = `mlr_mod_1 <- lm(RTlexdec ~ WrittenFrequency + AgeSubject, data = english)`;
RS.setups.mlr3 = `mlr_mod_3 <- lm(RTlexdec ~ WrittenFrequency*AgeSubject, data = english)`;
RS.setups.sjplot = `library(sjPlot)`;

const SUM_AGE = `Call:
lm(formula = RTlexdec ~ AgeSubject, data = english)

Residuals:
     Min       1Q   Median       3Q      Max
-0.25776 -0.08339 -0.01669  0.06921  0.52685

Coefficients:
                 Estimate Std. Error t value Pr(>|t|)
(Intercept)      6.660958   0.002324 2866.44   <2e-16 ***
AgeSubjectyoung -0.221721   0.003286  -67.47   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.1111 on 4566 degrees of freedom
Multiple R-squared:  0.4992,\tAdjusted R-squared:  0.4991
F-statistic:  4552 on 1 and 4566 DF,  p-value: < 2.2e-16`;

const SUM_MLR1 = `Call:
lm(formula = RTlexdec ~ WrittenFrequency + AgeSubject, data = english)

Residuals:
     Min       1Q   Median       3Q      Max
-0.34622 -0.06029 -0.00722  0.05178  0.44999

Coefficients:
                   Estimate Std. Error t value Pr(>|t|)
(Intercept)       6.8467921  0.0039792 1720.64   <2e-16 ***
WrittenFrequency -0.0370103  0.0007033  -52.62   <2e-16 ***
AgeSubjectyoung  -0.2217215  0.0025930  -85.51   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.08763 on 4565 degrees of freedom
Multiple R-squared:  0.6883,\tAdjusted R-squared:  0.6882
F-statistic:  5040 on 2 and 4565 DF,  p-value: < 2.2e-16`;

const SUM_MLR3 = `Call:
lm(formula = RTlexdec ~ WrittenFrequency * AgeSubject, data = english)

Residuals:
     Min       1Q   Median       3Q      Max
-0.34664 -0.06021 -0.00713  0.05190  0.45019

Coefficients:
                                   Estimate Std. Error  t value Pr(>|t|)
(Intercept)                       6.8463068  0.0053210 1286.669   <2e-16 ***
WrittenFrequency                 -0.0369136  0.0009948  -37.107   <2e-16 ***
AgeSubjectyoung                  -0.2207510  0.0075250  -29.336   <2e-16 ***
WrittenFrequency:AgeSubjectyoung -0.0001933  0.0014068   -0.137    0.891
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.08764 on 4564 degrees of freedom
Multiple R-squared:  0.6883,\tAdjusted R-squared:  0.6881
F-statistic:  3359 on 3 and 4564 DF,  p-value: < 2.2e-16`;

RS.units.push({
  id: 'mlr',
  title: '범주형 예측변수 · 다중 회귀 · 상호작용',
  short: 'old/young 더미 코딩과 기준 수준, lm = t검정, y ~ x1 + x2, 상호작용 x1:x2와 x1*x2, plot_model 예측 그림',
  desc: '`wk7_linear reg intro_rmld_freq.R` 91–154행. 이번엔 old·young **둘 다** 쓰는 `english` 전체(4,568행)에서 나이 집단의 효과, 빈도와 나이를 함께 넣은 모델, 그리고 "빈도 효과가 나이에 따라 다른가"(상호작용)를 봐요.',
  setup: 'english',
  lessons: [
    {
      id: 'mlr-factor',
      title: '범주형 예측변수: Intercept = 기준 수준의 평균',
      src: 'wk7 106–108행',
      key: '예측변수가 범주(old/young)면 R은 **기준 수준(reference level)** 하나를 정한다(알파벳 순 첫 번째 = old). **Intercept = old의 평균**, `AgeSubjectyoung` = **young − old 차이**.',
      setup: ['english', 'age'],
      body: [
        { code: `slr_mod_age <- lm(RTlexdec ~ AgeSubject, data = english)
summary(slr_mod_age)`, run: false },
        { anno: SUM_AGE, marks: [
          { s: '(Intercept)', t: '**기준 수준 old의 평균** log RT = 6.661. (범주형만 있으면 "x = 0" = "기준 수준"이에요.)' },
          { s: 'AgeSubjectyoung', t: '이름 = **변수 이름 + 수준 이름**. "young이면 1, old면 0"인 표시 변수(더미 변수)를 R이 몰래 만들어서 그 기울기를 구한 거예요.' },
          { s: '-0.221721', t: '**young − old = −0.222**. young이 old보다 log RT가 0.222 짧다(빠르다). young 평균 = 6.661 − 0.222 = 6.439.' },
          { s: '-67.47', t: '두 집단 차이의 t. p < 2e-16 → 나이 차이는 유의.' },
          { s: 'Multiple R-squared:  0.4992', t: '나이 집단 하나로 반응시간 변동의 **약 50%**를 설명. 나이 차이가 아주 크다는 뜻.' },
        ] },
        { table: { head: ['AgeSubject', '더미 `AgeSubjectyoung`', '예측값 = 6.660958 + (−0.221721) × 더미'], rows: [
          ['old (기준)', '0', '6.660958 + 0 = **6.661**'],
          ['young', '1', '6.660958 − 0.221721 = **6.439**'],
        ] } },
        { code: `levels(english$AgeSubject)`, cap: 'factor의 첫 번째 수준이 기준이 돼요. 기본은 알파벳 순 (o < y).' },
        { note: '기준 수준 바꾸기 미리 보기', kind: 'tip', t: 'young을 기준으로 하고 싶으면 `mutate(AgeSubject = fct_relevel(AgeSubject, "young"))`(X단원 forcats)나 `relevel(AgeSubject, "young")`(wk8)을 쓰면 돼요. 그러면 Intercept = young 평균, 계수 이름 = `AgeSubjectold`(+0.222). wk8에서 자세히 → [[neut-relevel|relevel 레슨]].' },
        { note: '참고: ms로', kind: 'tip', t: '`exp(6.661)` ≈ 781 ms (old), `exp(6.439)` ≈ 626 ms (young). `exp(-0.2217)` = 0.80 → young의 반응시간이 old의 약 80%.' },
      ],
      quiz: [
        { type: 'mcq', q: '이 모델의 Intercept `6.660958`은?', opts: [
          { t: 'old 집단의 평균 log RT', ok: true, why: '기준 수준(old)의 평균.' },
          { t: '전체 4,568행의 평균 log RT', why: '전체 평균은 6.550이에요.' },
          { t: 'young 집단의 평균', why: 'young은 기준이 아니라서 Intercept + AgeSubjectyoung.' },
        ] },
        { type: 'fill', q: 'young 평균 log RT를 표에서 계산하세요.', code: 'young 평균 = 6.660958 + (▢)', ans: [['-0.221721', '-0.2217', '-0.222', '-0.22172']], why: '= 6.439237. t.test 결과의 "mean in group young"과 같아요.' },
        { type: 'mcq', q: '계수 이름이 `AgeSubjectold`가 아니라 `AgeSubjectyoung`인 이유는?', opts: [
          { t: 'old가 기준 수준이라서, 기준이 아닌 young에 0/1 표시 변수가 생겼다', ok: true, why: '기준 수준은 Intercept 안에 들어가 있어요.' },
          { t: 'young이 데이터에 먼저 나와서', why: '데이터 순서가 아니라 factor 수준 순서(알파벳)예요.' },
          { t: 'young의 효과가 더 커서', why: '크기와 무관해요.' },
        ] },
      ],
    },
    {
      id: 'mlr-ttest',
      title: 'lm(y ~ 집단) = t.test(): 같은 검정',
      src: 'wk7 112–113행',
      key: '두 집단 비교에서 `lm(y ~ 집단)`과 `t.test(y ~ 집단, var.equal = TRUE)`는 **같은 검정**. t의 부호만 반대(t.test는 old − young 방향).',
      body: [
        { code: `t.test(RTlexdec ~ AgeSubject, data = english, var.equal = TRUE)` },
        { table: { head: ['', '`lm` (summary)', '`t.test`'], rows: [
          ['차이', 'young − old = −0.221721', 'old − young: 6.660958 − 6.439237 = 0.221721'],
          ['t', '−67.47', '67.468 (부호만 반대)'],
          ['df', '4566 (잔차 자유도)', '4566'],
          ['p', '< 2e-16', '< 2.2e-16'],
          ['기준 집단 평균', 'Intercept 6.660958', 'mean in group old 6.660958'],
        ] } },
        '- `var.equal = TRUE`: 두 집단의 퍼짐(분산)이 같다고 가정. lm도 잔차 표준오차를 **하나**만 쓰니까 같은 가정이에요.\n- 이 옵션을 빼면 Welch t검정이 돼서 df가 4534.6으로 바뀌고 lm과 조금 달라져요.\n- 그래서 회귀는 "t검정의 일반화"예요: 예측변수를 더 넣거나 숫자 변수를 섞을 수 있어요.',
      ],
      quiz: [
        { type: 'mcq', q: 'lm은 t = −67.47, t.test는 t = 67.468. 왜 부호가 다를까요?', opts: [
          { t: '빼는 방향이 반대다 (lm: young − old, t.test: old − young)', ok: true, why: '검정 자체는 같아요.' },
          { t: '둘 중 하나가 틀렸다', why: '같은 검정을 다른 방향으로 표현했을 뿐.' },
          { t: 'var.equal = TRUE 때문', why: '그 옵션은 df에 영향을 줘요. 부호는 방향 문제.' },
        ] },
        { type: 'tf', q: '`var.equal = TRUE`를 빼도 df는 4566 그대로다.', ans: false, why: 'Welch 검정이 되면서 df = 4534.6.' },
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
      id: 'mlr-mlr',
      title: '다중 회귀: y ~ x1 + x2',
      src: 'wk7 119–135행',
      key: '`y ~ x1 + x2`에서 각 계수는 **다른 예측변수를 고정했을 때**의 효과. 이 모델은 old·young에 **기울기가 같은(평행한) 직선 두 개**를 긋는다.',
      setup: ['english', 'mlr1'],
      body: [
        { code: `mlr_mod_1 <- lm(RTlexdec ~ WrittenFrequency + AgeSubject, data = english)
summary(mlr_mod_1)`, run: false },
        { anno: SUM_MLR1, marks: [
          { s: '(Intercept)', t: '**모든 예측변수가 0/기준일 때**: old 집단 + 빈도 0인 단어의 예측 log RT = 6.847.' },
          { s: '-0.0370103', label: 'WrittenFrequency  −0.0370103', t: '**나이 집단을 고정했을 때**(같은 집단 안에서) 빈도 1 증가 → log RT 0.037 감소. 두 집단 **공통** 기울기.' },
          { s: '-0.2217215', label: 'AgeSubjectyoung  −0.2217215', t: '**빈도가 같은 단어끼리 비교하면** young이 old보다 0.222 빠르다. 어느 빈도에서든 같은 차이(평행선 간격).' },
          { s: '4565 degrees of freedom', t: '4,568행 − 계수 3개.' },
          { s: 'Multiple R-squared:  0.6883', t: '나이만(0.499) 또는 빈도만 넣었을 때보다 커져서 **68.8%**. 두 변수가 각자 다른 부분을 설명해요.' },
          { s: 'on 2 and 4565 DF', t: 'F의 첫 자유도 = 예측변수 계수 2개.' },
        ] },
        { table: { head: ['집단', '직선의 식 (예측 RTlexdec)'], rows: [
          ['old (기준)', '6.8468 − 0.0370 × WrittenFrequency'],
          ['young', '(6.8468 − 0.2217) − 0.0370 × WrittenFrequency = 6.6251 − 0.0370 × WrittenFrequency'],
        ] } },
        '기울기가 똑같으니 두 직선은 **평행**하고, 간격은 어디서나 0.2217이에요.',
        { note: '관찰: 나이 계수가 그대로인 이유', kind: 'tip', t: '`AgeSubjectyoung`이 나이만 넣은 모델(−0.221721)과 거의 같아요. 이 데이터에선 **모든 단어가 두 집단에 똑같이** 들어 있어서 빈도와 나이가 서로 무관하기 때문이에요. 대신 SE는 0.003286 → 0.002593으로 작아졌어요: 빈도가 잡음의 일부를 설명해서 남은 잡음(RSE 0.1111 → 0.0876)이 줄었거든요.' },
        { code: `confint(mlr_mod_1)`, cap: '135행: 세 계수 모두 신뢰구간에 0이 없어요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`WrittenFrequency` −0.0370의 올바른 해석은?', opts: [
          { t: '나이 집단이 같을 때, 빈도 1 증가 → log RT 0.037 감소', ok: true, why: '다중 회귀의 계수는 "다른 변수를 고정했을 때".' },
          { t: 'old 집단에서만 빈도 효과가 −0.037', why: '상호작용이 없는 모델이라 두 집단 공통이에요.' },
          { t: '빈도가 반응시간 변동의 3.7%를 설명', why: '설명 비율은 R²예요.' },
        ] },
        { type: 'mcq', q: 'Intercept 6.8468은 누구의 예측값인가요?', opts: [
          { t: 'old 집단, WrittenFrequency = 0인 단어', ok: true, why: '숫자 예측변수 = 0, 범주형 = 기준 수준.' },
          { t: 'young 집단, 평균 빈도 단어', why: 'young은 기준이 아니고, 빈도도 0이에요.' },
          { t: '전체 평균', why: '절편은 평균이 아니에요.' },
        ] },
        { type: 'fill', q: 'young 집단, WrittenFrequency = 0인 단어의 예측값', code: '6.8467921 + (▢)', ans: [['-0.2217215', '-0.2217', '-0.222', '-0.22172']], why: '= 6.6251. young 직선의 절편.' },
      ],
    },
    {
      id: 'mlr-practice-mlr',
      title: '연습 3: 빈도 × 나이, 색 + 직선 두 개',
      src: 'wk7 119–124행 Practice, 정답: wk7 key 128–132행',
      key: '`color = AgeSubject`를 넣으면 점도 선도 집단별로 나뉜다. 이때 geom_smooth는 집단마다 **기울기를 따로** 구한다.',
      body: [
        '그림을 그려 보면 두 선이 거의 평행해요. 그런데 ggplot은 집단마다 따로 회귀를 해서 기울기도 따로 구해요. 이건 사실 `mlr_mod_1`(같은 기울기 강제)이 아니라 다음 레슨의 **상호작용 모델**과 같은 그림이에요. 상호작용 모델에서 기울기 차이가 0에 가까웠기 때문에 평행해 보이는 거예요.',
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
          { t: '빈도 효과(기울기)는 두 집단에서 비슷하고, 집단 차이(높이 차)는 빈도와 관계없이 일정하다', ok: true, why: '다음 두 레슨의 다중 회귀·상호작용 모델이 이걸 숫자로 확인해요.' },
          { t: '두 집단의 반응시간이 같다', why: '높이가 달라요 (young이 아래).' },
          { t: '빈도 효과가 없다', why: '두 선 모두 내려가요.' },
        ] },
      ],
    },
    {
      id: 'mlr-interaction',
      title: '상호작용: 기울기가 집단마다 다른가? (x1:x2, x1*x2)',
      src: 'wk7 138–145행',
      key: '**상호작용 항 `x1:x2` = x1의 기울기가 x2 수준에 따라 얼마나 달라지는가.** `x1 * x2`는 `x1 + x2 + x1:x2`의 줄임말.',
      setup: ['english', 'mlr3'],
      body: [
        { code: `mlr_mod_2 <- lm(RTlexdec ~ WrittenFrequency + AgeSubject +
                WrittenFrequency:AgeSubject, data = english)
mlr_mod_3 <- lm(RTlexdec ~ WrittenFrequency*AgeSubject, data = english)`, run: false, cap: '139–143행: 두 모델은 쓰는 법만 다르고 결과가 완전히 같아요.' },
        { anno: SUM_MLR3, cap: '`summary(mlr_mod_3)` (mlr_mod_2와 동일)', marks: [
          { s: '(Intercept)', t: 'old 집단, 빈도 0의 예측값 6.8463. **old 직선의 절편.**' },
          { s: '-0.0369136', label: 'WrittenFrequency  −0.0369136', t: '⚠ **old 집단(기준 수준)의 기울기**. "빈도 효과 전체"가 아니에요! 상호작용이 있는 모델에선 이 행이 "상대 변수가 기준일 때"의 효과가 돼요.' },
          { s: '-0.2207510', label: 'AgeSubjectyoung  −0.2207510', t: '⚠ **빈도 = 0인 지점에서의** young − old 차이. 빈도 0은 데이터의 끝자락이라 SE(0.0075)가 mlr_mod_1(0.0026)보다 커요.' },
          { s: 'WrittenFrequency:AgeSubjectyoung', t: '**상호작용**: young 기울기 − old 기울기 = −0.0002. young에서 빈도 효과가 0.0002만큼 더 가파르다… 는 거의 0.' },
          { s: '0.891', t: 'p = .891 → 기울기 차이는 **유의하지 않다**. 빈도 효과는 두 나이 집단에서 다르다고 할 근거가 없다.' },
          { s: 'Multiple R-squared:  0.6883', t: 'mlr_mod_1과 같은 R². 상호작용 항이 더 설명하는 게 없어요.' },
          { s: 'Adjusted R-squared:  0.6881', t: '0.6882 → **0.6881로 오히려 내려감**. 쓸모없는 항을 넣은 벌점이에요 (수정 R²의 존재 이유).' },
        ] },
        { table: { head: ['집단', '절편', '기울기'], rows: [
          ['old (기준)', '6.8463068', '−0.0369136'],
          ['young', '6.8463068 + (−0.2207510) = **6.6255558**', '−0.0369136 + (−0.0001933) = **−0.0371069**'],
        ] } },
        'young의 절편과 기울기가 [[reg-coef-est|young만으로 만든 slr_mod_freq1]]의 6.6255559, −0.0371069와 **똑같아요**. 상호작용 모델 = **집단마다 직선을 따로 그린 것**이에요. 그래서 앞 레슨 ggplot의 집단별 직선 두 개와 같은 그림이 돼요.',
        { note: '시험에 나오기 좋은 함정', kind: 'warn', t: '상호작용이 있는 모델에서 `WrittenFrequency` 행의 p < 2e-16을 보고 "빈도 효과는 (모든 집단에서) 유의하다"고 쓰면 틀려요. 이 행은 **old의 기울기**에 대한 검정이에요. young의 기울기는 두 줄을 더해야 나와요. wk8에서 기준을 바꿔 가며 확인해요 → [[neut-relevel2|기준을 둘 다 바꾸면]].' },
      ],
      quiz: [
        { type: 'mcq', q: '상호작용 항 −0.0001933 (p = .891)의 해석은?', opts: [
          { t: '빈도 효과(기울기)가 old와 young에서 다르다는 증거가 없다', ok: true, why: '기울기 차이가 거의 0이고 유의하지 않아요.' },
          { t: '빈도 효과가 없다', why: '빈도 효과(기울기 −0.037)는 뚜렷해요. 차이가 없을 뿐.' },
          { t: '나이 효과가 없다', why: '나이 차이는 다른 행이에요.' },
        ] },
        { type: 'fill', q: 'young의 기울기를 표에서 계산하세요.', code: 'young 기울기 = −0.0369136 + (▢)', ans: [['-0.0001933', '-0.000193', '−0.0001933']], why: '= −0.0371069. young만으로 한 회귀와 같아요.' },
        { type: 'mcq', q: '`y ~ A*B`와 같은 모델은?', opts: [
          { t: '`y ~ A + B + A:B`', ok: true, why: '`*` = 각각 + 상호작용.' },
          { t: '`y ~ A:B`', why: '상호작용 항만 넣으면 다른 모델이에요.' },
          { t: '`y ~ A + B`', why: '상호작용이 빠졌어요.' },
        ] },
        { type: 'mcq', q: '이 모델에서 `AgeSubjectyoung` −0.2208은?', opts: [
          { t: '빈도 = 0인 지점에서의 young − old 차이', ok: true, why: '상호작용이 있으면 "상대 변수 = 0(기준)일 때"의 차이.' },
          { t: '모든 빈도에서 young − old 차이', why: '그건 상호작용이 없는 mlr_mod_1의 해석이에요.' },
          { t: 'young의 기울기', why: '기울기는 WrittenFrequency + 상호작용.' },
        ] },
      ],
    },
    {
      id: 'mlr-plotmodel',
      title: 'plot_model(type = "pred"): 모델이 예측한 값 그리기',
      src: 'wk7 149–153행',
      key: '`plot_model(모델, type = "pred", terms = ...)`는 **모델의 예측값**과 95% 신뢰구간을 그린다. **terms에 없는 변수는 고정**: 범주형 → 기준 수준, 숫자 → 평균.',
      setup: ['english', 'mlr3', 'sjplot'],
      body: [
        { code: `plot_model(mlr_mod_3, type="pred", terms=c("WrittenFrequency"))`, cap: '150행: 선 하나 = **old**(AgeSubject의 기준 수준)의 예측. 빈도 0에서 6.846.' },
        { code: `plot_model(mlr_mod_3, type="pred", terms=c("AgeSubject"))`, cap: '151행: 빈도를 **평균(5.02)**에 고정한 두 집단의 예측: old 6.661, young 6.439.' },
        { code: `plot_model(mlr_mod_3, type="pred", terms=c("WrittenFrequency","AgeSubject"))`, cap: '152행: 첫 번째 terms = **x축**, 두 번째 = **색(집단)**. 직선 두 개.' },
        { code: `plot_model(mlr_mod_3, type="pred", terms=c("AgeSubject","WrittenFrequency"))`, cap: '153행: 숫자 변수가 두 번째(색)로 가면 대표값 세 개로 나눠요: 평균 − 1SD(3.18), 평균(5.02), 평균 + 1SD(6.86).' },
        '이렇게 **다른 변수는 고정해 두고 한 변수의 효과만** 보여 주는 그림을 partial effect plot(부분 효과 그림)이라고 해요. 원자료의 산점도가 아니라 **모델이 계산한 직선**이에요.',
      ],
      quiz: [
        { type: 'mcq', q: '`terms = "WrittenFrequency"`만 줬을 때 그려진 선은 어느 집단의 예측?', opts: [
          { t: 'old (AgeSubject의 기준 수준)', ok: true, why: 'terms에 없는 범주형 변수는 기준 수준에 고정돼요.' },
          { t: 'old와 young의 평균', why: '평균 내지 않고 기준 수준을 써요.' },
          { t: 'young', why: 'young은 기준이 아니에요.' },
        ] },
        { type: 'mcq', q: '`terms = c("WrittenFrequency", "AgeSubject")`를 `c("AgeSubject", "WrittenFrequency")`로 바꾸면?', opts: [
          { t: 'x축과 색(그룹)의 역할이 바뀐다', ok: true, why: '첫 번째 = x축, 두 번째 = 그룹.' },
          { t: '아무것도 안 바뀐다', why: '순서가 역할을 정해요.' },
          { t: '모델이 바뀐다', why: '모델(mlr_mod_3)은 그대로, 그림만 달라요.' },
        ] },
        { type: 'mcq', q: '153행 그림의 색 3.18 · 5.02 · 6.86은?', opts: [
          { t: 'WrittenFrequency의 평균 − 1SD, 평균, 평균 + 1SD', ok: true, why: '숫자 변수를 그룹으로 쓸 때의 대표값.' },
          { t: '실제 단어 세 개의 빈도', why: '모델로 계산한 대표 지점이에요.' },
          { t: '반응시간', why: '반응시간은 y축이에요.' },
        ] },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'mlr-practice-age', src: 'wk7 Practice', title: '나이 집단 jitter + 평균점 + 직선' },
  { lesson: 'mlr-practice-mlr', src: 'wk7 Practice', title: '나이별 색 + 직선 두 개' },
);

})();
