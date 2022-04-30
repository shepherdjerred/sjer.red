VERSION 0.6
FROM node:16
WORKDIR /source

dependencies:
    COPY package*.json .
    RUN npm ci

build:
    FROM +dependencies
    COPY . .
    RUN npm run build
    SAVE ARTIFACT dist/ /dist AS LOCAL .

release:
    FROM +dependencies
    COPY . .
    RUN npm run release
    SAVE ARTIFACT dist/ /dist AS LOCAL .

test:
    FROM +dependencies
    COPY . .
    RUN npm run test

lint.check:
    FROM +dependencies
    COPY . .
    RUN npm run lint:check

lint.fix:
    FROM +dependencies
    COPY . .
    RUN npm run lint:fix

docker:
    COPY +build/dist .
    EXPOSE port 4173
    ENTRYPOINT ["npm", "run", "preview"]
    SAVE IMAGE shepherdjerred.com:latest

preview:
    WITH DOCKER --load shepherdjerred.com:latest=+docker
        RUN docker run -p 4173:4173 shepherdjerred.com
    END
