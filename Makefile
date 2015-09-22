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

test:
	@npm test

test-watch:
	@npm run watchify-test

shrinkwrap:
	npm shrinkwrap --dev
	git add npm-shrinkwrap.json package.json
	git commit -m 'updating shrinkwrap' -e

.PHONY: all install server test watch
