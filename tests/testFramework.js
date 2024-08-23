const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const testsFolder = process.argv[2];
if (!testsFolder) {
  console.error('Error: testsFolder is required as a command-line argument');
  process.exit(1);
}

let testCount = 0;
let passCount = 0;
let failCount = 0;
let warningCount = 0;
let warningFilePaths = [];
let results = {};

fs.readdirSync(testsFolder).forEach((subfolder) => {
  const subfolderPath = path.join(testsFolder, subfolder);
  if (fs.statSync(subfolderPath).isDirectory()) {
    fs.readdirSync(subfolderPath).forEach((file) => {
      if (path.extname(file) === '.c') {
        const filePath = path.join(subfolderPath, file);
        const command = `node ../compiler.js ${filePath}`;
        testCount++;
        console.log(`Running test: ${subfolder}/${file}`);
        try {
          const output = childProcess.execSync(command, { encoding: 'utf8' });
          if (output && subfolder.startsWith('valid')) {
            passCount++;
            results[`${subfolder}/${file}`] = output.trim();
            console.log(`  PASS`);
          } else if (output && subfolder.startsWith('invalid')) {
            warningCount++;
            results[`${subfolder}/${file}`] = output.trim();
            warningFilePaths.push(`${subfolder}/${file}`);
            console.log(`  WARNING: No errors occurred, scrutinize more`);
          } else {
            failCount++;
            console.log(`  FAIL`);
          }
        } catch (error) {
          if (subfolder.startsWith('invalid')) {
            passCount++;
            console.log(`  PASS`);
          } else {
            failCount++;
            console.log(`  FAIL`);
          }
        }
      }
    });
  }
});

console.log(results)

console.log(`Test Summary:`);
console.log(`  Total Tests: ${testCount}`);
console.log(`  Passed: ${passCount}`);
console.log(`  Failed: ${failCount}`);
console.log(`  Warnings: ${warningCount}`);

if (warningFilePaths.length > 0) {
  console.log('Warning File Paths:');
  warningFilePaths.forEach((filePath) => {
    console.log(`  ${filePath}`);
  });
}

const resultsFile = `${testsFolder}.json`;
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
console.log(`Results saved to ${resultsFile}`);