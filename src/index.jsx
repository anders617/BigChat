import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let style = document.createElement("style");
style.appendChild(document.createTextNode(""));
document.head.appendChild(style);
style.sheet.insertRule("#mainContent * {max-width: 75vw}");

let mainContent = document.createElement('div');
mainContent.setAttribute('id', 'mainContent');
mainContent.style.cssText = "margin-right: 25vw !important; height: 100%";

function printCallback(e, o) {
	for (const mutation of e) {
		if (mutation.addedNodes != null) {
			for (const node of mutation.addedNodes) {
				if (node.id != "BigChatRoot") {
					mainContent.appendChild(node);
				}
			}
		}
		if (mutation.nextSibling != null && mutation.nextSibling.id != "BigChatRoot") {
			mainContent.appendChild(mutation.nextSibling);
		}
		if (mutation.previousSibling != null && mutation.previousSibling.id != "BigChatRoot") {
			mainContent.appendChild(mutation.previousSibling);
		}
	}
}
const observer = new MutationObserver(printCallback);
observer.observe(document.body, {childList: true});

for (let node of document.body.childNodes) {
	if (node.id != "BigChatRoot") {
		mainContent.appendChild(node);
	}
}

document.body.appendChild(mainContent);
let sideContent = document.createElement('div');
sideContent.style.cssText = "height: 100%; width: 25vw; position: fixed; z-index: 1; top: 0; right: 0; background-color: #d3dedd; overflow-x: hidden; padding: 20px; transition: 0.5s;"
sideContent.setAttribute('id', 'BigChatRoot');
document.body.appendChild(sideContent);


console.log("Big Chat!");

ReactDOM.render(<App />, document.getElementById('BigChatRoot'));
