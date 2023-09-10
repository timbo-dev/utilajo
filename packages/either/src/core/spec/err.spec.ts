import { Either } from '../either.type';
import { EitherErr, err } from '../err';
import { EitherOk } from '../ok';

class SutError extends Error {
    constructor() {
        super('error message');
        this.name = this.constructor.name;
    }
}

it('should be able to create a new EitherErr instance', () => {
    const sut = err(new SutError());

    expect(sut).toBeInstanceOf(EitherErr);

    expect(sut.isErr()).toBe(true);
    expect(sut.isOk()).toBe(false);

    expect(sut.getValue()).toBeInstanceOf(SutError);
});

it('should be return EitherErr instance type', () => {
    function sutFunction(): Either<SutError, string> {
        return err(new SutError());
    }

    const sut = sutFunction();

    expectTypeOf(sut).toEqualTypeOf<EitherErr<SutError> | EitherOk<string>>();

    if (sut.isErr()) {
        expectTypeOf(sut).toEqualTypeOf<EitherErr<SutError>>();
        expectTypeOf(sut.getValue()).toEqualTypeOf<SutError>();
    } else {
        expectTypeOf(sut).toEqualTypeOf<EitherOk<string>>();
        expectTypeOf(sut.getValue()).toEqualTypeOf<string>();
    }
});
