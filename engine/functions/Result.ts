import {Value} from "./Value";

export interface Result {
    evaluate(input: any): Value

    serialize(): any;
}
