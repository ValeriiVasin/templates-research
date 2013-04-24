var fs = require('fs'),
    Tag = require('./parser_underscore'),
    file = './parser/templates/FriendsPage/friends.tmpl';

Tag.setBase('parser');

console.log(
    Tag.parseFile(file)
);
