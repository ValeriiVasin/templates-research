var tags = [
        { name: 'TMPL_VAR', single: true },
        { name: 'TMPL_IF', single: false },
        { name: 'TMPL_ELSE', single: true },
        { name: 'TMPL_ELSIF', single: true },
        { name: 'TMPL_UNLESS', single: false },
        { name: 'TMPL_LOOP', single: false },
        { name: 'TMPL_INCLUDE', single: true }
    ],
    fs = require('fs'),
    path = require('path');


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

/**
 * Tag object
 * @param {Object} data         Data for tag creation
 * @param {String} data.tagName One of allowed tags
 * @param {String} data.text    Not parsed tag text including tag itself
 * @param {Tag}    [parent]     Parent tag link
 */
function Tag(data, parent) {
    this.attrs = {
        __noname: []
    };

    this.tagName = data.tagName;
    this.outerText = data.text;
    this.parent = parent;
    this.innerText = this.outerText.slice(
        this.outerText.indexOf('>') + 1,
        this.outerText.lastIndexOf('<')
    );

    this.parseAttributes();
    this.parseBody();
}

Tag.prototype.parseAttributes = function () {
    var attributes = this.outerText.slice(
            this.tagName.length + 1,
            this.outerText.indexOf('>', this.tagName.length + 1)
        ).trim(),
        attrs = this.attrs;

    // parse named attrs with quotes
    attributes = attributes.replace(/(\w+)=('|")([\s\S]*)\2/gim, function (str, attr, quote, value) {
        attrs[ attr.toLowerCase() ] = value;
        return '';
    });

    // parse named attrs without quotes
    attributes = attributes.replace(/(\w+)=(\w+)/gim, function (str, attr, value) {
        attrs[ attr.toLowerCase() ] = value;
        return '';
    });

    // parse attrs without name (single attrs)
    attributes.trim().replace(/\s+/, ' ');
    if (attributes) {
        attrs.__noname = attributes.split(' ');
    }
};

Tag.prototype.parseBody = function () {
    this.parsedBody = Tag.parse( this.innerText, this );
};

Tag.prototype.hasTags = function () {
    this.parsedBody.some(function (chunk) {
        return typeof chunk !== 'string';
    });
};

/**
 * Attr accessor
 */
Tag.prototype.attr = function (name) {
    if (typeof name === 'undefined') {
        return this.attrs;
    }
    return this.attrs[name];
};

Tag.prototype.toString = function () {
    var that = this,
        attributes = '',
        result = '',
        isSingle,
        attr;

    // get attributes string
    for (attr in this.attrs) {
        if ( this.attrs.hasOwnProperty(attr) && attr !== '__noname') {
            attributes += ' ' + attr + '="' + this.attrs[attr] + '"';
        }
    }

    if (this.attrs.__noname.length) {
        attributes += ' ' + this.attrs.__noname.join(' ');
    }

    result += '<' + this.tagName + attributes + '>';

    isSingle = tags.filter(function (tag) {
        return that.tagName === tag.name;
    })[0].single;

    if ( !isSingle ) {

        result += (this.hasTags() ? Tag.join(this.parsedBody) : this.innerText) + '</' + this.tagName + '>';
    }

    return result;
};

// join chunks of text and tags
Tag.join = function (chunks) {
    return chunks
        .map(function (chunk) {
            return typeof chunk === 'string' ? chunk : chunk.toString();
        })
        .join('');
};

/**
 * Parse content string into chunks of text and Tags
 * @param  {String} content       String to parse
 * @param  {Tag}    [parentTag]   Parent tag to link all parsed tags with
 * @return {Array}                Array of chunks: String | Tag
 */
Tag.parse = function (content, parentTag) {
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
                new Tag(tag, parentTag)
            );

            if (index === tagsLength - 1) {
                chunks.push(
                    content.slice(tags[ tags.length - 1 ].end)
                );
            }
        });
    }

    return chunks;
};

/**
 * Parse template and return other template HTML
 * @param  {String} content Content to parse
 * @return {String}         Result
 */
Tag.parseTemplate = function (content) {
    return this.join(
        this.parse(content)
    );
};

Tag.parseFile = function (file) {
    var content;

    this.filebase = path.dirname(
        path.resolve(this.base || __dirname, file)
    );
    content = fs.readFileSync(file, 'utf-8');

    return this.parseTemplate(content);
};

Tag.setBase = function (base) {
    this.base = base;
};

Tag.include = function (filename) {
    var relativePath,
        absolutePath;

    // unwrap quotes that could be in filename
    if (
        filename.charAt(0) === filename.charAt( filename.length - 1 ) &&
        filename.charAt(0) === '\'' || filename.charAt(0) === '"'
    ) {
        filename = filename.slice(1, -1);
    }

    relativePath = path.resolve( Tag.filebase || __dirname, filename),
    absolutePath = path.resolve( Tag.base || __dirname, filename);

    if ( fs.existsSync(relativePath) ) {
        return Tag.parseFile(relativePath);
    } else if ( fs.existsSync(absolutePath) ) {
        return Tag.parseFile(absolutePath);
    } else {
        return '<!-- nothing to include -->';
    }
};


module.exports = Tag;
