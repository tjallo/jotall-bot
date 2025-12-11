FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno cache main.ts

EXPOSE 3000

CMD ["sh", "-c", "deno run --unsafely-ignore-certificate-errors --allow-env --allow-net --allow-read --allow-write main.ts"]