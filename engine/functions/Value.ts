import {Result} from "./Result";

export class Value implements Result {
    private readonly value: any;

    constructor(value: any) {
        this.value = value;
    }

    evaluate(): Value {
        return this;
    }

    serialize(): any {
        return {value: this.value};
    }

    getValue(): any {
        return this.value;
    }
}

export const value = (val: any): Value => new Value(val);
