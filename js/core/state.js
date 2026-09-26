const SUBJECTS = [
  { id: 'algoritmo', name: 'Algoritmo',       color: '#0071e3', code: 'AL', blurb: 'Lógica, estruturas de dados e resolução de problemas.' },
  { id: 'bd',        name: 'Banco de Dados',  color: '#34c759', code: 'BD', blurb: 'Modelagem, SQL e consultas eficientes.' },
  { id: 'ti',        name: 'TI',              color: '#ff9500', code: 'TI', blurb: 'Fundamentos e prática de Tecnologia da Informação.' },
  { id: 'arqcomp',   name: 'ArqComp',         color: '#af52de', code: 'AC', blurb: 'Arquitetura de computadores e organização de hardware.' },
  { id: 'so',        name: 'Intro a SO',      color: '#ff3b30', code: 'SO', blurb: 'Processos, memória e sistemas operacionais.' }
];
const subjectById = id => SUBJECTS.find(s => s.id === id);

const S = { subjects: [], tasks: [], logs: [] };
