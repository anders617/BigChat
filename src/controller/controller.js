class HTMLMediaControls {
	constructor() {}

	select(selectors) {
		for (const selector of arguments) {
			const e = document.querySelector(selector);
			if (e != null) return e;
		}
		return null;
	}

	play() {
		const media = this.select('video', 'audio');
		if (media == null) return false;
		media.play();
		return true;
	}

	pause() {
		const media = this.select('video', 'audio');
		if (media == null) return false;
		media.pause();
		return true;
	}

	seek(seconds) {
		const media = this.select('video', 'audio');
		if (media == null) return false;
		media.currentTime = seconds;
		return true;
	}

	tell() {
		const media = this.select('video', 'audio');
		if (media == null) return null;
		return media.currentTime;
	}

	duration() {
		const media = this.select('video', 'audio');
		if (media == null) return 0;
		return media.duration;
	}

}

class NetflixControls extends HTMLMediaControls {
	constructor() {
		super()
	}

	seek(seconds) {
		if (seconds == null || isNaN(seconds)) return false;
		let scrubber = this.select('.scrubber-bar');
		if (scrubber == null) return false;
		const duration = this.duration();
		if (duration == 0 || duration == +Infinity) return false;
		const rect = scrubber.getBoundingClientRect();
		const x = rect.left + rect.width * (seconds / duration);
		const y = rect.top + (rect.height / 2);
		if (x == 0 && y == 0) return false;
		console.log(`(${x}, ${y})`);
		const options = {
			clientX: x,
			clientY: y,
			bubbles: true
		}
		scrubber.dispatchEvent(new MouseEvent("mousehover", options));
    scrubber.dispatchEvent(new MouseEvent("mousedown", options));
		scrubber.dispatchEvent(new MouseEvent("mouseup", options));
		return true;
	}

}

function ControlsFactory() {
	const domain = document.URL.match(/(.+):\/\/(.+?)\/.*/)[2];
	const mapping = {
		'www.netflix.com': new NetflixControls()
	};
	return mapping[domain] || new HTMLMediaControls();
}

export {ControlsFactory};

