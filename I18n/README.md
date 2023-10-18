# Internationalization (i18n)
The i18n feature has a function to translate values.
```
translate(value, replacements, plural);
```

It can take 3 different types of values.

1. Key/value maps where the key is the locale.
	```
	let value = {
		"en": "I love programming",
		"fr": "J'aime programmer"
	};

	translate(value);
	// Outputs "I love programming" or "J'aime programmer" depending on the app state
	```
2. Arrays that contains a singular or plural value. The first index being a singular value and the second a plural one.
	```
	let value = ["Programming language", "Programming languages"];

	translate(value, null, 0);
	translate(value, null, false);
	// Outputs "Programming language"

	translate(value, null, 1);
	translate(value, null, 99);
	translate(value, null, true);
	// Outputs "Programming languages"
	```
3. Strings that can have placeholders to be replaced.
	```
	let value = "I sleep {amount} hours every night";

	translate(value, {"amount": 8});
	// Outputs "I sleep 8 hours every night"
	```
	You can also have placeholders be in an array format.
	```
	let value = "I program {0} hours every {1} days";

	translate(value, [16, 3])
	// Outputs "I program 16 hours every 3 days"
	```

It is possible to use all these types in any combination.
```
let amount = 1;
let value = {
	"en": ["I own {amount} computer", "I own {amount} compmuters"]
};

translate(value, {amount: amount}, amount);
// Outputs "I own 1 computer"

translate(value, {amount: 2}, amount);
// Outputs "I own 2 computers"
```