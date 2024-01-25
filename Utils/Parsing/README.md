# Parsing
## Front-end
Parsing values in the front-end happens automatically when collecting or validating values from inputs.

Parsing in the front-end is done like so:
```
Parser.parse(value, type, schema)
```
To add a new type, simply add the a function property to the object that returns the parsed value.
```
Parse.myNewType = function (value, type, schema) { ... }
```