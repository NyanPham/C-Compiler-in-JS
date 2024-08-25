# Improving My Skills: A C Compiler in JavaScript
==============================================

I'm working on a C compiler written in JavaScript, following the book "Writing a C Compiler" by Nora Sandler. The goal is to improve my skills and knowledge in programming languages and compiler design.

## Overview

The project aims to create a C compiler from scratch using JavaScript. The compiler will take C source code as input and generate machine code as output.

## Features

- [ ] Lexical analysis: breaking the source code into tokens
- [ ] Syntax analysis: parsing the tokens into an abstract syntax tree (AST)
- [ ] Semantic analysis: analyzing the AST for semantic errors
- [ ] Code generation: generating machine code from the AST

## Progress

Currently working on: lexical analysis

Next step: syntax analysis

## Dependencies

- JavaScript (ECMAScript 2020 or later)
- NodeJS

## Building and Running

To build and run the compiler, follow these steps:

1. Clone the repository: `git clone https://github.com/NyanPham/C-Compiler-in-JS.git`
2. Install dependencies: `npm install`
3. Run the compiler: `npm start PATH/TO/C/FILE`

The repository comes with a test suite from Nora Sandler. I've tailored these with a simple test framework to run on NodeJS, but the files to test remain unchanged. To test the compiler, run the command: 

`npm test FOLDER/OF/CHAPTER`

The test will run all C files in the specified folder and report results in JSON format.

## Contributing

Contributions are welcome! If you'd like to help with the project, please fork the repository and submit a pull request.

## Acknowledgments

- Nora Sandler, author of "Writing a C Compiler"


