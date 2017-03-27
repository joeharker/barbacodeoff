'use strict';

var config = (function () {
	var env = { DEV: 0, QA: 1, STAGE: 2, PROD: 3 };

	var environment = env.DEV;

	//PROD as default values
	var values = {
		url: 'https://order.chipotle.com',
		debug: false,
		iosBackButton: 'no',
		version: '1.0.0',
		trackjsToken: '8f6744a50bbd43fe8e20564e7c682048',
		trackjsApp: 'roo-phonegap'
	};

	//only change values that are different from prod
	switch (environment) {
		case env.DEV:
			values.url = 'https://dev1-order.chipotle.com';
			values.debug = true,
			values.iosBackButton = 'yes';
			break;

		case env.QA:
			values.url = 'https://qa1-order.chipotle.com';
			break;

		case env.STAGE:
			values.url = 'https://stg-order.chipotle.com';
			break;

		default: //PROD
	}

	return values;
})();