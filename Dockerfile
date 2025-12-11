FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno cache main.ts

EXPOSE 3000

CMD ["sh", "-c", "deno run --unsafely-ignore-certificate-errors=\"$MINECRAFT_SERVER_IP\" --allow-env --allow-net --allow-read --allow-write main.ts"]