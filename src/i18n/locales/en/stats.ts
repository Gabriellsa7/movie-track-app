export const stats = {
  back: 'Back',
  title: 'Your dashboard',
  subtitle: 'Everything you watched, in numbers. Pull down to refresh.',
  loadFailed: "Couldn't load your stats.",
  emptyTitle: 'Nothing to measure yet',
  emptyBody:
    'Log your first movie with the + button and your dashboard starts filling up.',
  movie_one: '{{count}} movie',
  movie_other: '{{count}} movies',
  rewatch_one: '{{count}} rewatch',
  rewatch_other: '{{count}} rewatches',
  metrics: {
    moviesLogged: 'Movies logged',
    moviesLoggedHelp: 'Different movies in your log.',
    timesWatched: 'Times watched',
    timesWatchedHelp: 'Counting {{rewatches}}.',
    hoursWatched: 'Hours watched',
    hoursWatchedHelp:
      'Runtime times watches. Movies without a runtime count as 0.',
    averageRating: 'Average rating',
    averageRatingHelp: 'The mean of your ratings, from 1 to 10.',
    favorites: 'Favorites',
    favoritesHelp: '{{percent}}% of your movies.',
    mostGivenRating: 'Most given rating',
    mostGivenRatingHelp: 'Given to {{movies}}.',
    mostGivenRatingEmpty: 'Rate movies to see it.',
  },
  perMonth: {
    title: 'Movies per month',
    help: 'Movies you watched in each of the last 12 months, by watched date.',
    label: 'Movies watched per month. {{summary}}',
    thisMonth: 'This month',
    bestMonth: 'Best month',
    monthlyAverage: 'Monthly average',
  },
  ratings: {
    title: 'Your ratings',
    help: 'How many movies got each rating. Shows if you are a tough or a generous critic.',
    rowLabel: 'Rating {{rating}}: {{movies}}',
  },
  genres: {
    title: 'Top genres',
    help: 'Your 5 most watched genres. A movie with several genres counts for each one.',
    rowLabel:
      '{{position}}. {{genre}}: {{movies}}, {{percent}}% of your movies',
  },
};
