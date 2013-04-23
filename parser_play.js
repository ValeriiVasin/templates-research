var content = require('fs').readFileSync('templates/item.tmpl', 'utf-8'),
    Parser = require('./parser'),
    parser = new Parser(content);

var parsed = parser.parse(content);

console.log(
    parsed.filter(function (arg) {
        return typeof arg !== 'string';
    })
);
