/**
 * Underscore templates port
 */

var Tag = require('./parser'),
    _toString = Tag.prototype.toString;

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
                expr = this.attr('expr');
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
                expr = this.attr('expr');
            } else if ( this.attr('name') ) {
                expr = 'typeof ' + this.attr('name') + ' !== "undefined" && ' + this.attr('name');
            } else {
                expr = 'typeof ' + this.attrs.__noname[0] + ' !== "undefined" && ' + this.attrs.__noname[0];
            }
            result = '<% } else if ('+ expr +') { %>';
            break;

        case 'TMPL_UNLESS':
            if ( this.attr('expr') ) {
                expr = '!(' + this.attr('expr') + ')';
            } else if ( this.attr('name') ) {
                expr = 'typeof ' + this.attr('name') + ' === "undefined" || ' + this.attr('name');
            } else {
                expr = 'typeof ' + this.attrs.__noname[0] + ' === "undefined" || ' + this.attrs.__noname[0];
            }

            result = '<% if (' + expr + ') { %>'+ Tag.join(this.parsedBody) +'<% } %>';
            break;

        default:
            result = _toString.apply(this, arguments);
            break;
    }

    return result;
};

module.exports = Tag;
