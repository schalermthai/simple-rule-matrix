import {OutputFunction} from "./OutputFunction";
import {value, Value} from "./Value";

class Sum extends OutputFunction {

    constructor(arg1: number | OutputFunction, arg2: number | OutputFunction) {
        super('sum', arg1, arg2);
    }

    evaluate(): Value {
        const evalArgs = this.args.map(r => this.evalArgument(r))
        const v = evalArgs.reduce((acc, cur) => acc + cur, 0);
        return value(v);
    }
}

// Factory function for creating Sum instances
export const sum = (arg1: number | OutputFunction, arg2: number | OutputFunction): Sum => new Sum(arg1, arg2);
