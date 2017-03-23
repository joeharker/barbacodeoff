'use strict';

var config = (function () {
	var env = { DEV: 0, QA: 1, STAGE: 2, PROD: 3 };

	var environment = env.PROD;

	//PROD as default values
	var values = {
		url: 'https://order.chipotle.com',
		debug: false,
		iosBackButton: 'no',
		version: 'phonegap.1.0.0'
	};

	//only change values that are different from prod
	switch (environment) {
		case env.DEV:
			values.url = 'https://order.chipotle.com';
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