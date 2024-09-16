import { AssemblyAllocateStackInstruction, AssemblyBinaryInstruction, AssemblyCdqInstruction, AssemblyFunctionDefinition, AssemblyIDivInstruction, AssemblyImmediateValue, AssemblyMoveInstruction, AssemblyProgram, AssemblyPseudoIdentifier, AssemblyRegister, AssemblyReturnInstruction, AssemblyStack, AssemblyUnaryInstruction } from "../assemblyConstructs/constructs";
import { AssemblyInstructionInterface, AssemblyUnaryOperator_t, AssemblyProgramInterface, AssemblyPseudoIdentifierInterface, AssemblyStackInterface, RegisterName, AssemblyBinaryOperator_t, AssemblyOperandInterface, AssemblyImmediateValueInterface } from "../assemblyConstructs/interfaces";
import { TackyConstantInterface, TackyFunctionDefinitionInterface, TackyInstructionInterface, TackyUnaryOperator_t, TackyProgramInterface, TackyReturnInterface, TackyUnaryInterface, TackyVariableInterface, TackyBinaryInterface, TackyBinaryOperator_t, TackyValueInterface } from "../tacky/interfaces";

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

    if (f.type == 'TackyBinary') {
      convertToAssemblyBinary(f as TackyBinaryInterface, instructions)
    }
  })

  const stackMemUsed: number = replacePseudoIdentifiers(instructions)
  const instructionsWithStackMem = fixingUpInstructions(instructions, stackMemUsed)

  return new AssemblyFunctionDefinition(program.functionDefinition.identifier, instructionsWithStackMem)
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


const getAssemblyUnaryOperator = (tackyUnaryOperator: TackyUnaryOperator_t): AssemblyUnaryOperator_t => {
  switch(tackyUnaryOperator) {
    case TackyUnaryOperator_t.Complement:
      return AssemblyUnaryOperator_t.Complement
    case TackyUnaryOperator_t.Negate:
      return AssemblyUnaryOperator_t.Negate
    default:
      throw new Error('Unsupported unary operator: ' + tackyUnaryOperator)
  }
}

const getAssemblyBinaryOperator = (tackyBinaryOperator: TackyBinaryOperator_t) : AssemblyBinaryOperator_t => {
  switch(tackyBinaryOperator) {
      case TackyBinaryOperator_t.Add:
        return AssemblyBinaryOperator_t.Add
      case TackyBinaryOperator_t.Subtract:
        return AssemblyBinaryOperator_t.Subtract
      case TackyBinaryOperator_t.Multiply:
        return AssemblyBinaryOperator_t.Multiply
      // case TackyBinaryOperator_t.Divide:
      //   return AssemblyBinaryOperator_t.Divide
      // case TackyBinaryOperator_t.Remainder:
      //   return AssemblyBinaryOperator_t.Remainder
      default:
        throw new Error('Unsupported binary operator: ' + tackyBinaryOperator)
  }
}

const convertToAsmOperand = (value: TackyValueInterface) : AssemblyOperandInterface => {
  switch (value.type) {
    case 'TackyConstant': {
      return new AssemblyImmediateValue((value as TackyConstantInterface).value)
    }
    case 'TackyVariable': {
      return new AssemblyPseudoIdentifier((value as TackyVariableInterface).name)
    }
    default: 
      throw new Error('Unsupported operand type: ' + value.type)
  }
}

const convertToAssemblyDivide = (inst: TackyBinaryInterface, instructions: AssemblyInstructionInterface[]) => {
  const moveInst = new AssemblyMoveInstruction(convertToAsmOperand(inst.src1), new AssemblyRegister(RegisterName.AX))
  const cdq = new AssemblyCdqInstruction()
  const idiv = new AssemblyIDivInstruction(convertToAsmOperand(inst.src2))
  const moveInst2 = new AssemblyMoveInstruction(new AssemblyRegister(RegisterName.AX), convertToAsmOperand(inst.dst))

  instructions.push(moveInst, cdq, idiv, moveInst2)
}

const convertToAssemblyRemainder = (inst: TackyBinaryInterface, instructions: AssemblyInstructionInterface[]) => {
  const moveInst = new AssemblyMoveInstruction(convertToAsmOperand(inst.src1), new AssemblyRegister(RegisterName.AX))
  const cdq = new AssemblyCdqInstruction()
  const idiv = new AssemblyIDivInstruction(convertToAsmOperand(inst.src2))
  const moveInst2 = new AssemblyMoveInstruction(new AssemblyRegister(RegisterName.DX), convertToAsmOperand(inst.dst))
  
  instructions.push(moveInst, cdq, idiv, moveInst2)
}

const convertToAssemblyOrdinaryBinary = (inst: TackyBinaryInterface, instructions: AssemblyInstructionInterface[]) => {
  const asmBinaryOperator = getAssemblyBinaryOperator(inst.operator)

  const dst = new AssemblyPseudoIdentifier((inst.dst as TackyVariableInterface).name)
  const moveInst = new AssemblyMoveInstruction(convertToAsmOperand(inst.src1), dst)
  instructions.push(moveInst)

  const binaryInst = new AssemblyBinaryInstruction(asmBinaryOperator, convertToAsmOperand(inst.src2), dst);
  instructions.push(binaryInst);
}


const convertToAssemblyBinary = (inst: TackyBinaryInterface, instructions: AssemblyInstructionInterface[]) => {
  if (inst.operator === TackyBinaryOperator_t.Divide) {
    return convertToAssemblyDivide(inst, instructions)
  } 

  if (inst.operator === TackyBinaryOperator_t.Remainder) {
    return convertToAssemblyRemainder(inst, instructions)
  } 

  convertToAssemblyOrdinaryBinary(inst, instructions) 
}

const convertToAssemblyUnary = (inst: TackyUnaryInterface, instructions: AssemblyInstructionInterface[]) => {
  const tackyUnaryOperator = inst.operator
  const assemblyUnaryOperator = getAssemblyUnaryOperator(tackyUnaryOperator)

  const moveInst = new AssemblyMoveInstruction(convertToAsmOperand(inst.src), new AssemblyPseudoIdentifier((inst.dst as TackyVariableInterface).name))
  instructions.push(moveInst)
  instructions.push(new AssemblyUnaryInstruction(assemblyUnaryOperator, moveInst.destination))
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

      case "Idiv": {
        const idivInst = i as AssemblyIDivInstruction
        idivInst.operand = getStackFromPseudo((idivInst.operand as AssemblyPseudoIdentifierInterface).identifier)
        break
      }

      case "BinaryInstruction": {
        const binaryInst = i as AssemblyBinaryInstruction

        if (binaryInst.srcOperand.type === 'PseudoIdentifier') {
          binaryInst.srcOperand = getStackFromPseudo((binaryInst.srcOperand as AssemblyPseudoIdentifierInterface).identifier)
        } else if (binaryInst.srcOperand.type === 'ImmediateValue') {
          binaryInst.srcOperand = new AssemblyImmediateValue((binaryInst.srcOperand as AssemblyImmediateValueInterface).value)
        }

        binaryInst.dstOperand = getStackFromPseudo((binaryInst.dstOperand as AssemblyPseudoIdentifierInterface).identifier)
        break
      }
      
      default:
        return
    }
  })

  return currentStackOffset
}

const fixingUpInstructions = (instructions: AssemblyInstructionInterface[], stackMemUsed: number) => {
  const newInstructions: AssemblyInstructionInterface[] = [new AssemblyAllocateStackInstruction(stackMemUsed)]

  instructions.forEach((inst) => {
    if (inst.type === 'MoveInstruction') {
      const moveInst = inst as AssemblyMoveInstruction
      if (moveInst.source.type === 'Stack' && moveInst.destination.type === 'Stack') {
        const stepMoveInst = new AssemblyMoveInstruction(moveInst.source, new AssemblyRegister(RegisterName.R10))
        moveInst.source = new AssemblyRegister(RegisterName.R10)
        newInstructions.push(stepMoveInst)
      }

      newInstructions.push(moveInst)
      return
    }

    if (inst.type === 'BinaryInstruction') {
      const binaryInst = inst as AssemblyBinaryInstruction
      if (
        (binaryInst.operator === AssemblyBinaryOperator_t.Add || binaryInst.operator === AssemblyBinaryOperator_t.Subtract) 
        && binaryInst.srcOperand.type === 'Stack' 
        && binaryInst.dstOperand.type === 'Stack'
      ) {
        const stepMoveInst = new AssemblyMoveInstruction(binaryInst.srcOperand, new AssemblyRegister(RegisterName.R10))
        binaryInst.srcOperand = new AssemblyRegister(RegisterName.R10)
        newInstructions.push(stepMoveInst)
        newInstructions.push(binaryInst)

        return 
      }

      if (binaryInst.operator === AssemblyBinaryOperator_t.Multiply && binaryInst.dstOperand.type === 'Stack') {
        const stack = binaryInst.dstOperand as AssemblyStackInterface

        const stepMoveInst = new AssemblyMoveInstruction(binaryInst.dstOperand, new AssemblyRegister(RegisterName.R11))
        binaryInst.dstOperand = new AssemblyRegister(RegisterName.R11)
        const stepMoveInst2 = new AssemblyMoveInstruction(new AssemblyRegister(RegisterName.R11), stack)

        newInstructions.push(stepMoveInst)
        newInstructions.push(binaryInst)
        newInstructions.push(stepMoveInst2)

        return;
      }
      
      newInstructions.push(binaryInst)
      return;
    }

    if (inst.type === 'Idiv') {
      const idivInst = inst as AssemblyIDivInstruction
      if (idivInst.operand.type === 'ImmediateValue') {
        const stepMoveInst = new AssemblyMoveInstruction(idivInst.operand, new AssemblyRegister(RegisterName.R10))
        idivInst.operand = new AssemblyRegister(RegisterName.R10)
        newInstructions.push(stepMoveInst)
      }

      newInstructions.push(idivInst)
      return 
    } 
    
    newInstructions.push(inst)
  })

  return newInstructions
}

export default astToAssembly