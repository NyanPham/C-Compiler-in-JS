const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const testsFolder = path.join(__dirname, process.argv[2]);
if (!testsFolder) {
  console.error('Error: testsFolder is required as a command-line argument');
  process.exit(1);
}

const testResults = {
  pass: 0,
  fail: 0,
  warning: 0,
  warningFilePaths: [],
  results: {},
};

fs.readdirSync(testsFolder).forEach((subfolder) => {
  const subfolderPath = path.join(testsFolder, subfolder);
  if (fs.statSync(subfolderPath).isDirectory()) {
    fs.readdirSync(subfolderPath).forEach((file) => {
      if (path.extname(file) === '.c') {
        const filePath = path.join(subfolderPath, file);
        const command = `npm start ${filePath}`;
        console.log(`Running test: ${subfolder}/${file}`);
        try {
          const output = childProcess.execSync(command, { encoding: 'utf8' });
          if (output && subfolder.startsWith('valid')) {
            testResults.pass++;
            testResults.results[`${subfolder}/${file}`] = output.trim();
            console.log(`  PASS`);
          } else if (output && subfolder.startsWith('invalid')) {
            testResults.warning++;
            testResults.results[`${subfolder}/${file}`] = output.trim();
            testResults.warningFilePaths.push(`${subfolder}/${file}`);
            console.log(`  WARNING: No errors occurred, scrutinize more`);
          } else {
            testResults.fail++;
            console.log(`  FAIL`);
          }
        } catch (error) {
          if (subfolder.startsWith('invalid')) {
            testResults.pass++;
            console.log(`  PASS`);
          } else {
            testResults.fail++;
            console.log(`  FAIL`);
          }
        }
      }
    });
  }
});

// console.log(testResults.results);

console.log(`Test Summary:`);
console.log(`  Total Tests: ${testResults.pass + testResults.fail + testResults.warning}`);
console.log(`  Passed: ${testResults.pass}`);
console.log(`  Failed: ${testResults.fail}`);
console.log(`  Warnings: ${testResults.warning}`);

if (testResults.warningFilePaths.length > 0) {
  console.log('Warning File Paths:');
  testResults.warningFilePaths.forEach((filePath) => {
    console.log(`  ${filePath}`);
  });
}
  
const resultsFile = `${testsFolder}.json`;
fs.writeFileSync(resultsFile, JSON.stringify(testResults.results, null, 2));
console.log(`Results saved to ${resultsFile}`);


