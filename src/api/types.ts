import type { components, operations } from './schema';

// openapi-typescript generates aliases; Pick turns each one into something an interface can extend.
type TSchema<TName extends keyof components['schemas']> = Pick<
  components['schemas'][TName],
  keyof components['schemas'][TName]
>;
type TQuery<TOperation extends keyof operations> = Pick<
  NonNullable<operations[TOperation]['parameters']['query']>,
  keyof NonNullable<operations[TOperation]['parameters']['query']>
>;

export interface IAuthTokens extends TSchema<'AuthTokens'> {}
export interface ILoginBody extends TSchema<'Login'> {}
export interface IResetPasswordBody extends TSchema<'ResetPassword'> {}

export interface IUser extends TSchema<'User'> {}
export interface IUserProfile extends TSchema<'UserProfile'> {}
export interface IUserSummary extends TSchema<'UserSummary'> {}
export interface IUserPage extends TSchema<'UserPage'> {}
export interface IUserStats extends TSchema<'UserStats'> {}
export interface INewUserBody extends TSchema<'NewUser'> {}
export interface IUpdateUserBody extends TSchema<'UpdateUser'> {}
export interface IChangePasswordBody extends TSchema<'ChangePassword'> {}
export interface IListUsersQuery extends TQuery<'getUsers'> {}

export interface IGenre extends TSchema<'Genre'> {}

export interface IMovie extends TSchema<'Movie'> {}
export interface IMoviePage extends TSchema<'MoviePage'> {}
export interface INewMovieBody extends TSchema<'NewMovie'> {}
export interface IUpdateMovieBody extends TSchema<'UpdateMovie'> {}
export interface IRewatchMovieBody extends TSchema<'MovieRewatch'> {}
export interface IListMoviesQuery extends TQuery<'getMovies'> {}

export interface IWatchlistItem extends TSchema<'WatchlistItem'> {}
export interface IWatchlistPage extends TSchema<'WatchlistPage'> {}
export interface INewWatchlistItemBody extends TSchema<'NewWatchlistItem'> {}
export interface IUpdateWatchlistItemBody extends TSchema<'UpdateWatchlistItem'> {}
export interface IWatchlistItemWatchedBody extends TSchema<'WatchlistItemWatched'> {}
export interface IListWatchlistQuery extends TQuery<'getWatchlist'> {}

export interface ITmdbMovie extends TSchema<'MovieSearchResult'> {}
export interface ITmdbMoviePage extends TSchema<'MovieSearchPage'> {}
export interface ITmdbSearchQuery extends TQuery<'searchTmdbMovies'> {}

export interface IApiErrorBody extends TSchema<'Error'> {}
export interface IFieldError extends TSchema<'FieldError'> {}
