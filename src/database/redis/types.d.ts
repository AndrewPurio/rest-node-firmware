export interface HashFields {
    [field: string]: string | number
}

interface NX {
    NX?: true;
}
interface XX {
    XX?: true;
}
interface LT {
    LT?: true;
}
interface GT {
    GT?: true;
}
interface CH {
    CH?: true;
}
interface INCR {
    INCR?: true;
}

export type ZAddOptions = (NX | (XX & LT & GT)) & CH & INCR;

export interface ZRangeOptions {
    BY?: 'SCORE' | 'LEX';
    REV?: true;
    LIMIT?: {
        offset: number;
        count: number;
    };
}