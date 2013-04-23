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
        // chunks with text and tag instances
        chunks = [],
        tag,
        start,
        tagsLength;

    do {
        start = tag ? tag.end : 0;
        tag = findTag(content, start);
        if (tag) {
            tags.push(tag);
        }
    } while (tag);

    tagsLength = tags.length;
    if (tagsLength === 0) {
        chunks.push(content);
    } else {
        tags.forEach(function (tag, index) {
            chunks.push(
                content.slice(index === 0 ? 0 : tags[index - 1].end, tag.start)
            );

            chunks.push(
                new Tag(tag)
            );

            if (index === tagsLength) {
                chunks.push(
                    content.slice(tags[ tags.length - 1 ].end)
                );
            }
        });
    }

    return chunks;
};

/**
 * Tag object
 * @param {Object} data         Data for tag creation
 * @param {String} data.tagName One of allowed tags
 * @param {String} data.text    Not parsed tag text including tag itself
 */
function Tag(data) {
    this.parsed = false;
    this.attrs = {
        __noname: []
    };
}

/**
 * Attr accessor
 */
Tag.prototype.attr = function () {

};

Tag.prototype.toString = function () {
    return '### tag content ###';
};

module.exports = Parser;
