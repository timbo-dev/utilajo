export default abstract class AbstractEither<V> {
    protected eitherValue: V;

    public constructor(value: V) {
        this.eitherValue = value;

        Object.freeze(this);
    }

    public getValue(): V {
        return this.eitherValue;
    }

    public abstract isOk(): boolean;
    public abstract isErr(): boolean;
}
