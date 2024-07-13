import {OutputFunction} from "./OutputFunction";
import {value, Value} from "./Value";

export class Min extends OutputFunction {

    constructor(arg1: number | OutputFunction, arg2: number | OutputFunction) {
        super('min', arg1, arg2);
    }

    evaluate(): Value {
        const evalArgs = this.args.map(r => this.evalArgument(r))
        const v = Math.min(...evalArgs);
        return value(v);
    }
}

// Factory function for creating Min instances
export const min = (arg1: number | OutputFunction, arg2: number | OutputFunction): Min => new Min(arg1, arg2);
