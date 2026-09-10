set quiet

install:
    pnpm install

run:
    nub run dev

build:
    nub run build && nub run serve

lint:
    nub run lint

test:
    nub run test

update:
    pnpm up -i

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
alias a := add
alias ad := addd
