var config = (function () {
	var environment = 'DEV';

	values = {
		url: 'https://qa-order.chipotle.com/',
		debug: false
	};

	switch (environment) {
		case 'DEV':
			values.debug = true;
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