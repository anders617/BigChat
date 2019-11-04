export default async function Call() {
	const args = [...arguments];
	const tab = await new Promise((resolve) => chrome.tabs.getCurrent(resolve));
	const result = await new Promise((resolve) => chrome.tabs.sendMessage(tab.id, args, {}, resolve));
	return result;
}

const registeredObjects = {};

if (chrome.runtime.onMessage != undefined) {
	chrome.runtime.onMessage.addListener(
		(request, sender, sendResponse) => {
			const [name, ...args] = request;
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

export function register(key, value) {
	registeredObjects[key] = value;
}