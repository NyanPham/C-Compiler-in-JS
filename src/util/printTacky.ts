import { TackyBinaryInterface, TackyFunctionDefinitionInterface, TackyInstructionInterface, TackyProgramInterface, TackyReturnInterface, TackyUnaryInterface } from "../tacky/interfaces";


function printTackyProgram(program: TackyProgramInterface): void {
    console.log(`TackyProgram(`);
    printTackyFunctionDefinition(program.functionDefinition, 1);
    console.log(`)`);
  }
  
  function printTackyFunctionDefinition(funcDef: TackyFunctionDefinitionInterface, indent: number): void {
    console.log(`${"  ".repeat(indent)}TackyFunctionDefinition(`);
    console.log(`${"  ".repeat(indent + 1)}name: ${funcDef.identifier}`);
    console.log(`${"  ".repeat(indent + 1)}body: [`);
    funcDef.body.forEach((instruction: TackyInstructionInterface) => {
        switch (instruction.type) {
            case "TackyReturn":
                console.log(`${"  ".repeat(indent + 2)}TackyReturn(value: ${(instruction as TackyReturnInterface).value})`);
                break;
            case "TackyUnary":
                const tackyUnary = instruction as TackyUnaryInterface
                console.log(`${"  ".repeat(indent + 2)}TackyUnary(operator: ${tackyUnary.unaryOperator}, src: ${tackyUnary.src}, dst: ${tackyUnary.dst})`);
                break;
            case "TackyBinary":
                const tackyBinary = instruction as TackyBinaryInterface
                console.log(`${"  ".repeat(indent + 2)}TackyBinary(operator: ${tackyBinary.binaryOperator}, src1: ${tackyBinary.src1}, src2: ${tackyBinary.src2}, dst: ${tackyBinary.dst})`);
                break;
            default:
                throw new Error(`Unsupported instruction type: ${instruction.type}`);
        }
    })
    console.log(`${"  ".repeat(indent + 1)}]`);
    console.log(`${"  ".repeat(indent)})`);
  }
  

  