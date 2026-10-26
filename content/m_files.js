/* 단원 M: 데이터 파일과 RStudio Project */
RS.units.push({
  id: 'm',
  title: 'CSV 불러오기와 RStudio Project',
  short: '작업 폴더와 상대 경로, read_csv vs read.csv, setwd와 역슬래시, file.choose, sibimit 둘러보기',
  desc: 'wk3_Rproject.R 1–25행과 wk3_Rproject.pdf "RStudio project: A suggested directory/Project setup · Read a delimited text file into a data frame".',
  lessons: [
    {
      id: 'm-project',
      title: 'RStudio Project와 작업 폴더',
      src: 'wk3_Rproject.pdf "A suggested directory/Project setup"',
      key: 'R은 파일을 **작업 폴더(working directory)** 기준으로 찾는다. RStudio Project(.Rproj)를 열면 작업 폴더가 **자동으로 그 프로젝트 폴더**가 된다.',
      body: [
        '슬라이드가 권하는 구조는 대략 이래요:',
        { code: `0_2026Fall QuantData/          ← 프로젝트 폴더 (여기에 .Rproj 파일)
├─ QuantData.Rproj
├─ wk3_Rproject.R
└─ QuantAnalysis_data/
   ├─ sib_imit_data.csv
   └─ sib_merger.csv`, run: false, cap: '폴더 구조 예시' },
        '`.Rproj`를 더블클릭해서 RStudio를 열면 작업 폴더가 `0_2026Fall QuantData/`가 돼요. 그래서 스크립트 안에서는 `"QuantAnalysis_data/sib_imit_data.csv"`처럼 **그 폴더로부터의 경로**(상대 경로)만 쓰면 돼요. 컴퓨터가 바뀌어도(선생님 맥 ↔ 내 윈도우) 코드가 그대로 동작해요.',
        '지금 작업 폴더가 어디인지는 콘솔에서 `getwd()`로 확인해요 (RStudio 콘솔 창 제목 줄에도 보여요).',
      ],
      quiz: [
        { type: 'mcq', q: 'RStudio Project를 쓰는 가장 큰 이유는?', opts: [
          { t: '작업 폴더가 자동으로 정해져서 상대 경로가 어느 컴퓨터에서나 통한다', ok: true, why: 'setwd()에 내 컴퓨터만의 절대 경로를 쓸 필요가 없어요.' },
          { t: 'R이 더 빨라진다', why: '속도와는 관계없어요.' },
          { t: 'tidyverse가 자동으로 설치된다', why: '패키지 설치는 별개예요.' },
        ] },
        { type: 'mcq', q: '프로젝트 폴더 안 `QuantAnalysis_data` 폴더에 있는 sib_merger.csv를 읽는 올바른 경로는? (Project를 열어 둔 상태)', opts: [
          { t: '`read_csv("QuantAnalysis_data/sib_merger.csv")`', ok: true, why: '작업 폴더(프로젝트 폴더) 기준 상대 경로.' },
          { t: '`read_csv("sib_merger.csv")`', why: '작업 폴더 **바로 안**에 있지 않아서 못 찾아요.' },
          { t: '`read_csv(QuantAnalysis_data/sib_merger.csv)`', why: '경로는 글자 값이라 따옴표가 필요해요 (없으면 `/`를 나눗셈으로 읽어요).' },
        ] },
      ],
    },
    {
      id: 'm-readcsv',
      title: 'read_csv(): CSV → tibble',
      src: 'wk3_Rproject.R 4–11행',
      key: '`객체 <- read_csv("경로")` — CSV를 읽어 **tibble**로 만들고 이름을 붙인다. 읽을 때 "Column specification" 안내가 뜬다(에러 아님).',
      body: [
        { code: `sibimit <- read_csv("QuantAnalysis_data/sib_imit_data.csv")` },
        '안내 메시지 읽기: 3,223행 17열, 글자(chr) 열 10개, 숫자(dbl) 열 7개. read_csv는 각 열의 앞부분을 보고 종류를 **추측**해요. 숫자 열에 글자가 섞여 있으면 chr로 읽히니, 읽은 뒤 `glimpse()`로 확인하는 습관을 들이세요.',
        '메시지를 끄고 싶으면 `read_csv("…", show_col_types = FALSE)`. 이 도구의 준비 코드가 이 옵션을 써요.',
        { code: `glimpse(sibimit)`, setup: 'sibimit' },
      ],
      quiz: [
        { type: 'mcq', q: 'read_csv 후 나오는 "── Column specification ──" 블록은?', opts: [
          { t: '각 열을 어떤 종류로 읽었는지 알려 주는 안내', ok: true, why: '에러도 경고도 아니에요.' },
          { t: '파일이 깨졌다는 경고', why: '정상 동작이에요.' },
          { t: '데이터 내용 전체', why: '내용은 head()·glimpse()로 봐요.' },
        ] },
        { type: 'mcq', q: '`read_csv("QuantAnalysis_data/sib_imit_data.csv")`만 실행하고 `<-`로 저장하지 않으면?', opts: [
          { t: '데이터가 콘솔에 출력되고 끝 — 나중에 쓸 이름이 없다', ok: true, why: '할당해야 sibimit으로 계속 쓸 수 있어요.' },
          { t: 'sibimit이라는 이름으로 자동 저장', why: '이름은 직접 붙여야 해요.' },
          { t: '에러', why: '읽기는 정상이에요.' },
        ] },
        { type: 'write', q: 'sib_merger.csv를 읽어서 `sibmerger`라는 이름으로 저장하고, glimpse로 구조를 보세요.', setup: [], starter: '', checks: [
          { r: 'obj_df("sibmerger")', m: '`sibmerger <- read_csv(...)`로 저장했나요?' },
          { r: 'nrow(obj("sibmerger")) == 3280', m: 'sib_merger.csv 전체 (3,280행)여야 해요. 경로: `"QuantAnalysis_data/sib_merger.csv"`' },
          { re: 'glimpse\\s*\\(', m: '`glimpse(sibmerger)`로 확인하기' },
        ], sol: `sibmerger <- read_csv("QuantAnalysis_data/sib_merger.csv")
glimpse(sibmerger)`, why: 'wk4 마지막 과제의 데이터예요. 열 이름이 전부 소문자라는 것도 확인했죠?' },
      ],
    },
    {
      id: 'm-readcsv2',
      title: 'read.csv()와 header = T: R 기본 함수',
      src: 'wk3_Rproject.R 23–24행 alternative 2',
      key: '`read.csv()`(점)는 R 기본 함수로 **data.frame**을 돌려준다. `header = T`는 "첫 줄이 열 이름"이라는 뜻(기본값도 TRUE).',
      body: [
        { compare: [
          { label: '`read_csv()` (tidyverse): tibble', code: `head(read_csv("QuantAnalysis_data/sib_merger.csv", show_col_types = FALSE), 3)` },
          { label: '`read.csv()` (base): data.frame', code: `head(read.csv("QuantAnalysis_data/sib_merger.csv", header = T), 3)` },
        ] },
        '차이: data.frame은 출력할 때 `<chr>` 같은 종류 표시가 없고, **모든 행**을 한꺼번에 출력하려 해요 (head 없이 치면 3,280행이 쏟아짐). 비어 있는 칸(NA)을 표시하는 방식도 조금 달라요. 이 수업에서는 `read_csv()`를 기본으로 써요.',
      ],
      quiz: [
        { type: 'mcq', q: '`read.csv(..., header = T)`의 header = T는?', opts: [
          { t: '파일 첫 줄을 열 이름으로 쓴다', ok: true, why: 'CSV 첫 줄이 task,subject,… 이니까요.' },
          { t: '첫 줄을 건너뛴다', why: '건너뛰는 게 아니라 이름으로 써요.' },
          { t: 'tibble로 만든다', why: 'read.csv는 항상 data.frame이에요.' },
        ] },
        { type: 'mcq', q: '`read_csv`와 `read.csv`의 결과 종류는?', opts: [
          { t: 'tibble / data.frame', ok: true, why: '밑줄 = tidyverse(readr), 점 = base R.' },
          { t: 'data.frame / tibble', why: '반대예요.' },
          { t: '둘 다 tibble', why: 'read.csv는 data.frame이에요.' },
        ] },
      ],
    },
    {
      id: 'm-setwd',
      title: 'setwd()와 경로 문자열 (윈도우의 역슬래시)',
      src: 'wk3_Rproject.R 16–21행 alternative 1',
      key: '`setwd("폴더")`로 작업 폴더를 **직접** 바꿀 수 있다. 윈도우 경로의 `\\`는 R 문자열에서 특수 문자라서 `\\\\`(두 번) 또는 `/`로 써야 한다.',
      body: [
        '수업 코드 18행의 `setwd("/Users/sangimleekim/Dropbox/0_2026Fall QuantData/")`는 **선생님 맥의 경로**예요. 내 컴퓨터에서 그대로 실행하면:',
        { code: `setwd("/Users/sangimleekim/Dropbox/0_2026Fall QuantData/")`, expect: 'error' },
        '윈도우에서는 주석(20행)처럼 역슬래시를 두 번 써요. 한 번만 쓰면 R이 `\\U`를 특수 기호의 시작으로 읽어서 에러가 나요:',
        { table: { head: ['쓴 것', '결과'], rows: [
          ['`setwd("C:\\Users\\kim")`', '에러: `\'\\U\' used without hex digits`'],
          ['`setwd("C:\\\\Users\\\\kim")`', 'OK'],
          ['`setwd("C:/Users/kim")`', 'OK (윈도우에서도 / 가능)'],
        ] } },
        'RStudio Project를 쓰면 이 줄 자체가 필요 없어요 — 그래서 "alternative"(대안)로 적혀 있는 거예요.',
      ],
      quiz: [
        { type: 'mcq', q: '윈도우에서 올바른 경로 문자열은?', opts: [
          { t: '`"C:\\\\Users\\\\me\\\\QuantData"`', ok: true, why: '역슬래시를 두 번.' },
          { t: '`"C:\\Users\\me\\QuantData"`', why: '`\\U`, `\\m`, `\\Q`가 특수 기호로 읽혀 에러.' },
          { t: '`C:/Users/me/QuantData` (따옴표 없이)', why: '경로는 문자열이라 따옴표가 필요해요.' },
        ] },
        { type: 'mcq', q: '강의 코드의 `setwd("/Users/sangimleekim/...")`를 내 컴퓨터에서 실행하면 "cannot change working directory" 에러가 나는 이유는?', opts: [
          { t: '그 폴더가 내 컴퓨터에 없어서', ok: true, why: '선생님 컴퓨터의 절대 경로예요.' },
          { t: 'setwd가 tidyverse에 없어서', why: 'setwd는 R 기본 함수예요.' },
          { t: '경로에 공백이 있어서', why: '공백은 따옴표 안이면 괜찮아요.' },
        ] },
      ],
    },
    {
      id: 'm-choose',
      title: 'file.choose(): 창에서 파일 고르기',
      src: 'wk3_Rproject.R 24행 `read.csv(file.choose(), header=T)`',
      key: '`file.choose()`는 파일 선택 창을 띄워 고른 파일의 **경로(글자)**를 돌려준다. 안쪽 함수가 먼저 실행된다.',
      body: [
        '`read.csv(file.choose(), header = T)`의 실행 순서: (1) `file.choose()` → 창에서 파일을 고르면 `"C:\\\\…\\\\sib_imit_data.csv"` 같은 경로 글자가 나옴 → (2) 그 글자가 `read.csv()`의 첫 인자로 들어감.',
        '편하지만 **스크립트만 보고는 어떤 파일을 읽었는지 알 수 없어서** 재현성이 떨어져요. 그래서 대안으로만 소개된 거예요. (웹 연습장에서는 창을 띄울 수 없어요.)',
      ],
      quiz: [
        { type: 'mcq', q: '`file.choose()`가 돌려주는 것은?', opts: [
          { t: '고른 파일의 경로 (문자열)', ok: true, why: '그래서 read.csv의 경로 자리에 넣을 수 있어요.' },
          { t: '파일 내용 (데이터)', why: '읽는 건 read.csv가 해요.' },
          { t: '작업 폴더 변경', why: '작업 폴더는 그대로예요.' },
        ] },
        { type: 'mcq', q: '과제 스크립트에 file.choose() 대신 경로를 직접 쓰는 게 좋은 이유는?', opts: [
          { t: '다시 실행할 때 어떤 파일을 읽는지 코드에 남아서', ok: true, why: '재현 가능한 분석.' },
          { t: 'file.choose()는 윈도우에서 안 돼서', why: '윈도우에서도 돼요.' },
          { t: '속도가 빨라서', why: '속도 문제가 아니에요.' },
        ] },
      ],
    },
    {
      id: 'm-sibimit',
      title: 'sibimit 데이터 둘러보기',
      src: 'wk3_Rproject.R 34–49행 "Sibilant imitation data"',
      key: '치찰음(sibilant) 모방 실험: 참가자 × 과제(Task) × 조음 위치(Place) … 행 하나 = **발화 토큰 하나**. COGb/m/e = 치찰음 시작·중간·끝의 **스펙트럼 무게중심(Hz)**.',
      setup: 'sibimit',
      body: [
        { table: { head: ['열', '값', '뜻'], rows: [
          ['Task', 'baseline, imit1, imit2, model', '과제 단계'],
          ['Subject', 'CSL, CSU, …', '참가자 ID'],
          ['Gender', 'F, M', '성별'],
          ['MergerStatus', 'MERGED, DISTINCT', '치조음–권설음 합류(merger) 여부'],
          ['Place', 'alveo, retro', '치조(ㅅ 계열) / 권설(retroflex)'],
          ['Manner', 'asp, fric, aff', '조음 방법'],
          ['COGb, COGm, COGe', '숫자 (Hz)', 'center of gravity: beginning, middle, end'],
          ['duration', '숫자, NA 많음', '길이 (baseline에는 측정 안 됨)'],
        ] } },
        { code: `n_distinct(sibimit$Subject)
unique(sibimit$Task)` },
        '두 줄 모두 처음 보는 데이터의 값을 확인하는 도구예요 (2단원 [[b-unique|unique(), length(), n_distinct()]]에서 배운 것).\n- `n_distinct(sibimit$Subject)` → `56`: Subject 열에 **서로 다른 값**이 56개, 곧 참가자가 56명이에요. 행은 3,223개지만 한 참가자가 여러 행에 나오니, 사람 수는 이렇게 세요.\n- `unique(sibimit$Task)` → 중복을 없앤 **값 목록**: baseline, imit1, imit2, model. 위 표의 Task 값이 실제로 이 네 가지뿐인지 확인한 거예요.',
        '권설음(retro)은 치조음(alveo)보다 COG가 **낮아요** (혀를 말아 공명 공간이 커짐). Practice 3·4는 이 차이가 합류 여부·성별에 따라 어떻게 다른지 보는 그림이에요.',
      ],
      quiz: [
        { type: 'mcq', q: 'sibimit의 한 행은?', opts: [
          { t: '한 참가자가 한 번 발음한 토큰 하나', ok: true, why: '그래서 참가자당 행이 많아요.' },
          { t: '참가자 한 명', why: '참가자는 여러 행에 걸쳐 있어요 (그래서 group_by로 평균을 내요).' },
          { t: '단어 하나', why: '같은 단어가 여러 참가자·과제에 반복돼요.' },
        ] },
        { type: 'mcq', q: 'COGm의 m은?', opts: [
          { t: 'middle (치찰음 구간의 가운데)', ok: true, why: 'b = beginning, e = end.' },
          { t: 'mean (평균)', why: '측정 위치예요. (평균은 summarise에서 따로 내요.)' },
          { t: 'male', why: '성별은 Gender 열.' },
        ] },
      ],
    },
  ],
});
