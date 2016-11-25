install:	pull mocha /opt/nginx-1.2.8/ingela/bundle.js /opt/nginx-1.2.8/ingela/index.html

pull:
	git pull

mocha:
	node_modules/.bin/mocha

bundle.js:	index.js html.js formatLatestAnnouncement.js MatchingTrains.js style.css
	node_modules/.bin/webpack --optimize-minimize

/opt/nginx-1.2.8/ingela/bundle.js:	bundle.js
	cp bundle.js /opt/nginx-1.2.8/ingela/

/opt/nginx-1.2.8/ingela/index.html:	index.html
	cp index.html /opt/nginx-1.2.8/ingela/

