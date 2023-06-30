VERSION 0.7
PROJECT sjerred/shepherdjerred.com
FROM node:lts
WORKDIR /source

pipeline.preview:
  PIPELINE
  TRIGGER pr main
  BUILD +build
  BUILD +lint

pipeline.push:
  PIPELINE --push
  TRIGGER push main
  BUILD +lint
  BUILD +deploy --prod=true
  BUILD +devcontainer

dependencies:
  COPY package*.json .
  RUN npm ci

build:
  FROM +dependencies
  COPY . .
  RUN npm run build
  SAVE ARTIFACT dist/ /dist AS LOCAL .

lint.check:
  FROM +dependencies
  COPY . .
  RUN npm run lint:check

lint.fix:
  FROM +dependencies
  COPY . .
  RUN npm run lint:fix

deploy:
  ARG prod=false
  FROM +node
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
  ARG version=0.1.11-beta.0
  RUN curl --location --fail --silent --show-error -o /usr/local/bin/devpod https://github.com/loft-sh/devpod/releases/download/v$version/devpod-linux-$TARGETARCH
  RUN chmod +x /usr/local/bin/devpod
  COPY .devcontainer/devcontainer.json .
  RUN --push --secret GITHUB_TOKEN=github_token echo $GITHUB_TOKEN | docker login ghcr.io -u shepherdjerred --password-stdin
  WITH DOCKER
    RUN devpod provider add docker && \
      devpod build github.com/shepherdjerred/shepherdjerred.com --repository ghcr.io/shepherdjerred/shepherdjerred.com
  END
