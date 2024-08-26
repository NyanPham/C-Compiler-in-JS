import { AssemblyFunctionDefinition, AssemblyImmediateValue, AssemblyMoveInstruction, AssemblyProgram, AssemblyRegister, AssemblyReturnInstruction } from "./assemblyConstructs/constructs"
import { AssemblyFunctionDefinitionInterface, AssemblyInstructionInterface, AssemblyOperandInterface, AssemblyProgramInterface } from "./assemblyConstructs/interfaces"
import { ConstantExpressionInterface, ExpressionInterface, FunctionDefinitionInterface, IdentifierInterface, ProgramInterface, ReturnStatementInterface, StatementInterface } from "./ast/interfaces"
import { ConstantExpression, FunctionDefinition, Identifier, Program, ReturnStatement } from "./ast/nodes"
import { parseReturnType, Token, TokenType } from "./types"

// AssemblyConstruct
// AssemblyInteface

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
  
const parse = (tokens: Array<Token>) : parseReturnType => {
    const ast = parseProgram(tokens)
    const assemblyConstruct = astToAssembly(ast)

    console.log(ast)
    console.log(assemblyConstruct)

    return { ast, assemblyConstruct }
}

module.exports = parse