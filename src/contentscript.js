// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('dist/index.html');

    // Some styles for a fancy sidebar
    iframe.style.cssText = 'position:fixed;top:0;right:0;display:block;' +
                           'width:400px;height:100%;z-index:1000;frameBorder:0;';
    document.body.appendChild(iframe);
}
