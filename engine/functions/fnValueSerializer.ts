import {
    BlockStatement,
    evaluateExpression,
    ExpressionBody,
    ExpressionStatement,
    FunctionDeclaration, Identifier, MemberExpression
} from "../marshaller/astEval";


export const parseFunction = (ast: FunctionDeclaration | ExpressionStatement): any => {
    if (ast.type === 'FunctionDeclaration') {
        return parseBlockStatement(ast.body, ast.params[0]);
    } else if (ast.type === 'ExpressionStatement' && ast.expression.type === 'ArrowFunctionExpression') {
        if (ast.expression.body.type === 'Identifier' && ast.expression.body.name === 'undefined') {
            throw new Error('Function must return a value. Function with multiple statements are not supported');
        }
        return ast.expression.body.type === 'BlockStatement'
            ? parseBlockStatement(ast.expression.body, ast.expression.params[0])
            : parseFnBody(ast.expression.body, ast.expression.params[0]);
    }
}

const parseBlockStatement = (ast: BlockStatement, inputParam: Identifier): any => {
    if (ast.body.length === 0 || ast.body[0].type !== 'ReturnStatement') {
        throw new Error('Function must return a value. Function with multiple statements are not supported');
    }
    return parseFnBody(ast.body[0].argument, inputParam);
}

const parseFnBody = (ast: ExpressionBody, inputParam: Identifier): any => {
    switch (ast.type) {
        case 'CallExpression':
            return { func: parseFnName(ast.callee), args: ast.arguments.map(arg => parseArgument(arg, inputParam)) };
        case 'MemberExpression':
            return { func: "id", args: [`input['${parseVariableName(ast, inputParam)}']`] };
        case 'Literal':
            return evaluateExpression(ast);
        case 'Identifier':
            return { func: "id", args: [undefined] };
        default:
            return null;
    }
}

const parseArgument = (arg: ExpressionBody, inputParam: Identifier): string => {
    if (arg.type === 'MemberExpression') {
        const name = parseVariableName(arg, inputParam);
        return `input['${name}']`
    } else if (arg.type === 'UnaryExpression' || arg.type === 'BinaryExpression') {
        return evaluateExpression(arg);
    } else if (arg.type === 'Identifier') {
        throw new Error(`Unknown variable name: ${arg.name}`);
    }
    return parseFnBody(arg, inputParam);
}

const parseFnName = (callee: ExpressionBody): string => {
    if (callee.type === 'SequenceExpression' && callee.expressions[1].type === 'MemberExpression') {
        return callee.expressions[1].property.type === 'Identifier'
            ? `${callee.expressions[1].property.name}`
            : `${callee.expressions[1].property.value}`
    }
    return '';
}

const parseVariableName = (ast: MemberExpression, inputParam: Identifier) => {
    if (ast.object.type === "Identifier" && ast.object.name !== inputParam.name) {
        throw new Error('Only input variables are allowed');
    }
    return ast.property.type === 'Identifier'
        ? `${ast.property.name}`
        : `${ast.property.value}`
}
