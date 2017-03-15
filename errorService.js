'use strict';

var errorService = (function () {
	//pretty logger
	function addCell(row, text, clas) {
		var cel = row.insertCell();
		var spn = document.createElement('span');
		var txt = document.createTextNode(text);
		if (clas !== undefined && clas !== null && clas !== '') {
			spn.classList.add(clas);
		}
		spn.appendChild(txt);
		cel.appendChild(spn);
	}

	function addRow(obj, key, table, maxRecursions) {
		var value = obj[key];
		var thatType = Object.prototype.toString.call(value); //more detail than typeof
		var row = table.insertRow();

		addCell(row, thatType, 'type');
		addCell(row, key, 'name');

		if (maxRecursions > 0 && typeof value === 'object' && value != null
				&& key !== 'enabledPlugin' //this is a recursive link to the plug in that lists its self
		) {
			var cel = row.insertCell();
			cel.innerHTML = objectToTable(value, --maxRecursions).outerHTML;
		} else {
			addCell(row, value, 'value');
		}
	}

	function objectToTable(obj, maxRecursions) {
		var table = document.createElement('table');
		if (maxRecursions === undefined) {
			maxRecursions = 20;
		}

		if (typeof obj === 'string') {
			try {
				addRow([JSON.parse(obj)], 0, table, maxRecursions);
			} catch (e) {
				addRow([obj], 0, table, maxRecursions);
			}
		} else {
			Object.getOwnPropertyNames(obj).forEach(function (key) {
				addRow(obj, key, table, maxRecursions);
			});
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) {
					addRow(obj, key, table, maxRecursions);
				}
			}
		}

		return table;
	}

	//public methods
	function log(obj) {
		console.log(obj);

		//debug dump to screen for mobile testing
		var debug = document.getElementById('debug');
		if (debug) {
			var table = document.createElement('table');
			var thatType = Object.prototype.toString.call(obj); //more detail than typeof
			var row = table.insertRow();
			
			addCell(row, thatType, 'type');
			var cel = row.insertCell();
			cel.innerHTML = objectToTable(obj).outerHTML;

			debug.appendChild(table);
			debug.style.display = 'block';
		}
	}

	function init() {
		//error handler
		window.onerror = function (msg, url, line, col, error) {
			//can add a service call to upload errors to a DB
			//try catch the send so we dont end up in a reporting loop
			log(['Error event', error]);
		};

		//add the debug modal
		window.onload = function () {
			var close = document.createElement('a');
			close.onclick = function () {
				document.getElementById('debug').style.display = 'none';
			};
			close.innerText = '[X]';

			var debug = document.createElement('div');
			debug.id = 'debug';
			debug.style.display = 'none';
			debug.appendChild(close);

			document.body.insertBefore(debug, document.body.firstChild);
		}
	}

	return {
		log: log,
		init: init
	}

})();