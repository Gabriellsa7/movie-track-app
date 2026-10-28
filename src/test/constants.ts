export const USER_ID = '64b7f0c2a1b2c3d4e5f60718';
export const MOVIE_ID = '64b7f0c2a1b2c3d4e5f60719';
export const ITEM_ID = '64b7f0c2a1b2c3d4e5f6071a';

function base64Url(value: string) {
  return btoa(value).replace(/=+$/, '');
}

// JWTs whose payload is { "sub": USER_ID }; the app only decodes them.
export const ACCESS_TOKEN = `${base64Url('{"alg":"HS256"}')}.${base64Url(JSON.stringify({ sub: USER_ID }))}.signature`;
export const REFRESH_TOKEN = `${base64Url('{"alg":"HS256"}')}.${base64Url(JSON.stringify({ sub: USER_ID, jti: 'r1' }))}.signature`;
