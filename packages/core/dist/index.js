"use strict";
// TO BETTER UNDERSTAND HOW IT WORKS
// http://www.craftinginterpreters.com/parsing-expressions.html
// https://ruslanspivak.com/lsbasi-part1/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionsInterpreter = exports.ExpressionsParser = exports.StringComparator = exports.StringComparatorParser = exports.Calculator = exports.CalculatorParser = exports.SimpleInterpreter = exports.Token = void 0;
var NUM = "NUM";
var PLUS = "PLUS";
var MINUS = "MINUS";
var EOF = "EOF";
var MULT = "MULT";
var DIV = "DIV";
var LPAREN = "LPAREN";
var RPAREN = "RPAREN";
var DIF = "DIF";
var BIG = "BIG";
var BIGEQ = "BIGEQ";
var SML = "SML";
var SMLEQ = "SMLEQ";
var EQ = "EQ";
var CHARS = "CHARS";
var AND = "AND";
var OR = "OR";
var Token = /** @class */ (function () {
    function Token(type, value) {
        this.type = type;
        this.value = value;
    }
    Token.prototype.toString = function () {
        return "Token(" + this.type + ", " + this.value + ")";
    };
    return Token;
}());
exports.Token = Token;
var SimpleInterpreter = /** @class */ (function () {
    function SimpleInterpreter(text) {
        this.lexer = new Lexer(text);
        this.currentToken = this.lexer.getNextToken();
    }
    SimpleInterpreter.prototype.error = function () {
        throw new Error("Invalid syntax");
    };
    SimpleInterpreter.prototype.eat = function (tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        }
        else {
            this.error();
        }
    };
    SimpleInterpreter.prototype.factor = function () {
        var token = this.currentToken;
        if (token.type === NUM) {
            this.eat(NUM);
            return token.value;
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN);
            var result = this.expr();
            this.eat(RPAREN);
            return result;
        }
        this.error();
    };
    SimpleInterpreter.prototype.term = function () {
        var result = this.factor();
        while ([MULT, DIV].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === MULT) {
                this.eat(MULT);
                result = result * this.factor();
            }
            else if (token.type === DIV) {
                this.eat(DIV);
                result = result / this.factor();
            }
        }
        return result;
    };
    SimpleInterpreter.prototype.expr = function () {
        var result = this.term();
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === PLUS) {
                this.eat(PLUS);
                result = result + this.term();
            }
            else if (token.type === MINUS) {
                this.eat(MINUS);
                result = result - this.term();
            }
        }
        return result;
    };
    return SimpleInterpreter;
}());
exports.SimpleInterpreter = SimpleInterpreter;
var Lexer = /** @class */ (function () {
    function Lexer(text) {
        this.text = text;
        this.position = 0;
        this.currentChar = this.text[this.position];
    }
    Lexer.prototype.error = function () {
        throw new Error("Invalid character \"" + this.currentChar + "\" at position " + this.position);
    };
    Lexer.prototype.advance = function () {
        this.position++;
        this.currentChar =
            this.position > this.text.length - 1 ? null : this.text[this.position];
    };
    Lexer.prototype.skipWhiteSpace = function () {
        while (this.currentChar != null && /\s/.test(this.currentChar))
            this.advance();
    };
    Lexer.prototype.num = function () {
        var result = "";
        var havePoint = false;
        while (this.currentChar != null && !/\s/.test(this.currentChar)) {
            if (!isNaN(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
            else if (!havePoint &&
                this.currentChar === "." &&
                !isNaN(this.peek())) {
                result += this.currentChar;
                havePoint = true;
                this.advance();
            }
            else {
                break;
            }
        }
        return Number(result);
    };
    Lexer.prototype.chars = function (quotes) {
        if (quotes === void 0) { quotes = '"'; }
        var result = "";
        this.advance();
        while (this.currentChar != null && this.currentChar !== quotes) {
            result += this.currentChar;
            this.advance();
        }
        this.advance();
        return String(result);
    };
    Lexer.prototype.peek = function (count) {
        if (count === void 0) { count = 1; }
        var peekPos = this.position + count;
        return peekPos > this.text.length - 1 ? null : this.text[peekPos];
    };
    Lexer.prototype.getNextToken = function () {
        while (this.currentChar != null) {
            var token = null;
            if (/\s/.test(this.currentChar)) {
                this.skipWhiteSpace();
                continue;
            }
            else if (this.currentChar === '"') {
                token = new Token(CHARS, this.chars('"'));
                return token;
            }
            else if (!isNaN(this.currentChar)) {
                token = new Token(NUM, this.num());
                return token;
            }
            else if (this.currentChar === "+") {
                this.advance();
                token = new Token(PLUS, "+");
                return token;
            }
            else if (this.currentChar === "-") {
                this.advance();
                token = new Token(MINUS, "-");
                return token;
            }
            else if (this.currentChar === "*") {
                this.advance();
                token = new Token(MULT, "*");
                return token;
            }
            else if (this.currentChar === "/") {
                this.advance();
                token = new Token(DIV, "/");
                return token;
            }
            else if (this.currentChar === "(") {
                this.advance();
                token = new Token(LPAREN, "(");
                return token;
            }
            else if (this.currentChar === ")") {
                this.advance();
                token = new Token(RPAREN, ")");
                return token;
            }
            else if (this.currentChar === "&" && this.peek() === "&") {
                this.advance();
                this.advance();
                token = new Token(AND, "&&");
                return token;
            }
            else if (this.currentChar === "|" && this.peek() === "|") {
                this.advance();
                this.advance();
                token = new Token("OR", "||");
                return token;
            }
            else if (this.currentChar === ">") {
                this.advance();
                if (this.currentChar === "=") {
                    this.advance();
                    token = new Token(BIGEQ, ">=");
                }
                else {
                    token = new Token(BIG, ">");
                }
                return token;
            }
            else if (this.currentChar === "<") {
                this.advance();
                if (this.currentChar === "=") {
                    this.advance();
                    token = new Token(SMLEQ, "<=");
                }
                else {
                    token = new Token(SML, "<");
                }
                return token;
            }
            else if (this.currentChar === "=" && this.peek() === "=") {
                this.advance();
                this.advance();
                token = new Token(EQ, "==");
                return token;
            }
            else if (this.currentChar === "!" && this.peek() === "=") {
                this.advance();
                this.advance();
                token = new Token(DIF, "!=");
                return token;
            }
            this.error(this.currentChar);
        }
        return new Token(EOF, null);
    };
    return Lexer;
}());
var Node = /** @class */ (function () {
    function Node(token, type) {
        this.token = token;
        this.type = type;
    }
    return Node;
}());
var BinOpNode = /** @class */ (function (_super) {
    __extends(BinOpNode, _super);
    function BinOpNode(left, op, right) {
        var _this = _super.call(this, op, "BinOpNode") || this;
        _this.left = left;
        _this.op = op;
        _this.right = right;
        return _this;
    }
    BinOpNode.prototype.toString = function () {
        return "left " + this.left + " op " + this.op + " right " + this.right;
    };
    return BinOpNode;
}(Node));
var ExpressionNode = /** @class */ (function (_super) {
    __extends(ExpressionNode, _super);
    function ExpressionNode(left, op, right) {
        var _this = _super.call(this, op.token, "ExpressionNode") || this;
        _this.left = left;
        _this.op = op;
        _this.right = right;
        return _this;
    }
    ExpressionNode.prototype.toString = function () {
        return "left " + this.left + " op " + this.op + " right " + this.right;
    };
    return ExpressionNode;
}(Node));
var ComparisonNode = /** @class */ (function (_super) {
    __extends(ComparisonNode, _super);
    function ComparisonNode(left, op, right) {
        var _this = _super.call(this, op.token, "ComparisonNode") || this;
        _this.left = left;
        _this.op = op;
        _this.right = right;
        return _this;
    }
    ComparisonNode.prototype.toString = function () {
        return "left " + this.left + " op " + this.op + " right " + this.right;
    };
    return ComparisonNode;
}(Node));
var MathNode = /** @class */ (function (_super) {
    __extends(MathNode, _super);
    function MathNode(left, op, right) {
        var _this = _super.call(this, op.token, "MathNode") || this;
        _this.left = left;
        _this.op = op;
        _this.right = right;
        return _this;
    }
    MathNode.prototype.toString = function () {
        return "left " + this.left + " op " + this.op + " right " + this.right;
    };
    return MathNode;
}(Node));
var NumNode = /** @class */ (function (_super) {
    __extends(NumNode, _super);
    function NumNode(token) {
        var _this = _super.call(this, token, "NumNode") || this;
        _this.token = token;
        return _this;
    }
    return NumNode;
}(Node));
var CharsNode = /** @class */ (function (_super) {
    __extends(CharsNode, _super);
    function CharsNode(token) {
        var _this = _super.call(this, token, "CharsNode") || this;
        _this.token = token;
        return _this;
    }
    return CharsNode;
}(Node));
var UnaryOpNode = /** @class */ (function (_super) {
    __extends(UnaryOpNode, _super);
    function UnaryOpNode(op, expr) {
        var _this = _super.call(this, op, "UnaryOpNode") || this;
        _this.token = op;
        _this.op = op;
        _this.expr = expr;
        return _this;
    }
    return UnaryOpNode;
}(Node));
var CalculatorParser = /** @class */ (function () {
    function CalculatorParser(text) {
        this.lexer = new Lexer(text);
        this.currentToken = this.lexer.getNextToken();
        this.tokenList = [this.currentToken];
    }
    CalculatorParser.prototype.error = function () {
        this.lexer.error();
    };
    CalculatorParser.prototype.eat = function (tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
            this.tokenList.push(this.currentToken);
        }
        else {
            this.error();
        }
    };
    CalculatorParser.prototype.expr = function () {
        var node = this.term();
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === PLUS) {
                this.eat(PLUS);
            }
            else if (token.type === MINUS) {
                this.eat(MINUS);
            }
            node = new BinOpNode(node, token, this.term());
        }
        return node;
    };
    CalculatorParser.prototype.term = function () {
        var node = this.factor();
        while ([MULT, DIV].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === MULT) {
                this.eat(MULT);
            }
            else if (token.type === DIV) {
                this.eat(DIV);
            }
            node = new BinOpNode(node, token, this.factor());
        }
        return node;
    };
    CalculatorParser.prototype.factor = function () {
        var token = this.currentToken;
        if (token.type === PLUS) {
            this.eat(PLUS);
            return new UnaryOpNode(token, this.factor());
        }
        else if (token.type === MINUS) {
            this.eat(MINUS);
            return new UnaryOpNode(token, this.factor());
        }
        else if (token.type === NUM) {
            this.eat(NUM);
            return new NumNode(token);
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN);
            var node = this.expr();
            this.eat(RPAREN);
            return node;
        }
        this.error(this.currentToken.toString());
    };
    CalculatorParser.prototype.parse = function () {
        var node = this.expr();
        return this.currentToken.type === EOF
            ? node
            : this.error(this.currentToken.toString());
    };
    return CalculatorParser;
}());
exports.CalculatorParser = CalculatorParser;
var Calculator = /** @class */ (function () {
    function Calculator() {
    }
    Calculator.prototype.visit = function (node) {
        var visitor = this.genericVisit;
        console.log('node', node);
        if (node.type === "NumNode") {
            visitor = this.visitNumNode;
        }
        else if (node.type === "UnaryOpNode") {
            visitor = this.visitUnaryOpNode;
        }
        else if (node.type === "BinOpNode") {
            visitor = this.visitBinOpNode;
        }
        return visitor.call(this, node);
    };
    Calculator.prototype.genericVisit = function (node) {
        throw new Error("No " + node.constructor.name + " method");
    };
    Calculator.prototype.visitBinOpNode = function (node) {
        if (node.op.type === PLUS) {
            return this.visit(node.left) + this.visit(node.right);
        }
        else if (node.op.type === MINUS) {
            return this.visit(node.left) - this.visit(node.right);
        }
        else if (node.op.type === MULT) {
            return this.visit(node.left) * this.visit(node.right);
        }
        else if (node.op.type === DIV) {
            return this.visit(node.left) / this.visit(node.right);
        }
        this.parser.error(node.toString());
    };
    Calculator.prototype.visitNumNode = function (node) {
        return node.token.value;
    };
    Calculator.prototype.visitUnaryOpNode = function (node) {
        var opType = node.op.type;
        if (opType === PLUS) {
            return +this.visit(node.expr);
        }
        else if (opType === MINUS) {
            return -this.visit(node.expr);
        }
        this.parser.error(node.toString());
    };
    Calculator.prototype.eval = function (text) {
        this.parser = new CalculatorParser(text);
        var tree = this.parser.parse();
        return this.visit(tree);
    };
    return Calculator;
}());
exports.Calculator = Calculator;
var StringComparatorParser = /** @class */ (function () {
    function StringComparatorParser(text) {
        this.lexer = new Lexer(text);
        this.currentToken = this.lexer.getNextToken();
        this.tokenList = [this.currentToken];
    }
    StringComparatorParser.prototype.error = function (char) {
        this.lexer.error(char);
    };
    StringComparatorParser.prototype.eat = function (tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
            this.tokenList.push(this.currentToken);
        }
        else {
            this.error(this.currentToken.toString());
        }
    };
    StringComparatorParser.prototype.expr = function () {
        var node = this.term();
        while ([AND, OR].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === AND) {
                this.eat(AND);
            }
            else if (token.type === OR) {
                this.eat(OR);
            }
            node = new BinOpNode(node, token, this.term());
        }
        return node;
    };
    StringComparatorParser.prototype.term = function () {
        var node = this.factor();
        while ([BIG, BIGEQ, SML, SMLEQ, EQ, DIF].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === BIG) {
                this.eat(BIG);
            }
            else if (token.type === BIGEQ) {
                this.eat(BIGEQ);
            }
            else if (token.type === SML) {
                this.eat(SML);
            }
            else if (token.type === SMLEQ) {
                this.eat(SMLEQ);
            }
            else if (token.type === EQ) {
                this.eat(EQ);
            }
            else if (token.type === DIF) {
                this.eat(DIF);
            }
            node = new BinOpNode(node, token, this.factor());
        }
        return node;
    };
    StringComparatorParser.prototype.factor = function () {
        var token = this.currentToken;
        if (token.type === CHARS) {
            this.eat(CHARS);
            return new CharsNode(token);
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN);
            var node = this.expr();
            this.eat(RPAREN);
            return node;
        }
        this.error();
    };
    StringComparatorParser.prototype.parse = function () {
        var node = this.expr();
        return this.currentToken.type === EOF ? node : this.error();
    };
    return StringComparatorParser;
}());
exports.StringComparatorParser = StringComparatorParser;
var StringComparator = /** @class */ (function () {
    function StringComparator() {
    }
    StringComparator.prototype.error = function () {
        this.parser.error();
    };
    StringComparator.prototype.visit = function (node) {
        var visitor = this.genericVisit;
        if (node.type === "CharsNode") {
            visitor = this.visitCharsNode;
        }
        else if (node.type === "BinOpNode") {
            visitor = this.visitBinOpNode;
        }
        return visitor.call(this, node);
    };
    StringComparator.prototype.genericVisit = function (node) {
        throw new Error("No " + node.constructor.name + " method");
    };
    StringComparator.prototype.visitBinOpNode = function (node) {
        if (node.op.type === AND) {
            return this.visit(node.left) && this.visit(node.right);
        }
        else if (node.op.type === OR) {
            return this.visit(node.left) || this.visit(node.right);
        }
        else if (node.op.type === BIG) {
            return this.visit(node.left) > this.visit(node.right);
        }
        else if (node.op.type === BIGEQ) {
            return this.visit(node.left) >= this.visit(node.right);
        }
        else if (node.op.type === SML) {
            return this.visit(node.left) < this.visit(node.right);
        }
        else if (node.op.type === SMLEQ) {
            return this.visit(node.left) <= this.visit(node.right);
        }
        else if (node.op.type === EQ) {
            return this.visit(node.left) == this.visit(node.right);
        }
        else if (node.op.type === DIF) {
            return this.visit(node.left) != this.visit(node.right);
        }
        this.error();
    };
    StringComparator.prototype.visitCharsNode = function (node) {
        return node.token.value;
    };
    StringComparator.prototype.eval = function (text) {
        this.parser = new StringComparatorParser(text);
        var tree = this.parser.parse();
        return this.visit(tree);
    };
    return StringComparator;
}());
exports.StringComparator = StringComparator;
var ExpressionsParser = /** @class */ (function () {
    function ExpressionsParser(text) {
        this.lexer = new Lexer(text);
        this.currentToken = this.lexer.getNextToken();
        this.tokenList = [this.currentToken];
    }
    ExpressionsParser.prototype.error = function () {
        this.lexer.error();
    };
    ExpressionsParser.prototype.eat = function (tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
            this.tokenList.push(this.currentToken);
        }
        else {
            this.error();
        }
    };
    ExpressionsParser.prototype.expr = function () {
        var node = this.comparison();
        while ([AND, OR].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === AND) {
                this.eat(AND);
            }
            else if (token.type === OR) {
                this.eat(OR);
            }
            node = new ExpressionNode(node, token, this.comparison());
        }
        return node;
    };
    ExpressionsParser.prototype.comparison = function () {
        var node = this.addition();
        while ([BIG, BIGEQ, SML, SMLEQ, EQ, DIF].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === BIG) {
                this.eat(BIG);
            }
            else if (token.type === BIGEQ) {
                this.eat(BIGEQ);
            }
            else if (token.type === SML) {
                this.eat(SML);
            }
            else if (token.type === SMLEQ) {
                this.eat(SMLEQ);
            }
            else if (token.type === EQ) {
                this.eat(EQ);
            }
            else if (token.type === DIF) {
                this.eat(DIF);
            }
            node = new ComparisonNode(node, token, this.addition());
        }
        return node;
    };
    ExpressionsParser.prototype.addition = function () {
        var node = this.multiplication();
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === PLUS) {
                this.eat(PLUS);
            }
            else if (token.type === MINUS) {
                this.eat(MINUS);
            }
            node = new MathNode(node, token, this.multiplication());
        }
        return node;
    };
    ExpressionsParser.prototype.multiplication = function () {
        var node = this.unary();
        while ([MULT, DIV].includes(this.currentToken.type)) {
            var token = this.currentToken;
            if (token.type === MULT) {
                this.eat(MULT);
            }
            else if (token.type === DIV) {
                this.eat(DIV);
            }
            node = new MathNode(node, token, this.unary());
        }
        return node;
    };
    ExpressionsParser.prototype.unary = function () {
        var token = this.currentToken;
        if (token.type === PLUS) {
            this.eat(PLUS);
            return new UnaryOpNode(token, this.unary());
        }
        else if (token.type === MINUS) {
            this.eat(MINUS);
            return new UnaryOpNode(token, this.unary());
        }
        else if (token.type === NUM) {
            this.eat(NUM);
            return new NumNode(token);
        }
        else if (token.type === CHARS) {
            this.eat(CHARS);
            return new CharsNode(token);
        }
        else if (token.type === LPAREN) {
            this.eat(LPAREN);
            var node = this.expr();
            this.eat(RPAREN);
            return node;
        }
        this.error();
    };
    ExpressionsParser.prototype.parse = function () {
        var node = this.expr();
        if (this.currentToken.type !== EOF) {
            this.error();
        }
        return node;
    };
    return ExpressionsParser;
}());
exports.ExpressionsParser = ExpressionsParser;
var ExpressionsInterpreter = /** @class */ (function () {
    function ExpressionsInterpreter() {
    }
    ExpressionsInterpreter.prototype.visit = function (node) {
        var visitor = this.genericVisit;
        if (node.type === "ExpressionNode") {
            visitor = this.visitExpressionNode;
        }
        else if (node.type === "ComparisonNode") {
            visitor = this.visitComparisonNode;
        }
        else if (node.type === "MathNode") {
            visitor = this.visitMathNode;
        }
        else if (node.type === "NumNode") {
            visitor = this.visitNumNode;
        }
        else if (node.type === "CharsNode") {
            visitor = this.visitCharsNode;
        }
        else if (node.type === "UnaryOpNode") {
            visitor = this.visitUnaryOpNode;
        }
        return visitor.call(this, node);
    };
    ExpressionsInterpreter.prototype.genericVisit = function (node) {
        throw new Error("No " + node.constructor.name + " method " + JSON.stringify(node));
    };
    ExpressionsInterpreter.prototype.error = function () {
        throw Error("Interpretation Error");
    };
    ExpressionsInterpreter.prototype.visitExpressionNode = function (node) {
        var leftNode = this.visit(node.left);
        var rightNode = this.visit(node.right);
        if (typeof leftNode !== "boolean" || typeof rightNode !== "boolean") {
            this.error();
        }
        if (node.op.type === AND) {
            return leftNode && rightNode;
        }
        else if (node.op.type === OR) {
            return leftNode || rightNode;
        }
        this.error();
    };
    ExpressionsInterpreter.prototype.visitComparisonNode = function (node) {
        if (node.op.type === BIG) {
            return this.visit(node.left) > this.visit(node.right);
        }
        else if (node.op.type === BIGEQ) {
            return this.visit(node.left) >= this.visit(node.right);
        }
        else if (node.op.type === SML) {
            return this.visit(node.left) < this.visit(node.right);
        }
        else if (node.op.type === SMLEQ) {
            return this.visit(node.left) <= this.visit(node.right);
        }
        else if (node.op.type === EQ) {
            return this.visit(node.left) == this.visit(node.right);
        }
        else if (node.op.type === DIF) {
            return this.visit(node.left) != this.visit(node.right);
        }
        this.error();
    };
    ExpressionsInterpreter.prototype.visitMathNode = function (node) {
        if (node.op.type === PLUS) {
            return this.visit(node.left) + this.visit(node.right);
        }
        else if (node.op.type === MINUS) {
            return this.visit(node.left) - this.visit(node.right);
        }
        else if (node.op.type === MULT) {
            return this.visit(node.left) * this.visit(node.right);
        }
        else if (node.op.type === DIV) {
            return this.visit(node.left) / this.visit(node.right);
        }
        this.error();
    };
    ExpressionsInterpreter.prototype.visitUnaryOpNode = function (node) {
        var opType = node.op.type;
        if (opType === PLUS) {
            return +this.visit(node.expr);
        }
        else if (opType === MINUS) {
            return -this.visit(node.expr);
        }
        this.parser.error();
    };
    ExpressionsInterpreter.prototype.visitCharsNode = function (node) {
        return node.token.type === CHARS ? node.token.value : this.error();
    };
    ExpressionsInterpreter.prototype.visitNumNode = function (node) {
        return node.token.type === NUM ? node.token.value : this.error();
    };
    ExpressionsInterpreter.prototype.eval = function (text) {
        this.parser = new ExpressionsParser(text);
        var tree = this.parser.parse();
        var result = this.visit(tree);
        return typeof result === "boolean" ? result : this.error();
    };
    return ExpressionsInterpreter;
}());
exports.ExpressionsInterpreter = ExpressionsInterpreter;
