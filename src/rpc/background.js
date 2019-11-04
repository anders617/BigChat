import {
	ControlsFactory
} from '../controller/controller';

const registeredObjects = {
	controls: ControlsFactory(),
};

if (chrome.runtime.onMessage != undefined) {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			let name, args;
			[name, ...args] = request;
			let object = registeredObjects;
			let func = registeredObjects;
			for (const p of name.split('.')) {
				object = func;
				func = object[p];
			}
			sendResponse(func.apply(object, args));
		}
	);
}