import { TackyConstantInterface, TackyFunctionDefinitionInterface, TackyInstructionInterface, TackyUnaryOperator_t, TackyProgramInterface, TackyReturnInterface, TackyUnaryInterface, TackyValueInterface, TackyVariableInterface, TackyBinaryInterface, TackyBinaryOperator_t } from "./interfaces"

export class TackyProgram implements TackyProgramInterface {
    type: "TackyProgram" = "TackyProgram"
    constructor(public functionDefinition: TackyFunctionDefinition) {}
}

export class TackyFunctionDefinition implements TackyFunctionDefinitionInterface {
    type: "TackyFunctionDefinition" = "TackyFunctionDefinition"
    constructor(public identifier: string, public body: TackyInstructionInterface[]) {}
}

export class TackyReturn implements TackyReturnInterface {
    type: "TackyReturn" = "TackyReturn"
    constructor(public value: TackyValue) {}
}

export class TackyUnary implements TackyUnaryInterface {
    type: "TackyUnary" = "TackyUnary"
    constructor(public unaryOperator: TackyUnaryOperator_t, public src: TackyValue, public dst: TackyValue) {}
}

export class TackyBinary implements TackyBinaryInterface {
    type: "TackyBinary" = "TackyBinary"
    constructor(public binaryOperator: TackyBinaryOperator_t, public src1: TackyValue, public src2: TackyValue, public dst: TackyValue) {}
}

export class TackyValue implements TackyValueInterface {
    type: "TackyValue" | "TackyConstant" | "TackyVariable" = "TackyValue"
}

export class TackyConstant extends TackyValue implements TackyConstantInterface {
    type: "TackyConstant" = "TackyConstant"
    constructor(public value: number) {
        super()
    }
}

export class TackyVariable extends TackyValue implements TackyVariableInterface {
    type: "TackyVariable" = "TackyVariable"
    constructor(public name: string) {
        super()
    }
}