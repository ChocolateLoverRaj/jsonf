> [!WARNING]
> I no longer maintain this. I switched to Rust and don't code in JS anymore. Contact me (you can email me) if you want me to put a link to a maintained alternative here.

[![Test](https://github.com/ChocolateLoverRaj/jsonf/actions/workflows/test.yml/badge.svg)](https://github.com/ChocolateLoverRaj/jsonf/actions/workflows/test.yml)
[![License](https://badgen.net/github/license/standard/ts-standard)](https://github.com/ChocolateLoverRaj/jsonf/blob/main/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)

# jsonf
Json with functions.

## Why
Json is good because of it's simplicity, but it can't do logical things. By being able to call functions, you can do many things with json.

Let's say we want to create an array of 100 numbers from 0 to 99.
```json
[
  0,
  1,
  2,
  "That's a lot of numbers"
]
```
We *could* store the data in this long array, but there are a few problems.

1. It takes up a lot of space. This can make it hard to read.
2. It's hard to change. If you change your mind and only want to have 50 numbers, or want to add 100 more numbers, then you'll have to do a lot of deleting / adding.

The solution: jsonf.
```json
{
  "$jsonf": ["jsFn", 100]
}
```
Your javascript function could look like this:
```js
const jsFn = numberOfNumbers => {
  const arr = []
  for (let i = 0; i < numberOfNumbers; i++) {
    arr.push(i)
  }
  return arr
}
```
Now the json is very easy to read, and you can easily change the number of numbers by changing the `100` to something else, like `50` or `200`.

## Syntax

### 'Calling' a function.
You can 'call' a function by having an object with a `$jsonf` key. The value is an array, where the first element is the name of the function, and the following elements are the parameters given to that function.
```json
{
  "$jsonf": [
    "nameOfMyFn", 
    "param 1", 
    { 
      "object": "is param 2",
      "params": "Can be any json value"
    }
  ]
}
```
This will transform into whatever `nameOfMyFn` returned.
```json
"Whatever `nameOfMyFn` returned"
```

## Security
> Can random js code be executed?

No. Inside the json, functions can only be called. In order for a function to be callable, they must be passed to the [`jsonf`](#Transforming-Json) function.

## Install
`@programmerraj/transform-json` is a `peerDependency`.
```bash
npm i @programmerraj/transform-json @programmerraj/jsonf
```

## Usage
[More information about `transform-json`](https://github.com/ChocolateLoverRaj/json-transformer#usage)

### ES
```js
import jsonf from 'jsonf'
```

### CommonJS
```js
const jsonf = require('jsonf').default
```

### Transforming Json
`jsonf` accepts an object where the keys are the names of the functions and the values are the functions.
```js
transform({
  $jsonf: ['myFn', 5, 4]
}, [jsonf({
  myFn: (n1, n2) => n1 * n2
})])`
```
Transforms into `20`.

### Using with [jsonv](https://github.com/ChocolateLoverRaj/jsonv#readme)
Make sure to put the `jsonv` visitor before the `jsonf` visitor.
```js
transform({
  $jsonv: {
    n: 50
  },
  key: {
    $jsonf: ['add', { $jsonv: 'n' }, 2]
  }
}, [
  jsonv(),
  jsonf({ add: (a, b) => a + b })
])
```
Transforms to
```json
{
  "key": 52
}
```
In the example above, the variables are getting converted first, which means that `add(50, 2)` is being called. If we didn't have the `jsonv` before the `jsonf` visitor, then `add(50, { $jsonv: 'n' })` would be called and `add` would try to add a number and an object.

## Contributing
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/eslint-config-standard-with-typescript)
