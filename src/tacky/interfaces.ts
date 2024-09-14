export enum TackyUnaryOperator_t {
    Complement = "Complement",
    Negate = "Negate"
}

export enum TackyBinaryOperator_t {
    Add = "Add",
    Subtract = "Subtract",
    Multiply = "Multiply",
    Divide = "Divide",
    Remainder = "Remainder",
}

export interface TackyProgramInterface {
    type: "TackyProgram"
    functionDefinition: TackyFunctionDefinitionInterface
}

export interface TackyFunctionDefinitionInterface {
    type: "TackyFunctionDefinition"
    identifier: string
    body: TackyInstructionInterface[]
}

export interface TackyInstructionInterface {
    type: "TackyInstruction" | "TackyReturn" | "TackyUnary" | "TackyBinary"
}

export interface TackyReturnInterface extends TackyInstructionInterface {
    type: "TackyReturn"
    value: TackyValueInterface
}

export interface TackyUnaryInterface extends TackyInstructionInterface {
    type: "TackyUnary"
    unaryOperator: TackyUnaryOperator_t
    src: TackyValueInterface
    dst: TackyValueInterface
}

export interface TackyBinaryInterface extends TackyInstructionInterface {
    type: "TackyBinary"
    binaryOperator: TackyBinaryOperator_t
    src1: TackyValueInterface
    src2: TackyValueInterface
    dst: TackyValueInterface
}


export interface TackyValueInterface {
    type: "TackyValue" | "TackyConstant" | "TackyVariable"
}

export interface TackyConstantInterface extends TackyValueInterface {
    type: "TackyConstant"
    value: number
}

export interface TackyVariableInterface extends TackyValueInterface {
    type: "TackyVariable"
    name: string
}