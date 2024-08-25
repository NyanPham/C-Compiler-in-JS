import { ConstantExpressionInterface, ExpressionInterface, FunctionDefinitionInterface, IdentifierInterface, ProgramInterface, ReturnStatementInterface, StatementInterface } from "./interfaces"

/**
 * <statement> ::= "return" <exp> ";" | "if" "(" <exp> ")" <statement> [ "else" <statement> ]
 */

export class Program implements ProgramInterface {
  type: "Program" = "Program"
  constructor(public body: FunctionDefinitionInterface[]) {}
}

export class FunctionDefinition implements FunctionDefinition {
  type: "FunctionDefinition" = "FunctionDefinition"
  constructor(public name: IdentifierInterface, public body: StatementInterface[]) {}
}

export class ReturnStatement implements ReturnStatementInterface {
  type: "ReturnStatement" = "ReturnStatement"
  constructor(public argument: ExpressionInterface) {}
}

export class ConstantExpression implements ConstantExpressionInterface {
  type: "ConstantExpression" = "ConstantExpression"
  constructor(public value: number) {}
}

export class Identifier implements IdentifierInterface {
  type: "Identifier" = "Identifier"
  constructor(public name: string) {}
}

