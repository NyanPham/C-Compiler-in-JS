// Define the types for the AST nodes for assembly language

export enum AssemblyUnaryOperator_t {
    Complement = "Not",
    Negate = "Neg"
}

// Note: Divide and Remainer operators are handled execeptionally
export enum AssemblyBinaryOperator_t {
    Add = "Add",
    Subtract = "Sub",
    Multiply = "Mult",
    // Divide = "Divide", 
    // Remainder = "Remainder",
}

export enum RegisterName {
    AX = 'AX',
    DX = 'DX',
    R10 = 'R10',
    R11 = 'R11',
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
    type: "Instruction" | "MoveInstruction" | "ReturnInstruction" | "UnaryInstruction" | "BinaryInstruction" | "Idiv" | "Cdq" | "AllocateStackInstruction",
}

export interface AssemblyUnaryInstructionInterface {
    type: "UnaryInstruction",
    operator: AssemblyUnaryOperator_t,
    operand: AssemblyOperandInterface,
}

export interface AssemblyBinaryInstructionInterface {
    type: "BinaryInstruction",
    operator: AssemblyBinaryOperator_t,
    srcOperand: AssemblyOperandInterface,
    dstOperand: AssemblyOperandInterface,
}

export interface AssemblyIDivInstructionInterface extends AssemblyInstructionInterface {
    type: "Idiv",
    operand: AssemblyOperandInterface
}

export interface AssemblyCdqInstructionInterface extends AssemblyInstructionInterface {
    type: "Cdq",
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