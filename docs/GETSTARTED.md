# Getting Started to Aula

This document provides an overview of the Aula application, including setup instructions and information about the development environment.

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm (version 7 or higher recommended)

## Getting Started

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
   npm install
   ```

### Database Setup and Configuration

4. Set up aula's API Back End based on the [Aula's Backend Repository](https://github.com/aula-app/playground).

### Environment Configuration

5. Create a `.env` file based on the `.env.sample` file:

   ```
   cp .env.sample .env
   ```

6. Update the values in the `.env` file with your configuration:

   ```
   VITE_APP_VERSION = $npm_package_version
   VITE_APP_API_URL = http://localhost/
   VITE_APP_MULTI_AULA = https://m.aula.de/instances
   VITE_APP_MULTI = false
   ```

7. Start the development server:

   ```
   npm run dev
   ```

   The application will start in development mode. Open your browser to the URL shown in the terminal to view the app.

### Available Scripts

The following npm scripts are available:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the production-ready application
- `npm run build-devel`: Builds the application in development mode
- `npm run build-test`: Builds the application in test mode
- `npm run preview`: Preview the production build locally
- `npm run format`: Format source files using Prettier
- `npm run lint`: Lint source files using ESLint
- `npm run check`: Type check TypeScript files
- `npm run type`: Alias for TypeScript checking

## Deployment

To deploy the application:

1. Build the production-ready application:

   ```
   npm run build
   ```

2. The build output will be generated in the `dist/` directory. Deploy these files to your web server.

3. For proper routing to work, ensure your web server is configured to redirect all requests to `index.html`, as this is a single-page application.

   If using Nginx, you might add this to your server configuration:

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```
