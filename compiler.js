/**
 * HTML Template Pro to Underscore templates compiler
 */
module.exports = function (content) {

    /**
     * @todo Use tokenizer for compilation
     */

    function compile(content) {
        var initial = content;

        // TMPL_VAR
        content = content.replace(/<TMPL_VAR\s+(\w+)\s*>/gim, '<%= $1 %>');

        // TMPL_VAR with expr=
        content = content.replace(
            /<TMPL_VAR expr=("|')(.*?)\1\s*>/gim,
            '<%= $2 %>'
        );

        // TMPL_IF
        content = content.replace(
            /<TMPL_IF\s+([\w\d]+)\s*>([\s\S]*?)<\/TMPL_IF>/gim,
            '<% if (typeof $1 !== \'undefined\' && $1) { %>$2<% } %>'
        );

        // TMPL_IF with expr=
        content = content.replace(
            /<TMPL_IF expr=("|')([\s\S]*?)\1\s*>([\s\S]*?)<\/TMPL_IF>/gim,
            '<% if ($2) { %>$3<% } %>'
        );


        // TMPL_UNLESS
        content = content.replace(
            /<TMPL_UNLESS\s+([\w\d]+)\s*>([\s\S]*?)<\/TMPL_UNLESS>/gim,
            '<% if (typeof $1 === \'undefined\' || !$1) { %>$2<% } %>'
        );

        // TMPL_UNLESS with expr=
        content = content.replace(
            /<TMPL_UNLESS expr=("|')([\s\S]*?)\1\s*>([\s\S]*?)<\/TMPL_UNLESS>/gim,
            '<% if (!($2)) { %>$3<% } %>'
        );

        // TMPL_ELSE
        content = content.replace(
            /<TMPL_ELSE>/gim,
            '<% } else { %>'
        );

        // TMPL_ELSIF
        content = content.replace(
            /<TMPL_ELSIF\s+([\w\d]+)\s*>/gim,
            '<% } else if (typeof $1 !== \'undefined\' && $1) { %>'
        );

        // TMPL_ELSIF with expr=
        content = content.replace(
            /<TMPL_ELSIF expr=("|')([\s\S]*?)\1\s*>/gim,
            '<% } else if ($2) { %>'
        );

        // TMPL_LOOP
        content = content.replace(
            /<TMPL_LOOP\s+([\w\d]+)\s*>([\s\S]*?)<\/TMPL_LOOP>/gim,
            '<% $1.forEach(function (__tmp) { %><% with (__tmp) { %>$2<% } %><% }); %>'
        );

        return content === initial ? content : compile(content);
    }

    return compile(content);
};
