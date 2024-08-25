import { ConstantExpressionInterface, ProgramInterface } from "../ast/interfaces"

module.exports = (program : ProgramInterface) => {
    const functions = program.body
    
    console.log(`${program.type}(
${functions.map(func => {
    return `    ${func.type}(
        name="${func.name.name}"
        body=${func.body.map(statement => {
            return `${statement.type}(
                ${statement.argument.type}${statement.argument.type === "ConstantExpression" ? `(${(statement.argument as ConstantExpressionInterface).value})` : ""}
            )`
        })}
    )`
})}
)`)
}