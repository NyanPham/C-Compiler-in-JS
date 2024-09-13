import { ExpressionInterface, FunctionDefinitionInterface, IdentifierInterface, ProgramInterface, StatementInterface } from "./ast/interfaces"
import { BinaryOperator, ConstantExpression, FunctionDefinition, Identifier, Program, ReturnStatement, UnaryOperator } from "./ast/nodes"
import { UnaryOperator_t, Token, TokenType, BinaryOperator_t } from "./types"

const BinaryOperatorPrecedenceMap = new Map(
    [
        [BinaryOperator_t.Multiply, 50],
        [BinaryOperator_t.Divide, 50],
        [BinaryOperator_t.Remainder, 50],
        [BinaryOperator_t.Add, 45],
        [BinaryOperator_t.Subtract, 45],
    ]
)

const precedence = (token: Token): number => {
    const op: BinaryOperator_t = parseBinaryOperator([token])
            
    if (!BinaryOperatorPrecedenceMap.has(op)) {
        return 0
    }

    return BinaryOperatorPrecedenceMap.get(op)!
}

const takeToken = (tokens : Array<Token>) : Token => {
    const [token] = tokens;
    tokens.shift();
    return token;
}

const peek = (tokens : Array<Token>) : Token => {
    const [token] = tokens;
    return token;
}

const parseProgram = (tokens: Array<Token>) : ProgramInterface => {
    const program = new Program([parseFunction(tokens)])

    if (tokens.length > 0) {
        const extraToken = takeToken(tokens)
        if (extraToken.type === TokenType.Identifier) {
            throw new Error(`Unexpected ${extraToken.type} outside of a declaration`)
        }
    }

    return program
}

const parseFunction = (tokens: Array<Token>) : FunctionDefinitionInterface => {
    expect(TokenType.IntKeyword, tokens)
    const name = parseIdentifier(tokens)
    expect(TokenType.OpenParenthesis, tokens)
    expect(TokenType.VoidKeyword, tokens)
    expect(TokenType.CloseParenthesis, tokens)
    expect(TokenType.OpenBrace, tokens)
    const body = [parseStatement(tokens)]
    expect(TokenType.CloseBrace, tokens)

    return new FunctionDefinition(name, body)
}

const parseStatement = (tokens: Array<Token>) : StatementInterface => {
    expect(TokenType.ReturnKeyword, tokens)
    const returnVal : ExpressionInterface = parseExpression(tokens, 0)
    expect(TokenType.Semicolon, tokens)
    return new ReturnStatement(returnVal)
}

const parseIdentifier = (tokens: Array<Token>) : IdentifierInterface => {
    const token = takeToken(tokens)
    if (token.type !== TokenType.Identifier) {
        throw new Error(`Expected an IDENTIFIER but got ${token.type}`)
    }   
    return new Identifier(token.value)
}

const parseUnaryOperator = (tokens: Array<Token>): UnaryOperator_t => {
    const token = takeToken(tokens)
    switch (token.type) {
        case TokenType.ComplementOperator:
            return UnaryOperator_t.Complement
        case TokenType.NegationOperator:
            return UnaryOperator_t.Negate
        default:
            throw new Error(`Expected a unary operator but got ${token.type}`)
    }
}

const parseBinaryOperator = (tokens: Array<Token>): BinaryOperator_t => {
    const token = takeToken(tokens)

    switch (token.type) {
        case TokenType.AddOperator:
            return BinaryOperator_t.Add
        case TokenType.NegationOperator:
            return BinaryOperator_t.Subtract
        case TokenType.MultiplyOperator:
            return BinaryOperator_t.Multiply
        case TokenType.DivideOperator:
            return BinaryOperator_t.Divide
        case TokenType.RemainderOperator:
            return BinaryOperator_t.Remainder
        default:
            throw new Error(`Expected a binary operator but got ${token.type}`)
    }
}
    
const isBinaryOperator = (token: Token): boolean => {
    return token.type === TokenType.AddOperator || token.type === TokenType.NegationOperator || token.type === TokenType.MultiplyOperator || token.type === TokenType.DivideOperator || token.type === TokenType.RemainderOperator
}

const parseExpression = (tokens: Array<Token>, minPrecedence: number) : ExpressionInterface => {
    let left = parseFactor(tokens)
    let nextToken = peek(tokens)

    while (isBinaryOperator(nextToken) && precedence(nextToken) >= minPrecedence) {
        const op: BinaryOperator_t = parseBinaryOperator(tokens)
        const right = parseExpression(tokens, precedence(nextToken) + 1)
        left = new BinaryOperator(op, left, right)
        nextToken = peek(tokens)
    }

    return left
}

const parseFactor = (tokens: Array<Token>) : ExpressionInterface => {
    const nextToken = peek(tokens)
    switch (nextToken.type) {
        case TokenType.Constant: {
            takeToken(tokens)
            return new ConstantExpression(parseInt(nextToken.value))
        }
        case TokenType.ComplementOperator:
        case TokenType.NegationOperator: {
            const op: UnaryOperator_t = parseUnaryOperator(tokens)
            const innerExpression = parseFactor(tokens)
            return new UnaryOperator(op, innerExpression)
        }
        case TokenType.OpenParenthesis: {
            takeToken(tokens)
            const innerExpression = parseExpression(tokens, 0)
            expect(TokenType.CloseParenthesis, tokens)
            return innerExpression
        }
        default:
            throw new Error("Malformed factor: " + nextToken.type)
    }
}

const expect = (expected: TokenType, tokens : Array<Token>) : Token => {
    const actual = takeToken(tokens)

    if (actual == null) {
        throw new Error(`Expected ${expected} but got EOF`)
    }

    if (actual.type !== expected) {
        throw new Error(`Expected ${expected} but got ${actual.type}`)
    }

    return actual
}       
  
const parse = (tokens: Array<Token>) : ProgramInterface => {
  const program = parseProgram(tokens)

  return program
}

module.exports = parse