var config = (function () {
	var environment = 'QA';

	values = {
		url: 'https://qa-order.chipotle.com/',
		debug: true,
		reloadDelay: 10000,
		iosBackButton: 'no'
	};

	switch (environment) {
		case 'DEV':
			values.debug = true;
			values.iosBackButton = 'yes';
			break;
		case 'QA':
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