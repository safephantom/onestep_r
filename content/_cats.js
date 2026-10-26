/* 카테고리: 기본 → wk2 … wk8 → 실습. 단원 번호(01, 02 …)와 "다음" 순서도 이 순서를 따른다.
   practice: 그 주를 마치고 갈 실습 바로가기 (lesson 또는 unit). 실습 단원 자체는 맨 아래 "실습"에 모은다. */
RS.cats = [
  { id: 'basic', title: '기본', units: ['a', 'b'] },
  { id: 'wk2', title: 'wk2 · ggplot2 기초', units: ['c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
    practice: [{ lesson: 't-36' }] },
  { id: 'wk3', title: 'wk3 · 그래프 다듬기 · CSV와 Project', units: ['l', 'm'],
    practice: [{ lesson: 't-p1' }, { lesson: 't-p3' }, { lesson: 't-p4' }, { unit: 'v' }] },
  { id: 'wk4', title: 'wk4 · dplyr', units: ['n', 'o', 'p', 'q', 'r', 's'],
    practice: [{ lesson: 't-dplyr' }, { lesson: 't-p4plot' }] },
  { id: 'wk5', title: 'wk5 · tidyr · stringr · forcats', units: ['w', 'x'],
    practice: [{ unit: 'p5' }] },
  { id: 'wk6', title: 'wk6 · 데이터 다루기 실습', units: [],
    practice: [{ unit: 'y' }, { unit: 'z' }], note: '이번 주는 실습만 있어요.' },
  { id: 'wk7', title: 'wk7 · 선형 회귀 (lm)', units: ['reg', 'mlr'],
    practice: [{ unit: 'p7' }] },
  { id: 'wk8', title: 'wk8 · 상호작용', units: ['neut', 'rev'] },
  { id: 'prac', title: '실습', units: ['t', 'u', 'v', 'p5', 'y', 'z', 'p7'], practiceCat: true,
    note: '수업 Practice, 논문 그림 따라 그리기, 연습 문제, 숙제를 직접 풀어 채점받는 곳이에요. 각 주의 끝에도 바로가기가 있어요.' },
];

(function () {
  const byId = Object.fromEntries(RS.units.map((u) => [u.id, u]));
  const listed = new Set(RS.cats.flatMap((c) => c.units));
  const rest = RS.units.filter((u) => !listed.has(u.id)).map((u) => u.id);
  if (rest.length) RS.cats.push({ id: 'etc', title: '기타', units: rest });
  RS.units = RS.cats.flatMap((c) => c.units.filter((id) => byId[id]).map((id) => Object.assign(byId[id], { cat: c.id })));
  // 최종 목표 보드: 실습 단원 순서대로, 그다음 나머지(wk7–8 종합 등)
  const pos = (g) => {
    const i = RS.units.findIndex((u) => u.lessons.some((l) => l.id === g.lesson));
    return (i >= 0 && RS.units[i].cat === 'prac' ? 0 : 1e4) + i;
  };
  RS.goals = RS.goals.map((g, k) => [pos(g), k, g]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
})();
