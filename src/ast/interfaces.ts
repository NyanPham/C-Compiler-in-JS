// Define the types for the AST nodes
export interface ProgramInterface {
  type: "Program"
  body: FunctionDefinitionInterface[]
}

export interface FunctionDefinitionInterface {
  type: "FunctionDefinition"
  name: IdentifierInterface
  body: StatementInterface[]
}

export interface StatementInterface {
  type: "Statement" | "ReturnStatement"
  argument: ExpressionInterface
}
  
export interface ReturnStatementInterface extends StatementInterface {
  type: "ReturnStatement"
  argument: ExpressionInterface
}

export interface ExpressionInterface {
  type: "Expression" | "ConstantExpression"
}

export interface ConstantExpressionInterface extends ExpressionInterface {
  type: "ConstantExpression"
  value: number
}

export interface IdentifierInterface {
  type: "Identifier"
  name: string
}
