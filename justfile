set quiet

install:
  nub install

run:
  nub run dev

build:
  nub run build && nub run serve

lint:
  nub run lint

test:
  nub run test

update:
  nub update

update-latest:
  nub update --latest

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

add package:
  nub add {{ package }}

addd package:
  nub add -D {{ package }}

remove package:
  nub remove {{ package }}

alias i := install
alias r := run
alias b := build
alias l := lint
alias u := update
alias ul := update-latest
alias a := add
alias ad := addd
