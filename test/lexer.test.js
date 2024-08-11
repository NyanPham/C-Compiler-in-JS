const { lexer } = require("../lexer.js");

const inputCode = 'int main(void) { return 0; }';
const tokens = lexer(inputCode);
console.log(tokens);