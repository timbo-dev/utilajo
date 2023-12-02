
import { ok, EitherOk } from '@utilajo/either';

function sut() {
    const sut = ok('ok message');

    if (!(sut instanceof EitherOk)) process.exit(1);
    if (sut.isErr()) process.exit(1);

    if (!sut.isOk()) process.exit(1);
    if (sut.getValue() !== 'ok message') process.exit(1);

    process.exit(0);
}

sut();
