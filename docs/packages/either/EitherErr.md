# Reference

## `constructor EitherErr<E>(errValue: E): EitherErr<E>`

`EitherErr` is an object that represents an error that can be returned.

```ts
import { EitherErr } from '@utilajo/either';

new EitherErr<Error>(new Error('Error value'));
new EitherErr<string>('error message');
new EitherErr<boolean>(false);

// ...
```

### Parameters

* `errValue`: The value you want to store on `EitherErr` object. It can be a value of generic type `E`.

### Methods

* `isOk`: For the `EitherErr` instance always returns `false` and define type predicate to `this is never`.

* `isErr`: For the `EitherErr` instance always returns `true` and define type predicate to `this is EitherErr<E>`

* `getValue`: Returns the value `E` stored on `EitherErr` object.
