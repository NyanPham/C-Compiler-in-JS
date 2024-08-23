/**
 * To compile a C file, in terminal, run
 * node compiler.js PATH/TO/FILENAME.c
 */

const fs = require('fs');
const tokenize = require("./lexer.js")

const compile = (data) => {
    const tokens = tokenize(data)
    console.log(tokens)
    return tokens
}

if (process.argv.length < 3) {
    console.log("Usage: pseudo-compiler <FILENAME>")
    return;
}

const testFilePath = process.argv[2]; // Get the file path from command line arguments
fs.readFile(testFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    compile(data)
});
