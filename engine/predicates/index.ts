import {equalsTo, greaterThan, inList, lessThan} from "./predefinePredicates";
import {Predicate} from "./Predicate";

export {Predicate} from "./Predicate";
export * from './predefinePredicates'


export const predicates: Record<string, (value: any) => Predicate> = {
    greaterThan: (value: number) => greaterThan(value),
    equalsTo: (value: any) => equalsTo(value),
    inList: (values: any[]) => inList(values),
    lessThan: (value: number) => lessThan(value),
};
