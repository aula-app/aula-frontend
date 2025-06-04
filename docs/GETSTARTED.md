# Getting Started with Aula

This document provides an overview of the Aula application, including setup instructions and information about the development environment.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- Yarn (preferred) or npm

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/aula-app/aula-frontend.git
   ```

2. Navigate to the project directory:

   ```
   cd aula-frontend
   ```

3. Install dependencies:
   ```
   yarn
   ```

### Database Setup and Configuration

4. Set up Aula's API Back End based on the [Aula's Backend Repository](https://github.com/aula-app/playground).

### Environment Configuration

5. Create a `.env` file based on the `.env.sample` file:

   ```
   cp .env.sample .env
   ```

6. Update the values in the `.env` file with your configuration:

   ```
   VITE_APP_VERSION = $npm_package_version
   VITE_APP_API_URL = http://localhost/
   VITE_APP_MULTI_AULA = https://neu.aula.de/instances
   VITE_APP_MULTI = false
   ```

7. Start the development server:

   ```
   yarn dev
   ```

   The application will start in development mode. Open your browser to the URL shown in the terminal to view the app.

### Available Scripts

The following yarn scripts are available:

- `yarn dev` or `yarn start`: Starts the development server
- `yarn build`: Builds the production-ready application
- `yarn build-devel`: Builds the application in development mode
- `yarn build-staging`: Builds the application in staging mode
- `yarn build-test`: Builds the application in test mode
- `yarn build-bw`: Builds the application with BW configuration
- `yarn build-single`: Builds the application in single-instance mode
- `yarn preview`: Preview the production build locally
- `yarn format`: Format src files using Prettier
- `yarn format:all`: Format all files using Prettier
- `yarn lint`: Lint source files using ESLint
- `yarn check-type` or `yarn type`: Type check TypeScript files

## Deployment

To deploy the application:

1. Build the production-ready application:

   ```
   yarn build
   ```

2. The build output will be generated in the `dist/` directory. Deploy these files to your web server.

3. For proper routing to work, ensure your web server is configured to redirect all requests to `index.html`, as this is a single-page application.

   A `_redirects` file is included in the public directory for services like Netlify:

   ```
   /*    /index.html   200
   ```

## Mobile Development

The application includes Capacitor integration for building mobile apps. To start Android development:

1. Build the web app first:

   ```
   yarn build
   ```

2. Sync the build with Capacitor:

   ```
   npx cap sync
   ```

3. Open the Android project:
   ```
   npx cap open android
   ```
