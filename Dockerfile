FROM denoland/deno:1.35.1

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno cache main.js --reload --import-map=import-map.json

EXPOSE 8000

CMD ["run", "-A", "--unstable", "./main.js"]
