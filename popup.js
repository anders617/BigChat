let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
	  changeColor.style.backgroundColor = data.color;
  	changeColor.setAttribute('value', data.color);
		changeColor.setAttribute('active', false);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
		element.target.active = !element.target.active;
		let active = element.target.active;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			if (active) {
      	chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
			} else {
				chrome.tabs.executeScript(
					tabs[0].id,
					{code: 'document.body.style.backgroundColor = "";'});
			}
    });
};
