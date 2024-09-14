import { BinaryOperatorExpressionInterface, ConstantExpressionInterface, ExpressionInterface, FunctionDefinitionInterface, ProgramInterface, ReturnStatementInterface, UnaryOperatorExpressionInterface } from "../ast/interfaces";
import { BinaryOperator_t, UnaryOperator_t } from "../types";
import { TackyBinary, TackyConstant, TackyFunctionDefinition, TackyProgram, TackyReturn, TackyUnary, TackyVariable } from "./ast";
import { TackyInstructionInterface, TackyUnaryOperator_t, TackyProgramInterface, TackyBinaryOperator_t } from "./interfaces";

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
            const tackyOp : TackyUnaryOperator_t = convertUneryOperator(exp.operator)
            instructions.push(new TackyUnary(tackyOp, src, dst))

            return dst            
        }
        case "BinaryOperatorExpression": {
            const exp = e as BinaryOperatorExpressionInterface
            const v1 = emitTacky(exp.left, instructions)
            const v2 = emitTacky(exp.right, instructions)
            const dstName = makeTemporary()
            const dst = new TackyVariable(dstName)
            const tackyOp : TackyBinaryOperator_t = convertBinaryOperator(exp.operator)
            instructions.push(new TackyBinary(tackyOp, v1, v2, dst))
            
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


const convertUneryOperator = (op: UnaryOperator_t) => {
    switch (op) {
        case UnaryOperator_t.Complement:
            return TackyUnaryOperator_t.Complement
        case UnaryOperator_t.Negate:
            return TackyUnaryOperator_t.Negate
        default:
            throw new Error("Unsupported unary operator: " + op)
    }
}

const convertBinaryOperator = (op: BinaryOperator_t) => {
    switch (op) {
        case BinaryOperator_t.Add:
            return TackyBinaryOperator_t.Add
        case BinaryOperator_t.Subtract:
            return TackyBinaryOperator_t.Subtract
        case BinaryOperator_t.Multiply:
            return TackyBinaryOperator_t.Multiply
        case BinaryOperator_t.Divide:
            return TackyBinaryOperator_t.Divide
        case BinaryOperator_t.Remainder:
            return TackyBinaryOperator_t.Remainder
        default:
            throw new Error("Unsupported binary operator: " + op)
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