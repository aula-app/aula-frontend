# Aula App

_Aula_ is an innovative participation concept that enables young people to actively participate in their School's everyday life. With the help of an online platform and didactic support, aula promotes democratic practices and competences.

For an overview to _Aula_'s thought and workflow, please read the [introduction to _Aula_](docs/INTRODUCTION.md) document.

## About Aula Frontend

Aula Frontend is a modern web application built with a robust tech stack:

### Tech Stack

- **React**: Our frontend framework of choice
- **Material UI**: UI component library
- **TypeScript**: Adds static typing to enhance code quality and maintainability
- **Vite**: For building frontend
- **Capacitor**: For building Android and iOS applications
- **i18next**: Robust internationalization framework
- **React Router**: For seamless client-side routing
- **React Hook Form**: Efficient form handling with validation
- **React Markdown**: For rich editing of markdown content

For detailed setup instructions, see our [Getting Started Guide](docs/GETSTARTED.md).

For more information about the project, visit [aula.de](https://www.aula.de).

### Running and testing locally

Check if your NodeJS version matches ours from `.nvmrc` file.

```sh
# Run the aula-frontend in development mode locally
npm run dev

# In another terminal, run the tests against the local aula-frontend
npx playwright test --headed
```

### Running and testing locally with docker

```sh
# Run the aula-frontend in docker container locally
docker run --env-file .env.docker -p 3000:80 aulaapp/aula-frontend:latest

# In another terminal, run the tests against the local aula-frontend
docker run -p 4000:4000 --network host --rm --init \
  --add-host=hostmachine:host-gateway -v $(pwd):/home/pwuser \
  -it mcr.microsoft.com/playwright:v1.54.1-jammy \
  /bin/sh -c "cd /home/pwuser && npx playwright install && npx playwright test"
```

## License
See `LICENSE.txt`. Licensed under the EUPL-1.2 or later. You may obtain a copy of the license at https://interoperable-europe.ec.europa.eu/collection/eupl/eupl-text-eupl-12.

## Contributing

Please read our [Contributing Guidelines](docs/INDEX.md) for details on our code of conduct and the process for submitting pull requests.
