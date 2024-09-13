import { BinaryOperatorExpressionInterface, ConstantExpressionInterface, ExpressionInterface, ProgramInterface, ReturnStatementInterface, StatementInterface, UnaryOperatorExpressionInterface } from "../ast/interfaces";

function printProgram(program: ProgramInterface): void {
    console.log(`Program(`);
    program.body.forEach((funcDef) => {
      console.log(`  FunctionDefinition(`);
      console.log(`    name: ${funcDef.name.name}`);
      console.log(`    body: [`);
      funcDef.body.forEach((statement) => {
        printStatement(statement, 2);
      });
      console.log(`    ]`);
      console.log(`  )`);
    });
    console.log(`)`);
  }

  function printStatement(statement: StatementInterface, indent: number): void {
    switch (statement.type) {
      case "ReturnStatement":
        console.log(`${"  ".repeat(indent)}ReturnStatement(`);
        console.log(`${"  ".repeat(indent + 1)}argument:`);
        printExpression((statement as ReturnStatementInterface).argument != null ? (statement as ReturnStatementInterface).argument : null, indent + 2);
        console.log(`${"  ".repeat(indent)})`);
        break;
      default:
        throw new Error(`Unsupported statement type: ${statement.type}`);
    }
  }
  
  function printExpression(expression: ExpressionInterface | null, indent: number): void {
    if (expression === null) {
        console.log(`${"  ".repeat(indent)}null`);
        return 
    }

    switch (expression.type) {
      case "ConstantExpression":
        console.log(`${"  ".repeat(indent)}ConstantExpression(value: ${(expression as ConstantExpressionInterface).value})`);
        break;
      case "UnaryOperatorExpression":
        console.log(`${"  ".repeat(indent)}UnaryOperatorExpression(operator: ${(expression as UnaryOperatorExpressionInterface).operator}, argument:`);
        printExpression((expression as UnaryOperatorExpressionInterface).argument, indent + 1);
        console.log(`${"  ".repeat(indent)})}`);
        break;
      case "BinaryOperatorExpression":
        console.log(`${"  ".repeat(indent)}BinaryOperatorExpression(operator: ${(expression as BinaryOperatorExpressionInterface).operator}, left:`);
        printExpression((expression as BinaryOperatorExpressionInterface).left, indent + 1);
        console.log(`${"  ".repeat(indent)}right:`);
        printExpression((expression as BinaryOperatorExpressionInterface).right, indent + 1);
        console.log(`${"  ".repeat(indent)})}`);
        break;
      default:
        throw new Error(`Unsupported expression type: ${expression.type}`);
    }
  }

module.exports = printProgram