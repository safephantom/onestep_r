/* 단원 W: wk5 tidyr (pivot_longer, separate, pivot_wider) + left_join */
RS.units.push({
  id: 'w',
  title: 'tidyr: 표 모양 바꾸기와 left_join (wk5)',
  short: 'pivot_longer, separate, pivot_wider, geom_col, left_join',
  desc: 'wk5_1_tidyr.R과 그 Exercise key. 같은 정보라도 **표 모양**에 따라 계산이 쉬워지기도, 막히기도 해요. 넓은 표 ↔ 긴 표를 오가는 세 함수와, 두 표를 열쇠 열로 붙이는 `left_join()`을 배워요. 이 단원의 함수는 HW1(Z단원)에 그대로 다시 나와요.',
  lessons: [
    {
      id: 'w-tidy',
      title: '넓은 표와 긴 표: 열 이름에 정보가 숨어 있을 때',
      src: 'wk5_1_tidyr.R 11–15행 `fruit <- tibble(...)`',
      key: '`apples_bought` 같은 열 이름에는 **과일(apples)과 행동(bought) 두 가지 정보**가 붙어 있다. 이런 정보를 값으로 꺼내 "한 행 = 관측 하나"로 만드는 게 tidyr의 일이다.',
      body: [
        { code: `(fruit <- tibble(sociolinguist = c("Bill", "Gillian"),
                 apples_bought = c(5, 3),
                 apples_ate = c(1, 2),
                 oranges_bought = c(5, 4),
                 oranges_ate = c(3, 3)))` },
        '사람 2명 × 숫자 4개 = 값 8개가 **넓게** 펼쳐져 있어요. 이대로는 "과일별로 몇 개 남았나(산 개수 − 먹은 개수)"를 계산하기 어려워요. 과일 종류가 **열 이름 속**에 있어서 group_by()로 묶을 수가 없거든요.',
        { table: { head: ['모양', '한 행', '언제 편한가'], rows: [
          ['넓은 표 (wide)', '사람 한 명', '사람끼리 한눈에 비교할 때'],
          ['긴 표 (long)', '사람 × 과일 × 행동 하나', 'group_by, ggplot의 aes에 변수로 쓸 때'],
        ] } },
        { note: '수업 출처', kind: 'src', t: 'wk5 파일 첫머리: tidyr의 `pivot_longer`, `pivot_wider`가 예전 함수 `spread`, `gather`(reshape2), `melt`, `cast`(reshape)를 대신한다고 적혀 있어요. 인터넷 예제에서 옛 함수를 보면 같은 일을 하는 거예요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`oranges_ate` 열 이름에 들어 있는 정보는?', opts: [
          { t: '과일 종류와 행동, 두 가지', ok: true, why: 'oranges(과일) + ate(행동). 그래서 나중에 이 이름을 둘로 쪼개요 (separate).' },
          { t: '사람 이름', why: '사람은 sociolinguist 열의 값이에요.' },
          { t: '먹은 개수', why: '개수는 그 열의 **값**(3, 3)이에요. 이름에는 "무엇을 셌는지"가 들어 있어요.' },
        ] },
        { type: 'tf', q: 'fruit 표에서 "과일별 남은 개수"를 group_by(과일)로 바로 계산할 수 있다.', ans: false, why: '과일 종류가 열 이름 속에 있어서 묶을 열이 없어요. 먼저 긴 표로 바꿔야 해요.' },
      ],
    },
    {
      id: 'w-longer',
      title: 'pivot_longer(): 열 여러 개 → 이름 열 + 값 열',
      src: 'wk5_1_tidyr.R 18–21행',
      key: '`pivot_longer(바꿀 열들, names_to = "새 이름 열", values_to = "새 값 열")`. 고른 열의 **이름**은 names_to 열로, **값**은 values_to 열로 내려간다.',
      setup: 'fruit',
      body: [
        { code: `(fruit_longer <- fruit %>%
    pivot_longer(apples_bought:oranges_ate,
                 names_to = "fruit_behavior",
                 values_to = "number"))` },
        { table: { head: ['인자', '뜻'], rows: [
          ['`apples_bought:oranges_ate`', '바꿀 열들 (`:`는 select()처럼 "여기부터 저기까지", N단원)'],
          ['`names_to = "fruit_behavior"`', '원래 **열 이름**이 들어갈 새 열의 이름 (따옴표!)'],
          ['`values_to = "number"`', '원래 **값**이 들어갈 새 열의 이름'],
        ] } },
        '행 수 계산: 원래 2행 × 바꾼 열 4개 = **8행**. sociolinguist처럼 고르지 않은 열은 그대로 반복돼요.',
        { note: '따옴표가 필요한 이유', kind: 'warn', t: '`names_to`, `values_to`는 **아직 없는** 열의 이름을 새로 지어 주는 거라 글자(따옴표)로 써요. 반대로 바꿀 열(`apples_bought:oranges_ate`)은 이미 있는 열이라 따옴표 없이 써요 (B단원 "따옴표가 있으면 값, 없으면 이름").' },
      ],
      quiz: [
        { type: 'predict', q: '결과는 몇 행일까요?', code: `fruit %>%
  pivot_longer(apples_bought:apples_ate,
               names_to = "fruit_behavior",
               values_to = "number")`, opts: [
          { t: '4행', ok: true, why: '2행 × 고른 열 2개. oranges_ 두 열은 그대로 옆에 남아요.' },
          { t: '8행', why: '이번에는 apples 두 열만 골랐어요.' },
          { t: '2행', why: '고른 열마다 행이 늘어나요.' },
        ] },
        { type: 'fill', q: '원래 열 이름이 `fruit_behavior` 열로, 값이 `number` 열로 가도록 채우세요.', code: 'pivot_longer(apples_bought:oranges_ate, ▢ = "fruit_behavior", ▢ = "number")', ans: [['names_to'], ['values_to']], why: '이름 → names_to, 값 → values_to.', full: `fruit %>%
  pivot_longer(apples_bought:oranges_ate, names_to = "fruit_behavior", values_to = "number")` },
      ],
    },
    {
      id: 'w-separate',
      title: 'separate(): 한 열을 둘로 쪼개기',
      src: 'wk5_1_tidyr.R 24–28행 "separate() will split values wherever it sees a non-alphanumeric character"',
      key: '`separate(열, into = c("새 열1", "새 열2"))`. 글자·숫자가 아닌 기호(`_`, `.` 등)가 나오는 곳에서 자른다.',
      setup: ['fruit', 'fruit_longer'],
      body: [
        { code: `(fruit_separate <- fruit_longer %>%
    separate(fruit_behavior,
             into = c("fruit", "behavior")))` },
        '`"apples_bought"`가 `_`에서 잘려 `fruit = "apples"`, `behavior = "bought"`가 됐어요. 원래 열(fruit_behavior)은 사라지고 새 두 열이 그 자리에 들어가요.',
        '연습 데이터의 열 이름 `oh.caught`처럼 `.`이 있어도 똑같이 잘려요. wk5 Exercise key의 `separate(vowel.word, into = c("vowel","word"))`가 그 예예요.',
        { note: '조각 수가 안 맞으면', kind: 'warn', t: '`into`에 이름을 2개 줬는데 값이 3조각(`a_b_c`)이면 남는 조각을 버리고 경고(`Expected 2 pieces`)를 내요. 반대로 조각이 모자라면 빈자리는 NA. 경고가 나오면 into의 개수를 확인하세요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과의 `vowel` 열 첫 값은?', setup: [], code: `tibble(vowel.word = c("oh.caught", "o.cot")) %>%
  separate(vowel.word, into = c("vowel", "word"))`, opts: [
          { t: '`oh`', ok: true, why: '`.`에서 잘려 앞 조각 oh가 vowel, 뒤 조각 caught가 word.' },
          { t: '`oh.caught`', why: 'separate가 잘라서 두 열로 나눠요.' },
          { t: '`caught`', why: '앞 조각이 into의 첫 이름(vowel)으로 가요.' },
        ] },
        { type: 'mcq', q: '`separate(speaker_ID, into = c("spkr", "age", "gender"))`가 `"spkrA_old_man"`을 자른 결과는?', opts: [
          { t: 'spkr = "spkrA", age = "old", gender = "man"', ok: true, why: '`_` 두 곳에서 잘려 세 조각.' },
          { t: 'spkr = "spkrA_old", gender = "man"', why: '기호가 나오는 곳마다 잘라요.' },
          { t: '에러: 조각이 3개라서', why: 'into에 이름을 3개 줬으니 딱 맞아요.' },
        ] },
      ],
    },
    {
      id: 'w-wider',
      title: 'pivot_wider(): 이름 열 + 값 열 → 열 여러 개',
      src: 'wk5_1_tidyr.R 32–35행',
      key: '`pivot_wider(names_from = 열, values_from = 열)`은 pivot_longer의 반대. names_from 열의 **값들이 새 열 이름**이 되고, values_from 열의 값이 그 칸을 채운다.',
      setup: ['fruit', 'fruit_longer', 'fruit_separate'],
      body: [
        { code: `fruit_separate %>%
  pivot_wider(names_from = behavior,
              values_from = number) %>%
  mutate(surplus = bought - ate)` },
        'behavior 열의 값(bought, ate)이 **열 이름**이 됐어요. 이제 같은 행에 bought와 ate가 나란히 있으니 Q단원의 `mutate()`로 빼기만 하면 남은 개수(surplus)예요.',
        '행 수: 나머지 열(sociolinguist, fruit)의 조합마다 한 행 → Bill·Gillian × apples·oranges = **4행**.',
        { note: '이 두 인자는 따옴표 없이', kind: 'tip', t: 'pivot_wider의 `names_from`, `values_from`은 **이미 있는** 열을 가리켜서 따옴표 없이 써요. pivot_longer의 `names_to`, `values_to`(새로 짓는 이름, 따옴표)와 반대예요.' },
      ],
      quiz: [
        { type: 'mcq', q: '`pivot_wider(names_from = behavior, values_from = number)`에서 새로 생기는 열 이름은?', opts: [
          { t: '`bought`, `ate`', ok: true, why: 'behavior 열에 들어 있던 **값들**이 열 이름이 돼요.' },
          { t: '`behavior`, `number`', why: '이 두 열은 오히려 사라져요.' },
          { t: '`fruit`, `behavior`', why: 'fruit 열은 그대로 남는 열이에요.' },
        ] },
        { type: 'fill', q: 'surplus(산 것 − 먹은 것)를 계산하려면 behavior의 값들이 열이 되어야 해요. 빈칸을 채우세요.', code: 'pivot_wider(names_from = ▢, values_from = ▢)', ans: [['behavior'], ['number']], why: '열 이름이 될 값이 있는 열 → names_from, 칸을 채울 값 → values_from.', full: `fruit_separate %>%
  pivot_wider(names_from = behavior, values_from = number) %>%
  mutate(surplus = bought - ate)` },
      ],
    },
    {
      id: 'w-col',
      title: 'geom_col() = geom_bar(stat = "identity")',
      src: 'wk5_1_tidyr.R 31–56행 (fruit 막대그래프 두 가지)',
      key: '값이 **이미 계산된** 표로 막대를 그릴 때는 `geom_col()`. `geom_bar()`는 기본이 "행 개수 세기"(J단원)라서 `stat = "identity"`를 붙여야 같은 그림이 된다.',
      setup: ['fruit', 'fruit_longer', 'fruit_separate'],
      body: [
        { compare: [
          { label: 'geom_bar(stat = "identity")', code: `(fruit_wider <- fruit_separate %>%
    pivot_wider(names_from = behavior, values_from = number) %>%
    mutate(surplus = bought - ate)) %>%
  ggplot(aes(fruit, surplus)) +
  geom_bar(stat = "identity", position = "dodge", aes(fill = fruit)) +
  facet_wrap(~sociolinguist) +
  ggtitle("Sociolinguists' fruit surpluses")` },
          { label: 'geom_col()', code: `(fruit_wider <- fruit_separate %>%
    pivot_wider(names_from = behavior, values_from = number) %>%
    mutate(surplus = bought - ate)) %>%
  ggplot(aes(fruit, surplus)) +
  geom_col(position = "dodge", aes(fill = fruit)) +
  facet_wrap(~sociolinguist) +
  ggtitle("Sociolinguists' fruit surpluses")` },
        ] },
        '두 그림이 똑같아요. 수업 주석 그대로: geom_col()의 기본 stat은 identity(값 그대로), geom_bar()의 기본 stat은 count(개수 세기).',
        { note: '괄호로 감싼 할당 + 파이프', kind: 'tip', t: '`(fruit_wider <- … ) %>% ggplot(…)`은 B단원의 "괄호로 감싸면 할당하면서 그 값을 내놓기"를 쓴 거예요. 괄호 안에서 fruit_wider를 저장하고, 그 결과를 바로 ggplot으로 넘겨요. 표도 남기고 그림도 그리는 한 줄짜리 요령이에요.' },
      ],
      quiz: [
        { type: 'mcq', q: 'surplus처럼 **이미 계산한 값**을 막대 높이로 쓰려면?', opts: [
          { t: '`geom_col()`', ok: true, why: '값 그대로(identity)가 기본이에요.' },
          { t: '`geom_bar()` (인자 없이)', why: 'geom_bar는 기본으로 행 수를 세서, y에 surplus를 주면 에러가 나요.' },
          { t: '`geom_histogram()`', why: '히스토그램은 연속 변수를 구간으로 나눠 세요.' },
        ] },
        { type: 'tf', q: '`geom_bar(stat = "identity")`와 `geom_col()`은 같은 그림을 그린다.', ans: true, why: '수업 파일이 두 버전을 나란히 보여 주는 이유예요.' },
      ],
    },
    {
      id: 'w-join',
      title: 'left_join(): 두 표를 열쇠 열로 붙이기',
      src: 'wk5_1_tidyr.R 끝부분 "The most important thing you need to learn from Ch. 13 is left_join()"',
      key: '`left_join(왼쪽, 오른쪽, by = "열쇠 열")`: 왼쪽 표의 **모든 행을 그대로** 두고, 열쇠 값이 같은 오른쪽 행의 열을 옆에 붙인다.',
      setup: 'joinex',
      body: [
        '실험 자료에서 아주 흔한 모양이에요: **시행(trial)마다 한 행**인 반응 표와, **단어마다 한 행**인 단어 정보 표.',
        { code: `word_rts
words
left_join(word_rts, words, by = "word")` },
        '- word_rts의 9행이 그대로 9행으로 남고, 각 행에 그 단어의 freq, pos가 붙었어요.\n- 같은 단어(cat)가 여러 번 나오면 단어 정보도 여러 번 복사돼요.\n- 오른쪽에 없는 단어가 왼쪽에 있으면 붙일 값이 없어 **NA**가 돼요. HW1의 trials + stims에서 실제로 일어나요 (Z단원).',
        { note: '행 수가 늘어나는 경우', kind: 'warn', t: '오른쪽 표에 같은 열쇠 값이 **두 번** 있으면 왼쪽 행이 두 번 복사되어 행 수가 늘어나요. 그래서 붙인 뒤 `nrow()`로 행 수가 그대로인지 확인하는 습관이 좋아요 (HW1 1번이 바로 이걸 묻고 있어요).' },
      ],
      quiz: [
        { type: 'predict', q: '결과는 몇 행일까요?', code: `left_join(word_rts, words, by = "word")`, opts: [
          { t: '9행', ok: true, why: '왼쪽(word_rts)의 행 수 그대로예요.' },
          { t: '3행', why: '3은 오른쪽(words)의 행 수예요.' },
          { t: '27행', why: '열쇠가 겹치지 않으면 곱하기가 되지 않아요.' },
        ] },
        { type: 'mcq', q: 'words에 없는 단어 "dog"이 word_rts에 있다면, left_join 뒤 그 행의 freq는?', opts: [
          { t: 'NA', ok: true, why: '붙일 정보가 없으면 빈칸(NA). 행 자체는 남아요.' },
          { t: '그 행이 사라진다', why: 'left_join은 왼쪽 행을 모두 남겨요.' },
          { t: '에러', why: '에러 없이 NA로 채워요.' },
        ] },
        { type: 'fill', q: '반응 표 trials에 단어 정보 stims를 spelling 열로 붙이세요.', code: 'data <- ▢(trials, stims, by = ▢)', ans: [['left_join'], ['"spelling"']], why: '왼쪽(trials)의 모든 행을 남기는 left_join, 열쇠 열 이름은 따옴표로.', full: `left_join(word_rts, words, by = "word")` },
      ],
    },
  ],
});
