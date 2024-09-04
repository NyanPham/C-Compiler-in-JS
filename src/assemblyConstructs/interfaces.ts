// Define the types for the AST nodes for assembly language

export enum AssemblyOperator {
    Complement = "Not",
    Negate = "Neg"
}

export enum RegisterName {
    AX = 'AX',
    R10 = 'R10',
}

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
    type: "Instruction" | "MoveInstruction" | "ReturnInstruction" | "UnaryInstruction" | "AllocateStackInstruction",
}

export interface AssemblyUnaryInstructionInterface {
    type: "UnaryInstruction",
    operator: AssemblyOperator,
    operand: AssemblyOperandInterface,
}

export interface AssemblyAllocateStackInstructionInterface extends AssemblyInstructionInterface {
    type: "AllocateStackInstruction",
    size: number,
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
    type: "Operand" | "ImmediateValue" | "Register" | "PseudoIdentifier" | "Stack",
}

export interface AssemblyImmediateValueInterface extends AssemblyOperandInterface {
    type: "ImmediateValue",
    value: number,
}

export interface AssemblyRegisterInterface extends AssemblyOperandInterface {
    type: "Register",
    register: RegisterName
}

export interface AssemblyPseudoIdentifierInterface extends AssemblyOperandInterface {
    type: "PseudoIdentifier",
    identifier: string,
}

export interface AssemblyStackInterface extends AssemblyOperandInterface {
    type: "Stack",
    offset: number
}