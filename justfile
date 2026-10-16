set quiet

install:
  pnpm install

run:
  pnpm dev

build:
  pnpm build && pnpm serve

lint:
  pnpm lint

test:
  pnpm test

update:
  pnpm update -i

update-latest:
  pnpm update -i --latest

dock:
  ./builtin/tools/generate-docker ./configs/deployment.config.json && docker compose up -d && rm .dockerignore && rm docker-compose.yml && rm Dockerfile

pod:
  ./builtin/tools/generate-docker ./configs/deployment.config.json && ./builtin/tools/generate-podman ./configs/deployment.config.json && podman-compose up -d && rm .dockerignore && rm docker-compose.yml && rm Dockerfile

favicon:
  nub ./builtin/scripts/node/generateFavicon.ts

logo size:
  nub ./builtin/scripts/node/optimizeLogo.ts --size {{ size }}

image name size:
  nub ./builtin/scripts/node/optimizeImage.ts --name {{ name }} --size {{ size }}

background:
  nub ./builtin/scripts/node/optimizeBackground.ts

license:
  ./builtin/tools/generate-license ./configs/site.config.json
  
secret:
  ./builtin/tools/generate-random-characters 'secret key' 32

nonce:
  ./builtin/tools/generate-random-characters nonce 24

add package:
  pnpm add {{ package }}

addd package:
  pnpm add -D {{ package }}

remove package:
  pnpm remove {{ package }}

alias i := install
alias r := run
alias b := build
alias l := lint
alias u := update
alias ul := update-latest
alias a := add
alias ad := addd
