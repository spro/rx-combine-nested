# RxJS `combineNested`

Combine arbitrarily nested objects/arrays of RxJS observables into a single observable

## Installation

Install with NPM or Yarn:

```
npm install rx-combine-nested
yarn add rx-combine-nested
```

## Example

```typescript
import * as rx from 'rxjs'
import * as rxo from 'rxjs/operators'
import {combineNested} from 'rx-combine-nested'

const every_1s = rx.interval(1000)
const every_2s = rx.interval(2000)
const hello_1s = every_1s.pipe(rxo.map(n => `hello 1s: ${n}`))
const hello_2s = every_2s.pipe(rxo.map(n => `hello 2s: ${n}`))

const nested_obs = {
    every_1s,
    every_2s,
    hellos: [hello_1s, hello_2s],
    deep_hellos: {hellos: {hello_1s, hello_2s}}
}

combineNested(nested_obs).subscribe(result =>
    console.log('[result]', result)
)
```

The nested object of observables `nested_obs` is turned into a single observable.

Each "endpoint" of the resulting observable will start as a `null` value (using RxJS `startNull`) so that the full shape of the object is emitted immediately.

```
[result] {
  every_1s: null,
  every_2s: null,
  hellos: [ null, null ],
  deep_hellos: { hellos: { hello_1s: null, hello_2s: null } }
}

... after a few seconds ...

[result] {
  every_1s: 4,
  every_2s: 1,
  hellos: [ 'hello 1s: 4', 'hello 2s: 1' ],
  deep_hellos: { hellos: { hello_1s: 'hello 1s: 4', hello_2s: 'hello 2s: 1' } }
}
```