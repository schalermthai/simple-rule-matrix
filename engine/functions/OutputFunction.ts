import {Value} from "./Value";

export abstract class OutputFunction {
    type: string;
    args: any[];

    protected constructor(type: string, ...args: any[]) {
        this.type = type;
        this.args = args;
    }

    abstract evaluate(): Value;

    serialize(): any {
        return {
            func: this.type,
            args: this.args
        };
    }

    protected evalArgument(r: any): any {
        if (r instanceof Value) return r.getValue();
        if (r instanceof OutputFunction) return this.evalArgument(r.evaluate());
        return r;
    }
}
