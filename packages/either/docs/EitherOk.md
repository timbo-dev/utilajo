# Reference

## `constructor EitherOk<V>(okValue: V): EitherOk<V>`

`EitherOk` is an object that represents an success value that can be returned.

```ts
import { EitherOk } from '@utilajo/either';

type User = {
    name: string
}

new EitherOk<User>({name: 'Jhon Doe'});
new EitherOk<string>('Ok message');
new EitherOk<boolean>(true);

// ...
```

### Parameters

* `okValue`: The value you want to store on `EitherOk` object. It can be a value of generic type `V`.

### Methods

* `isOk`: For the `EitherOk` instance always returns `true` and define type predicate to `this is EitherOk<E>`.

* `isErr`: For the `EitherOk` instance always returns `false` and define type predicate to `this is never`

* `getValue`: Returns the value `V` stored on `EitherOk` object.
