﻿'use strict';

(function (log) {
	var inAppBrowserRef;
	var timmer = (new Date()).getTime();

	function onScriptCallback(params) {
		log.write({ onScriptCallback: ((new Date()).getTime() - timmer) / 1000, params: params });
	}

	function onCssCallback(params) {
		log.write({ onCssCallback: ((new Date()).getTime() - timmer) / 1000, params: params });
	}

	function onInAppBrowserLoadStart() {
		log.write({ onInAppBrowserLoadStart: ((new Date()).getTime() - timmer) / 1000});
		onInAppBrowserExit();
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
		//if they exit too far lets get them back into the InAppBrowser
		setTimeout(function () { onDeviceReady(); }, config.reloadDelay);
	}

	function onInAppBrowserLoadStop(params) {
		log.write({ onInAppBrowserLoadStop: ((new Date()).getTime() - timmer) / 1000, params: params });
		inAppBrowserRef.show();
		loadCustomStyles();
		runCustomScripts();
	}

	function onDeviceReady(params) {
		log.write({ onDeviceReady: ((new Date()).getTime() - timmer) / 1000, params: params });
		//navigator.splashscreen.hide();
		inAppBrowserRef = cordova.InAppBrowser.open(config.url, '_blank', 'location=no,hidden=yes,clearcache=no,clearsessioncache=no,disallowoverscroll=yes,toolbar=' + config.iosBackButton);
		inAppBrowserRef.addEventListener('loaderror', onInAppBrowserLoadError);
		inAppBrowserRef.addEventListener('loadstart', onInAppBrowserLoadStart);
		inAppBrowserRef.addEventListener('loadstop', onInAppBrowserLoadStop);
		inAppBrowserRef.addEventListener('exit', onInAppBrowserExit);

		speedTest();
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

	//setTimeout(function () { log.write({ test: ((new Date()).getTime() - timmer) / 1000 }); }, 1000);
})(logService);