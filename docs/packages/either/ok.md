# Reference

## `ok<V>(okValue: V): EitherOk<V>`

Call `ok` to create an `EitherOk` instance.

By default `ok` method pass primitive values by value and object values by reference.

```ts
import { ok } from '@utilajo/either';

ok<string>('My ok value');
ok<number>(36);
ok<boolean>(true);

// ...
```

### Parameters

* `okValue`: The value you want to store on `EitherOk` object. It can be a value of generic type `V`.

### Returns

* `EitherOk`: The `EitherOk` instance as returned by `ok` function. This object contains the value `V` and methods to verify if `isOk()` or `isErr()`.
