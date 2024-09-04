import { AssemblyFunctionDefinition, AssemblyImmediateValue, AssemblyMoveInstruction, AssemblyProgram, AssemblyPseudoIdentifier, AssemblyRegister, AssemblyReturnInstruction } from "../assemblyConstructs/constructs";
import { AssemblyInstructionInterface, AssemblyProgramInterface, RegisterName } from "../assemblyConstructs/interfaces";
import { TackyConstantInterface, TackyProgramInterface, TackyReturnInterface, TackyUnaryInterface, TackyVariableInterface } from "../tacky/interfaces";

const astToAssembly = (program: TackyProgramInterface): AssemblyProgramInterface | void => {
  const instructions: AssemblyInstructionInterface[] = []
  const tackyInstructions = program.functionDefinition.body

  tackyInstructions.forEach(f => {
    if (f.type === 'TackyReturn') {
      convertToAssemblyReturn(f as TackyReturnInterface, instructions)
    }

    if (f.type === 'TackyUnary') {
      convertToAssemblyUnary(f as TackyUnaryInterface, instructions)
    }
  })

  const functionDefinition = new AssemblyFunctionDefinition(program.functionDefinition.identifier, instructions)
  return new AssemblyProgram(functionDefinition)
};

const convertToAssemblyReturn = (inst: TackyReturnInterface, instructions: AssemblyInstructionInterface[]) => {
  switch (inst.value.type) {
    case 'TackyConstant': {
      const moveInst = new AssemblyMoveInstruction(new AssemblyImmediateValue((inst.value as TackyConstantInterface).value), new AssemblyRegister(RegisterName.AX))
      instructions.push(moveInst)
      break
    } 
    case 'TackyVariable': {
      const moveInst = new AssemblyMoveInstruction(new AssemblyPseudoIdentifier((inst.value as TackyVariableInterface).name), new AssemblyRegister(RegisterName.AX))
      instructions.push(moveInst)
      break
    }
    default:
      throw new Error('Unsupported value type: ' + inst.value.type)
  }

  const retInst = new AssemblyReturnInstruction()
  instructions.push(retInst)
}

const convertToAssemblyUnary = (inst: TackyUnaryInterface, instructions: AssemblyInstructionInterface[]) => {
  switch (inst.src.type) {
    case 'TackyConstant': {
      const moveInst = new AssemblyMoveInstruction(new AssemblyImmediateValue((inst.src as TackyConstantInterface).value), new AssemblyPseudoIdentifier((inst.dst as TackyVariableInterface).name))
      instructions.push(moveInst)
      break
    }
    case 'TackyVariable': {
      const moveInst = new AssemblyMoveInstruction(new AssemblyPseudoIdentifier((inst.src as TackyVariableInterface).name), new AssemblyPseudoIdentifier((inst.dst as TackyVariableInterface).name))
      instructions.push(moveInst)
      break
    }
    default: {
      throw new Error('Unsupported src type: ' + inst.src.type)
    }
  }
}

export default astToAssembly