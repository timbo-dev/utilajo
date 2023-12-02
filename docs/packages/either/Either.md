# Reference

## `type Either<E, V> = EitherErr<E> | EitherOk<V>`

`Either` is a type that represents an union of two instances `EitherErr` and `EitherOk`.

```ts
import { Either } from '@utilajo/either';

function validate(): Either<false, true> {
    if (/* some validation here... */) {
        return err(false);
    }

    return ok(true);
}

// ...
```

### Parameters

* `E`: The type of value you want to be `EitherErr`.
* `V`: The type of value you want to be `EitherOk`.

### Returns

* `EitherErr<E> | EitherOk<V>`: `Either` returns the union of two instances `EitherErr` and `EitherOk.
