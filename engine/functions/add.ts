import {OutputFunction} from "./OutputFunction";
import {Value, value} from "./Value";

// Define the Add class
export class Add extends OutputFunction {
    constructor(arg1: number | OutputFunction, arg2: number | OutputFunction) {
        super('add', arg1, arg2);
    }

    evaluate(): Value {
        const v = this.args.reduce((acc, curr) => {
            return this.evalArgument(curr) + acc;
        }, 0);
        return value(v);
    }
}

// Factory function for creating Add instances
export const add = (arg1: number | OutputFunction, arg2: number | OutputFunction): Add => new Add(arg1, arg2);
