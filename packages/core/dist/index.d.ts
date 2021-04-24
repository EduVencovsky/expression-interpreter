export declare type TokenType = 'NUM' | 'PLUS' | 'MINUS' | 'EOF' | 'MULT' | 'DIV' | 'LPAREN' | 'RPAREN' | 'DIF' | 'BIG' | 'BIGEQ' | 'SML' | 'SMLEQ' | 'EQ' | 'CHARS' | 'AND' | 'OR';
export interface Parser {
    lexer: Lexer;
    currentToken: Token<TokenType>;
    tokenList: Token<TokenType>[];
    parse(): Node<TokenType>;
}
export interface Interpreter {
    parser?: Parser;
}
export declare class Token<T extends TokenType> {
    type: T;
    value: any;
    constructor(type: T, value: any);
    toString(): string;
}
export declare class SimpleInterpreter implements Interpreter {
    lexer: Lexer;
    parser?: Parser;
    currentToken: Token<TokenType>;
    constructor(text: string);
    error(): void;
    eat(tokenType: TokenType): void;
    factor(): any;
    term(): any;
    expr(): any;
}
declare class Lexer {
    text: string;
    position: number;
    currentChar: string | null;
    constructor(text: string);
    error(): void;
    advance(): void;
    skipWhiteSpace(): void;
    num(): number;
    chars(quotes?: string): string;
    peek(count?: number): string | null;
    getNextToken(): Token<TokenType>;
}
declare class Node<T extends TokenType> {
    token: Token<T>;
    constructor(token: Token<T>);
}
export declare class CalculatorParser implements Parser {
    lexer: Lexer;
    currentToken: Token<TokenType>;
    tokenList: Token<TokenType>[];
    constructor(text: string);
    error(): void;
    eat(tokenType: TokenType): void;
    expr(): Node<TokenType>;
    term(): Node<TokenType>;
    factor(): Node<TokenType>;
    parse(): Node<TokenType>;
}
export declare class Calculator implements Interpreter {
    parser?: CalculatorParser;
    visit(node: any): any;
    genericVisit(node: any): void;
    visitBinOpNode(node: any): any;
    visitNumNode(node: any): any;
    visitUnaryOp(node: any): number | undefined;
    eval(text: string): any;
}
export declare class StringComparatorParser implements Parser {
    lexer: Lexer;
    currentToken: Token<TokenType>;
    tokenList: Token<TokenType>[];
    constructor(text: string);
    error(char: string): void;
    eat(tokenType: TokenType): void;
    expr(): any;
    term(): any;
    factor(): any;
    parse(): Node<TokenType>;
}
export declare class StringComparator implements Interpreter {
    parser?: Parser;
    error(): void;
    visit(node: any): any;
    genericVisit(node: any): void;
    visitBinOpNode(node: any): any;
    visitChars(node: any): any;
    eval(text: string): any;
}
export declare class ExpressionsParser implements Parser {
    lexer: Lexer;
    currentToken: Token<TokenType>;
    tokenList: Token<TokenType>[];
    constructor(text: string);
    error(): void;
    eat(tokenType: TokenType): void;
    expr(): any;
    comparison(): any;
    addition(): any;
    multiplication(): any;
    unary(): any;
    parse(): Node<TokenType>;
}
export declare class ExpressionsInterpreter implements Interpreter {
    parser?: ExpressionsParser;
    visit(node: any): any;
    genericVisit(node: any): void;
    error(): void;
    visitExpressionNode(node: any): any;
    visitComparisonNode(node: any): boolean | undefined;
    visitMathNode(node: any): any;
    visitUnaryOp(node: any): number | undefined;
    visitChars(node: any): any;
    visitNumNode(node: any): any;
    eval(text: string): boolean | void;
}
export {};
