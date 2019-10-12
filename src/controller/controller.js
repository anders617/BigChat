console.log("Hello world");

class Extractor {
	constructor() {}

	select(selectors) {
		for (const selector of selectors) {
			const e = document.querySelector(selector);
			if (e != null) return e;
		}
		return null;
	}

	extract(e, attributes) {
		for (const attr of attributes) {
			const val = e.getAttribute(attr);
			if (val != null) return val;
		}
		return null;
	}

	play() {
		return this.select([
			"button[aria-label=Play]"
		]);
	}

	pause() {
		return this.select([
			"button[aria-label=Pause]"
		]);
	}

	scrubber() {
		return this.select([
			".scrubber-bar"
		]);
	}

	videoLength() {
		const info = this.select([
			"[aria-label=\"Seek time scrubber\"]"
		]);
		return this.extract(info, [
			"aria-valuemax"
		]);
	}
}

class VideoControls {
	constructor(extractor) {
		this.extractor = extractor;
	}
	play() {
		let button = this.extractor.play();
		if (button == null) return false;
		button.click();
		return true;
	}
	pause() {
		let button = this.extractor.pause();
		if (button == null) return false;
		button.click();
		return false;
	}
	scrub(seconds) {
		if (seconds == null || isNaN(seconds)) return false;
		let scrubber = this.extractor.scrubber();
		if (scrubber == null) return false;
		const duration = extractor.videoLength();
		if (duration == null) return false;
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

const extractor = new Extractor();
const controls = new VideoControls(extractor);

