var content = require('fs').readFileSync('templates/item.tmpl', 'utf-8'),
    Parser = require('./parser'),
    parser = new Parser(content);

var tags = parser.parse(content);

console.log(tags.length, tags);
