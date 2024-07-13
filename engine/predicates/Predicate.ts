// Define the abstract Predicate class
export abstract class Predicate {
    protected constructor(public type: string, public value: any) {
    }

    abstract evaluate(input: any): boolean;

    serialize(): any {
        return {
            type: this.type,
            value: this.value
        };
    }
}
