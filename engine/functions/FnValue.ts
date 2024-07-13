import {OutputFunction} from "./OutputFunction";
import * as esprima from "esprima";
import { FunctionHeader } from "../marshaller/astEval";
import {Result} from "./Result";
import {value, Value} from "./Value";
import {parseFunction} from "./fnValueSerializer";

export class FnValue implements Result {
    constructor(private fn: (input: any) => OutputFunction | any) {
    }

    evaluate(input: any): Value {
        const v = this.fn(input);
        if (v instanceof Value) return v.evaluate();
        return v instanceof OutputFunction ? v.evaluate() : value(v);
    }

    serialize() {
        const code = codeToString(this.fn);
        const ast = esprima.parseScript(code);
        return parseFunction(ast.body[0] as FunctionHeader);
    }
}

const codeToString = (fn: (input: any) => OutputFunction | any): string => {
    const code = fn.toString();
    return code.startsWith('function (') ? code.replace('function (', 'function fn(') : code;
}


