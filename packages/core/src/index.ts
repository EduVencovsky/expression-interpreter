// TO BETTER UNDERSTAND HOW IT WORKS
// http://www.craftinginterpreters.com/parsing-expressions.html 
// https://ruslanspivak.com/lsbasi-part1/

//-----------------------GRAMMAR RULES-----------------------//

/* Num Parser (Calculator)

expr       : term ((PLUS|MINUS) term)*

term       : factor ((MULT|DIV) factor)*

factor     : (PLUS factor) | (MINUS factor) | NUM | (LPAREN expr RPAREN)

*/

/* Chars Parser (String Comparator)

expr      : term ((AND|OR) term)*

term      : factor ((BIG|BIGEQ|SML|SMLEQ|EQ|DIF) factor)*

factor    : CHARS | (LPAREN expr RPAREN)

*/

/* Expression Parser (Num and Chars Comparator)

expr           : comparison ((AND|OR) comparison)*

comparison     : addition ((BIG|BIGEQ|SML|SMLEQ|EQ|DIF) addition)*

addition       : multiplication ((PLUS|MINUS) multiplication)*

multiplication : unary ((MULT|DIV) unary)*

unary          : (PLUS unary) | (MINUS unary) | NUM | CHARS | (LPAREN exprInt RPAREN)

*/

export type TokenType = 'NUM'
| 'PLUS'
| 'MINUS'
| 'EOF'
| 'MULT'
| 'DIV'
| 'LPAREN'
| 'RPAREN'
| 'DIF'
| 'BIG'
| 'BIGEQ'
| 'SML'
| 'SMLEQ'
| 'EQ'
| 'CHARS'
| 'AND'
| 'OR'

const NUM = 'NUM'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const EOF = 'EOF'
const MULT = 'MULT'
const DIV = 'DIV'
const LPAREN = 'LPAREN'
const RPAREN = 'RPAREN'
const DIF = 'DIF'
const BIG = 'BIG'
const BIGEQ = 'BIGEQ'
const SML = 'SML'
const SMLEQ = 'SMLEQ'
const EQ = 'EQ'
const CHARS = 'CHARS'
const AND = 'AND'
const OR = 'OR'

export interface Parser {
    lexer: Lexer
    currentToken: Token<TokenType>
    tokenList: Token<TokenType>[]
    parse(): Node<TokenType>
} 

export interface Interpreter {
    parser?: Parser
} 

export class Token<T extends TokenType> {
    constructor(public type: T, public value: any) {}

    toString() {
        return `Token(${this.type}, ${this.value})`
    }
}

export class SimpleInterpreter implements Interpreter {
    
    lexer: Lexer
    parser?: Parser
    currentToken: Token<TokenType>

    constructor(text: string) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
    }

    error() {
        throw new Error(`Invalid syntax`)
    }

    eat(tokenType: TokenType) {
        if (this.currentToken.type === tokenType){
            this.currentToken = this.lexer.getNextToken()
        }
        else{
            this.error()
        }
    }

    factor() {
        let token = this.currentToken
        if (token.type === NUM) {
            this.eat(NUM)
            return token.value
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN)
            let result = this.expr()
            this.eat(RPAREN)
            return result
        }
        this.error()
    }

    term() {
        let result = this.factor()
        while ([MULT, DIV].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === MULT) {
                this.eat(MULT)
                result = result * this.factor()
            }
            else if (token.type === DIV) {
                this.eat(DIV)
                result = result / this.factor()
            }
        }
        return result
    }

    expr() {
        let result = this.term()
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === PLUS) {
                this.eat(PLUS)
                result = result + this.term()
            }
            else if (token.type === MINUS) {
                this.eat(MINUS)
                result = result - this.term()
            }
        }
        return result
    }
}

class Lexer {
    text: string
    position: number
    currentChar: string | null
    
    constructor(text: string) {        
        this.text = text
        this.position = 0
        this.currentChar = this.text[this.position]
    }

    error(): void {
        throw new Error(`Invalid character "${this.currentChar}" at position ${this.position}`)
    }

    advance(): void {
        this.position++
        this.currentChar = this.position > this.text.length - 1 ? null : this.text[this.position]
    }

    skipWhiteSpace(): void {
        while (this.currentChar != null && /\s/.test(this.currentChar))
            this.advance()
    }

    num(): number {
        let result = ''
        let havePoint = false
        while (this.currentChar != null && !/\s/.test(this.currentChar)) {
            if(!isNaN(this.currentChar)) {
                result += this.currentChar
                this.advance()
            }
            else if(!havePoint && this.currentChar === '.' && !isNaN(this.peek())) {
                result += this.currentChar
                havePoint = true
                this.advance()
            }
            else {
                break
            }
        }
        return Number(result)
    }

    chars(quotes = '"'): string {
        let result = ''
        this.advance()
        while (this.currentChar != null && this.currentChar !== quotes) {
            result += this.currentChar
            this.advance()
        }
        this.advance()
        return String(result)
    }

    peek(count = 1): string | null {
        let peekPos = this.position + count
        return peekPos > this.text.length - 1 ? null : this.text[peekPos]
    }

    getNextToken(): Token<TokenType> {

        while (this.currentChar != null) {

            let token = null

            if (/\s/.test(this.currentChar)) {
                this.skipWhiteSpace()
                continue
            }
            else if (this.currentChar === '"') {
                token = new Token(CHARS, this.chars('"'))
                return token
            }
            else if (!isNaN(this.currentChar)) {
                token = new Token(NUM, this.num())
                return token
            }
            else if (this.currentChar === '+') {
                this.advance()
                token = new Token(PLUS, '+')
                return token
            }
            else if (this.currentChar === '-') {
                this.advance()
                token = new Token(MINUS, '-')
                return token
            }
            else if (this.currentChar === '*') {
                this.advance()
                token = new Token(MULT, '*')
                return token
            }
            else if (this.currentChar === '/') {
                this.advance()
                token = new Token(DIV, '/')
                return token
            }
            else if (this.currentChar === '(') {
                this.advance()
                token = new Token(LPAREN, '(')
                return token
            }
            else if (this.currentChar === ')') {
                this.advance()
                token = new Token(RPAREN, ')')
                return token
            }
            else if (this.currentChar === '&' && this.peek() === '&') {
                this.advance()
                this.advance()
                token = new Token(AND, '&&')
                return token
            }
            else if (this.currentChar === '|' && this.peek() === '|') {
                this.advance()
                this.advance()
                token = new Token('OR', '||')
                return token
            }
            else if (this.currentChar === '>') {
                this.advance()
                if (this.currentChar === '=') {
                    this.advance()
                    token = new Token(BIGEQ, '>=')
                } else {
                    token = new Token(BIG, '>')
                }
                return token
            }
            else if (this.currentChar === '<') {                
                this.advance()
                if (this.currentChar === '=') {
                    this.advance()
                    token = new Token(SMLEQ, '<=')
                } else {
                    token = new Token(SML, '<')
                }
                return token
            }
            else if (this.currentChar === '=' && this.peek() === '=') {
                this.advance()
                this.advance()
                token = new Token(EQ, '==')
                return token
            }
            else if (this.currentChar === '!' && this.peek() === '=') {
                this.advance()
                this.advance()
                token = new Token(DIF, '!=')
                return token
            }

            this.error(this.currentChar)
        }

        return new Token(EOF, null)
    }
}

class Node<T extends TokenType> {
    constructor(public token: Token<T>){}
}

class BinOpNode extends Node<'OR' | 'AND'> {
    constructor(public left: Node<TokenType>, public op: Node<TokenType>, public right:Node<TokenType>) {
        super(op.token)
    }

    toString() {
        return `left ${this.left} op ${this.left} right ${this.left}`
    }
}

class ExpressionNode {
    constructor(left, op, right) {
        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }

    toString() {
        return `left ${this.left} op ${this.left} right ${this.left}`
    }
}

class ComparisonNode {
    constructor(left, op, right) {
        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }

    toString() {
        return `left ${this.left} op ${this.left} right ${this.left}`
    }
}

class MathNode {
    constructor(left, op, right) {
        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }

    toString() {
        return `left ${this.left} op ${this.left} right ${this.left}`
    }
}

class NumNode extends Node<'NUM'> {
    constructor(token) {
        this.token = token
        this.value = token.value
    }
}

class Chars {
    constructor(token) {
        this.token = token
        this.value = token.value
    }
}

class UnaryOp {
    constructor(op, expr) {
        this.token = op
        this.op = op
        this.expr = expr
    }
}

export class CalculatorParser implements Parser {
    lexer: Lexer
    currentToken: Token<TokenType>
    tokenList: Token<TokenType>[]

    constructor(text: string) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
        this.tokenList = [this.currentToken]
    }

    error(): void {
        this.lexer.error()
    }

    eat(tokenType: TokenType): void {
        if (this.currentToken.type === tokenType){
            this.currentToken = this.lexer.getNextToken()
            this.tokenList.push(this.currentToken)
        }
        else{
            this.error()
        }
    }

    expr(): Node<TokenType> {
        let node = this.term()
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === PLUS) {
                this.eat(PLUS)
            }
            else if (token.type === MINUS) {
                this.eat(MINUS)
            }
            node = new BinOpNode(node, token, this.term())
        }
        return node
    }

    term(): Node<TokenType> {
        let node = this.factor()
        while ([MULT, DIV].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === MULT) {
                this.eat(MULT)
            }
            else if (token.type === DIV) {
                this.eat(DIV)
            }
            node = new BinOpNode(node, token, this.factor())
        }
        return node
    }

    factor(): Node<TokenType> {
        let token = this.currentToken
        if (token.type === PLUS) {
            this.eat(PLUS)
            return new UnaryOp(token, this.factor())
        }
        else if (token.type === MINUS) {
            this.eat(MINUS)
            return new UnaryOp(token, this.factor())
        }
        else if (token.type === NUM) {
            this.eat(NUM)
            return new NumNode(token)
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN)
            let node = this.expr()
            this.eat(RPAREN)
            return node
        }
        this.error(this.currentToken.toString())
    }

    parse(): Node<TokenType> {
        let node = this.expr()
        return this.currentToken.type === EOF ? node : this.error(this.currentToken.toString())
    }
}

export class Calculator implements Interpreter {

    parser?: CalculatorParser

    visit(node) {
        const methodName = `visit${node.constructor.name}`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node)
    }

    genericVisit(node) {
        throw new Error(`No ${node.constructor.name} method`)
    }

    visitBinOpNode(node) {
        if (node.op.type === PLUS) {
            return this.visit(node.left) + this.visit(node.right)
        }
        else if (node.op.type === MINUS) {
            return this.visit(node.left) - this.visit(node.right)
        }
        else if (node.op.type === MULT) {
            return this.visit(node.left) * this.visit(node.right)
        }
        else if (node.op.type === DIV) {
            return this.visit(node.left) / this.visit(node.right)
        }
        this.parser.error(node.toString())
    }

    visitNumNode(node) {
        return node.value
    }

    visitUnaryOp(node) {
        let opType = node.op.type
        if (opType === PLUS) {
            return +this.visit(node.expr)
        }
        else if (opType === MINUS) {
            return -this.visit(node.expr)
        }
        this.parser.error(node.toString())
    }

    eval(text: string) {
        this.parser = new CalculatorParser(text)
        let tree = this.parser.parse()
        return this.visit(tree)
    }
}

export class StringComparatorParser implements Parser {
    lexer: Lexer
    currentToken: Token<TokenType>
    tokenList: Token<TokenType>[]

    constructor(text: string) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
        this.tokenList = [this.currentToken]
    }

    error(char: string) {
        this.lexer.error(char)
    }

    eat(tokenType: TokenType) {
        if (this.currentToken.type === tokenType){
            this.currentToken = this.lexer.getNextToken()
            this.tokenList.push(this.currentToken)
        }
        else{
            this.error(this.currentToken.toString())
        }
    }

    expr() {
        let node = this.term()
        while ([AND, OR].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === AND) {
                this.eat(AND)
            }
            else if (token.type === OR) {
                this.eat(OR)
            }
            node = new BinOpNode(node, token, this.term())
        }
        return node
    }

    term() {
        let node = this.factor()
        while ([BIG, BIGEQ, SML, SMLEQ, EQ, DIF].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === BIG) {
                this.eat(BIG)
            }
            else if (token.type === BIGEQ) {
                this.eat(BIGEQ)
            }
            else if (token.type === SML) {
                this.eat(SML)
            }
            else if (token.type === SMLEQ) {
                this.eat(SMLEQ)
            }
            else if (token.type === EQ) {
                this.eat(EQ)
            }
            else if (token.type === DIF) {
                this.eat(DIF)
            }
            node = new BinOpNode(node, token, this.factor())
        }
        return node
    }

    factor() {
        let token = this.currentToken
        if (token.type === CHARS) {
            this.eat(CHARS)
            return new Chars(token)
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN)
            let node = this.expr()
            this.eat(RPAREN)
            return node
        }
        this.error()
    }

    parse(): Node<TokenType> {
        let node = this.expr()
        return this.currentToken.type === EOF ? node : this.error()
    }

}

export class StringComparator implements Interpreter {

    parser?: Parser

    error(){
        this.parser.error()
    }

    visit(node) {
        const methodName = `visit${node.constructor.name}`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node)
    }

    genericVisit(node) {
        throw new Error(`No ${node.constructor.name} method`)
    }

    visitBinOpNode(node) {
        if (node.op.type === AND) {
            return this.visit(node.left) && this.visit(node.right)
        }
        else if (node.op.type === OR) {
            return this.visit(node.left) || this.visit(node.right)
        }
        else if (node.op.type === BIG) {
            return this.visit(node.left) > this.visit(node.right)
        }
        else if (node.op.type === BIGEQ) {
            return this.visit(node.left) >= this.visit(node.right)
        }
        else if (node.op.type === SML) {
            return this.visit(node.left) < this.visit(node.right)
        }
        else if (node.op.type === SMLEQ) {
            return this.visit(node.left) <= this.visit(node.right)
        }
        else if (node.op.type === EQ) {
            return this.visit(node.left) == this.visit(node.right)
        }
        else if (node.op.type === DIF) {
            return this.visit(node.left) != this.visit(node.right)
        }
        this.error()
    }

    visitChars(node) {
        return node.value
    }

    eval(text: string) {
        this.parser = new StringComparatorParser(text)
        let tree = this.parser.parse()
        return this.visit(tree)
    }
}

export class ExpressionsParser implements Parser {
    lexer: Lexer
    currentToken: Token<TokenType>
    tokenList: Token<TokenType>[]

    constructor(text: string) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
        this.tokenList = [this.currentToken]
    }

    error() {
        this.lexer.error()
    }

    eat(tokenType: TokenType) {
        if (this.currentToken.type === tokenType){
            this.currentToken = this.lexer.getNextToken()
            this.tokenList.push(this.currentToken)
        }
        else{
            this.error()
        }
    }
    
    expr(){
        let node = this.comparison()
        while ([AND, OR].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === AND) {
                this.eat(AND)
            }
            else if (token.type === OR) {
                this.eat(OR)
            }
            node = new ExpressionNode(node, token, this.comparison())
        }
        return node
    }

    comparison(){
        let node = this.addition()
        while ([BIG, BIGEQ, SML, SMLEQ, EQ, DIF].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === BIG) {
                this.eat(BIG)
            }
            else if (token.type === BIGEQ) {
                this.eat(BIGEQ)
            }
            else if (token.type === SML) {
                this.eat(SML)
            }
            else if (token.type === SMLEQ) {
                this.eat(SMLEQ)
            }
            else if (token.type === EQ) {
                this.eat(EQ)
            }
            else if (token.type === DIF) {
                this.eat(DIF)
            }
            node = new ComparisonNode(node, token, this.addition())
        }
        return node
    }

    addition(){
        let node = this.multiplication()
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === PLUS) {
                this.eat(PLUS)
            }
            else if (token.type === MINUS) {
                this.eat(MINUS)
            }
            node = new MathNode(node, token, this.multiplication())
        }
        return node
    }

    multiplication(){
        let node = this.unary()
        while ([MULT, DIV].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === MULT) {
                this.eat(MULT)
            }
            else if (token.type === DIV) {
                this.eat(DIV)
            }
            node = new MathNode(node, token, this.unary())
        }
        return node
    }

    unary(){
        let token = this.currentToken
        if (token.type === PLUS) {
            this.eat(PLUS)
            return new UnaryOp(token, this.unary())
        }
        else if (token.type === MINUS) {
            this.eat(MINUS)
            return new UnaryOp(token, this.unary())
        }
        else if (token.type === NUM) {
            this.eat(NUM)
            return new NumNode(token)
        }
        else if (token.type === CHARS) {
            this.eat(CHARS)
            return new Chars(token)
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN)
            let node = this.expr()
            this.eat(RPAREN)
            return node
        }
        this.error()
    }

    parse(): Node<TokenType> {
        let node = this.expr()
        if(this.currentToken.type !== EOF) {
            this.error()
        }
        return node
    }
}

export class ExpressionsInterpreter implements Interpreter {

    parser?: ExpressionsParser 

    visit(node) {
        const methodName = `visit${node.constructor.name}`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node)
    }

    genericVisit(node) {
        throw new Error(`No ${node.constructor.name} method`)
    }

    error(){
        throw Error("Interpretation Error")
    }

    visitExpressionNode(node) {
        let leftNode = this.visit(node.left)
        let rightNode = this.visit(node.right)
        if (typeof leftNode !== 'boolean' || typeof rightNode !== 'boolean'){
            this.error()
        }
        if (node.op.type === AND) {
            return leftNode && rightNode            
        }
        else if (node.op.type === OR) {
            return leftNode || rightNode
        }
        this.error()
    }
    
    visitComparisonNode(node) {
        if (node.op.type === BIG) {
            return this.visit(node.left) > this.visit(node.right)
        }
        else if (node.op.type === BIGEQ) {
            return this.visit(node.left) >= this.visit(node.right)
        }
        else if (node.op.type === SML) {
            return this.visit(node.left) < this.visit(node.right)
        }
        else if (node.op.type === SMLEQ) {
            return this.visit(node.left) <= this.visit(node.right)
        }
        else if (node.op.type === EQ) {
            return this.visit(node.left) == this.visit(node.right)
        }
        else if (node.op.type === DIF) {
            return this.visit(node.left) != this.visit(node.right)
        }
        this.error()
    }
    
    visitMathNode(node) {
        if (node.op.type === PLUS) {
            return this.visit(node.left) + this.visit(node.right)
        }
        else if (node.op.type === MINUS) {
            return this.visit(node.left) - this.visit(node.right)
        }
        else if (node.op.type === MULT) {
            return this.visit(node.left) * this.visit(node.right)
        }
        else if (node.op.type === DIV) {
            return this.visit(node.left) / this.visit(node.right)
        }
        this.error()
    }

    visitUnaryOp(node) {
        let opType = node.op.type
        if (opType === PLUS) {
            return +this.visit(node.expr)
        }
        else if (opType === MINUS) {
            return -this.visit(node.expr)
        }
        this.parser.error()
    }

    visitChars(node) {
        return node.token.type === CHARS ? node.value : this.error()
    }

    visitNumNode(node) {
        return node.token.type === NUM ? node.value : this.error()
    }

    eval(text: string) {
        this.parser = new ExpressionsParser(text)
        let tree = this.parser.parse()
        let result = this.visit(tree)
        return typeof result === 'boolean' ? result : this.error()
    }
}