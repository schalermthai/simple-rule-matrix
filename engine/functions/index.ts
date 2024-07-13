export {OutputFunction} from "./OutputFunction";
export * from "./Value"
export * from "./Result"

export {min} from "./min";
export {max} from "./max";
export {add} from "./add";
export {sum} from "./sum";
export {id} from "./id";

import {min} from "./min";
import {max} from "./max";
import {add} from "./add";
import {sum} from "./sum";
import {id} from "./id";


import {OutputFunction} from "./OutputFunction";

export const functions: Record<string, (...args: any[]) => OutputFunction> = {
    min,
    max,
    add,
    sum,
    id,
};

