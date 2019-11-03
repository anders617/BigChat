import {
	ControlsFactory
} from '../controller/controller';

if (chrome.runtime.onMessage != undefined) {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			let name, args;
			[name, ...args] = request;
			const objects = {
				controls: ControlsFactory(),
			}
			let object = objects;
			let func = objects;
			for (const p of name.split('.')) {
				object = func;
				func = object[p];
			}
			sendResponse(func.apply(object, args));
		}
	);
}