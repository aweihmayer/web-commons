# Validation
## Front-end
Validation in the front-end is done like so:
```
Validator.validate(value, type, schema)
```
To add a new type, simply add the a function property to the object that returns true if the value is valid or throws an error.
```
Validator.myNewType = function (value, type, schema) { ... }
```