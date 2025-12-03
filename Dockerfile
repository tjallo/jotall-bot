FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno cache main.ts

CMD ["deno", "run", "--allow-env --allow-net --allow-read --allow-write", "main.ts"]