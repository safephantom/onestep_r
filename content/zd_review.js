/* 단원 rev: wk7–8 종합 — 회귀 표 해석 정리와 연습 */
(function () {

RS.units.push({
  id: 'rev',
  title: '종합: 회귀 표 해석 (중간고사 대비)',
  short: 'Intercept 총정리, summary() 한 장 요약, 보고 문장, wk7–8 모델을 섞은 해석 문제',
  desc: 'wk7–8 회귀 단원 세 개에서 본 모델 9개를 한자리에 모아 "이 숫자는 무엇의 값인가"를 정리하고, 섞어서 풀어 봐요.',
  lessons: [
    {
      id: 'rev-intercept',
      title: 'Intercept 총정리: 모델마다 무엇의 값인가',
      src: 'wk7·wk8 모델 전체',
      key: '**Intercept = 모든 숫자 예측변수가 0이고, 모든 범주형 예측변수가 기준 수준일 때의 예측값.** 모델이 바뀌면 "0"과 "기준"이 가리키는 대상이 바뀐다.',
      body: [
        { table: { head: ['모델', 'Intercept', '무엇의 예측값인가'], rows: [
          ['`RTlexdec ~ WrittenFrequency` (young)', '6.6256', '빈도 0(= 1번)인 단어'],
          ['`RTlexdec ~ WrittenFrequency2` (빈도 − 3)', '6.5142', '원래 빈도 3인 단어'],
          ['`RTlexdec ~ AgeSubject`', '6.6610', '**old**(기준) 집단의 평균'],
          ['`RTlexdec ~ WrittenFrequency + AgeSubject`', '6.8468', 'old 집단 + 빈도 0인 단어'],
          ['`RTlexdec ~ WrittenFrequency * AgeSubject`', '6.8463', 'old 집단 + 빈도 0 (= old 직선의 절편)'],
          ['`vowel_dur ~ voicing` (기본)', '160.241', '**voiced**(알파벳 순 기준) 평균'],
          ['`vowel_dur ~ voicing` (relevel voiceless)', '151.209', 'voiceless 평균'],
          ['`vowel_dur ~ boundary * voicing` (no, voiceless)', '144.566', 'voiceless + 경계 없음 칸의 평균'],
          ['`vowel_dur ~ boundary * voicing` (yes, voiceless)', '164.656', 'voiceless + 경계 있음 칸의 평균'],
        ] } },
        '**읽는 순서**: ① 숫자 예측변수는 0이 어디인가(중심화했나?) ② 범주형 예측변수의 기준 수준은 무엇인가(계수 이름에 **안 보이는** 수준이 기준) ③ 그 조건에서의 예측값 = Intercept.',
        { note: '기준 수준 찾는 요령', kind: 'tip', t: '계수 이름 `voicingvoiced`가 보이면 기준은 그 반대인 **voiceless**, `AgeSubjectyoung`이 보이면 기준은 **old**. 이름에 붙은 쪽이 "기준이 아닌 쪽"이에요.' },
      ],
      quiz: [
        { type: 'mcq', q: '계수 표에 `(Intercept)`, `prosodic_boundaryno`, `voicingvoiced`, `prosodic_boundaryno:voicingvoiced`가 있다. Intercept는 어느 칸의 평균?', opts: [
          { t: '경계 있음(yes) + voiceless', ok: true, why: '이름에 no와 voiced가 붙어 있으니 기준은 yes와 voiceless.' },
          { t: '경계 없음(no) + voiced', why: '이름에 붙은 쪽은 기준이 아닌 쪽이에요.' },
          { t: '전체 평균', why: '절편은 기준 칸의 값이에요.' },
        ] },
        { type: 'mcq', q: '`lm(RTlexdec ~ WrittenFrequency + AgeSubject)`의 Intercept는?', opts: [
          { t: 'old 집단에서 빈도 0인 단어의 예측 log RT', ok: true, why: '숫자 = 0, 범주 = 기준.' },
          { t: 'old 집단의 평균 log RT', why: '빈도가 들어가 있어서 "빈도 0일 때"가 돼요.' },
          { t: 'young 집단에서 빈도 0인 단어', why: 'young은 기준이 아니에요.' },
        ] },
        { type: 'tf', q: '예측변수에서 상수를 빼서(중심화) 다시 회귀하면 Intercept의 p값도 바뀔 수 있다.', ans: true, why: '절편이 가리키는 지점이 바뀌니 그 값·SE·t·p가 모두 바뀌어요. 기울기의 검정은 그대로.' },
      ],
    },
    {
      id: 'rev-sheet',
      title: 'summary() 한 장 요약과 보고 문장',
      src: 'wk7–8 회귀 단원 정리',
      key: '표를 읽는 순서: **Call(무엇을 예측?) → 기준 수준 → Estimate(방향·크기) → p(유의?) → R²(얼마나 설명?)**.',
      body: [
        { table: { head: ['출력', '뜻', '이렇게 읽는다'], rows: [
          ['Call', '공식과 데이터', '반응변수와 그 **단위**(로그인가?) 확인'],
          ['Residuals', '실제 − 예측의 분포', 'Median ≈ 0, 1Q·3Q가 대칭이면 양호'],
          ['Estimate (Intercept)', '숫자 = 0, 범주 = 기준일 때의 예측값', '[[rev-intercept|Intercept 총정리]]'],
          ['Estimate (기울기 / 범주 행)', 'x가 1 늘 때(또는 기준 → 그 수준일 때) y의 변화', '부호 = 방향, 크기 = 효과 (단위 붙여서)'],
          ['Estimate (상호작용 a:b)', 'a의 효과가 b 수준에 따라 달라지는 양', '"차이의 차이" / 기울기의 차이'],
          ['Std. Error', '추정값의 흔들림', '작을수록 정밀'],
          ['t value', 'Estimate ÷ SE', '|t| > 약 2면 대략 p < .05'],
          ['Pr(>|t|)', '진짜 값이 0이라면 이런 t가 나올 확률', '< .05 → 유의 (`*`)'],
          ['Residual standard error', '예측이 보통 빗나가는 정도 (y 단위)', '같은 y끼리 비교'],
          ['Multiple R²', '설명된 변동의 비율', '0.41 = 41% 설명'],
          ['Adjusted R²', '예측변수 개수 벌점', '쓸모없는 항을 넣으면 내려감'],
          ['F-statistic, p', '예측변수 없는 모델보다 나은가', '예측변수 하나면 F = t²'],
          ['confint()', '계수의 95% 신뢰구간', '0을 포함하지 않으면 p < .05'],
        ] } },
        { note: '보고 문장 틀', kind: 'src', t: '"[예측변수]가 [반응변수]에 유의한 [방향] 효과를 보였다 (β = [Estimate], SE = [SE], t = [t], p [< .001 / = .004])."\n\n- wk7: 단어 빈도가 높을수록 반응시간이 유의하게 짧았다 (β = −0.037, SE = 0.0009, t = −40.15, p < .001). 모델은 반응시간 변동의 41%를 설명했다 (R² = .41).\n- wk8: voicing과 운율 경계의 상호작용이 유의했다 (β = 12.97, SE = 6.53, t = 1.99, p = .047). 경계 앞에서는 voiced 앞 모음이 18.7 ms 길었지만(p < .001), 경계가 없을 때는 차이가 5.7 ms로 유의하지 않았다(p = .12).' },
      ],
      quiz: [
        { type: 'order', q: '처음 보는 회귀 표를 읽는 순서로 놓으세요.', lines: [
          'Call에서 반응변수와 단위 확인',
          '범주형 예측변수의 기준 수준 확인',
          'Estimate의 부호와 크기 읽기',
          'Pr(>|t|)로 유의성 확인',
          'R²로 모델 전체 설명력 확인',
        ], why: '무엇을, 어디를 기준으로 → 얼마나 → 확실한가 → 전체적으로 얼마나.' },
        { type: 'mcq', q: '보고 문장 "β = −0.037, SE = 0.0009, t = −40.15"에서 t를 검산하면?', opts: [
          { t: '−0.037 ÷ 0.0009 ≈ −41 (반올림 차이로 −40.15와 비슷)', ok: true, why: 't = Estimate ÷ SE.' },
          { t: '−0.037 × 0.0009', why: '곱이 아니라 나눗셈이에요.' },
          { t: '0.0009 ÷ −0.037', why: '분자·분모가 바뀌었어요.' },
        ] },
      ],
    },
    {
      id: 'rev-drill',
      title: '해석 연습: wk7–8 모델 섞어 풀기',
      src: 'wk7–8 회귀 단원 모델',
      key: '숫자를 보면 "**어느 조건에서**, **무엇과 무엇의 차이**인가"부터 말해 보기.',
      body: [
        '아래 문제는 앞에서 본 실제 출력의 숫자를 그대로 써요. 헷갈리면 해당 레슨 링크로 돌아가 표를 다시 보세요: [[reg-map|단순 회귀]], [[mlr-mlr|다중 회귀]], [[mlr-interaction|빈도 × 나이]], [[neut-inter|voicing × 경계]], [[neut-relevel2|기준 바꾸기]].',
      ],
      quiz: [
        { type: 'mcq', q: '`mlr_mod_1` (빈도 + 나이): `AgeSubjectyoung` = −0.2217. 올바른 해석은?', opts: [
          { t: '빈도가 같은 단어끼리 비교하면 young이 old보다 log RT가 0.222 짧다', ok: true, why: '다중 회귀 = 다른 변수 고정.' },
          { t: 'young의 평균 log RT가 −0.222다', why: '차이지 평균이 아니에요.' },
          { t: '빈도가 0일 때만 young이 0.222 빠르다', why: '상호작용이 없는 모델이라 모든 빈도에서 같은 차이예요.' },
        ] },
        { type: 'mcq', q: '빈도 × 나이 상호작용 모델에서 `WrittenFrequency` 행이 p < 2e-16이다. 맞는 결론은?', opts: [
          { t: 'old 집단에서 빈도 효과(기울기)가 유의하다', ok: true, why: '상호작용 모델의 단독 행 = 기준 수준(old)에서의 효과.' },
          { t: '빈도 효과는 모든 집단에서 유의하다', why: '이 행만으로는 young의 기울기를 검정하지 않아요.' },
          { t: '빈도와 나이의 상호작용이 유의하다', why: '상호작용은 `WrittenFrequency:AgeSubjectyoung` 행(p = .891).' },
        ] },
        { type: 'fill', q: '`mlr_mod_3` (voicing × 경계, 기준 voiceless·no): voiced + 경계 없음 칸의 평균', code: '144.566 + ▢ = 150.252', ans: [['5.686']], why: 'voicing 행만 더해요. 경계는 기준(no)이라 경계 행·상호작용 행은 0.' },
        { type: 'mcq', q: '상호작용 항을 넣었더니 Multiple R²는 그대로(0.6883)이고 Adjusted R²는 0.6882 → 0.6881로 내려갔다. 이것이 뜻하는 것은?', opts: [
          { t: '상호작용 항이 설명을 거의 보태지 못했다', ok: true, why: 'R²는 항을 넣으면 줄지 않고, 수정 R²는 쓸모없는 항에 벌점을 줘요.' },
          { t: '계산 오류', why: '정상이에요.' },
          { t: '상호작용이 유의하다', why: '유의성은 그 행의 p(.891)로 봐요.' },
        ] },
        { type: 'mcq', q: '`vowel_dur ~ voicing` 모델: p = .004, R² = 0.011. 가장 적절한 요약은?', opts: [
          { t: 'voicing에 따른 모음 길이 차이는 작지만(9 ms) 우연이라 보기 어렵다', ok: true, why: '유의성(p)과 설명력(R²)은 다른 질문.' },
          { t: 'R²가 작으므로 voicing 효과는 없다', why: '효과는 있고 유의해요. 설명하는 비율이 작을 뿐.' },
          { t: 'p가 작으므로 voicing이 모음 길이를 대부분 설명한다', why: '1%만 설명해요.' },
        ] },
        { type: 'mcq', q: 'relevel로 기준 수준을 바꿨을 때 **반드시 그대로인** 것은?', opts: [
          { t: '모델의 예측값, RSE, R², F', ok: true, why: '같은 모델을 다른 기준에서 표현할 뿐.' },
          { t: 'Intercept', why: '기준 칸이 바뀌면 바뀌어요.' },
          { t: '모든 행의 p값', why: '상호작용 모델에선 단독 행의 p가 바뀌어요 (.12 → .0006).' },
        ] },
        { type: 'mcq', q: 'confint() 결과 어떤 계수의 구간이 [−0.0389, −0.0353]이다. 맞는 것은?', opts: [
          { t: '0을 포함하지 않으므로 p < .05이고, 효과는 음(−)의 방향', ok: true, why: '구간 전체가 음수.' },
          { t: '구간이 좁으므로 효과가 작다', why: '좁다는 건 정밀하다는 뜻이에요.' },
          { t: '95% 확률로 p가 이 구간에 있다', why: '구간은 계수의 범위지 p의 범위가 아니에요.' },
        ] },
        { type: 'mcq', q: '`-0.6434^2`의 결과가 −0.414인 이유는?', opts: [
          { t: '`^`가 부호 `-`보다 먼저 계산되어 −(0.6434²)가 되기 때문', ok: true, why: '`(-0.6434)^2`라고 써야 0.414.' },
          { t: '상관계수의 제곱은 음수일 수 있어서', why: '제곱은 음수가 될 수 없어요.' },
          { t: 'R²가 음수라서', why: 'R²는 0 이상이에요.' },
        ] },
        { type: 'tf', q: '두 집단 비교에서 `lm(y ~ 집단)`의 집단 계수 p값은 `t.test(y ~ 집단, var.equal = TRUE)`의 p값과 같다.', ans: true, why: '같은 검정이에요 (t의 부호만 반대일 수 있음).' },
        { type: 'mcq', q: '`plot_model(mlr_mod_3, type = "pred", terms = "voicing")`의 두 점이 표의 어떤 값과 같나? (기준 voiceless·no)', opts: [
          { t: 'Intercept(144.6)와 Intercept + voicingvoiced(150.3)', ok: true, why: '경계는 기준(no)에 고정.' },
          { t: 'voicing별 전체 평균(151.2, 160.2)', why: '전체 평균이 아니라 기준 조건의 예측이에요.' },
          { t: 'Intercept + 경계 행(164.7)과 네 줄 합(183.3)', why: '그건 경계 있음(yes) 조건.' },
        ] },
      ],
    },
  ],
});

RS.goals.push(
  { lesson: 'rev-drill', src: 'wk7–8 종합', title: '회귀 표 해석 연습 10문제' },
);

})();
