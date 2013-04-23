var tags = [
    { name: 'TMPL_VAR', single: true },
    { name: 'TMPL_LOOP', single: false },
    { name: 'TMPL_IF', single: false },
    { name: 'TMPL_ELSIF', single: true },
    { name: 'TMPL_ELSE', single: true },
    { name: 'TMPL_UNLESS', single: false },
    { name: 'TMPL_INCLUDE', single: true }
];

function matchesCount(content, needle) {
    return content.split(needle).length - 1;
}

function findTag(content, _start) {
    // mapping
    var mapping = tags.map(function (tagInfo) {
        var startTag = '<' + tagInfo.name,
            endTag = tagInfo.single ? '>' : '</' + tagInfo.name + '>',
            start = content.indexOf(startTag, _start);

        if (start === -1) {
            return null;
        }

        var _end = start;
        var found = false;
        var _str;
        while (!found && _end !== -1) {
            _end = content.indexOf(endTag, _end);
            if (_end !== -1) {
                _end += endTag.length;
                _str = content.slice(start, _end);
                found = matchesCount(_str, startTag) === matchesCount(_str, endTag);
            }
        }

        if (_end === -1) {
            return null;
        }

        return {
            tagName: tagInfo.name,
            start: start,
            end: _end,
            text: content.slice(start, _end)
        };
    });

    var tag = null, min = +Infinity;
    mapping.forEach(function (foundTag, index) {
        if (foundTag && foundTag.start < min) {
            min = foundTag.start;
            tag = foundTag;
        }
    });

    return tag;
}

function Parser(content) {
    this.content = content;
}

Parser.prototype.parse = function (content) {
    var tags = [],
        tag,
        start;

    do {
        start = tag ? tag.end : 0;
        console.log(start);
        tag = findTag(content, start);
        if (tag) {
            tags.push(tag);
        }
    } while (tag && tags.length < 20);

    return tags;
};

module.exports = Parser;
