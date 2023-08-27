import { EitherErr } from './err';
import { EitherOk } from './ok';

export type Either<E, V> = EitherErr<E> | EitherOk<V>;
