const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const EOF = 'EOF'

class Token {
    constructor(type, value){
        this.type = type
        this.value = value
    }

    toString() {
        return `Token(${this.type}, ${this.value})`
    }
}

export default class Interpreter {
    constructor(text) {        
        this.text = text
        this.position = 0
        this.currentToken = null
        this.currentChar = this.text[this.position]
    }

    error() {
        console.error('Error parsing input');
        throw new Error('Error parsing input')
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

    getNextToken() {

        while (this.currentChar != null) {

            let token = null

            if (/\s/.test(this.currentChar)) {
                this.skipWhiteSpace()
                continue
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

            this.error()
        }

        return new Token(EOF, null)

    }

    eat(tokenType) {
        if(this.currentToken.type === tokenType)
            this.currentToken = this.getNextToken()
        else
            this.error()
    }

    expr() {
        // debugger
        this.currentToken = this.getNextToken()

        let left = this.currentToken
        this.eat(INTEGER)

        let op = this.currentToken
        if (op.type === PLUS)
            this.eat(PLUS)
        else
            this.eat(MINUS)

        let right = this.currentToken
        this.eat(INTEGER)

        if (op.type == PLUS)
            return left.value + right.value
        else 
            return left.value - right.value
    }
}