function clearBody() {
	const content = document.getElementById('OriginalContent');
	for (const node of document.body.childNodes) {
		if (node.id != 'OriginalContent' && node.id != 'BigChat')
			content.appendChild(node);
	}
}

// Avoid recursive frame insertion...
var extensionOrigin = `chrome-extension://${chrome.runtime.id}`;

if (!location.ancestorOrigins.contains(extensionOrigin)) {
		let style = document.createElement("style");
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
		style.sheet.insertRule("#OriginalContent * {max-width: calc(100vw - 400px);}");
		const originalContent = document.createElement('div');
		originalContent.id = 'OriginalContent';
		originalContent.style.cssText = 'width:calc(100vw - 400px);height:100%;'
    const iframe = document.createElement('iframe');
		iframe.id = 'BigChat';
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('popup.html');

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'z-index:1000;' +
			'width: 400px; height: 100%; right: 0; top: 0; position: fixed; box-shadow: -4px 0px 10px 0px #adadad;padding: 3px; border: 0; background-color: white;'
		document.body.appendChild(originalContent);
    document.body.appendChild(iframe);
		const observer = new MutationObserver((o, e) => clearBody());
		observer.observe(document.body, { childList: true });
		observer.observe(document.head, { childList: true });
		clearBody();
}
