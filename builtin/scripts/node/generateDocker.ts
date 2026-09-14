import { consola } from "consola";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "url";
import deployment from 'configs/deployment.config.mts'

const dockerfileContent = `FROM node:${deployment.container.node_version} AS build
WORKDIR /app
COPY package*.json ./
# RUN corepack enable
RUN nub install
COPY . .
RUN nub run build

FROM node:${deployment.container.node_version}
WORKDIR /app2
COPY --from=build /app/dist ./
CMD [ "nub", "run", "serve"]
EXPOSE 8080
`;

const dockerComposeContent = `services:
  ${deployment.container.name}:
    container_name: ${deployment.container.name}
    image: ${deployment.container.name}:latest
    restart: unless-stopped
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - ${deployment.container.port}:8080
`;

const dockerIgnoreContent = `node_modules/
.git
.gitignore
*.log
.output
.vinxi
Dockerfile
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dockerfilePath = path.join(__dirname, "../../../Dockerfile");
const dockercomposePath = path.join(__dirname, "../../../docker-compose.yml");
const dockerignorePath = path.join(__dirname, "../../../.dockerignore");

try {
  fs.writeFileSync(dockerfilePath, dockerfileContent);
  fs.writeFileSync(dockercomposePath, dockerComposeContent);
  fs.writeFileSync(dockerignorePath, dockerIgnoreContent);

  consola.success("Docker generated successfully");
  consola.success("Docker build successfully");
} catch {
  consola.error("Docker generation failed");
}
