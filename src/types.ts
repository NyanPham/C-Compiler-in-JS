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
    ComplementOperator = "COMPLEMENT_OPERATOR",
    NegationOperator = "NEGATION_OPERATOR",
    DecrementOperator = "DECREMENT_OPERATOR",
    AddOperator = "ADD_OPERATOR",
    MultiplyOperator = "MULTIPLY_OPERATOR",
    DivideOperator = "DIVIDE_OPERATOR",
    RemainderOperator = "REMAINDER_OPERATOR",
}

export enum UnaryOperator_t {
    Complement = "Complement",
    Negate = "Negate"
}

export enum BinaryOperator_t {
    Add = "Add",
    Subtract = "Subtract",
    Multiply = "Multiply",
    Divide = "Divide",
    Remainder = "Remainder"
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