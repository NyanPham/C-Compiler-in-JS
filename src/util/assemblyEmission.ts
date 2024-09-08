import { AssemblyAllocateStackInstructionInterface, AssemblyFunctionDefinitionInterface, AssemblyImmediateValueInterface, AssemblyInstructionInterface, AssemblyMoveInstructionInterface, AssemblyOperandInterface, AssemblyOperator, AssemblyProgramInterface, AssemblyRegisterInterface, AssemblyStackInterface, AssemblyUnaryInstructionInterface, RegisterName } from "../assemblyConstructs/interfaces";

const emitAssemly = (assemblyAst: AssemblyProgramInterface) => {
    let assemblyCode = ``
    
    const functionAssemblyCode = emitFunctionInstructionsCode(assemblyAst.functionDefinition)
    assemblyCode += functionAssemblyCode

    return assemblyCode
}


const emitFunctionInstructionsCode = (functionDefinition: AssemblyFunctionDefinitionInterface) => {
    let assemblyCode = `\n`

    assemblyCode += `\t.globl ${functionDefinition.name}\n`
    assemblyCode += `${functionDefinition.name}:\n`
    assemblyCode += `\t; Prologue: \n`
    assemblyCode += '\tpushq %rbp\n'
    assemblyCode += '\tmovq %rsp, %rbp\n'

    for (const instruction of functionDefinition.instructions) {
        switch(instruction.type) {
            case "AllocateStackInstruction":
                assemblyCode += getAllocateStackInstructionCode(instruction as AssemblyAllocateStackInstructionInterface)
                break
            case "MoveInstruction":
                assemblyCode += getMoveInstructionCode(instruction as AssemblyMoveInstructionInterface)
                break
            case "ReturnInstruction":
                assemblyCode += getReturnInstructionCode()
                break
            case "UnaryInstruction":
                assemblyCode += getUnaryInstructionCode(instruction as AssemblyUnaryInstructionInterface)
                break
            default:
                throw new Error("Unsuppored instruction type: " + instruction.type)
        }
    }

    return assemblyCode
}

const getOperandCode = (operand: AssemblyOperandInterface): string => {
    switch (operand.type) {
        case "Register": {
            const registerOperand = operand as AssemblyRegisterInterface
            if (registerOperand.register === RegisterName.R10) {
                return '%r10d'
            }

            if (registerOperand.register === RegisterName.AX) {
                return '%eax'
            }
        }
        case "Stack": {
            const stackOperand = operand as AssemblyStackInterface
            return `-${stackOperand.offset}(%rbp)`
        }
        case "ImmediateValue":
            return `$${(operand as AssemblyImmediateValueInterface).value}`
    }
    return ''
}

const getUnaryInstructionCode = (instruction: AssemblyUnaryInstructionInterface) => {
    let unaryOperator = ''

    switch (instruction.operator) {
        case AssemblyOperator.Complement:
            unaryOperator = 'notl'
            break
        case AssemblyOperator.Negate:
            unaryOperator = 'negl'
            break
        default:
            throw new Error('Unsupported unary operator: ' + instruction.operator)
    }

    const operand = getOperandCode(instruction.operand)

    return `\t${unaryOperator} ${operand}\n`
}
    
const getAllocateStackInstructionCode = (instruction: AssemblyAllocateStackInstructionInterface) => {
    return `\tsubq $${instruction.size}, %rsp\n\n`
}

const getMoveInstructionCode = (instruction: AssemblyMoveInstructionInterface) => {
    const srcStr = getOperandCode(instruction.source)
    const dstStr = getOperandCode(instruction.destination)

    return `\tmovl ${srcStr}, ${dstStr}\n`
}

const getReturnInstructionCode = () => {
    let assemblyCode = `\n\t; Epilogue: \n`
    assemblyCode += `\tmovq %rbp, %rsp\n`
    assemblyCode += `\tpopq %rbp\n`
    assemblyCode += `\tret\n`
    return assemblyCode
}

export default emitAssemly