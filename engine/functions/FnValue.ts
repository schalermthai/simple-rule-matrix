import {OutputFunction} from "./OutputFunction";
import * as esprima from "esprima";
import {evaluateExpression, Expression, MemberExpression} from "../marshaller/astEval";
import {Result} from "./Result";
import {value, Value} from "./Value";

export class FnValue implements Result {
    constructor(private fn: (input: any) => OutputFunction | any) {
    }

    evaluate(input: any): Value {
        const v = this.fn(input);
        if (v instanceof Value) return v.evaluate();
        return v instanceof OutputFunction ? v.evaluate() : value(v);
    }

    serialize() {
        const code = this.fn.toString();
        const ast = esprima.parseScript(code);
        return parseExpression(ast.body[0] as Expression);
    }
}

const parseExpression = (ast: Expression): any => {
    if (ast.type === 'BlockStatement') {
        if (ast.body[0].type !== 'ReturnStatement') {
            throw new Error('Function must return a value. Function with multiple statements are not supported');
        }
        return parseExpression(ast.body[0].argument);
    }
    else if (ast.type === 'ExpressionStatement' && ast.expression.type === 'ArrowFunctionExpression') {
        return parseExpression(ast.expression.body);
    }
    else if (ast.type === 'CallExpression') {
        const args = ast.arguments.map((arg: any) => parseArgument(arg));
        const func = parseFnName(ast.callee);
        return {func, args};
    } else if (ast.type === 'MemberExpression') {
        const name = parseVariableName(ast);
        const args = [`input['${name}']`]
        return { func: "id", args }

    } else if (ast.type === 'Literal') {
        return ast.value;
    }
    return null; // or throw an error if an unknown type is encountered
}

const parseArgument = (arg: Expression): string => {
    if (arg.type === 'MemberExpression') {
        const name = parseVariableName(arg);
        return `input['${name}']`
    } else if (arg.type === 'UnaryExpression' || arg.type === 'BinaryExpression') {
        return evaluateExpression(arg);
    }
    return parseExpression(arg);
}

const parseFnName = (callee: Expression): string => {
    if (callee.type === 'SequenceExpression') {
        return parseFnName(callee.expressions[1]);
    } else if (callee.type === 'MemberExpression') {
        return parseVariableName(callee);
    }
    return '';
}

const parseVariableName = (ast: MemberExpression) => {
    return ast.property.type === 'Identifier'
        ? `${ast.property.name}`
        : `${ast.property.value}`
}
