// Define the Add class
import {OutputFunction} from "./OutputFunction";
import {value, Value} from "./Value";

export class Id extends OutputFunction {
    constructor(arg1: any) {
        super('id', arg1);
    }

    evaluate(): Value {
        const v = this.evalArgument(this.args[0]);
        return value(v);
    }
}

// Factory function for creating Add instances
export const id = (arg1: any): Id => new Id(arg1);
