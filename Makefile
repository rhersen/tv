install:	pull mocha /opt/nginx-1.2.8/ingela/browser-bundle.js /opt/nginx-1.2.8/ingela/index.html

pull:
	git pull

mocha:
	node_modules/.bin/mocha

browser-bundle.js:	index.js getHtml.js formatLatestAnnouncement.js position.js style.css
	node_modules/.bin/webpack --optimize-minimize

/opt/nginx-1.2.8/ingela/browser-bundle.js:	browser-bundle.js
	cp browser-bundle.js /opt/nginx-1.2.8/ingela/

/opt/nginx-1.2.8/ingela/index.html:	index.html
	cp index.html /opt/nginx-1.2.8/ingela/

