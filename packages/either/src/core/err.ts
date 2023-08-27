import AbstractEither from './either.abstract';

export function err<E>(errValue: E): EitherErr<E> {
    return new EitherErr(errValue);
}

export class EitherErr<E> extends AbstractEither<E> {
    public constructor(errValue: E) {
        super(errValue);
    }

    public isErr(): this is EitherErr<E> {
        return true;
    }

    public isOk(): this is never {
        return false;
    }
}
