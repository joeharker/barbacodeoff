'use strict';

(function (log) {
	var inAppBrowserRef;

	function onScriptCallback(params) {
		//log.write(['onScriptCallback', params]);
	}

	function onCssCallback(params) {
		//log.write(['onCssCallback', params]);
	}

	function onInAppBrowserLoadError(params) {
		log.write(['InAppBrowser error', params]);
		onInAppBrowserExit();
	}

	function getRoot() {
		var root = '';
		var findRoot = new RegExp('^(.*/)', 'gi');
		var matches = findRoot.exec(location.href);

		if (matches) {
			root = matches[1];
		}

		return root;
	}

	function httpGet(url, callback) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState === 4) {
				if ([0, 200].indexOf(xmlHttp.status) !== -1) {
					callback(xmlHttp.responseText);
				} else {
					log.write(['Error: httpGet not 200', xmlHttp]);
				}
			}
		};
		xmlHttp.onerror = function (e) {
			log.write(['Error: httpGet', e]);
		};
		xmlHttp.open('GET', url, true); // true for asynchronous 
		xmlHttp.send(null);
	}

	function loadCustomStyles() {
		////inAppBrowserRef.insertCSS({ file: getRoot() + 'custom.css' }, onCssCallback); //Docs say this works but it does not: 
		httpGet(getRoot() + 'custom.css', function (css) {
			inAppBrowserRef.insertCSS({ code: css }, onCssCallback);
		});
	}

	function runCustomScripts() {
		//do not put a return in the javascript
		////inAppBrowserRef.executeScript({ file: getRoot() + 'custom.js' }, onScriptCallback);	//Docs say this works but it does not: 
		httpGet(getRoot() + 'custom.js', function (js) {
			inAppBrowserRef.executeScript({ code: js }, onScriptCallback);
		});
	}

	function onInAppBrowserExit() {
		//if they exit too far lets get them back into the InAppBrowser
		setTimeout(function () { onDeviceReady(); }, config.reloadDelay);
	}

	function onInAppBrowserLoadStop() {
		inAppBrowserRef.show();
		loadCustomStyles();
		runCustomScripts();
	}

	function onDeviceReady() {
		navigator.splashscreen.hide();
		inAppBrowserRef = cordova.InAppBrowser.open(config.url, '_blank', 'location=no,hidden=yes,clearcache=no,clearsessioncache=no,disallowoverscroll=yes,toolbar=' + config.iosBackButton);
		inAppBrowserRef.addEventListener('loaderror', onInAppBrowserLoadError);
		inAppBrowserRef.addEventListener('loadstop', onInAppBrowserLoadStop);
		inAppBrowserRef.addEventListener('exit', onInAppBrowserExit);
	}

	//when cordova is ready
	document.addEventListener('deviceready', onDeviceReady, false);

	//test/////////////////
	function showResults(startTime, endTime, imageAddr, downloadSize) {
			var duration = (endTime - startTime) / 1000;
			var bitsLoaded = downloadSize * 8;
			var speedKbps = (bitsLoaded / duration / 1024).toFixed(2);
			log.write(['speedKbps', speedKbps]);
			//if (speedKbps < 400) {
			//} else if (speedKbps >= 400 && speedKbps < 800) {
			//} else if (speedKbps >= 800) {
			//}
	}
	function test() {
		var downloadSize = 1037745;
		var imageAddr = 'https://order.chipotle.com/images/entree-tile-burrito-desktop.jpg' + "?n=" + Math.random();
		var startTime, endTime = 0;
		var download = new Image();
		download.onload = function () {
			endTime = (new Date()).getTime();
			showResults(startTime, endTime, imageAddr, downloadSize);
		};
		startTime = (new Date()).getTime();
		download.src = imageAddr;
	}
	setTimeout(function () { test(); }, 1000);
})(logService);