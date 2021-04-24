export declare type TokenType = 'NUM' | 'PLUS' | 'MINUS' | 'EOF' | 'MULT' | 'DIV' | 'LPAREN' | 'RPAREN' | 'DIF' | 'BIG' | 'BIGEQ' | 'SML' | 'SMLEQ' | 'EQ' | 'CHARS' | 'AND' | 'OR';
declare class Token<T extends TokenType> {
    type: T;
    value: any;
    constructor(type: T, value: any);
    toString(): string;
}
export declare class SimpleInterpreter {
    constructor(text: any);
    error(): void;
    eat(tokenType: any): void;
    factor(): any;
    term(): any;
    expr(): any;
}
declare class Lexer {
    position: number;
    currentChar: string;
    text: string;
    constructor(text: string);
    error(char: string): void;
    advance(): void;
    skipWhiteSpace(): void;
    num(): number;
    chars(quotes?: string): string;
    peek(count?: number): string | null;
    getNextToken(): Token<unknown, unknown>;
}
export declare class CalculatorParser {
    lexer: Lexer;
    currentToken: Token<TokenType>;
    constructor(text: string);
    error(char: string): void;
    eat(tokenType: TokenType): void;
    expr(): any;
    term(): any;
    factor(): any;
    parse(): any;
}
export declare class Calculator {
    parser: CalculatorParser;
    visit(node: any): any;
    genericVisit(node: any): void;
    visitBinOpNode(node: any): any;
    visitNum(node: any): any;
    visitUnaryOp(node: any): number | undefined;
    eval(text: any): any;
}
export declare class StringComparatorParser {
    constructor(text: any);
    error(): void;
    eat(tokenType: any): void;
    expr(): any;
    term(): any;
    factor(): any;
    parse(): any;
}
export declare class StringComparator {
    error(): void;
    visit(node: any): any;
    genericVisit(node: any): void;
    visitBinOpNode(node: any): any;
    visitChars(node: any): any;
    eval(text: any): any;
}
export declare class ExpressionsParser {
    constructor(text: any);
    error(): void;
    eat(tokenType: any): void;
    parse(): any;
    expr(): any;
    comparison(): any;
    addition(): any;
    multiplication(): any;
    unary(): any;
}
export declare class ExpressionsInterpreter {
    visit(node: any): any;
    genericVisit(node: any): void;
    error(): void;
    visitExpressionNode(node: any): any;
    visitComparisonNode(node: any): boolean | undefined;
    visitMathNode(node: any): any;
    visitUnaryOp(node: any): number | undefined;
    visitChars(node: any): any;
    visitNum(node: any): any;
    eval(text: any): boolean | void;
}
export {};
