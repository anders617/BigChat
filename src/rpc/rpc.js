export default async function Call(...args) {
	if (chrome.tabs !== undefined) {
		const tab = await new Promise((resolve) => chrome.tabs.getCurrent(resolve));
		const result = await new Promise((resolve) => chrome.tabs.sendMessage(tab.id, args, {}, resolve));
		return result;
	}
	const result = await new Promise((resolve) => chrome.runtime.sendMessage(args, {}, resolve));
	return result;
}



const registeredObjects = {};

if (chrome.runtime.onMessage !== undefined) {
	chrome.runtime.onMessage.addListener(
		(request, sender, sendResponse) => {
			(async () => {
				const [name, ...args] = request;
				if (chrome.tabs !== undefined) {
					const tab = await new Promise((resolve) => chrome.tabs.getCurrent(resolve));
					if (sender.tab !== undefined && tab.id !== sender.tab.id) {
						sendResponse(undefined);
						return;
					}
				}
				let object = registeredObjects;
				let func = registeredObjects;
				for (const p of name.split('.')) {
					object = func;
					if (object === undefined) return undefined;
					func = object[p];
				}
				if (func === undefined) return undefined;
				sendResponse(func.apply(object, args));
			})();
			return true;
		}
	);
}

export function register(key, value) {
	registeredObjects[key] = value;
}