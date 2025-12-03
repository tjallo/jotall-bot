FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno cache main.ts

EXPOSE 3000

CMD ["deno", "run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "main.ts"]