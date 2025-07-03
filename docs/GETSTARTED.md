# Getting Started with Aula

This document provides an overview of the Aula application, including setup instructions and information about the development environment.

## Run aula frontend using Docker

### Local testing

Assuming you installed Docker, you can test the frontend with the default `.env.docker` which points to devel.aula.de backend with the following:

```bash
docker run --env-file .env.docker -p 3000:80 aulaapp/aula-frontend:latest
```

You can copy and edit the `.env.docker` to change the configuration.

### Production self-hosting setup

For production setup, configure your own envfile and make sure that you configure SSL either by adapting aula-frontend image, or by putting a reverse proxy with SSL in front of it.

Reach out to `dev [at] aula.de` for more information. <!-- @TODO: we should add link to docs when ready -->

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended; we test and deploy on version found in `.nvmrc`)
- Yarn (we use `yarn`, you could theoretically use `npm`)
- Docker (if you want to build/publish/deploy using Docker)

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

4. Set up Aula's API Back End based on the [Aula's Backend Repository](https://github.com/aula-app/aula-backend).

### Environment Configuration

5. Create a `.env` file based on the `.env.local` file:

   ```
   cp .env.local .env
   ```

6. Update the values in the `.env` file with your configuration:

   ```
   VITE_APP_VERSION = $npm_package_version
   VITE_APP_API_URL = http://localhost:8080/
   VITE_APP_MULTI = false
   ```

7. Start the development server:

   ```
   yarn dev
   ```

   The application will start in development mode. Open your browser to the URL shown in the terminal to view the app.

## Mobile Development

The application includes Capacitor integration for building mobile apps. To start Android development:

```bash
# Make sure to have local tooling for Android/iOS development installed
#   eg. export CAPACITOR_ANDROID_STUDIO_PATH=/opt/android-studio/bin/studio
yarn build && npx cap sync && \
   npx cap open android
```

## Deployment

Please reach out to `dev [at] aula.de` for instructions on self-hosting in production environment.

### Build and publish using Docker

To build and publish your local version of the repo:

```bash
docker build -t YOUR_ORG/aula-frontend:latest
docker push YOUR_ORG/aula-frontend:latest
```
