# Aula App

Stack: React + Material UI + Auth starter using TypeScript

## React App Documentation

This document provides an overview of the React application, including setup instructions and information about the development environment.

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Getting Started

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

5. Create a `.env.development` file based on the `.env.sample` file:

   ```
   cp .env.sample .env.development
   ```

6. Update the values in the `.env.development` file with your aula's API backend configuration on VITE_APP_API_URL:

   ```
    VITE_APP_API_URL = https://your-api-endpoint.com
    VITE_APP_MULTI = false
   ```

7. Start the development server:

   ```
   npm start
   ```

   The application should now be running at the Apache's defined location.

### Scripts

The following npm scripts are available:

- `npm start`: Starts the development server.
- `npm run build`: Builds the production-ready application.

### Deployment

To deploy the application, follow these steps:

1. Build the production-ready application:

   ```
   npm run build
   ```

2. Deploy the contents of the `build/` directory to your hosting platform.

For more detailed deployment instructions, please refer to the [Create React App documentation](https://create-react-app.dev/docs/deployment/).
