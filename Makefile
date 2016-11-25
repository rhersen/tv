install:	pull mocha /opt/nginx-1.2.8/ingela/bundle.js /opt/nginx-1.2.8/ingela/index.html

pull:
	git pull

mocha:
	node_modules/.bin/mocha

bundle.js:	entry.js format.js style.css trains.hbs
	node_modules/.bin/webpack

/opt/nginx-1.2.8/ingela/bundle.js:	bundle.js
	cp bundle.js /opt/nginx-1.2.8/ingela/

/opt/nginx-1.2.8/ingela/index.html:	index.html
	cp index.html /opt/nginx-1.2.8/ingela/

