# File Picker Demo

## Running the Project

- Create a `.env.local` file based on `.env.example` (or provide the necessary environment variables).
- Install dependencies (`pnpm install`).
- Build the app (`pnpm build`) and start the production server (`pnpm start`). Alternatively, run the development server (`pnpm dev`).

## Technical Choices

### Security

- All data from untrusted sources (API calls, environment variables, etc.) is validated using Zod.
- Email and password validation is handled server-side with Zod to prevent unnecessary requests to the service. At the same time, the form includes (currently rough-looking) client-side validation.
- The authentication token is stored as an HTTP-only cookie, preventing client-side access by either the app itself or third parties.

### Code Organization

- The code is structured so that modules are as close as possible to the files that reference them.
- The dashboard code is placed within a route group `(dashboard)`, allowing shared files and layout components to be kept together.

### Authentication Flow

- Token validation is handled within the dashboard layout. If validation fails, the user is redirected to the login page.
- The login page also validates the token, displaying user information and allowing them to log out if a token already exists. We do not enforce a redirect here, ensuring that users can manually refresh their token if they become blocked for any reason.
- The login process runs within a server action, where the resolved token is stored in a secure cookie. In a real-world scenario, a refresh token would also be stored to obtain a new token once the current one expires.

### Data Fetching

- Resource requests are handled client-side using React Query. This approach prevents significant delays that would occur if these expensive requests were moved to the server.
- The Google Drive file picker modal is triggered by a button inside a component, and its initial request is prefetched as soon as the trigger component is rendered.
- Resource fetching follows a uniform approach, regardless of whether a root ID is present. In this setup, the ID serves as a dependency key.
- The connection ID is marked as a dependency of the resources query, ensuring that the query waits for resolution before making the actual request. Initially, we considered resolving it if it didn’t exist as a header, but this could introduce race conditions, which we wanted to avoid at all costs.

### Performance

- The modal dialog component is not rendered until it has been opened at least once.
- That component (as well as the Google Drive section) is loaded dynamically to aid in code-splitting. However, SSR is enabled to prevent waterfall requests that would otherwise delay client-side component resolution.

### File Picker

- Selected file and folder IDs are not stored at the root level. Instead, they are included as form fields so they can be retrieved when needed without causing unnecessary re-renders.
- Since we do not want to include child IDs when a folder is selected, we mark the checkbox as selected but do not include the hidden field. This prevents the need for deep traversal of the array to disable individual values.
