
# storage

  tiny storage layer to simplify `localStorage`.

## Installation

```bash
$ component install segmentio/storage
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

