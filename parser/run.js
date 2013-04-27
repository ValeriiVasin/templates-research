var fs = require('fs'),
    Tag = require('./parser_underscore'),
    file = process.argv[2];

fs.writeFileSync(
    file.replace('.tmpl', '.underscore.tmpl'),
    Tag.parseFile(file)
);
