var fs = require('fs'),
    compiler = require('./compiler'),
    input = process.argv[2],
    output = process.argv[3];

if (!input || !output) {
    console.error('You should provide input and output');
}

fs.writeFileSync(
    output,
    compiler( fs.readFileSync(input, 'utf-8') ),
    'utf-8'
);
