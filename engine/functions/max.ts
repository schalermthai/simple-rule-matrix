import {OutputFunction} from "./OutputFunction";
import {value, Value} from "./Value";

export class Max extends OutputFunction {

    constructor(arg1: number | OutputFunction, arg2: number | OutputFunction) {
        super('max', arg1, arg2);
    }

    evaluate(): Value {
        const evalArgs = this.args.map(r => this.evalArgument(r));
        const v = Math.max(...evalArgs);
        return value(v)
    }
}

// Factory function for creating Max instances
export const max = (arg1: number | OutputFunction, arg2: number | OutputFunction): Max => new Max(arg1, arg2);
