import { AssemblyProgramInterface, AssemblyFunctionDefinitionInterface, AssemblyInstructionInterface, AssemblyMoveInstructionInterface, AssemblyReturnInstructionInterface, AssemblyOperandInterface, AssemblyImmediateValueInterface, AssemblyRegisterInterface, RegisterName, AssemblyUnaryInstructionInterface, AssemblyUnaryOperator_t, AssemblyAllocateStackInstructionInterface, AssemblyStackInterface, AssemblyPseudoIdentifierInterface, AssemblyBinaryInstructionInterface, AssemblyBinaryOperator_t, AssemblyIDivInstructionInterface, AssemblyCdqInstructionInterface } from "./interfaces";

export class AssemblyProgram implements AssemblyProgramInterface {
    type: "AssemblyProgram" = "AssemblyProgram";
    functionDefinition: AssemblyFunctionDefinitionInterface;

    constructor(functionDefinition: AssemblyFunctionDefinitionInterface) {
        this.functionDefinition = functionDefinition;
    }
}

export class AssemblyFunctionDefinition implements AssemblyFunctionDefinitionInterface {
    type: "AssemblyFunctionDefinition" = "AssemblyFunctionDefinition";
    name: string;
    instructions: AssemblyInstructionInterface[];

    constructor(name: string, instructions: AssemblyInstructionInterface[]) {
        this.name = name;
        this.instructions = instructions;
    }
}

export class AssemblyMoveInstruction implements AssemblyMoveInstructionInterface {
    type: "MoveInstruction" = "MoveInstruction";
    source: AssemblyOperandInterface;
    destination: AssemblyOperandInterface;  
    constructor(source: AssemblyOperandInterface, destination: AssemblyOperandInterface) {
        this.source = source;
        this.destination = destination;
    }
}

export class AssemblyReturnInstruction implements AssemblyReturnInstructionInterface {
    type: "ReturnInstruction" = "ReturnInstruction";

    constructor() {}
}

export class AssemblyImmediateValue implements AssemblyImmediateValueInterface {
    type: "ImmediateValue" = "ImmediateValue";
    value: number;

    constructor(value: number) {
        this.value = value;
    }
}

export class AssemblyRegister implements AssemblyRegisterInterface {
    type: "Register" = "Register";
    register: RegisterName;

    constructor(register: string) {
        this.register = register as RegisterName;
    }
}

export class AssemblyUnaryInstruction implements AssemblyUnaryInstructionInterface {
    type: "UnaryInstruction" = "UnaryInstruction";
    operator: AssemblyUnaryOperator_t;
    operand: AssemblyOperandInterface;

    constructor(operator: AssemblyUnaryOperator_t, operand: AssemblyOperandInterface) {
        this.operator = operator;
        this.operand = operand;
    }
}

export class AssemblyBinaryInstruction implements AssemblyBinaryInstructionInterface {
    type: "BinaryInstruction" = "BinaryInstruction";
    operator: AssemblyBinaryOperator_t;
    srcOperand: AssemblyOperandInterface;
    dstOperand: AssemblyOperandInterface;

    constructor(operator: AssemblyBinaryOperator_t, srcOperand: AssemblyOperandInterface, dstOperand: AssemblyOperandInterface) {
        this.operator = operator;
        this.srcOperand = srcOperand;
        this.dstOperand = dstOperand;
    }
}

export class AssemblyIDivInstruction implements AssemblyIDivInstructionInterface {
    type: "Idiv" = "Idiv";
    operand: AssemblyOperandInterface;


    constructor(operand: AssemblyOperandInterface) {
        this.operand = operand;
    }
}

export class AssemblyCdqInstruction implements AssemblyCdqInstructionInterface {
    type: "Cdq" = "Cdq";
}

export class AssemblyAllocateStackInstruction implements AssemblyAllocateStackInstructionInterface {
    type: "AllocateStackInstruction" = "AllocateStackInstruction";
    size: number;
    
    constructor(size: number) {
        this.size = size;
    }
}

export class AssemblyPseudoIdentifier implements AssemblyPseudoIdentifierInterface {
    type: "PseudoIdentifier" = "PseudoIdentifier";
    identifier: string;

    constructor(identifier: string) {
        this.identifier = identifier;
    }
}

export class AssemblyStack implements AssemblyStackInterface {
    type: "Stack" = "Stack";
    offset: number;

    constructor(offset: number) {
        this.offset = offset;
    }
}