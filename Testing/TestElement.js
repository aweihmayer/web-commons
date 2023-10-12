<html>
	<head>
		<script>
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
			console.log(this.element);
			this.element.focus();
			let waitUntil = Date.now() + (wait * 1000);
			while (Date.now() < waitUntil) { }
			return true;
			}

			clone() {
				return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
			}
		}

			class TechniqueListTestElement extends TestElement {
				constructor() {
				super('ul.technique', 'technique list');
			}

			onFound() {
				this.items = this.findAll(new TestElement('input'));
			}
		}

			function test() {
				alert('Test starting');
			let documentTest = new TestElement('body');
			documentTest.find();
			let techniqueList = documentTest.find(new TechniqueListTestElement());
			techniqueList.items[0].click();
			console.log(techniqueList);
		}

			setTimeout(test, 1000);
		</script>
	</head>
	<body>
		<ul class="technique">
			<li><input />I am a technique</li>
		</ul>
	</body>
</html>