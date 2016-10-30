
# storage

  tiny storage layer to simplify `localStorage`.

## Installation

```bash
$ npm install @segment/storage
```

## Example

set / get / clear
```js
var store = require('@segment/storage')('topic');

store('key', [1, 2, 3]);
store('key'); // => [1, 2, 3]
store(); // => { key: [1, 2, 3] }
store(null);
store(); // => {}
```

localStorage events
```js
var store = require('@segment/storage')('topic');

// tab 1
store(function(e){
  assert('key' == e.key);
  assert(null == e.previous);
  assert([1, 2, 3] eql e.current);
  assert(e.url);
});

store('key', function(e){
  assert('key' == e.key);
  assert(null == e.previous);
  assert([1, 2, 3] eql e.current);
  assert(e.url);
});

// tab 2
var store = require('@segment/storage')('topic');

store('key', [1, 2, 3]);
```

## API

#### storage(topic)

  Initialize new `store` with `topic`.

#### store(key, value)

  Set `key`, `value` in `topic`.

#### store(key)

  Get `key` in `topic`

#### store()

  Get all `items` in `topic`.

#### store(null)

  Clear all items in `topic`.

#### store(fn)

  Listen on changes in `topic`.

#### store(key, fn)

  Call `fn(e)` when `key` changes.

    - `.previous` parsed `.oldValue`.
    - `.current` parsed `.newValue`.

## License

  (MIT)
