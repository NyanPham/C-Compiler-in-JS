import { ConstantExpressionInterface, ProgramInterface } from "../ast/interfaces"

const prettyPrintAst = (program : ProgramInterface) => {
    const functions = program.body
    
    console.log(`${program.type}(
${functions.map(func => {
    return `    ${func.type}(
        name="${func.name.name}"
        body=${func.body.map(statement => {
            return `${statement.type}(
                ${statement.argument?.type}${statement.argument?.type === "ConstantExpression" ? `(${(statement.argument as ConstantExpressionInterface).value})` : ""}
            )`
        })}
    )`
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