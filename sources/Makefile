
make all:
	clear
	make css
	make js

css:
	stylus styles/style.styl -o ../website/wp-content/themes/cubhub/

js:
	bash compiler.sh

clean-js:
	rm -fr javascript/build javascript/components javascript/template.js


ftp-push:
	clear
	make all
	bash ftp-push.sh

deploy:
	git push origin develop
	make ftp-push

.PHONY: html
