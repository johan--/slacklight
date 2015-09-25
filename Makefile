all: install build

install:
	@npm install

dev:
	@make dev-server & \
	 make dev-watch;

server dev-server:
	@npm start

watch dev-watch:
	@node_modules/.bin/gulp

build:
	@npm run build &
	@npm run build-less

build-production:
	@npm run build-production

bootstrap:
	mkdir -p public/less/bootstrap
	cp -r node_modules/bootstrap/less/* public/less/bootstrap

test:
	@npm test

test-watch:
	@npm run watchify-test

watch-unit-test:
	@npm run watch-unit-test

.PHONY: all install server test watch
