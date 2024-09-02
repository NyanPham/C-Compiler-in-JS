export enum TackyOperator {
    Complement = "Complement",
    Negate = "Negate"
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
    type: "TackyInstruction" | "TackyReturn" | "TackyUnary"
}

export interface TackyReturnInterface extends TackyInstructionInterface {
    type: "TackyReturn"
    value: TackyValueInterface
}

export interface TackyUnaryInterface extends TackyInstructionInterface {
    type: "TackyUnary"
    unaryOperator: TackyOperator
    src: TackyValueInterface
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