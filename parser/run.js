var fs = require('fs'),
    Tag = require('./parser_underscore'),
    file = process.argv[2],
    errorMessage = null;

try {
    fs.writeFileSync(
        file.replace('.tmpl', '.underscore.tmpl'),
        Tag.parseFile(file)
    );
} catch (error) {
    errorMessage = error.message;
} finally {
    if (errorMessage) {
        console.log('FAIL %s', file);
        console.log(errorMessage);
    }
}
