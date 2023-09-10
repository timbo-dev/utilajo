# Reference

## `err<E>(errValue: E): EitherErr<E>`

Call `err` to create an `EitherErr` instance.

By default `err` method pass primitive values by value and object values by reference.

```ts
import { err } from '@utilajo/either';

err<Error>(new Error('Error value'));
err<string>('error message');
err<null>(null);

// ...
```

### Parameters

* `errValue`: The value you want to store on `EitherErr` object. It can be a value of generic type `E`.

### Returns

* `EitherErr`: The `EitherErr` instance as returned by `err` function. This object contains the value `E` and methods to verify if `isOk()` or `isErr()`.
