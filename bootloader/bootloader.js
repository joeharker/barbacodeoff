'use strict';

(function (log) {
	var inAppBrowserRef = undefined;
	//var timmer = (new Date()).getTime();

	function onScriptCallback(params) {
		//log.write({ onScriptCallback: ((new Date()).getTime() - timmer) / 1000, params: params });
	}

	function onCssCallback(params) {
		//log.write({ onCssCallback: ((new Date()).getTime() - timmer) / 1000, params: params });
	}

	function onInAppBrowserLoadError(params) {
		log.write({ onInAppBrowserLoadError: params });
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
		//log.write({ onInAppBrowserExit: ((new Date()).getTime() - timmer) / 1000 });
		//if they exit too far lets get them back into the InAppBrowser
		if (inAppBrowserRef !== undefined) {
			inAppBrowserRef = undefined;
		}
		if (!config.debug) {
			navigator.app.exitApp();
		}
	}

	function onInAppBrowserLoadStart() {
		//log.write({ onInAppBrowserLoadStart: ((new Date()).getTime() - timmer) / 1000 });
	}

	function onInAppBrowserLoadStop() {
		//log.write({ onInAppBrowserLoadStop: ((new Date()).getTime() - timmer) / 1000 });
		inAppBrowserRef.show();
		loadCustomStyles();
		runCustomScripts();
	}

	function onDeviceReady() {
		//log.write({ onDeviceReady: ((new Date()).getTime() - timmer) / 1000 });
		if (inAppBrowserRef === undefined) {
			inAppBrowserRef = cordova.InAppBrowser.open(config.url + '?app=' + device.platform + config.version, '_blank', 'location=no,hidden=yes,clearcache=no,clearsessioncache=no,disallowoverscroll=yes,toolbar=' + config.iosBackButton);
			//inAppBrowserRef.addEventListener('loadstart', onInAppBrowserLoadStart);
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