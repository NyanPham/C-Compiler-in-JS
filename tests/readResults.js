const fs = require('fs');

const resultFilename = process.argv[2];

fs.readFile(resultFilename, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Loop through the matches and parse them into JSON
    try {   
        const result = JSON.parse(data);
        Object.entries(result).forEach(([key, value]) => {
            console.log(`Tested file: ${key} - Result: ${value}`);
        })
    } catch (e) {
        console.log(`Invalid JSON`);
    }
});