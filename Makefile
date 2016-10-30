.DEFAULT_GOAL: build/build.js

build: build/build.js
build/build.js: index.js node_modules
	mkdir -p $(dir $@)
	node_modules/.bin/browserify $< > $@

test: node_modules
	node_modules/.bin/mochify

node_modules: package.json
	npm install
	touch $@

clean:
	rm -rf build

.PHONY: clean test
