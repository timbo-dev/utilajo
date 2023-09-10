# @utilajo/either

| Packages                                                                              | Last Version | Github                                                                                                                                                                           | Npm                                                                                                                                                   |
| ------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@utilajo/either](https://timbo-dev.github.io/utilajo/packages/either/#utilajo-either)| `1.0.0`      | <a href="https://github.com/timbo-dev/utilajo/tree/main/packages/either"><img src="https://github.com/timbo-dev/utilajo/tree/main/docs/assets/github.svg" alt="Github Icon"></a> | <a href="https://npmjs.com/package/@utilajo/either"><img src="https://github.com/timbo-dev/utilajo/tree/main/docs/assets/npm.svg" alt="Npm Icon"></a> |

```sh [npm]
$ npm add @utilajo/either --save
```

```sh [pnpm]
$ pnpm add @utilajo/either
```

```sh [yarn]
$ yarn add @utilajo/either
```

```sh [bun]
$ bun add @utilajo/either
```

## TL;DR

The "either" utility is a functional exception handler able to manage errors and success messages, values, and objects.

## What is either?

A solution to handle errors in your program is to use throw exceptions and try to catch them. However, you know that try-catch statements can make the code more complicated because they can accidentally create a ***Hadoooooouken***-like code body. If a throw hasn't been caught, the program can crash or be caught in another catch layer.

With either exception handling pattern, you can make your exception flow more dynamic by returning an exception instead of throwing it. Look at this example:

Let's say we have a function called `createUser`, and its responsibility is to create an user (if this function creates a payment, I swear I'd be impressed).

```ts
function createUser(userData: UserDTO): User {
    const validationResult = validate(userData);

    if (!validationResult) {
        throw new InvalidUserException();
    }

    return new User(userData);
}
```

### ⚠️ Warning ⚠️
> **Some methods haven't been implemented in this example because they are not relevant. Please ignore the `validate` function and the `User` and `InvalidUserException` classes.**

At first glance, the createUser function looks like a good thing because it's easy to understand what the method does.

If the validation is successful, return the user instance; otherwise, throw an exception. Simple, right? Let's go see the method that implements the `createUser` function:

```ts
async function registerUser(userData: UserDTO, repository: IUserRepository): Promise<void> {
    try {
        const user = createUser(userData);

        await repository.registerUser(user);
    } catch(err) {
        throw err;
    }
}
```

### ⚠️ Warning ⚠️
> **Again, please ignore the `repository`. This is only an extremely simple example of the `registerUser` method implementation.**

Okay, we can see the try/catch block statement, and you might be thinking, **"Okay, it works and has been implemented correctly. Where is the problem?"**

When we develop code, we need to ensure that other people will understand the code we have written. If you do not read the `createUser` code implementation, you cannot know that there is a possibility of an exception being thrown.

So, once again, you might say, **"Okay, I am using TypeScript to specify exactly which types can be returned."** However, we still have a problem; TypeScript cannot recognize thrown exceptions. The type of the `createUser` function is:

```ts
function createUser(userData: UserDTO): User
```

This type doesn't indicate the existence of the exception. So, how can we communicate the possibility of an exception? Simply create a comment!

```ts
/**
 * Hey keep your eyes open, this function can throws an InvalidUserException!
 */
function createUser(userData: UserDTO): User
```

The problem seems to have been solved, YEAH! But it's not completely fixed yet.

Comments, as they age, can become inaccurate, not always intentionally, but they silently deteriorate over time, depending on how many times the code has been changed. They might omit newly added exceptions, potentially causing the issues mentioned earlier.

You might be thinking, **"Okay, you've convinced me! But what's the best approach to handle this?" (I know you don't think exactly like this, but...)** That's a great question! Perhaps the best way is to try returning an error instead of throwing it?

I personally believe that's probably the best approach. By returning an error, we can inform TypeScript that the function may return an error. Let's revisit the same example again:

```ts
function createUser(userData: UserDTO): User | InvalidUserException {
    const validationResult = validate(userData);

    if (!validationResult)
        return new InvalidUserException();

    return new User(userData);
}
```

Okay, the `createUser` method now returns an instance of `InvalidUserException`. So, for a new developer who sees the code for the first time, they can immediately recognize the possibility of an error.

With that in mind, let's move on to the package and see how this works.

## How does this work?

First, import the type `Either` and the methods `ok()` and `err()` from `@utilajo/either`. With these methods, we can refactor the `createUser` method to use the package. Take a look at the example below:

```ts
import { Either, ok, err } from '@utilajo/either';

function createUser(userData: UserDTO): Either<InvalidUserException, User> {
    const validationResult = validate(userData);

    if (!validationResult)
        return err(new InvalidUserException());

    return ok(new User(userData));
}
```
Alright, looking at this code, let's start by explaining what the Either type is.

The `Either` type takes two generics: everything typed on the Left is an `EitherErr` instance, and everything typed on the Right is an `EitherOk` instance. These instances store the primitive value typed in the generics and provide two methods to identify what type of value it is: the `isErr()` method and `isOk()`. To obtain the primitive value, you need to use the `getValue()` method.

`EitherErr` can represent various values, not just error instances.

Now, let's take a look at the refactored version of the `registerUser` method to see another example of this pattern.

```ts
async function registerUser(userData: UserDTO, repository: IUserRepository): Promise<Either<InvalidUserException, void>> {
    const createUserResponse = createUser(userData);

    if (createUserResponse.isErr()) return createUserResponse;

    const user: User = createUserResponse.getValue();
    await repository.registerUser(user);

    return ok(void 0);
}
```

Looking at this function, you can now see the `createUserResponse`, whose type is:

```ts
const createUserResponse: Either<InvalidUserException, User>
```

This type informs us that the variable can have two values. So, if `isErr()` returns `true`, the `createUserResponse` will have the type `EitherErr<InvalidUserException>`, and if it returns `false`, it will have the type `EitherOk<User>`. This distinction is possible without using [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) because the methods `isErr()` and `isOk()` use [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) to infer the correct type.

The user instance can be obtained using the `getValue()` method and finally saved in the repository. It's not required, but this function returns the exception to a layer above. In this case, the function returns `void` as an OK value. Using `undefined` would work too, but I think `void` is more consistent.

## References

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

