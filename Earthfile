VERSION 0.8
FROM node:lts

deps:
  COPY package*.json .
  # TODO: cache
  RUN npm ci

build:
  FROM +deps
  COPY --dir src public astro.config.ts tailwind.config.cjs tsconfig.json .
  RUN npm run build
  SAVE ARTIFACT dist AS LOCAL .

deploy:
  
