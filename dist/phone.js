var camera = (function () {
	var c = {};
	c.transparent = "data:image/gif;base64,R0lGODlhAQABALMAALu7uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAwQCEEQAOw==";
	c.lastPhoto = "" + c.transparent;
	c.callback = undefined;
	c.takePhoto = takePhoto;

	//private functions
	function onSuccess(imageData) {
		c.lastPhoto = "data:image/jpeg;base64," + imageData;
		if (c.callback !== undefined) {
			c.callback(c.lastPhoto);
		}
	}

	function onFail(message) {
		if (message.indexOf("has no") === -1 && message.indexOf("cancelled") === -1) { //this means the photo was canceled
			alert("photo error"+ JSON.stringify(message));
		}
	}

	//public functions
	function takePhoto(callback) {
		c.callback = callback;
		if (navigator.camera === undefined) {
			alert("your phone does not appear to suport photos");
		} else {
			navigator.camera.getPicture(onSuccess, onFail, {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				correctOrientation: true
			});
		}
	}

	return c;
})();


//init
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	window.open = cordova.InAppBrowser.open;
}