/**
 * To compile a C file, in terminal, run
 * node compiler.js PATH/TO/FILENAME.c
 */

import { Token } from "./types";

const fs = require('fs');
const tokenize = require("./lexer.ts")

const compile = (input: string): Array<Token> => {
    const tokens = tokenize(input)
    console.log(tokens)
    return tokens
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
