import { AssemblyProgramInterface, AssemblyFunctionDefinitionInterface, AssemblyInstructionInterface, AssemblyMoveInstructionInterface, AssemblyReturnInstructionInterface, AssemblyOperandInterface, AssemblyImmediateValueInterface, AssemblyRegisterInterface } from "./interfaces";

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
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}
