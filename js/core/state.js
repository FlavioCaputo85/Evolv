const PALETTE = ['#0071e3', '#34c759', '#ff9500', '#af52de', '#ff3b30', '#5ac8fa', '#ffcc00', '#30d158', '#bf5af2', '#64d2ff'];

const COURSES = [
  { code: 'ADS', name: 'Análise e Desenvolvimento de Sistemas', subjects: ['Algoritmo', 'Banco de Dados', 'TI', 'ArqComp', 'Intro a SO'] },
  { code: 'CC', name: 'Ciência da Computação', subjects: ['Algoritmo', 'Estrutura de Dados', 'ArqComp', 'Banco de Dados', 'Intro a SO', 'Cálculo'] },
  { code: 'ES', name: 'Engenharia de Software', subjects: ['Algoritmo', 'Engenharia de Requisitos', 'Banco de Dados', 'ArqComp', 'Intro a SO'] },
  { code: 'SI', name: 'Sistemas de Informação', subjects: ['Algoritmo', 'Banco de Dados', 'TI', 'Gestão de Projetos', 'Intro a SO'] },
  { code: 'RC', name: 'Redes de Computadores', subjects: ['Algoritmo', 'Redes de Computadores', 'ArqComp', 'TI', 'Intro a SO'] },
  { code: 'EC', name: 'Engenharia da Computação', subjects: ['Algoritmo', 'ArqComp', 'Circuitos Digitais', 'Banco de Dados', 'Intro a SO'] }
];
const courseByCode = code => COURSES.find(c => c.code === code);
const findCourses = q => {
  const t = (q || '').trim().toLowerCase();
  if (!t) return [];
  return COURSES.filter(c => c.code.toLowerCase().includes(t) || c.name.toLowerCase().includes(t)).slice(0, 6);
};

const subjectCode = name => {
  const words = name.trim().split(/\s+/).filter(w => !['de', 'da', 'do', 'e', 'a', 'em'].includes(w.toLowerCase()));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};
const nextColor = usedCount => PALETTE[usedCount % PALETTE.length];

const S = { subjects: [], tasks: [], logs: [], user: null };
const subjectById = id => S.subjects.find(s => s.id === id);
