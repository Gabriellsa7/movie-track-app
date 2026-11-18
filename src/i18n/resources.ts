import { account as accountEn } from './locales/en/account';
import { auth as authEn } from './locales/en/auth';
import { common as commonEn } from './locales/en/common';
import { errors as errorsEn } from './locales/en/errors';
import { navigation as navigationEn } from './locales/en/navigation';
import { validation as validationEn } from './locales/en/validation';
import { home as homeEn } from './locales/en/home';
import { movies as moviesEn } from './locales/en/movies';
import { stats as statsEn } from './locales/en/stats';
import { users as usersEn } from './locales/en/users';
import { watchlist as watchlistEn } from './locales/en/watchlist';
import { account as accountPt } from './locales/pt-BR/account';
import { auth as authPt } from './locales/pt-BR/auth';
import { common as commonPt } from './locales/pt-BR/common';
import { errors as errorsPt } from './locales/pt-BR/errors';
import { navigation as navigationPt } from './locales/pt-BR/navigation';
import { validation as validationPt } from './locales/pt-BR/validation';
import { home as homePt } from './locales/pt-BR/home';
import { movies as moviesPt } from './locales/pt-BR/movies';
import { stats as statsPt } from './locales/pt-BR/stats';
import { users as usersPt } from './locales/pt-BR/users';
import { watchlist as watchlistPt } from './locales/pt-BR/watchlist';

export const EN_TRANSLATION = {
  account: accountEn,
  auth: authEn,
  common: commonEn,
  errors: errorsEn,
  navigation: navigationEn,
  validation: validationEn,
  home: homeEn,
  movies: moviesEn,
  stats: statsEn,
  users: usersEn,
  watchlist: watchlistEn,
};

export const PT_BR_TRANSLATION: typeof EN_TRANSLATION = {
  account: accountPt,
  auth: authPt,
  common: commonPt,
  errors: errorsPt,
  navigation: navigationPt,
  validation: validationPt,
  home: homePt,
  movies: moviesPt,
  stats: statsPt,
  users: usersPt,
  watchlist: watchlistPt,
};

export const RESOURCES = {
  en: { translation: EN_TRANSLATION },
  'pt-BR': { translation: PT_BR_TRANSLATION },
};
