import { AssemblyImmediateValueInterface, AssemblyInstructionInterface, AssemblyMoveInstructionInterface, AssemblyOperandInterface, AssemblyProgramInterface, AssemblyRegisterInterface } from "../assemblyConstructs/interfaces";

const emitAssemly = (assemblyAst: AssemblyProgramInterface) => {
    let assemblyCode = ``

    assemblyCode += `\t.globl ${assemblyAst.functionDefinition.name}\n`
    assemblyCode += `${assemblyAst.functionDefinition.name}:\n`
    for (const instruction of assemblyAst.functionDefinition.instructions) {
        switch(instruction.type) {
            case "MoveInstruction":
                assemblyCode += getMoveInstructionCode(instruction as AssemblyMoveInstructionInterface)
                break
            case "ReturnInstruction":
                assemblyCode += getReturnInstructionCode()
                break
            default:
                throw new Error("Unsuppored instruction type: " + instruction.type)
        }
    }

    return assemblyCode
}

const getMoveInstructionCode = (instruction: AssemblyMoveInstructionInterface) => {
    const srcStr = getOperandCode(instruction.source)
    const dstStr = getOperandCode(instruction.destination)

    return `\tmov ${srcStr}, ${dstStr}\n`
}

const getOperandCode = (operand: AssemblyOperandInterface) => {
    switch(operand.type) {
        case "Register":
            return `%${(operand as AssemblyRegisterInterface).name}`
        case "ImmediateValue":
            return `$${(operand as AssemblyImmediateValueInterface).value}`
        default:
            throw new Error("Unsupported operand type: " + operand.type)
    }
}

const getReturnInstructionCode = () => {
    return '\tret\n'
}

export default emitAssemly