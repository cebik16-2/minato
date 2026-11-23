# Minato

Minato is a marketplace for second-hand goods. The first focus is audio equipment, such as speakers.
Users register, post listings, and browse listings from other users.

The project is a work in progress. Some features exist only in the frontend.
Read [Known gaps](#known-gaps) before you treat a feature as finished.

## Table of Contents

- [What the app does](#what-the-app-does)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Usage](#usage)
- [API endpoints](#api-endpoints)
- [Admin screens](#admin-screens)
- [Tests and static analysis](#tests-and-static-analysis)
- [Continuous integration](#continuous-integration)
- [Deployment](#deployment)
- [Known gaps](#known-gaps)
- [Contributing](#contributing)
- [License](#license)

## What the app does

- **Accounts.** Devise handles sign-up and sign-in. The API returns a JSON Web Token (JWT).
  The React client stores the token in `localStorage` and sends it in the `Authorization` header.
- **Listings.** Users create, read, update, and delete products. Active Storage holds the images.
  `app/controllers/products_controller.rb` limits update, destroy, and file detach to the owner
  through `authorize_owner!`.
- **Browse and filter.** The React client loads `/listings`, `/cities`, and `/favorites`.
  It then filters by title, price range, and location, and sorts by price or title, in the browser.
  See `client/src/utils/filterAndSortListings.jsx` and `client/src/components/shared/FilterBar.jsx`.
- **Favorites.** `Favorite` rows link a user to a product
  (`app/models/favorite.rb`, `app/controllers/favorites_controller.rb`).
- **Pagination.** Kaminari paginates products on the server (`Product.page(params[:page]).per(params[:per])`).
- **Responsive layout.** `client/src/components/ListingsGrid.jsx` uses MUI Grid breakpoints
  (`xs={12} sm={6} md={4}`), so the listing grid changes column count with the viewport width.

## Architecture

Two frontends live in this one repository.

| Part | Where | What it is |
| --- | --- | --- |
| Rails API | `app/`, `config/` | Rails 8 in API mode (`config.api_only = true`). Serves JSON on the routes in `config/routes.rb`. |
| Hotwire assets | `app/javascript/` | `application.js` loads Turbo and the Stimulus controllers in `app/javascript/controllers`. `webpack.config.js` builds that entry into `app/assets/builds`. The controllers are still the Rails scaffold examples. |
| React app | `client/` | A separate Vite + React application. This is the real user interface. It calls the Rails API over HTTP. |

The React dev server listens on port 5173. `client/vite.config.ts` proxies `/api` to
`http://localhost:3000`. `config/initializers/cors.rb` allows the origins
`http://localhost:5173` and `http://127.0.0.1:5173`. Those origins are hard-coded; they do not
come from the environment.

## Tech stack

Backend:

- Ruby 3.4.1 (`.ruby-version`), Rails `~> 8.0.1` (`Gemfile`).
- PostgreSQL (`config/database.yml`).
- Devise and devise-jwt for authentication, rack-cors for cross-origin requests,
  active_model_serializers and kaminari for JSON output and paging.
- Puma behind Thruster, Solid Queue / Solid Cache / Solid Cable, Kamal for deploys (`Dockerfile`).

Frontend, the React app in `client/`:

- Node 18.20.5 (`.node-version`), Vite 6, React 18, React Router 7, TypeScript 5.6 config files.
- **Material UI (MUI) v6** supplies the components and the theme. MUI is used **only** in
  `client/`. Every file that imports `@mui/*` lives under `client/`; the root Rails asset code
  imports none of it. The theme is `client/src/styles/themes.jsx`.
- **State management: React Context plus custom hooks.** There is no Redux in this repository.
  `client/src/context/AuthContext.jsx` holds the token and user id and exposes `useAuth()`.
  `client/src/hooks/` holds `useListings`, `useListingDetails`, `useLoginForm`, `usePagination`,
  and `useUsers`. `client/src/services/` holds the `fetch` calls.

## Requirements

- Ruby 3.4.1 (see `.ruby-version`).
- Node 18.20.5 and npm (see `.node-version`).
- A running PostgreSQL server.
- libpq / `pg_config`, so Ruby can build the `pg` gem.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cebik16-2/minato.git
   cd minato
   ```

1. Set the database variables. See [Environment variables](#environment-variables).

1. Run the setup script:

   ```bash
   bin/setup
   ```

   `bin/setup` runs `bundle install`, `yarn install --check-files`, and `bin/rails db:prepare`,
   clears logs and temp files, and then starts `bin/dev`. Pass `--skip-server` to stop before the
   server starts.

1. Install the React dependencies yourself. `bin/setup` does not touch `client/`:

   ```bash
   cd client
   npm install
   ```

## Environment variables

Database, read by `config/database.yml`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `MINATO_DATABASE_USERNAME` | `minato` | PostgreSQL user. Production has no default. |
| `MINATO_DATABASE_PASSWORD` | `minato` | PostgreSQL password. Production has no default. |
| `DB_HOST` | `localhost` | PostgreSQL host. |
| `DB_PORT` | `5432` | PostgreSQL port. |
| `RAILS_MAX_THREADS` | `5` | Connection pool size and Puma thread count. |

Authentication, read by `config/initializers/devise.rb`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `DEVISE_JWT_SECRET_KEY` | `Rails.application.credentials.secret_key_base` | Signs the JWT. Set it in every environment. Tokens expire after one day. |

React client, read by `client/src/services/helpers.jsx`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://127.0.0.1:3000` | Base URL of the Rails API. Vite reads it from the shell or from a file such as `client/.env.local`. |

```bash
# client/.env.local
VITE_API_URL=http://127.0.0.1:3000
```

Development mail, read by `config/environments/development.rb`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SMTP_ADDRESS` | none | SMTP host. If it is unset, development does not use SMTP. |
| `SMTP_PORT` | `587` | SMTP port. |
| `SMTP_DOMAIN` | none | SMTP HELO domain. |
| `SMTP_USER_NAME` | none | SMTP login. |
| `SMTP_PASSWORD` | none | SMTP password. |

Server and deploy:

| Variable | Where |
| --- | --- |
| `RAILS_MASTER_KEY` | Decrypts `config/credentials.yml.enc`. Kamal injects it. |
| `KAMAL_REGISTRY_PASSWORD` | Container registry password. See `.kamal/secrets`. |
| `PORT` | Puma port. Default 3000 (`config/puma.rb`). |
| `RAILS_ENV`, `RAILS_LOG_LEVEL` | Rails environment and log level. |
| `WEB_CONCURRENCY`, `JOB_CONCURRENCY`, `SOLID_QUEUE_IN_PUMA`, `DB_HOST` | Set in `config/deploy.yml`. |

There are **no** admin or basic-auth variables. Nothing in this repository reads an `ADMIN_*`
environment variable.

## Usage

Start the Rails API on port 3000, in the first terminal:

```bash
bin/rails server
```

`bin/dev` is an alternative. It runs the Rails server and the root JavaScript build in watch mode,
from `Procfile.dev`.

Start the React app on port 5173, in a second terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

New accounts must confirm their email address. The `User` model enables the Devise `:confirmable`
module. With `SMTP_ADDRESS` unset, development does not send the confirmation email. Either set the
`SMTP_*` variables or confirm the user in the Rails console:

```ruby
User.find_by(email: "you@example.com").confirm
```

## API endpoints

`config/routes.rb` defines these routes. "JWT" means the request needs an `Authorization: Bearer`
token.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/up` | none | Health check. |
| `POST` | `/users/sign_in` | none | Login. Returns `{ message, user, token }`. |
| `DELETE` | `/users/sign_out` | JWT | Logout. |
| `POST` | `/users` | none | Sign-up (Devise `:registerable`). |
| `GET` | `/users` | JWT | All users, through `UserSerializer`. |
| `GET` | `/users/:id` | JWT | One user. |
| `GET` | `/users/:user_id/products` | none | Products of one user. |
| `POST` | `/users/:user_id/products` | JWT | Create a product for one user. |
| `GET` | `/products` | none | Paged list. Accepts `page` and `per`. |
| `GET` | `/products/:id` | none | One product. |
| `PATCH` / `PUT` | `/products/:id` | JWT, owner | Update a product. |
| `DELETE` | `/products/:id` | JWT, owner | Delete a product. |
| `DELETE` | `/products/:id/detach_file/:file_id` | JWT, owner | Detach one attached file. |
| `GET` | `/listings` | none | All listings. |
| `GET` | `/listings/:id` | none | One listing. |
| `GET` | `/categories` | none | Category list. |
| `GET` | `/cities` | none | City list. |
| `GET` | `/favorites` | JWT | Favorites of the current user. |
| `POST` | `/favorites` | JWT | Add a favorite. |
| `DELETE` | `/favorites/:id` | JWT | Remove a favorite. |
| `GET` | `/` | none | Rails scaffold page (`welcome#index`). |

Devise also generates the standard routes for password reset, email confirmation, and account
unlock, because `app/models/user.rb` enables `:recoverable`, `:confirmable`, and `:lockable`.

## Admin screens

`client/src/pages/admin/` holds five pages. `client/src/App.jsx` routes them at `/admin`,
`/admin/listings`, `/admin/users`, `/admin/reports`, and `/admin/settings`.

The five routes are wrapped in a `RequireAuth` guard (`client/src/components/RequireAuth.jsx`):
an anonymous visitor is sent back to the site and the login dialog opens. That is authentication
only. There is still no role check, because the backend has no admin flag:

- Four of the five pages render static placeholder text. `AdminDashboardPage.jsx` only links to
  the other four.
- The `users` table has no `admin` column (`db/schema.rb`).
- `config/routes.rb` has no admin route.
- No controller checks for an admin role.

Any signed-in user can still open these pages. Do not treat them as an administrative interface
until the `users` table gains an admin flag and the API enforces it.

## Tests and static analysis

- **Rails tests: none.** There is no `test/` directory, and `config/application.rb` does not
  require `rails/test_unit/railtie`. `bin/rails test` therefore runs zero tests.
- **React tests: not wired up.** `client/src/App.test.jsx` exists, but `client/package.json`
  defines no `test` script and installs no test runner.
- Ruby static analysis and security scan:

  ```bash
  bin/rubocop
  bin/brakeman --no-pager
  ```

- Frontend lint:

  ```bash
  cd client && npm run lint
  ```

  This runs `eslint .` with `client/eslint.config.js`. It passes today.

- Frontend build: `cd client && npm run build` **fails**. The script runs `tsc -b && vite build`,
  and `tsc -b` stops with `TS5083` because `client/tsconfig.json` does not exist. `npx vite build`
  on its own succeeds.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on every push to `main`. It has four jobs:

| Job | What it does |
| --- | --- |
| `scan_ruby` | Brakeman security scan. |
| `lint` | RuboCop style check. |
| `frontend` | `npm install` and `npm run lint` in `client/`. |
| `test` | Boots the Rails app, prepares the test database, and runs `bin/rails test` against a PostgreSQL service container. |

`.github/dependabot.yml` opens pull requests for bundler, GitHub Actions, and npm (the root
`package.json` and `client/package.json`).

## Deployment

Kamal deploys the app. `bin/kamal deploy` builds the image from `Dockerfile` and rolls it out with
the settings in `config/deploy.yml`.

**`config/deploy.yml` is not configured.** It still holds the Kamal placeholders
(`image: your-user/minato`, `proxy.host: app.example.com`, server `192.168.0.1`,
`registry.username: your-user`). Fill them in before you run any deploy. A warning block at the top
of the file says the same thing.

The Docker image builds the Rails app only. It does not build `client/`. If you deploy the React
app, serve `client/dist` yourself, for example from a static host or a CDN.

`.kamal/secrets` reads `KAMAL_REGISTRY_PASSWORD` from the environment and `RAILS_MASTER_KEY` from
`config/master.key`. Never commit `config/master.key`; `.gitignore` already excludes it.

## Known gaps

- Admin screens need a login but have no role check, so any signed-in user can open them.
  See [Admin screens](#admin-screens).
- There are no Rails tests, and `rails/test_unit/railtie` is not required.
- `client/eslint.config.js` only matches `**/*.{ts,tsx}`, so `npm run lint` checks none of the
  65 `.jsx` files and always passes.
- CORS origins are hard-coded for `localhost:5173`.
- `client/src/hooks/useFetch.jsx` is an empty file.
- `app/controllers/registrations_controller.rb` defines `Users::RegistrationsController`, but
  `config/routes.rb` does not use it, so Devise's default registration controller handles sign-up.

## Contributing

1. Branch from `main`.
1. Run `bin/setup`, then `cd client && npm install`.
1. Before you push, run these checks:

   ```bash
   bin/rubocop
   bin/brakeman --no-pager
   cd client && npm run lint
   ```

1. Open a pull request. Continuous integration must be green.
1. Keep the style that is already in the codebase. Ruby follows the Rails omakase RuboCop config in
   `.rubocop.yml`. The frontend follows `client/eslint.config.js`.

Write clear commit messages. One commit does one thing.

## License

MIT. See [LICENSE](LICENSE).
