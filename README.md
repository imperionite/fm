# fm

Frontend service for the PT micro-service project.

## Commands

All commands are run from the gui/ directory of the project, from a terminal:

| Command        | Action                                       |
| :------------- | :------------------------------------------- |
| `yarn install` | Installs dependencies                        |
| `yarn dev`     | Starts local dev server at `localhost:5173`  |
| `yarn build`   | Build your production site to `./dist/`      |
| `yarn preview` | Preview your build locally, before deploying |
| `yarn lint`    | Code linting                                 |

## PWA Support

The app is configured as a Progressive Web App (PWA) using vite-plugin-pwa.

- Active only in production builds
- Auto-generated service worker with auto-update
- Offline support and installable on devices
- Manifest defines app name, theme color, and icons.
