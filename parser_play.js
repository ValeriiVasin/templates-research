var fs = require('fs'),
    Tag = require('./parser_underscore');

var content = fs.readFileSync('parser/templates/FriendsPage/item.tmpl', 'utf-8');

console.log( Tag.parseTemplate(content) );
