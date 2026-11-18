import type { stats as en } from '../en/stats';

export const stats: typeof en = {
  back: 'Voltar',
  title: 'Seu painel',
  subtitle: 'Tudo o que você assistiu, em números. Puxe para atualizar.',
  loadFailed: 'Não deu para carregar seus números.',
  emptyTitle: 'Nada para medir ainda',
  emptyBody:
    'Registre seu primeiro filme no botão + e seu painel começa a se encher.',
  movie_one: '{{count}} filme',
  movie_other: '{{count}} filmes',
  rewatch_one: '{{count}} revisão',
  rewatch_other: '{{count}} revisões',
  metrics: {
    moviesLogged: 'Filmes registrados',
    moviesLoggedHelp: 'Filmes diferentes no seu registro.',
    timesWatched: 'Vezes assistidos',
    timesWatchedHelp: 'Contando {{rewatches}}.',
    hoursWatched: 'Horas assistidas',
    hoursWatchedHelp:
      'Duração vezes quantas vezes assistiu. Filmes sem duração contam como 0.',
    averageRating: 'Nota média',
    averageRatingHelp: 'A média das suas notas, de 1 a 10.',
    favorites: 'Favoritos',
    favoritesHelp: '{{percent}}% dos seus filmes.',
    mostGivenRating: 'Nota mais dada',
    mostGivenRatingHelp: 'Dada a {{movies}}.',
    mostGivenRatingEmpty: 'Dê notas aos filmes para ver.',
  },
  perMonth: {
    title: 'Filmes por mês',
    help: 'Filmes que você assistiu em cada um dos últimos 12 meses, pela data em que assistiu.',
    label: 'Filmes assistidos por mês. {{summary}}',
    thisMonth: 'Este mês',
    bestMonth: 'Melhor mês',
    monthlyAverage: 'Média por mês',
  },
  ratings: {
    title: 'Suas notas',
    help: 'Quantos filmes receberam cada nota. Mostra se você é um crítico exigente ou generoso.',
    rowLabel: 'Nota {{rating}}: {{movies}}',
  },
  genres: {
    title: 'Gêneros favoritos',
    help: 'Seus 5 gêneros mais assistidos. Um filme com vários gêneros conta para cada um.',
    rowLabel:
      '{{position}}. {{genre}}: {{movies}}, {{percent}}% dos seus filmes',
  },
};
