import { AssemblyAllocateStackInstruction, AssemblyFunctionDefinition, AssemblyImmediateValue, AssemblyMoveInstruction, AssemblyProgram, AssemblyPseudoIdentifier, AssemblyRegister, AssemblyReturnInstruction, AssemblyStack, AssemblyUnaryInstruction } from "../assemblyConstructs/constructs";
import { AssemblyInstructionInterface, AssemblyOperator, AssemblyProgramInterface, AssemblyPseudoIdentifierInterface, AssemblyStackInterface, RegisterName } from "../assemblyConstructs/interfaces";
import { TackyConstantInterface, TackyFunctionDefinitionInterface, TackyInstructionInterface, TackyOperator, TackyProgramInterface, TackyReturnInterface, TackyUnaryInterface, TackyVariableInterface } from "../tacky/interfaces";

const astToAssembly = (program: TackyProgramInterface): AssemblyProgramInterface | void => {
  const functionDefinition = convertToAssemblyFunction(program, program.functionDefinition)
  return new AssemblyProgram(functionDefinition)
};

const convertToAssemblyFunction = (program: TackyProgramInterface, tackyFunction: TackyFunctionDefinitionInterface) => {
  const tackyInstructions = tackyFunction.body
  const instructions: AssemblyInstructionInterface[] = []

  tackyInstructions.forEach(f => {
    if (f.type === 'TackyReturn') {
      convertToAssemblyReturn(f as TackyReturnInterface, instructions)
    }

    if (f.type === 'TackyUnary') {
      convertToAssemblyUnary(f as TackyUnaryInterface, instructions)
    }
  })

  const stackMemUsed: number = replacePseudoIdentifiers(instructions)
  fixingUpInstructions(instructions, stackMemUsed)

  return new AssemblyFunctionDefinition(program.functionDefinition.identifier, instructions)
}

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


const getAssemblyUnaryOperator = (tackyUnaryOperator: TackyOperator): AssemblyOperator => {
  switch(tackyUnaryOperator) {
    case TackyOperator.Complement:
      return AssemblyOperator.Complement
    case TackyOperator.Negate:
      return AssemblyOperator.Negate
    default:
      throw new Error('Unsupported unary operator: ' + tackyUnaryOperator)
  }
}

const convertToAssemblyUnary = (inst: TackyUnaryInterface, instructions: AssemblyInstructionInterface[]) => {
  const tackyUnaryOperator = (inst as TackyUnaryInterface).unaryOperator
  const assemblyUnaryOperator = getAssemblyUnaryOperator(tackyUnaryOperator)

  switch (inst.src.type) {
    case 'TackyConstant': {
      const moveInst = new AssemblyMoveInstruction(new AssemblyImmediateValue((inst.src as TackyConstantInterface).value), new AssemblyPseudoIdentifier((inst.dst as TackyVariableInterface).name))
      instructions.push(moveInst)
      instructions.push(new AssemblyUnaryInstruction(assemblyUnaryOperator, moveInst.destination))
      break
    }
    case 'TackyVariable': {
      const moveInst = new AssemblyMoveInstruction(new AssemblyPseudoIdentifier((inst.src as TackyVariableInterface).name), new AssemblyPseudoIdentifier((inst.dst as TackyVariableInterface).name))
      instructions.push(moveInst)
      instructions.push(new AssemblyUnaryInstruction(assemblyUnaryOperator, moveInst.destination))
      break
    }
    default: {
      throw new Error('Unsupported src type: ' + inst.src.type)
    }
  }
}

const replacePseudoIdentifiers = (instructions: AssemblyInstructionInterface[]) => {
  const PseudoToStackMap = new Map<string, AssemblyStackInterface>()
  let currentStackOffset = 0  

  const getStackFromPseudo = (pseudo: string): AssemblyStackInterface => {
    if (!PseudoToStackMap.has(pseudo)) {
      currentStackOffset += 4
      // TODO: Check if the stack offset is too big
      const stack = new AssemblyStack(currentStackOffset)
      PseudoToStackMap.set(pseudo, stack)
    }

    return PseudoToStackMap.get(pseudo)!
  }

  instructions.forEach(i => {
    switch (i.type) {
      case "MoveInstruction": {
        const moveInst = i as AssemblyMoveInstruction
        if (moveInst.source.type === 'PseudoIdentifier') {
          moveInst.source = getStackFromPseudo((moveInst.source as AssemblyPseudoIdentifierInterface).identifier)
        } 
        if (moveInst.destination.type === 'PseudoIdentifier') {
          moveInst.destination = getStackFromPseudo((moveInst.destination as AssemblyPseudoIdentifierInterface).identifier)
        }
        break;
      }

      case "UnaryInstruction": {
        const unaryInst = i as AssemblyUnaryInstruction
        unaryInst.operand = getStackFromPseudo((unaryInst.operand as AssemblyPseudoIdentifierInterface).identifier)
        break
      }
      
      default:
        return
    }
  })

  return currentStackOffset
}

const fixingUpInstructions = (instructions: AssemblyInstructionInterface[], stackMemUsed: number) => {
  instructions.unshift(new AssemblyAllocateStackInstruction(stackMemUsed))

  instructions.forEach((inst, idx) => {
    if (inst.type === 'MoveInstruction') {
      const moveInst = inst as AssemblyMoveInstruction
      if (moveInst.source.type === 'Stack' && moveInst.destination.type === 'Stack') {
        const stepMoveInst = new AssemblyMoveInstruction(moveInst.source, new AssemblyRegister(RegisterName.R10))
        moveInst.source = new AssemblyRegister(RegisterName.R10)
        instructions.splice(idx, 0, stepMoveInst)
      }
    }
  })
}

export default astToAssembly