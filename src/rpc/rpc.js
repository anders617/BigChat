
export function Call() {
	const args = [...arguments];
	chrome.tabs.getCurrent(tab => {
		chrome.tabs.sendMessage(tab.id, args);
	});
}

