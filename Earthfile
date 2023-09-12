VERSION 0.7
PROJECT sjerred/shepherdjerred.com
FROM node:lts
RUN npm install -g npm
WORKDIR /source

ci:
  ARG --required prod
  BUILD +lint
  BUILD +test
  BUILD +deploy --prod=$prod
  IF [ $prod = "true" ]
    BUILD +devcontainer
  END

dependencies:
  COPY package*.json .
  RUN npm ci

build:
  FROM +dependencies
  COPY . .
  RUN npm run build
  SAVE ARTIFACT dist/ /dist AS LOCAL .

lint:
  FROM +dependencies
  COPY . .
  RUN npm run lint

lint.fix:
  FROM +dependencies
  COPY . .
  RUN npm run lint:fix

dependencies.test:
  FROM mcr.microsoft.com/playwright
  COPY package*.json .
  RUN npm ci

test:
  FROM +dependencies.test
  ARG EARTHLY_CI
  ENV CI=$EARTHLY_CI
  COPY . .
  RUN npm run test

test.update:
  FROM +dependencies.test
  ARG EARTHLY_CI
  ENV CI=$EARTHLY_CI
  COPY . .
  RUN npm run test:update

deploy:
  ARG prod=false
  ENV NETLIFY_SITE_ID=0c2c0de1-9c7d-4b06-9448-e77401a379de
  RUN npm i -g netlify-cli
  COPY +build/dist dist
  RUN --push --secret NETLIFY_AUTH_TOKEN=netlify_token npx netlify-cli link
  IF [ $prod = "true" ]
    RUN --push --secret NETLIFY_AUTH_TOKEN=netlify_token npx netlify-cli deploy --dir=dist --prod
  ELSE
    RUN --push --secret NETLIFY_AUTH_TOKEN=netlify_token npx netlify-cli deploy --dir=dist
  END

devcontainer:
  FROM earthly/dind:ubuntu
  WORKDIR /workspace
  ARG TARGETARCH
  ARG version=0.3.7
  RUN curl --location --fail --silent --show-error -o /usr/local/bin/devpod https://github.com/loft-sh/devpod/releases/download/v$version/devpod-linux-$TARGETARCH
  RUN chmod +x /usr/local/bin/devpod
  COPY .devcontainer/devcontainer.json .
  RUN --push --secret GITHUB_TOKEN=github_token echo $GITHUB_TOKEN | docker login ghcr.io -u shepherdjerred --password-stdin
  WITH DOCKER
    RUN devpod provider add docker && \
      devpod build github.com/shepherdjerred/shepherdjerred.com --repository ghcr.io/shepherdjerred/shepherdjerred.com
  END
