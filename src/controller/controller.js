/* eslint-disable max-classes-per-file */
import 'babel-polyfill';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

class HTMLMediaControls {
	constructor() {
		this.poll('video', 'audio').then(media => {
			media.addEventListener('pause', () => {
				chrome.runtime.sendMessage(chrome.runtime.id, ["content.pause"], {}, () => {});
			});
			media.addEventListener('play', () => {
				chrome.runtime.sendMessage(chrome.runtime.id, ["content.play"], {}, () => {});
			});
			media.addEventListener('seeked', () => {
				chrome.runtime.sendMessage(chrome.runtime.id, ["content.seek", this.tell()], {}, () => {});
			});
		});
	}

	select(...selectors) {
		for (const selector of selectors) {
			const e = document.querySelector(selector);
			if (e != null) return e;
		}
		return null;
	}

	async poll(...selectors) {
		while (true) {
			const e = this.select(...selectors);
			if (e !== null) return e;
			await sleep(1000);
		}
	}

	play() {
		const media = this.select('video', 'audio');
		if (media == null) return false;
		media.play();
		return true;
	}

	playing() {
		const media = this.select('video', 'audio');
		if (media == null) return false;
		return !media.paused;
	}

	pause() {
		const media = this.select('video', 'audio');
		if (media == null) return false;
		media.pause();
		return true;
	}

	paused() {
		const media = this.select('video', 'audio');
		if (media == null) return true;
		return media.paused;
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

	// eslint-disable-next-line class-methods-use-this
	goto(url) {
		window.location.href = url;
	}

	url() {
		return window.location.href;
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

export {
	ControlsFactory
};