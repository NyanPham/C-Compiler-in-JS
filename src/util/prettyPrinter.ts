import { ConstantExpressionInterface, ExpressionInterface, ProgramInterface, StatementInterface, UnaryOperatorExpressionInterface } from "../ast/interfaces"

const printUnaryOperator = (operator: UnaryOperatorExpressionInterface, indexLevel: number): string => {
    return (`${operator.operator}(${printExpression(operator.argument, indexLevel + 1)})`
    )
}

const printExpression = (expression : ExpressionInterface, indexLevel: number): string => {
    const indent = " ".repeat(indexLevel * 2);

    if (expression.type === "ConstantExpression") {
        return `${indent}${expression.type}(${expression.type === "ConstantExpression" ? `(${(expression as ConstantExpressionInterface).value})` : ""})` 
    } else if (expression.type === "UnaryOperatorExpression") {
        return `${indent}${printUnaryOperator(expression as UnaryOperatorExpressionInterface, indexLevel)}`
    } else {
        return ""
    }
}

const printStatement = (statement : StatementInterface, indexLevel: number): string => {
    const indent = " ".repeat(indexLevel * 2);

    return  `${indent}${statement.type}(${printExpression(statement.argument as ExpressionInterface, indexLevel + 1)})`
}

const prettyPrintAst = (program : ProgramInterface) => {
    const functions = program.body
    
    console.log(
`${program.type}(
${functions.map(func => {
    return `\t${func.type}(
        \t\tname="${func.name.name}"
        \t\tbody=${func.body.map(statement => printStatement(statement, 2)).join(",\n")}
        \t\t
    \t)`
})}
)`)
}

// const prettyPrintAssemblyConstruct = (program: AssemblyInterface.ProgramInterface) => {
//     const functionDefinition = program.functionDefinition

//     console.log(`${functionDefinition.type}(
//     name="${functionDefinition.name}"
//     instructions=${functionDefinition.instructions.map((instruction : AssemblyInterface.InstructionInterface) => {
//         return `${instruction.type}(
//             ${instruction.type === "MoveInstruction" ? `source=${(instruction as AssemblyInterface.MoveInstructionInterface).source.type}, destination=${(instruction as AssemblyInterface.MoveInstructionInterface).destination.type}` : ""}
//             ${instruction.type === "ReturnInstruction" ? "Return" : ""}
//         )`
//     })})`)
// }   

module.exports = {
    prettyPrintAst,
}