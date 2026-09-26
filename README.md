# NPA Property Survey App

React Native (Expo) mobile app for Nagar Panchayat property workflows:

- Numbering
- Survey
- Tax Collection
- Admin user/reporting
- Offline SQLite + manual REST sync

## Run

```bash
npm install
npm run start
```

For Android:

```bash
npm run android
```

## Users

- `admin / admin`
- `number/ number`

## Key Files

- `App.tsx` - app entry
- `src/navigation/AppNavigator.tsx` - role-based routing
- `src/db/database.ts` - SQLite schema + seed data
- `src/services/*.ts` - module logic and sync service
- `REFACTORED_REQUIREMENTS.md` - refactored requirement and flows
