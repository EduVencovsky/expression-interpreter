//-----------------------GRAMMAR RULES-----------------------//

/* Integer Parser (Calculator)

expr       : term ((PLUS|MINUS) term)*

term       : factor ((MULT|DIV) factor)*

factor     : (PLUS factor) | (MINUS factor) | INTEGER | (LPAREN expr RPAREN)

*/

/* Chars Parser (String Comparator)

expr      : term ((AND|OR) term)*

term      : factor ((BIG|BIGEQ|SML|SMLEQ|EQ|DIF) factor)*

factor    : CHARS | (LPAREN expr RPAREN)

*/

/* Expression Parser (Integer and Chars Comparetor)

expr      : term ((AND|OR) term)*

term      : factor ((BIG|BIGEQ|SML|SMLEQ|EQ|DIF) factor)*

factor    : CHARS | (LPAREN expr RPAREN) | exprInt

exprInt   : term ((PLUS|MINUS) term)*

termInt   : factor ((MULT|DIV) factor)*

factorInt : (PLUS factorInt) | (MINUS factorInt) | INTEGER | (LPAREN exprInt RPAREN)


*/

const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const EOF = 'EOF'
const MULT = 'MULT'
const DIV = 'DIV'
const LPAREN  = 'LPAREN'
const RPAREN  = 'RPAREN'
const DIF = 'DIF'
const BIG = 'BIG'
const BIGEQ = 'BIGEQ'
const SML = 'SML'
const SMLEQ = 'SMLEQ'
const EQ = 'EQ'
const CHARS = 'CHARS' // It's a string
const AND = 'AND'
const OR = 'OR'

class Token {
    constructor(type, value) {
        this.type = type
        this.value = value
    }

    toString() {
        return `Token(${this.type}, ${this.value})`
    }
}

export class SimpleInterpreter {
    constructor(text) {        
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
    }

    error() {
        throw new Error(`Invalid syntax`)
    }

    eat(tokenType) {
        if(this.currentToken.type === tokenType)
            this.currentToken = this.lexer.getNextToken()
        else
            this.error()
    }

    factor() {
        let token = this.currentToken

        if(token.type === INTEGER) {
            this.eat(INTEGER)
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

        while([MULT, DIV].includes(this.currentToken.type)) {
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
        // debugger
        let result = this.term()

        while([PLUS, MINUS].includes(this.currentToken.type)) {
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
        console.log('token', this.currentToken.type)
        return result
    }
}

class Lexer {
    constructor(text) {
        this.text = text
        this.position = 0
        this.currentChar = this.text[this.position]
    }
    
    error(char) {
        throw new Error(`Invalid character ${char} at position ${this.position}`)
    }

    advance() { 
        this.position++
        this.currentChar = this.position > this.text.length - 1 ? null : this.text[this.position]
    }

    skipWhiteSpace() {
        while (this.currentChar != null && /\s/.test(this.currentChar))
            this.advance()
    }

    integer() {
        let result = ''
        while (this.currentChar != null && !isNaN(this.currentChar)) {
            result += this.currentChar
            this.advance()
        }
        return(Number(result))
    }

    chars(quotes) {
        let result = ''
        this.advance() // jumps "
        while (this.currentChar != null && this.currentChar !== quotes) {
            result += this.currentChar
            this.advance()
        }
        this.advance() // jumps "
        return(String(result))
    }

    peek(count = 1) {
        let peekPos = this.position + count
        if (peekPos > this.text.length - 1) 
            return null
        else 
            return this.text[peekPos]
    }

    getNextToken() {

        while (this.currentChar != null) {

            let token = null

            if (/\s/.test(this.currentChar)) {
                this.skipWhiteSpace()
                continue
            }
            else if (this.currentChar === '"') {
                token = new Token(CHARS, this.chars('"'))
                console.log(token)
                return token
            }
            else if (!isNaN(this.currentChar)) {
                token = new Token(INTEGER, this.integer())
                console.log(token)
                return token
            }
            else if (this.currentChar === '+') {
                this.advance()
                token = new Token(PLUS, '+')
                console.log(token)
                return token
            }            
            else if (this.currentChar === '-') {
                this.advance()
                token = new Token(MINUS, '-')
                console.log(token)
                return token
            }  
            else if (this.currentChar === '*') {
                this.advance()
                token = new Token(MULT, '*')
                console.log(token)
                return token
            }            
            else if (this.currentChar === '/') {
                this.advance()
                token = new Token(DIV, '/')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '(') {
                this.advance()
                token = new Token(LPAREN, '(')
                console.log(token)
                return token
            }            
            else if (this.currentChar === ')') {
                this.advance()
                token = new Token(RPAREN, ')')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '&' && this.peek() === '&') {
                this.advance()
                this.advance()
                token = new Token(AND, '&&')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '|' && this.peek() === '|') {
                this.advance()
                this.advance()
                token = new Token(OR, '||')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '>') {
                this.advance()
                token = new Token(BIG, '>')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '>' && this.peek() === '=') {
                this.advance()
                this.advance()
                token = new Token(BIGEQ, '>=')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '<') {
                this.advance()
                token = new Token(SML, '<')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '<' && this.peek() === '=') {
                this.advance()
                this.advance()
                token = new Token(SMLEQ, '<=')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '=' && this.peek() === '=') {
                this.advance()
                this.advance()
                token = new Token(EQ, '==')
                console.log(token)
                return token
            } 
            else if (this.currentChar === '!' && this.peek() === '=') {
                this.advance()
                this.advance()
                token = new Token(DIF, '!=')
                console.log(token)
                return token
            }             

            this.error(this.currentChar)
        }

        return new Token(EOF, null)

    }

}

class BinOpNode {
    constructor(left, op, right){
        this.left = left
        this.token = op
        this.op = op
        this.right = right
    }

    toString() {
        return `left ${this.left} op ${this.left} right ${this.left}`
    }
}

class Integer {
    constructor(token){
        this.token = token
        this.value = token.value
    }
}   

class Chars {
    constructor(token){
        this.token = token
        this.value = token.value
    }
}

class UnaryOp {
    constructor(op, expr){
        this.token = op
        this.op = op
        this.expr = expr
    }
}

export class ParserInt {
    constructor(text) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
    }

    error() {
        throw new Error(`Invalid syntax`)
    }

    eat(tokenType) {
        if(this.currentToken.type === tokenType)
            this.currentToken = this.lexer.getNextToken()
        else
            this.error()
    }

    expr() {
        // debugger
        let node = this.term()

        while([PLUS, MINUS].includes(this.currentToken.type)) {
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

    term() {
        let node = this.factor()

        while([MULT, DIV].includes(this.currentToken.type)) {
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

    factor() {
        let token = this.currentToken

        if (token.type === PLUS) {
            this.eat(PLUS)
            return new UnaryOp(token, this.factor())
        }
        else if (token.type === MINUS) {
            this.eat(MINUS)
            return new UnaryOp(token, this.factor())
        }
        else if (token.type === INTEGER) {
            this.eat(INTEGER)
            return new Integer(token)
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN)
            let node = this.expr()            
            this.eat(RPAREN)
            return node 
        }

        this.error()
    }

    parse() {
        return this.expr()
    }
}

export class InterpreterInt {
    constructor(text){
        this.parser = new ParserInt(text)
    }

    visit(node) {
        const methodName = `visit${ node.constructor.name }`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node)
    }

    genericVisit(node){
        throw new Error(`No visit${node.constructor.name} method`)
    }

    visitBinOpNode(node){ 
        if(node.op.type === PLUS){
            return this.visit(node.left) + this.visit(node.right)
        }
        else if(node.op.type === MINUS){
            return this.visit(node.left) - this.visit(node.right)
        }
        else if(node.op.type === MULT){
            return this.visit(node.left) * this.visit(node.right)
        }
        else if(node.op.type === DIV){
            return this.visit(node.left) / this.visit(node.right)
        }
    }

    visitInteger(node){
        return node.value
    }

    visitUnaryOp(node){
        let opType = node.op.type
        if(opType === PLUS){
            return +this.visit(node.expr)
        }
        else if(opType === MINUS){
            return -this.visit(node.expr)
        }
    }

    interpret() {
        let tree = this.parser.parse()
        console.log('TREE', tree)
        return this.visit(tree)
    }
}

export class ExpressionsParserChars {
    constructor(text) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
    }

    error() {
        throw new Error(`Invalid syntax`)
    }

    eat(tokenType) {
        if(this.currentToken.type === tokenType)
            this.currentToken = this.lexer.getNextToken()
        else
            this.error()
    }

    expr() {
        // debugger
        let node = this.term()

        while([AND, OR].includes(this.currentToken.type)) {
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

        while([BIG, BIGEQ, SML, SMLEQ, EQ, DIF].includes(this.currentToken.type)) {
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

    parse() {
        return this.expr()
    }

}

export class ExpressionsInterpreterChars {
    constructor(text){
        this.parser = new ExpressionsParserChars(text)
    }

    visit(node) {
        const methodName = `visit${ node.constructor.name }`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node)
    }

    genericVisit(node){
        throw new Error(`No visit${node.constructor.name} method`)
    }

    visitBinOpNode(node){ 
        if(node.op.type === AND){
            return this.visit(node.left) && this.visit(node.right)
        }
        else if(node.op.type === OR){
            return this.visit(node.left) || this.visit(node.right)
        }
        else if(node.op.type === BIG){
            return this.visit(node.left) > this.visit(node.right)
        }
        else if(node.op.type === BIGEQ){
            return this.visit(node.left) >= this.visit(node.right)
        }
        else if(node.op.type === SML){
            return this.visit(node.left) < this.visit(node.right)
        }
        else if(node.op.type === SMLEQ){
            return this.visit(node.left) <= this.visit(node.right)
        }
        else if(node.op.type === EQ){
            return this.visit(node.left) == this.visit(node.right)
        }
        else if(node.op.type === DIF){
            return this.visit(node.left) != this.visit(node.right)
        }
    }

    visitChars(node){
        return node.value
    }

    interpret() {
        let tree = this.parser.parse()
        console.log('TREE', tree)
        return this.visit(tree)
    }
}

export class ExpressionsParser {
    constructor(text) {
        this.lexer = new Lexer(text)
        this.currentToken = this.lexer.getNextToken()
    }

    error() {
        throw new Error(`Invalid syntax`)
    }

    eat(tokenType) {
        if(this.currentToken.type === tokenType)
            this.currentToken = this.lexer.getNextToken()
        else
            this.error()
    }

    expr() {
        // debugger
        let node = this.term()

        while([AND, OR].includes(this.currentToken.type)) {
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

        while([BIG, BIGEQ, SML, SMLEQ, EQ, DIF].includes(this.currentToken.type)) {
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
        else if (token.type === PLUS) {
            this.eat(PLUS)
            return new UnaryOp(token, this.factorInt())
        }
        else if (token.type === MINUS) {
            this.eat(MINUS)
            return new UnaryOp(token, this.factorInt())
        }
        else if (token.type === INTEGER) {
            return this.exprInt() 
        }

        this.error()
    }

    
    exprInt() {
        // debugger
        let node = this.termInt()

        while([PLUS, MINUS].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === PLUS) {
                this.eat(PLUS)
            }
            else if (token.type === MINUS) {
                this.eat(MINUS)
            }
            node = new BinOpNode(node, token, this.termInt())
        }

        return node
    }

    termInt() {
        let node = this.factorInt()

        while([MULT, DIV].includes(this.currentToken.type)) {
            let token = this.currentToken
            if (token.type === MULT) {
                this.eat(MULT)
            }
            else if (token.type === DIV) {
                this.eat(DIV)
            }

            node = new BinOpNode(node, token, this.factorInt())
        }

        return node
    }

    factorInt() {
        let token = this.currentToken

        if (token.type === PLUS) {
            this.eat(PLUS)
            return new UnaryOp(token, this.factorInt())
        }
        else if (token.type === MINUS) {
            this.eat(MINUS)
            return new UnaryOp(token, this.factorInt())
        }
        else if (token.type === INTEGER) {
            this.eat(INTEGER)
            return new Integer(token)
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN)
            let node = this.exprInt()            
            this.eat(RPAREN)
            return node 
        }
        
        this.error()
    }
    

    parse() {
        return this.expr()
    }

}

export class ExpressionsInterpreter {
    constructor(text){
        this.parser = new ExpressionsParser(text)
    }

    visit(node) {
        const methodName = `visit${ node.constructor.name }`;
        const visitor = this[methodName] || this.genericVisit;
        return visitor.call(this, node)
    }

    genericVisit(node){
        throw new Error(`No visit${node.constructor.name} method`)
    }

    visitBinOpNode(node){ 
        if(node.op.type === AND){
            return this.visit(node.left) && this.visit(node.right)
        }
        else if(node.op.type === OR){
            return this.visit(node.left) || this.visit(node.right)
        }
        else if(node.op.type === BIG){
            return this.visit(node.left) > this.visit(node.right)
        }
        else if(node.op.type === BIGEQ){
            return this.visit(node.left) >= this.visit(node.right)
        }
        else if(node.op.type === SML){
            return this.visit(node.left) < this.visit(node.right)
        }
        else if(node.op.type === SMLEQ){
            return this.visit(node.left) <= this.visit(node.right)
        }
        else if(node.op.type === EQ){
            return this.visit(node.left) == this.visit(node.right)
        }
        else if(node.op.type === DIF){
            return this.visit(node.left) != this.visit(node.right)
        }
        else if(node.op.type === PLUS){
            return this.visit(node.left) + this.visit(node.right)
        }
        else if(node.op.type === MINUS){
            return this.visit(node.left) - this.visit(node.right)
        }
        else if(node.op.type === MULT){
            return this.visit(node.left) * this.visit(node.right)
        }
        else if(node.op.type === DIV){
            return this.visit(node.left) / this.visit(node.right)
        }
    }

    visitChars(node){
        return node.value
    }

    visitInteger(node){
        return node.value
    }

    visitUnaryOp(node){
        let opType = node.op.type
        if(opType === PLUS){
            return +this.visit(node.expr)
        }
        else if(opType === MINUS){
            return -this.visit(node.expr)
        }
    }

    interpret() {
        let tree = this.parser.parse()
        console.log('TREE', tree)
        return this.visit(tree)
    }
}