# Movie Track — App

Native app (Android / iOS) of **Movie Track**, a personal movie log: log the
movies you watched with a rating and a review, keep a watchlist of the next
ones, see your stats and browse other people's profiles.

It consumes the [Movie Track API](https://github.com/Gabriellsa7/movie-track)
and has the same screens as the web app.

## Stack

Expo SDK 58 · React Native · Expo Router · NativeWind · TypeScript (strict) · ESLint
(`eslint-config-expo`) · Prettier · Husky + commitlint.

## Requirements

- Node 24 (`.nvmrc`) and Yarn 1
- Expo Go on the phone, matching SDK 58
- The API running on your computer. The phone can't reach `localhost`: use
  your computer's LAN IP (`http://192.168.x.x:3000`), or `http://10.0.2.2:3000`
  on the Android emulator. CORS doesn't apply to native apps.

## Getting started

```bash
yarn
yarn start          # scan the QR code with Expo Go
```

Install native-aware packages with `npx expo install <package>`, which picks
the versions that match the SDK.

## Scripts

| Script                         | What it does                            |
| ------------------------------ | --------------------------------------- |
| `yarn start`                   | Expo dev server                         |
| `yarn android` / `ios` / `web` | Dev server opening that platform        |
| `yarn lint` / `lint:fix`       | ESLint with type-aware rules            |
| `yarn format` / `format:check` | Prettier                                |
| `yarn typecheck`               | `tsc --noEmit`                          |
| `yarn doctor`                  | `expo-doctor` (SDK and config problems) |
| `yarn test` / `test:watch`     | Jest (jest-expo)                        |
| `yarn test:coverage`           | Tests with the 80% coverage threshold   |
| `yarn build:apk`               | EAS preview APK for Android             |

Before pushing:

```bash
yarn format:check && yarn lint && yarn typecheck && yarn test:coverage && yarn doctor
```

## Styles

- [NativeWind](https://www.nativewind.dev) 4 (Tailwind 3 classes). Colors are
  CSS variables set on the root view with `vars()` (`src/theme/`), with the
  same token names as the web: `bg-surface`, `text-muted`, `bg-accent`…
- The theme preference (dark, light, system) is saved in AsyncStorage and
  applied with NativeWind's `colorScheme`; dark is the default.
- Fonts: `font-sans`, `font-medium`, `font-semibold`, `font-bold` (Inter) and
  `font-display` (Bebas Neue, titles and big numbers), loaded while the splash
  screen is up.

## Preview APK (EAS)

The `preview` profile in `eas.json` builds an installable APK for the
portfolio; there is no store release.

1. Create an account on [expo.dev](https://expo.dev) and run
   `npx eas-cli@latest login`.
2. Link the project once: `npx eas-cli@latest init` (adds the project id to
   the app config).
3. Set `EXPO_PUBLIC_API_URL` to the deployed API in the **preview**
   environment: `npx eas-cli@latest env:create --environment preview --name EXPO_PUBLIC_API_URL --value https://<api-url> --visibility plaintext`.
4. `yarn build:apk`, then share the APK link from the build page.

The icons and the splash are placeholders until the logo exists.

## Tests

Jest with `jest-expo` and React Native Testing Library 14 (its `render`,
`renderHook`, `fireEvent` and `act` are async: always `await` them). Test files
sit next to the code, named `describe('When we …')` / `it('should …')`.

- API calls are answered by `axios-mock-adapter` (`src/test/mock-api.ts`);
  unmatched requests fail.
- `src/test/setup.ts` mocks SecureStore (in memory), AsyncStorage, NetInfo and
  sonner-native, and resets the session, the query cache and the adapter
  after each test. `EXPO_PUBLIC_API_URL` is set in `src/test/env.js`.
- Protected routes are tested with `renderRouter` from
  `expo-router/testing-library`.

## Conventions

- Routes live in `src/app/` (Expo Router) and only re-export screens; the rest
  of the code lives in `src/`.
- Files in kebab-case (`movie-card.tsx`, `home.screen.tsx`); components in
  PascalCase (`MovieCard`).
- Interfaces `I*`, type aliases `T*`, enums `E*`, constants `UPPER_SNAKE_CASE`.
- Code, comments and commits in English; UI texts in pt-BR.
- Conventional Commits, checked by commitlint on every commit.
- Imports from `src` use the `@/` alias.
- ESLint stays on v9: `eslint-plugin-react` (inside `eslint-config-expo`) does
  not support ESLint 10 yet.
