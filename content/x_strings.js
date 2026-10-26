/* 단원 X: wk5 문자열(stringr)과 factor(forcats) */
RS.units.push({
  id: 'x',
  title: '문자열과 factor: stringr · forcats (wk5)',
  short: 'str_length, str_c, str_sub, factor·levels, droplevels, NA 빼기, fct_reorder/relevel/recode',
  desc: 'wk5_2_stringr.R. 글자를 붙이고 자르는 stringr 몇 가지와, **범주의 순서**를 정하는 factor를 다뤄요. factor는 막대 순서·패널 순서·범례 순서를 정하고, HW1에서는 `nsyl`을 factor로 바꾸는 데 쓰여요.',
  lessons: [
    {
      id: 'x-strc',
      title: 'str_length()와 str_c(): 길이 재기, 이어 붙이기',
      src: 'wk5_2_stringr.R 9–31행',
      key: '`str_length(x)`는 글자 수. `str_c(a, b, sep = " ")`는 이어 붙이기. 길이가 짧은 쪽은 **긴 쪽 길이만큼 되풀이**된다.',
      body: [
        { code: `string1 <- "hello"
string2 <- "friends"
str_length(string1)
str_c(string1, string2, sep = " ")
str_c("prefix-", c("a", "b", "c"), "-suffix")` },
        '마지막 줄: `"prefix-"`와 `"-suffix"`는 1개, 가운데는 3개 → 짧은 것이 3번 되풀이돼 결과도 3개예요. B단원의 "벡터 계산은 원소마다"와 같은 규칙이에요.',
        { note: 'B단원과 비교', kind: 'tip', t: 'R의 `+`로는 글자를 이어 붙일 수 없었죠 (`"a" + "b"`는 에러). 글자를 붙일 때는 `str_c()`를 써요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과는?', setup: [], code: `str_c("wk", c(5, 6, 7), sep = "_")`, opts: [
          { t: '`[1] "wk_5" "wk_6" "wk_7"`', ok: true, why: '"wk"가 3번 되풀이되고, 사이에 sep "_"가 들어가요.' },
          { t: '`[1] "wk_5_6_7"`', why: '하나로 합치려면 collapse가 필요해요 (다음 레슨).' },
          { t: '에러: 숫자와 글자를 섞어서', why: 'str_c는 숫자를 글자로 바꿔서 붙여요.' },
        ] },
        { type: 'predict', q: '결과는?', setup: [], code: `str_length("caught")`, opts: [
          { t: '`[1] 6`', ok: true, why: 'c-a-u-g-h-t, 6글자.' },
          { t: '`[1] 1`', why: '원소 개수가 아니라 글자 수예요. 원소 개수는 length().' },
        ] },
      ],
    },
    {
      id: 'x-collapse',
      title: 'letters, LETTERS와 collapse',
      src: 'wk5_2_stringr.R 33–43행',
      key: '`sep`은 **같은 위치끼리** 붙일 때 사이에 넣는 글자, `collapse`는 벡터 하나를 **한 덩어리로** 합칠 때 사이에 넣는 글자.',
      body: [
        { code: `str_c(letters, LETTERS)
str_c(letters)
str_c(letters, collapse = "")` },
        '`letters`, `LETTERS`는 R에 내장된 알파벳 26개 벡터예요.',
        '수업 질문 "`str_c(letters)`는 무엇을 하고 왜?": 붙일 상대가 없으니 **아무것도 안 바뀐** 26개 그대로예요. 하나로 합치려면 collapse를 줘야 해요.',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', setup: [], code: `str_c(c("o", "oh"), collapse = " vs ")`, opts: [
          { t: '`[1] "o vs oh"`', ok: true, why: '벡터 두 원소를 " vs "로 이어 한 덩어리로.' },
          { t: '`[1] "o"  "oh"`', why: 'collapse가 있으면 하나로 합쳐요.' },
          { t: '`[1] "o vs " "oh vs "`', why: '그건 sep처럼 원소마다 붙인 모양이에요.' },
        ] },
        { type: 'mcq', q: '`str_c(letters, LETTERS)`의 결과 길이는?', opts: [
          { t: '26', ok: true, why: '같은 위치끼리 붙여 "aA", "bB", … 26개.' },
          { t: '52', why: '이어 붙이는 거지 늘어놓는 게 아니에요.' },
          { t: '1', why: 'collapse가 없어서 하나로 합쳐지지 않아요.' },
        ] },
      ],
    },
    {
      id: 'x-strsub',
      title: 'str_sub(): 글자 일부 잘라 내기',
      src: 'wk5_2_stringr.R 45–56행',
      key: '`str_sub(x, 시작, 끝)`. 번호는 1부터, 끝 번호의 글자까지 **포함**. 음수는 뒤에서부터 센다.',
      body: [
        { code: `str_sub("friends", 1, 4)
birds <- c("merganser", "grackle", "oriole")
str_sub(birds, 1, 3)
str_sub(birds, 1:3)
str_sub("birds", -3)` },
        '- `str_sub(birds, 1:3)`: 시작 번호도 벡터라서 **원소마다 다른 시작**(1, 2, 3)이 적용돼요. 끝을 안 주면 끝까지.\n- `-3`: 뒤에서 세 번째 글자부터 끝까지.',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', setup: [], code: `str_sub("caught", 1, 3)`, opts: [
          { t: '`[1] "cau"`', ok: true, why: '1~3번째 글자 (3번째 포함).' },
          { t: '`[1] "ca"`', why: 'R은 끝 번호 글자까지 포함해요 (파이썬 슬라이스와 다름).' },
          { t: '`[1] "aug"`', why: 'R은 1부터 세요.' },
        ] },
        { type: 'predict', q: '결과는?', setup: [], code: `str_sub("oriole", -2)`, opts: [
          { t: '`[1] "le"`', ok: true, why: '뒤에서 두 번째부터 끝까지.' },
          { t: '`[1] "oriol"`', why: '음수 시작은 뒤에서부터 세요.' },
        ] },
      ],
    },
    {
      id: 'x-factor',
      title: 'factor: 순서가 정해진 범주',
      src: 'wk5_2_stringr.R 59–76행',
      key: 'factor = 범주 값 + **수준(levels)의 순서**. `as_factor()`(forcats)는 **처음 나온 순서**로, 기본 R의 `factor()`는 **가나다(알파벳) 순서**로 수준을 정한다.',
      body: [
        { code: `mpg2 <- mpg %>%
  mutate(manufacturer = as_factor(manufacturer))
is.factor(mpg2$manufacturer)
levels(mpg2$manufacturer)` },
        'glimpse로 보면 manufacturer의 종류가 `<chr>`에서 `<fct>`로 바뀌어 있어요 (C단원 열 종류 약어).',
        { compare: [
          { label: 'as_factor(): 처음 나온 순서', setup: [], code: `levels(as_factor(c("young", "old", "young")))` },
          { label: 'factor(): 알파벳 순서', setup: [], code: `levels(factor(c("young", "old", "young")))` },
        ] },
        { note: '수업 파일 그대로 실행하면', kind: 'warn', t: 'wk5_2 파일 66행 `is.factor(mpg2$manufacturer)`는 **mpg2를 만들기 전**에 있어서 `object \'mpg2\' not found` 에러가 나요. 위 코드처럼 mpg2를 먼저 만들고 확인하세요.' },
        '숫자 열도 factor로 바꿀 수 있어요. HW1의 `nsyl`(음절 수 1, 2)을 factor로 바꾸면 ggplot이 연속 색 막대 대신 **두 범주의 색**으로 구분해요 (Z단원).',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', setup: [], code: `levels(as_factor(c("W", "N", "W", "T")))`, opts: [
          { t: '`[1] "W" "N" "T"`', ok: true, why: 'as_factor는 처음 나온 순서예요.' },
          { t: '`[1] "N" "T" "W"`', why: '그건 factor()의 알파벳 순서예요.' },
          { t: '`[1] "W" "N" "W" "T"`', why: 'levels는 중복 없는 수준 목록이에요.' },
        ] },
        { type: 'mcq', q: 'factor의 수준 순서가 바꾸는 것은?', opts: [
          { t: '막대·상자의 x축 순서, 범례 순서, 패널 순서', ok: true, why: 'ggplot은 factor의 levels 순서대로 그려요.' },
          { t: '값 자체', why: '값은 그대로예요. 순서만 바뀌어요.' },
          { t: '행의 순서', why: '행 순서는 그대로예요 (행 정렬은 arrange).' },
        ] },
      ],
    },
    {
      id: 'x-drop',
      title: 'droplevels(): 걸러 낸 뒤 남은 빈 수준 지우기',
      src: 'wk5_2_stringr.R 80–90행',
      key: 'filter로 행을 걸러도 factor의 levels 목록은 **그대로 남는다**. 실제로 남은 값만 수준으로 두려면 `droplevels()`.',
      setup: 'mpg2',
      body: [
        { compare: [
          { label: 'filter만', code: `mpg3 <- mpg2 %>%
  filter(manufacturer %in% c("audi","chevrolet","dodge"))
levels(mpg3$manufacturer)` },
          { label: 'filter + droplevels', code: `mpg3 <- mpg2 %>%
  filter(manufacturer %in% c("audi","chevrolet","dodge")) %>%
  mutate(manufacturer = droplevels(manufacturer))
levels(mpg3$manufacturer)` },
        ] },
        '왼쪽은 행이 3개 회사뿐인데 수준은 15개 그대로예요. 이대로 그리면 빈 범주가 범례나 축에 남을 수 있어요.',
      ],
      quiz: [
        { type: 'predict', q: '마지막 줄의 결과는?', code: `two <- mpg2 %>%
  filter(manufacturer %in% c("audi", "dodge")) %>%
  mutate(manufacturer = droplevels(manufacturer))
levels(two$manufacturer)`, opts: [
          { t: '`[1] "audi"  "dodge"`', ok: true, why: '남은 두 회사만 수준으로 남아요.' },
          { t: '15개 회사 전부', why: 'droplevels가 빈 수준을 지웠어요.' },
        ] },
      ],
    },
    {
      id: 'x-na',
      title: 'NA 빼기: filter(!is.na(열)) vs na.omit()',
      src: 'wk5_2_stringr.R 93–100행 "na.omit() — 전체 dataframe에 대해 작동"',
      key: '`filter(!is.na(열))`은 **그 열이** NA인 행만 뺀다. `na.omit(데이터)`는 **어느 열이든** NA가 하나라도 있는 행을 모두 뺀다.',
      setup: 'dutch',
      body: [
        '수업 코드는 NA가 없는 mpg3로 시연해서 차이가 안 보여요. HW1의 단어 정보 표 stims에는 음절 수(nsyl)가 빈 단어가 있어서 차이를 직접 볼 수 있어요.',
        { code: `nrow(stims)
stims %>% filter(!is.na(nsyl)) %>% nrow()
na.omit(stims) %>% nrow()` },
        '여기서는 둘 다 12,712행이에요. nsyl이 빈 137개 단어는 nchar도 비어 있어서, 어느 방법이든 같은 행이 빠졌어요. 하지만 **다른 열에도 NA가 섞여 있으면** na.omit은 의도하지 않은 행까지 지울 수 있어요. 어느 열 때문에 빼는지 분명할 때는 filter(!is.na())가 안전해요.',
        { note: '!is.na() 읽는 법', kind: 'tip', t: '`is.na(nsyl)`은 "nsyl이 NA인가?" → TRUE/FALSE. 앞의 `!`가 뒤집어서 "NA가 아닌 행"만 남겨요 (B단원 `!`, O단원 filter).' },
      ],
      quiz: [
        { type: 'mcq', q: 'HW1 5번 "Exclude words that have no value for nsyl"에 가장 알맞은 코드는?', opts: [
          { t: '`filter(!is.na(nsyl))`', ok: true, why: '문제가 nsyl을 콕 집어 말하니, 그 열의 NA만 빼요.' },
          { t: '`filter(is.na(nsyl))`', why: '이건 반대로 NA인 행만 남겨요.' },
          { t: '`filter(nsyl != NA)`', why: 'NA와의 비교는 항상 NA라서 모든 행이 빠져요. NA는 is.na()로 확인해요.' },
        ] },
        { type: 'tf', q: '`na.omit(data)`는 nsyl 열의 NA만 확인한다.', ans: false, why: '모든 열을 봐요. 아무 열에나 NA가 있으면 그 행을 빼요.' },
      ],
    },
    {
      id: 'x-reorder',
      title: 'fct_reorder(): 값 크기 순서로 막대 정렬',
      src: 'wk5_2_stringr.R 104–122행',
      key: '`fct_reorder(범주, 숫자)`는 범주를 **숫자 값의 크기 순서**로 다시 줄 세운다. 막대를 높이 순으로 놓을 때 쓴다.',
      setup: ['mpg2', 'mpg3', 'mpg4'],
      body: [
        { compare: [
          { label: '기본: 수준 순서 (audi, chevrolet, dodge)', code: `ggplot(mpg4, aes(manufacturer, mean.hwy)) +
  geom_col()` },
          { label: 'fct_reorder: mean.hwy 작은 것부터', code: `ggplot(mpg4, aes(fct_reorder(manufacturer, mean.hwy), mean.hwy)) +
  geom_col()` },
        ] },
        { note: '수업 파일의 117행', kind: 'warn', t: '`fct_reorder(manufacturer, c("chevrolet","dodge","audi"))`는 두 번째 자리에 **글자**를 줘서, "그 글자들의 알파벳 순"으로 정렬돼 버려요 (결과: dodge, audi, chevrolet). 원하는 순서를 **직접** 정하고 싶으면 fct_reorder가 아니라 다음 레슨의 `fct_relevel()`을 써요.' },
        '오른쪽 그림의 x축 제목이 `fct_reorder(manufacturer, mean.hwy)`로 길게 나오죠. labs(x = "Manufacturer")로 바꿔 주면 돼요 (L단원).',
      ],
      quiz: [
        { type: 'mcq', q: 'mpg4의 mean.hwy는 audi 26.4, chevrolet 21.9, dodge 17.9. `fct_reorder(manufacturer, mean.hwy)`의 막대 순서(왼쪽부터)는?', opts: [
          { t: 'dodge, chevrolet, audi', ok: true, why: '작은 값부터 (오름차순).' },
          { t: 'audi, chevrolet, dodge', why: '그건 원래 수준 순서예요.' },
          { t: 'audi, dodge, chevrolet', why: '크기 순서가 아니에요.' },
        ] },
      ],
    },
    {
      id: 'x-relevel',
      title: 'fct_relevel(): 원하는 수준을 맨 앞으로',
      src: 'wk5_2_stringr.R 125–131행',
      key: '`fct_relevel(범주, "수준")`은 적은 수준을 **맨 앞**으로 옮기고 나머지는 원래 순서를 지킨다. 여러 개를 적으면 적은 순서대로 앞에 선다.',
      setup: ['mpg2', 'mpg3', 'mpg4'],
      body: [
        { code: `mpg5 <- mpg4 %>%
  mutate(manufacturer = fct_relevel(manufacturer, "dodge"))
levels(mpg5$manufacturer)` },
        '실험 조건처럼 **의미 있는 순서**(통제 조건 먼저 등)가 있을 때 써요. 아래 sib_merger 레슨에서 네 조건을 원하는 순서로 세워요.',
      ],
      quiz: [
        { type: 'predict', q: '결과는?', code: `levels(fct_relevel(mpg4$manufacturer, "dodge", "chevrolet"))`, opts: [
          { t: '`[1] "dodge" "chevrolet" "audi"`', ok: true, why: '적은 순서대로 앞에 서고, 남은 audi가 뒤에.' },
          { t: '`[1] "audi" "dodge" "chevrolet"`', why: '적은 수준이 **앞**으로 가요.' },
          { t: '`[1] "dodge" "chevrolet"`', why: '나머지 수준(audi)이 사라지지는 않아요.' },
        ] },
      ],
    },
    {
      id: 'x-recode',
      title: 'fct_recode(): 수준 이름 바꾸기',
      src: 'wk5_2_stringr.R 135–140행 `### "새 이름" = "기존이름"`',
      key: '`fct_recode(범주, "새 이름" = "기존 이름")`. **새 이름이 왼쪽**이다 (mutate의 `새 열 = 계산`과 같은 방향).',
      setup: ['mpg2', 'mpg3', 'mpg4'],
      body: [
        { code: `mpg6 <- mpg4 %>%
  mutate(manufacturer2 = fct_recode(manufacturer,
                                    "a_dodge" = "dodge",
                                    "a_chevrolet" = "chevrolet"))
mpg6` },
        '적지 않은 수준(audi)은 이름이 그대로예요. 순서는 바뀌지 않고 이름만 바뀌어요.',
      ],
      quiz: [
        { type: 'fill', q: 'sib_merger의 조건 이름 nw를 NoComp로 바꾸세요.', code: 'fct_recode(condition, ▢ = ▢)', ans: [['"NoComp"'], ['"nw"']], why: '새 이름 = 기존 이름.', full: `levels(fct_recode(factor(c("nw", "nc")), "NoComp" = "nw"))` },
      ],
    },
    {
      id: 'x-sibmerger',
      title: '실제 데이터: sib_merger 조건 이름과 순서 정하기',
      src: 'wk5_2_stringr.R 145–154행',
      key: 'filter로 화자 5명·interactive 과제만 남기고 → `factor()` → `fct_recode()`로 이름 → `fct_relevel()`로 순서. mutate 안에서 **같은 열을 차례로 고쳐 쓴다.**',
      setup: 'sibmerger',
      body: [
        { code: `sibmerger2 <- sibmerger %>%
  filter(subject %in% c('CSY','C21','XSJ','E63','TFH')) %>%
  filter(task == "interactive") %>%
  mutate(condition = factor(condition),
         condition = fct_recode(condition,
                                "Control" = "control",
                                "NoComp" = "nw",
                                "NoCont" = "nc",
                                "Context" = "yc"),
         condition = fct_relevel(condition,
                                 "Control", "NoComp", "NoCont", "Context"))
levels(sibmerger2$condition)` },
        'mutate 안에서 condition을 세 번 연달아 덮어써요. Q단원에서 본 대로 mutate 안의 식은 **위에서부터 차례로** 계산되니까 가능해요.',
        { note: '이름을 바꿔 저장한 이유', kind: 'tip', t: '수업 파일은 결과를 다시 `sibmerger`에 덮어써요. 그러면 아래 레슨처럼 같은 변환을 한 번 더 할 때 원래 값(control, nw…)이 이미 사라져서 문제가 생겨요. 연습할 때는 새 이름(sibmerger2)에 저장하는 게 안전해요.' },
      ],
      quiz: [
        { type: 'mcq', q: '이 코드 뒤 sib_merger 그림의 x축(조건) 순서는?', opts: [
          { t: 'Control, NoComp, NoCont, Context', ok: true, why: 'fct_relevel에 적은 순서예요.' },
          { t: 'Context, Control, NoComp, NoCont', why: '알파벳 순은 factor()만 했을 때예요.' },
          { t: 'control, nc, nw, yc', why: 'fct_recode로 이름이 바뀌었어요.' },
        ] },
      ],
    },
    {
      id: 'x-basefactor',
      title: '기본 R 방식: factor(x, levels = …, labels = …)',
      src: 'wk5_2_stringr.R 160–189행',
      key: '`factor(x, levels = 원래 값 순서, labels = 새 이름)` 한 번으로 순서와 이름을 함께 정한다. labels는 **levels의 순서와 짝**이 맞아야 한다.',
      setup: 'sibmerger',
      body: [
        { code: `sibmerger2 <- sibmerger %>%
  filter(subject %in% c('CSY','C21','XSJ','E63','TFH')) %>%
  filter(task == "interactive") %>%
  mutate(condition = factor(condition,
                            levels = c("control", "nw", "nc", "yc"),
                            labels = c("Control", "NoComp", "NoCont", "Context")))
levels(sibmerger2$condition)` },
        '앞 레슨과 같은 결과를 한 번에 냈어요. `levels`에는 **데이터에 실제로 있는 값**을 적고, `labels`에는 그 순서대로 바꿀 이름을 적어요.',
        { note: '수업 파일을 위에서부터 다 실행하면', kind: 'warn', t: '파일 끝부분은 **이미 이름이 바뀐** sibmerger에 같은 변환을 또 해요. 그러면 값이 Control이라 levels의 "control"과 맞지 않아 전부 NA가 되고, 마지막 줄은 `invalid \'labels\'; length 4 should be 1 or 0` 에러가 나요. 대안들을 비교해 볼 때는 매번 **원래 데이터에서** 시작하세요.' },
      ],
      quiz: [
        { type: 'predict', q: '결과는? (levels의 철자가 데이터와 다름)', setup: [], code: `factor(c("nw", "nc", "nw"), levels = c("NW", "NC"))`, opts: [
          { t: '`[1] <NA> <NA> <NA>` (Levels: NW NC)', ok: true, why: 'levels에 없는 값은 NA가 돼요. 대소문자도 정확히 맞아야 해요.' },
          { t: '`[1] NW NC NW`', why: 'factor는 철자를 고쳐 주지 않아요. 바꾸려면 labels예요.' },
          { t: '에러', why: '에러 없이 NA가 되어서 더 조심해야 해요.' },
        ] },
        { type: 'tf', q: '`labels`는 levels와 상관없이 원하는 순서로 적으면 된다.', ans: false, why: 'labels의 첫 이름은 levels의 첫 값에, 둘째는 둘째에 붙어요.' },
      ],
    },
  ],
});
