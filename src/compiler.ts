/**
 * To compile a C file, in terminal, run
 * node compiler.js PATH/TO/FILENAME.c
 */

import { AssemblyProgramInterface } from "./assemblyConstructs/interfaces";
import { ProgramInterface } from "./ast/interfaces";
import astToAssembly from "./util/convertAstToAssemblyConstructs";
import { parseReturnType, Token } from "./types";
import emitAssemly from "./util/assemblyEmission";

const fs = require('fs');
const tokenize = require("./lexer.ts")
const parse = require('./parser.ts')

const { prettyPrintAst } = require('./util/prettyPrinter.ts')

const compile = (input: string): ProgramInterface | void => {
    try {   
        const tokens : Array<Token> = tokenize(input)
        console.log(tokens)
        // const ast : ProgramInterface = parse(tokens)
        // const assemblyAst : AssemblyProgramInterface = astToAssembly(ast)
        // const assembly = emitAssemly(assemblyAst)
        // console.log(assembly)
        // prettyPrintAst(ast)emitAssemly
        
    } catch (err) {
        if (err instanceof Error)
            console.log(`Compile Error: ${err.message}`)
        else   
            console.log(`Compile Error: ${err}`)
        process.exit(1)
    }
}

if (process.argv.length < 3) {
    console.log("Usage: pseudo-compiler <FILENAME>")
    process.exit(1)
}

const testFilePath = process.argv[2]; // Get the file path from command line arguments
fs.readFile(testFilePath, 'utf8', (err: Error, data: string) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    compile(data)
});
