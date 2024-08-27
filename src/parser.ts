import { ExpressionInterface, FunctionDefinitionInterface, IdentifierInterface, ProgramInterface, StatementInterface } from "./ast/interfaces"
import { ConstantExpression, FunctionDefinition, Identifier, Program, ReturnStatement } from "./ast/nodes"
import { Token, TokenType } from "./types"

const takeToken = (tokens : Array<Token>) : Token => {
    return tokens.splice(0, 1)[0]
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
    const returnVal : ExpressionInterface = parseExp(tokens)
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
    
const parseExp = (tokens: Array<Token>) : ExpressionInterface => {
    const value = expect(TokenType.Constant, tokens)?.value
    return new ConstantExpression(parseInt(value))
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