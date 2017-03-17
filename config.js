var config = (function () {
	var environment = 'PROD';

	//default to prod values
	values = {
		url: 'https://order.chipotle.com/',
		debug: false,
		reloadDelay: 1,
		iosBackButton: 'no'
	};

	switch (environment) {
		case 'DEV':
			values.url = 'https://order.chipotle.com/';
			values.debug = true;
			values.reloadDelay = 10000;
			values.iosBackButton = 'yes';
			break;
		case 'QA':
			values.url = 'https://qa1-order.chipotle.com/';
			break;
		case 'STAGE':
			values.url = 'https://stg-order.chipotle.com/';
			break;
		case 'PROD':
			values.url = 'https://order.chipotle.com/';
			break;
		default:
	}

	return values;
})();