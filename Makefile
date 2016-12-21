install:	pull mocha /opt/nginx-1.2.8/text/browser-bundle.js /opt/nginx-1.2.8/text/index.html

pull:
	git pull

mocha:
	node_modules/.bin/mocha

browser-bundle.js:	index.js getHtml.js formatLatestAnnouncement.js position.js style.css
	node_modules/.bin/webpack --optimize-minimize

/opt/nginx-1.2.8/text/browser-bundle.js:	browser-bundle.js
	cp browser-bundle.js /opt/nginx-1.2.8/text/

/opt/nginx-1.2.8/text/index.html:	index.html
	cp index.html /opt/nginx-1.2.8/text/

