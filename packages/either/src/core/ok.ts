import AbstractEither from './either.abstract';

export function ok<V>(okValue: V) {
    return new EitherOk(okValue);
}

export class EitherOk<V> extends AbstractEither<V> {
    public constructor(okValue: V) {
        super(okValue);
    }

    public isErr(): this is never {
        return false;
    }

    public isOk(): this is EitherOk<V> {
        return true;
    }
}
