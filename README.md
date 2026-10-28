# Movie Track — App

Native app (Android / iOS) of **Movie Track**, a personal movie log: log the
movies you watched with a rating and a review, keep a watchlist of the next
ones, see your stats and browse other people's profiles.

It consumes the [Movie Track API](https://github.com/Gabriellsa7/movie-track)
and has the same screens as the web app.

## Stack

Expo SDK 58 · React Native · Expo Router · TypeScript (strict) · ESLint
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

Before pushing:

```bash
yarn format:check && yarn lint && yarn typecheck && yarn doctor
```

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
