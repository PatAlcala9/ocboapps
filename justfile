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
  nub ./builtin/scripts/node/generateDocker.ts && docker compose up -d && rm .dockerignore && rm docker-compose.yml && rm Dockerfile

pod:
  nub ./builtin/scripts/node/generateDocker.ts && nub ./builtin/scripts/node/generatePodman.ts && podman-compose up -d && rm .dockerignore && rm docker-compose.yml && rm Dockerfile

favicon:
  nub ./builtin/scripts/node/generateFavicon.ts

logo size:
  nub ./builtin/scripts/node/optimizeLogo.ts --size {{ size }}

image name size:
  nub ./builtin/scripts/node/optimizeImage.ts --name {{ name }} --size {{ size }}

background:
  nub ./builtin/scripts/node/optimizeBackground.ts

license:
  nub ./builtin/scripts/node/generateLicense.ts
  
secret:
  nub ./builtin/scripts/node/generateRandomCharacters.ts --name 'secret key' --digit 32

nonce:
  nub ./builtin/scripts/node/generateRandomCharacters.ts --name nonce --digit 24

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
