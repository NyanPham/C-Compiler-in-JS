import { ConstantExpressionInterface, ExpressionInterface, FunctionDefinitionInterface, ProgramInterface, ReturnStatementInterface, UnaryOperatorExpressionInterface } from "../ast/interfaces";
import { Operator } from "../types";
import { TackyConstant, TackyFunctionDefinition, TackyProgram, TackyReturn, TackyUnary, TackyVariable } from "./ast";
import { TackyInstructionInterface, TackyOperator, TackyProgramInterface } from "./interfaces";

const emitTacky = (e: ExpressionInterface, instructions: TackyInstructionInterface[]) => {
    switch (e.type) {
        case "ConstantExpression": {
            return new TackyConstant((e as ConstantExpressionInterface).value)
        } 
        case "UnaryOperatorExpression": {
            const exp = e as UnaryOperatorExpressionInterface
            const src = emitTacky(exp.argument, instructions)
            const dstName = makeTemporary()
            const dst = new TackyVariable(dstName)
            const tackyOp = convertUneryOperator(exp.operator)
            instructions.push(new TackyUnary(tackyOp, src, dst))

            return dst            
        }
        default:
            throw new Error("Unsupported expression type: " + e.type)
    }
}

const emitReturnTacky = (e: ReturnStatementInterface, instructions: TackyInstructionInterface[]) => {
    const returnVal = emitTacky(e.argument as ExpressionInterface, instructions)
    instructions.push(new TackyReturn(returnVal))
}


const convertUneryOperator = (op: Operator) => {
    switch (op) {
        case Operator.Complement:
            return TackyOperator.Complement
        case Operator.Negate:
            return TackyOperator.Negate
        default:
            throw new Error("Unsupported unary operator: " + op)
    }
}

let counter = 0
const makeTemporary = () : string => {
    return `tmp.${counter++}`
}

const emitTackyProgram = (p: ProgramInterface) : TackyProgramInterface => {
    const instructions: TackyInstructionInterface[] = []
    const astFunction = (p.body as FunctionDefinitionInterface[])[0]

    for (const s of astFunction.body) {
        if (s.type === "ReturnStatement") {
            emitReturnTacky(s as ReturnStatementInterface, instructions)
        }
        else if (s.type === "Statement") {
            if (s.argument)
                emitTacky(s.argument as ExpressionInterface, instructions)
        }
    }
    
    const tackyFunction = new TackyFunctionDefinition(astFunction.name.name, instructions)
    return new TackyProgram(tackyFunction)
}

export default emitTackyProgram