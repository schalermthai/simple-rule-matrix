import {Predicate} from "./Predicate";

export class GreaterThan extends Predicate {
    constructor(value: number) {
        super('greaterThan', value);
    }

    evaluate(input: number): boolean {
        return input > this.value;
    }
}

export class EqualsTo extends Predicate {
    constructor(value: any) {
        super('equalsTo', value);
    }

    evaluate(input: any): boolean {
        return input === this.value;
    }
}

export class InList extends Predicate {
    constructor(values: any[]) {
        super('inList', values);
    }

    evaluate(input: any): boolean {
        return this.value.includes(input);
    }
}

export class LessThan extends Predicate {
    constructor(value: number) {
        super('lessThan', value);
    }

    evaluate(input: number): boolean {
        return input < this.value;
    }
}

export const greaterThan = (val: number) => new GreaterThan(val);
export const equalsTo = (val: any) => new EqualsTo(val);
export const inList = (vals: any[]) => new InList(vals);
export const lessThan = (val: number) => new LessThan(val);
