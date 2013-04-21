;(function ($) {
    'use strict';

    var _getTemplate = $.get('templates_underscore/item.tmpl'),
        _getJSON = $.getJSON('data/items.json');

    $.when(_getJSON, _getTemplate)
        .then(function (data, templateHTML) {
            var template,
                fragment,
                html;

            data = data[0].map(function (item) {
                item.extra_attributes = '';
                item.ml = function (text) { return text; };
                return item;
            });
            templateHTML = templateHTML[0];

            // jquery
            fragment = document.createDocumentFragment();
            console.time('jquery');
            data.forEach(function (_item) {
                fragment.appendChild( $.tmpl('item', _item).get(0) );
            });
            $('body').append(fragment);
            console.timeEnd('jquery');

            // empty body
            $('body').empty();

            // compile underscore template
            template = _.template(templateHTML);

            html = '';
            console.time('underscore');
            data.forEach(function (_item) {
                html += template(_item);
            });
            $('body').append(html);
            console.timeEnd('underscore');
        });
}(jQuery));
