import { consola } from "consola";
import * as fs from "node:fs";
import * as path from "node:path";
import os from "os";
import deployment from 'configs/deployment.config.mts'

const podmanContent = `[Unit]
Description=Dasig

[Container]
ContainerName=${deployment.container.name}
Image=localhost/${deployment.container.name}:latest
PublishPort=${deployment.container.port}:8080

[Service]
Restart=always

[Install]
WantedBy=multi-user.target default.target
`;

const homeDir = os.homedir();
const podmanPath = path.join(
  homeDir,
  `.config`,
  `containers`,
  `systemd`,
  `${deployment.container.name}.container`,
);

const quadletDir = path.dirname(podmanPath);
if (!fs.existsSync(quadletDir)) {
  fs.mkdirSync(quadletDir, { recursive: true });
}

try {
  fs.writeFileSync(podmanPath, podmanContent);
  consola.success("Podman generated successfully");
  consola.success("Podman build successfully");
} catch {
  consola.error("Podman generation failed");
}
