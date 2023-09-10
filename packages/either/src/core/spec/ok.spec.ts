import { Either } from '../either.type';
import { EitherErr } from '../err';
import { EitherOk, ok } from '../ok';

class SutError extends Error {
    constructor() {
        super('error message');
        this.name = this.constructor.name;
    }
}

it('should be able to create a new EitherOk instance', () => {
    const sut = ok('ok message');

    expect(sut).toBeInstanceOf(EitherOk);

    expect(sut.isErr()).toBe(false);
    expect(sut.isOk()).toBe(true);

    expect(sut.getValue()).toBe('ok message');
});

it('should be assigned by reference', () => {
    const sutValue = { message: 'ok message' };
    const sut = ok(sutValue);

    sutValue.message = 'other message';

    expect(sut.getValue().message).toBe('other message');
});

it('should be return EitherOk instance type', () => {
    function sutFunction(): Either<SutError, string> {
        return ok('ok message');
    }

    const sut = sutFunction();

    expectTypeOf(sut).toEqualTypeOf<EitherErr<SutError> | EitherOk<string>>();

    if (sut.isOk()) {
        expectTypeOf(sut).toEqualTypeOf<EitherOk<string>>();
        expectTypeOf(sut.getValue()).toEqualTypeOf<string>();
    }
    else {
        expectTypeOf(sut).toEqualTypeOf<EitherErr<SutError>>();
        expectTypeOf(sut.getValue()).toEqualTypeOf<SutError>();
    }
});

