var content = require('fs').readFileSync('templates/item.tmpl', 'utf-8'),
    Tag = require('./parser_underscore');

var parsed = Tag.join(
    Tag.parse(content)
);

console.log(parsed);
