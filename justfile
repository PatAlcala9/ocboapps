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

dockhub username image:
  ./builtin/tools/generate-docker ./configs/deployment.config.json && docker build -t {{username}}/{{image}} . && rm .dockerignore && rm docker-compose.yml && rm Dockerfile

favicon:
  ./builtin/tools/generate-favicon ./configs/site.config.json

logo size:
  ./builtin/tools/optimize-image logo {{ size }}

image name size:
  ./builtin/tools/optimize-image {{ name }} {{ size }}

background:
  ./builtin/tools/optimize-image background 0

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
