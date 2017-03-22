'use strict';

(function (log) {
	var inAppBrowserRef = undefined;

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
					log.write({ httpGetNot200: xmlHttp });
				}
			}
		};
		xmlHttp.onerror = function (e) {
			log.write({ httpGetError: e });
		};
		xmlHttp.open('GET', url, true); // true for asynchronous 
		xmlHttp.send(null);
	}

	function runCustomScripts() {
		//do not put a return in the custom javascript
		//WARNING//inAppBrowserRef.executeScript({ file: getRoot() + 'custom.js' }, onScriptCallback);	//Docs say this works but it does not: 
		httpGet(getRoot() + 'custom.js', function (js) {
			inAppBrowserRef.executeScript({ code: js });
		});
	}

	function onInAppBrowserLoadError(params) {
		log.write({ onInAppBrowserLoadError: params });
		onInAppBrowserExit();
	}

	function onInAppBrowserLoadStop() {
		inAppBrowserRef.show();
		loadCustomStyles();
		runCustomScripts();
	}

	function onInAppBrowserExit() {
		//if they exit too far lets get them back into the InAppBrowser
		if (inAppBrowserRef !== undefined) {
			inAppBrowserRef = undefined;
		}
		if (!config.debug) {
			navigator.app.exitApp();
		}
	}

	function onDeviceReady() {
		if (inAppBrowserRef === undefined) {
			inAppBrowserRef = cordova.InAppBrowser.open(config.url + '?app=' + device.platform + config.version, '_blank', 'location=no,hidden=yes,clearcache=no,clearsessioncache=no,disallowoverscroll=yes,toolbar=' + config.iosBackButton);
			inAppBrowserRef.addEventListener('loaderror', onInAppBrowserLoadError);
			inAppBrowserRef.addEventListener('loadstop', onInAppBrowserLoadStop);
			inAppBrowserRef.addEventListener('exit', onInAppBrowserExit);
		}
	}

	//when cordova is ready
	document.addEventListener('deviceready', onDeviceReady, false);

	//test/////////////////
	function speedTest() {
		var download = new Image();
		var startTime = (new Date()).getTime();
		download.onload = function () {
			log.write({ ten_k_duration: ((new Date()).getTime() - startTime) / 1000 });
		};
		download.src = 'https://order.chipotle.com/images/pepper.jpg' + "?n=" + Math.random();
	}

	if (config.debug) {
		setTimeout(function () { speedTest(); }, 1000);
	}
})(logService);