/**
 * Underscore templates port
 */

var Tag = require('./parser'),
    _toString = Tag.prototype.toString;

/**
 * Clean expressions from perl-based comparators
 * @param  {String} statement Expression code to clean
 * @return {String}           Statement with javascript-based operators
 */
function cleanExpr(statement) {
    /**
     * @todo Improve algorithm to prevent replacement of strings like 'he eq me'
     */
    return statement
        .replace(/ gt /g, ' > ')
        .replace(/ lt /g, ' < ')
        .replace(/ eq /g, ' === ')
        .replace(/ ne /g, ' !== ')
        .replace(/ ge /g, ' >= ')
        .replace(/ le /g, ' <= ');
}

Tag.prototype.toString = function () {
    var result,
        expr;

    switch (this.tagName) {
        case 'TMPL_VAR':
            if ( this.attr('expr') ) {
                expr = this.attr('expr');
            } else {
                expr = this.attr('name') || this.attrs.__noname[0];
            }
            result = '<%= ' + expr + ' %>';
            break;

        case 'TMPL_IF':
            if ( this.attr('expr') ) {
                expr = cleanExpr( this.attr('expr') );
            } else if ( this.attr('name') ) {
                expr = 'typeof ' + this.attr('name') + ' !== "undefined" && ' + this.attr('name');
            } else {
                expr = 'typeof ' + this.attrs.__noname[0] + ' !== "undefined" && ' + this.attrs.__noname[0];
            }

            result = '<% if (' + expr + ') { %>'+ Tag.join(this.parsedBody) +'<% } %>';
            break;

        case 'TMPL_ELSE':
            result = '<% } else { %>';
            break;

        case 'TMPL_ELSIF':
            if ( this.attr('expr') ) {
                expr = cleanExpr( this.attr('expr') );
            } else if ( this.attr('name') ) {
                expr = 'typeof ' + this.attr('name') + ' !== "undefined" && ' + this.attr('name');
            } else {
                expr = 'typeof ' + this.attrs.__noname[0] + ' !== "undefined" && ' + this.attrs.__noname[0];
            }
            result = '<% } else if ('+ expr +') { %>';
            break;

        case 'TMPL_UNLESS':
            if ( this.attr('expr') ) {
                expr = '!(' + cleanExpr( this.attr('expr') ) + ')';
            } else if ( this.attr('name') ) {
                expr = 'typeof ' + this.attr('name') + ' === "undefined" || ' + this.attr('name');
            } else {
                expr = 'typeof ' + this.attrs.__noname[0] + ' === "undefined" || ' + this.attrs.__noname[0];
            }

            result = '<% if (' + expr + ') { %>'+ Tag.join(this.parsedBody) +'<% } %>';
            break;

        case 'TMPL_LOOP':
            if ( this.attr('name') ) {
                expr = this.attr('name');
            } else {
                expr = this.attrs.__noname[0];
            }
            result = [
                '<% ', expr ,'.forEach(function (__value__, __counter__, __array__) { %>',
                '<% var __length__ = __array__.length; %>',
                '<% var __first__ = __counter__ === 0; %>',
                '<% var __last__ = __counter__ === __length__ - 1; %>',
                '<% var __inner__ = __counter__ > 0 && __counter__ < __length__ - 1; %>',
                '<% var __odd__ = __counter__ % 0 === 0; %>',
                '<% var __even__ = !__odd__ %>',

                '<% with (__value__) { %>',
                    Tag.join( this.parsedBody ),
                '<% } %><% }); %>'
            ].join('');
            break;

        default:
            result = _toString.apply(this, arguments);
            break;
    }

    return result;
};

module.exports = Tag;
