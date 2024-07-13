import {Predicate} from "./predicates";
import {OutputFunction, Result, value, Value} from "./functions";
import {FnValue} from "./functions/FnValue";

export class Rule {
    predicates: Predicate[];
    result: Result[];

    constructor(predicates: Predicate[], result: Result[]) {
        this.predicates = predicates;
        this.result = result;
    }

    evaluate(input: any, keys: string[]): boolean {
        return this.predicates.every((predicate, index) => predicate.evaluate(input[keys[index]]));
    }

    serialize(): any {
        return {
            predicates: this.predicates.map(pred => pred.serialize()),
            result: this.result.map(r => r.serialize())
        };
    }
}


export type FunctionType = (input: any) => OutputFunction | any;
type ArrayElement = FunctionType | Value | number | string | boolean | null | undefined | Record<any, any> | Array<any>;
type MixedArray = ArrayElement[];


export const rule = (predicates: Predicate[], resultBuilder: MixedArray) => {
    const result = resultBuilder.map(r => {
        if (r instanceof Value) {
            return r;
        } else if (typeof r === 'function') {
            return new FnValue(r as FunctionType)
        } else {
            return value(r)
        }
    })

    return new Rule(predicates, result);
}
