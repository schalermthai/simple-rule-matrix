interface BaseNode {
    type: string;
}

export interface ExpressionStatement extends BaseNode {
    type: 'ExpressionStatement';
    expression: Literal | ArrowFunctionExpression;
}

interface ArrowFunctionExpression extends BaseNode {
    type: 'ArrowFunctionExpression';
    body:Expression;
}

interface CallExpression extends BaseNode {
    type: 'CallExpression';
    callee: Expression;
    arguments: Array<Expression>;
}

export interface SequenceExpression extends BaseNode {
    type: "SequenceExpression";
    expressions: Expression[];
}

interface MemberExpression extends BaseNode {
    type: 'MemberExpression';
    object: Expression;
    property: Literal | Identifier;
    computed: boolean;
}

interface Literal extends BaseNode {
    type: 'Literal';
    value: boolean | number | string | null;
}

export interface Identifier extends BaseNode {
    type: 'Identifier';
    name: string;
}

export interface UnaryExpression extends BaseNode {
    type: "UnaryExpression";
    operator: any;
    prefix: true;
    argument: Expression;
}

export type Expression = ExpressionStatement | ArrowFunctionExpression | SequenceExpression | CallExpression | MemberExpression | Literal | Identifier | UnaryExpression;


// Utility function to evaluate AST nodes
export const evaluateExpression = (node: any, context: any = {}): any => {
    switch (node.type) {
        case 'Literal':
            return node.value;
        case 'Identifier':
            return context[node.name];
        case 'MemberExpression':
            const object = evaluateExpression(node.object, context);
            const property = node.computed ? evaluateExpression(node.property, context) : node.property.name;
            return object[property];
        case 'BinaryExpression':
            const left = evaluateExpression(node.left, context);
            const right = evaluateExpression(node.right, context);
            return evaluateBinaryExpression(node.operator, left, right);
        case 'UnaryExpression':
            const argument = evaluateExpression(node.argument, context);
            return evaluateUnaryExpression(node.operator, argument);
        case 'CallExpression':
            const func = evaluateExpression(node.callee, context);
            const args = node.arguments.map((arg: any) => evaluateExpression(arg, context));
            return func(...args);
        default:
            throw new Error(`Unsupported node type: ${node.type}`);
    }
}

// Helper function to evaluate binary expressions
const evaluateBinaryExpression = (operator: string, left: any, right: any): any => {
    switch (operator) {
        case '+':
            return left + right;
        case '-':
            return left - right;
        case '*':
            return left * right;
        case '/':
            return left / right;
        case '%':
            return left % right;
        case '**':
            return left ** right;
        case '==':
            return left == right;
        case '!=':
            return left != right;
        case '===':
            return left === right;
        case '!==':
            return left !== right;
        case '<':
            return left < right;
        case '<=':
            return left <= right;
        case '>':
            return left > right;
        case '>=':
            return left >= right;
        case '&&':
            return left && right;
        case '||':
            return left || right;
        case '|':
            return left | right;
        case '&':
            return left & right;
        case '^':
            return left ^ right;
        case '<<':
            return left << right;
        case '>>':
            return left >> right;
        case '>>>':
            return left >>> right;
        default:
            throw new Error(`Unsupported binary operator: ${operator}`);
    }
}

// Helper function to evaluate unary expressions
const evaluateUnaryExpression = (operator: string, argument: any): any => {
    switch (operator) {
        case '-':
            return -argument;
        case '+':
            return +argument;
        case '!':
            return !argument;
        case '~':
            return ~argument;
        case 'typeof':
            return typeof argument;
        case 'void':
            return void argument;
        default:
            throw new Error(`Unsupported unary operator: ${operator}`);
    }
}
