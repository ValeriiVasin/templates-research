var content = require('fs').readFileSync('templates/item.tmpl', 'utf-8'),
    Parser = require('./parser'),
    parser = new Parser(content);

var parsed = parser.parse(content);
