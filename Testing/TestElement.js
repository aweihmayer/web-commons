class TestElement {
	constructor(selector, name) {
		this.selector = selector;
		this.name = name ?? selector;
		this.element = null;
		this.parent = null;
		this.children = [];
	}

	find(testElement) {
		let selector = this.selector;
		let container = document;

		if (!testElement) {
			testElement = this;
		} else {
			selector = testElement.selector;
			container = this.element;
			testElement.parent = this;
			this.children.push(testElement);
		}

		let element = container.querySelector(selector);
		if (!element) { return testElement; }
		testElement.element = element;
		testElement.onFound();
		return testElement;
	}

	findAll(testElement) {
		let selector = this.selector;
		let container = document;
		let parent = null;

		if (!testElement) {
			testElement = this;
		} else {
			selector = testElement.selector;
			container = this.element;
			parent = this;
		}

		let elements = container.querySelectorAll(selector);
		let testElements = [];
		Array.from(elements).forEach(el => {
			let testElementClone = testElement.clone();
			testElementClone.parent = parent;
			testElementClone.element = el;
			if (parent) {parent.children.push(testElementClone); }
			testElements.push(testElementClone);
		});

		return testElements;
	}

	onFound() { }

	focus(wait) {
		wait = wait ?? 1;
		this.element.focus();
		let waitUntil = Date.now() + (wait * 1000);
		while (Date.now() < waitUntil) { }
		return true;
	}

	clone() {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}
}