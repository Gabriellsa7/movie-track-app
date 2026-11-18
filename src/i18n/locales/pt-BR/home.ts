import type { home as en } from '../en/home';

export const home: typeof en = {
  title: 'Início',
  openAccount: 'Abrir conta',
  greeting: {
    morning: 'Bom dia',
    afternoon: 'Boa tarde',
    evening: 'Boa noite',
  },
  stats: {
    summary: 'Resumo',
    title: 'Seus números',
    seeDashboard: 'Ver painel',
    loadFailed: 'Não deu para carregar seus números.',
    movies: 'Filmes',
    averageRating: 'Nota média',
    favorites: 'Favoritos',
    hours: 'Horas',
    openDashboard: 'Abrir seu painel',
    openDashboardHint: 'Mostra suas tendências, notas e gêneros favoritos',
    dashboardTip:
      'Toque para abrir seu painel: filmes por mês, notas e gêneros favoritos.',
  },
  perMonth: {
    title: 'Filmes por mês',
    label: 'Filmes por mês. {{summary}}',
    hint: 'Abre seu painel',
  },
  next: {
    title: 'Próximo filme',
    seeList: 'Ver lista',
    loadFailed: 'Não deu para carregar o próximo filme.',
    emptyTitle: 'Nenhum filme agendado',
    emptyBody: 'Escolha um dia para um filme da sua lista.',
    markWatched: 'Marcar {{title}} como assistido',
    watchedIt: 'Já assisti',
  },
  recent: {
    title: 'Assistidos recentemente',
    seeAll: 'Ver todos',
    loadFailed: 'Não deu para carregar seus filmes.',
    empty: 'Nenhum filme registrado ainda',
  },
};
