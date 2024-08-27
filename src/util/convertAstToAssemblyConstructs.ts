
import { AssemblyFunctionDefinition, AssemblyImmediateValue, AssemblyMoveInstruction, AssemblyProgram, AssemblyRegister, AssemblyReturnInstruction } from "../assemblyConstructs/constructs"
import { AssemblyFunctionDefinitionInterface, AssemblyInstructionInterface, AssemblyOperandInterface, AssemblyProgramInterface } from "../assemblyConstructs/interfaces"
import { ConstantExpressionInterface, ExpressionInterface, FunctionDefinitionInterface, IdentifierInterface, ProgramInterface, ReturnStatementInterface, StatementInterface } from "../ast/interfaces"
import { ConstantExpression, FunctionDefinition, Identifier, Program, ReturnStatement } from "../ast/nodes"

const astToAssembly = (program: ProgramInterface): AssemblyProgramInterface => {
    const assemblyFuncs : AssemblyFunctionDefinitionInterface[] =program.body.map((funcDef) => {
      const instructions : AssemblyInstructionInterface[] = funcDef.body.flatMap((statement) => {
        return convertStatementToAssembly(statement);
      });

      return new AssemblyFunctionDefinition((funcDef.name.name), instructions);
    });

    const assemblyProgram : AssemblyProgramInterface = new AssemblyProgram(assemblyFuncs[0]);

    return assemblyProgram;
  };
  
  const convertStatementToAssembly = (statement: StatementInterface): AssemblyInstructionInterface[] => {
    switch (statement.type) {
      case "ReturnStatement":
        return convertReturnStatementToAssembly(statement as ReturnStatement);
      default:
        throw new Error(`Unsupported statement type: ${statement.type}`);
    }
  };
  
  const convertReturnStatementToAssembly = (statement: ReturnStatementInterface): AssemblyInstructionInterface[] => {
    const instructions : AssemblyInstructionInterface[] = []
    if (statement.argument != null) {
      const sourceOperand = convertExpressionToAssemblyOperand(statement.argument);
      const moveInstruction = new AssemblyMoveInstruction(sourceOperand, new AssemblyRegister("eax"));
      instructions.push(moveInstruction)
    } 
    
    const returnInstruction = new AssemblyReturnInstruction();
    instructions.push(returnInstruction)

    return instructions;
  };
  
  const convertExpressionToAssemblyOperand = (expression: ExpressionInterface): AssemblyOperandInterface => {
    switch (expression.type) {
      case "ConstantExpression":
        return convertConstantExpressionToAssemblyOperand(expression as ConstantExpression);
      default:
        throw new Error(`Unsupported expression type: ${expression.type}`);
    }
  };

  const convertConstantExpressionToAssemblyOperand = (expression: ConstantExpressionInterface): AssemblyOperandInterface => {
    const value = expression.value;
    return new AssemblyImmediateValue(value);
  };

export default astToAssembly