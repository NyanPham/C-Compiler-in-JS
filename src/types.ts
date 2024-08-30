import { AssemblyProgramInterface } from "./assemblyConstructs/interfaces"
import { ProgramInterface } from "./ast/interfaces"

export enum TokenType {
    Constant = "CONSTANT",
    Identifier = "IDENTIFIER",
    IntKeyword = "INT_KEYWORD",
    VoidKeyword = "VOID_KEYWORD",
    ReturnKeyword = "RETURN_KEYWORD",
    OpenParenthesis = "OPEN_PARENTHESIS",
    CloseParenthesis = "CLOSE_PARENTHESIS",
    OpenBrace = "OPEN_BRACE",
    CloseBrace = "CLOSE_BRACE",
    Semicolon = "SEMICOLON",
    BitwiseComplement = "BITWISE_COMPLEMENT",
    NegationOperator = "NEGATION_OPERATOR",
    DecrementOperator = "DECREMENT_OPERATOR",
}
  
export type Token = {
    value: string,
    type: TokenType
}

export enum ValidateTokenErrors {
    NoErrors = 0,
    MustWordBoundary = 1,
  }
  
export type parseReturnType = {
    ast: ProgramInterface
    assemblyConstruct: AssemblyProgramInterface
}