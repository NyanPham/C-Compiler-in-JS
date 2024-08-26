// Define the types for the AST nodes for assembly language
export interface AssemblyProgramInterface {
    type: "AssemblyProgram",
    functionDefinition: AssemblyFunctionDefinitionInterface,
}

export interface AssemblyFunctionDefinitionInterface {
    type: "AssemblyFunctionDefinition",
    name: string,
    instructions: AssemblyInstructionInterface[]
}

export interface AssemblyInstructionInterface {
    type: "Instruction" | "MoveInstruction" | "ReturnInstruction",
}

export interface AssemblyMoveInstructionInterface extends AssemblyInstructionInterface {
    type: "MoveInstruction",
    source: AssemblyOperandInterface,
    destination: AssemblyOperandInterface,
}

export interface AssemblyReturnInstructionInterface extends AssemblyInstructionInterface {
    type: "ReturnInstruction",
}

export interface AssemblyOperandInterface {
    type: "Operand" | "ImmediateValue" | "Register",
}

export interface AssemblyImmediateValueInterface extends AssemblyOperandInterface {
    type: "ImmediateValue",
    value: number,
}

export interface AssemblyRegisterInterface extends AssemblyOperandInterface {
    type: "Register",
    name: string,
}
