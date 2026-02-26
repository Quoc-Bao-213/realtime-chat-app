import http from "node:http";
import next from "next";
import { loadEnvConfig } from "@next/env";

const port = Number(process.env.PORT ?? 3000);
const isProdArg = process.argv.includes("--prod");
const dev = !isProdArg && process.env.NODE_ENV !== "production";
const hostname = process.env.HOST ?? "0.0.0.0";

loadEnvConfig(process.cwd());

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    const { createChatSocketServer } = await import("./src/server/chat/socket");

    const httpServer = http.createServer((req, res) => {
      void handler(req, res);
    });

    createChatSocketServer(httpServer);

    httpServer.listen(port, hostname, () => {
      const mode = dev ? "development" : "production";
      console.log(`Server ready on http://${hostname}:${port} (${mode})`);
    });
  })
  .catch((error) => {
    console.error("Failed to bootstrap server", error);
    process.exit(1);
  });
