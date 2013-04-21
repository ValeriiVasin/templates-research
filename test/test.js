var compiler = require('../compiler'),
    fs = require('fs'),
    testMe;


testMe = function (fixture, message) {
    var actual = fs.readFileSync('./test/fixtures/input/' + fixture + '.html', 'utf-8'),
        expected =  fs.readFileSync('./test/fixtures/output/' + fixture + '.html', 'utf-8');

    this.equal(expected, compiler(actual), message);
};

exports.compilerTest = function(test) {
    testMe = testMe.bind(test);

    testMe('tmpl_var', 'Simple TMPL_VAR statement.');
    testMe('tmpl_var_with_expr', 'TMPL_VAR statement with expr=');

    testMe('tmpl_if', 'TMPL_IF with nested TMPL_VAR');
    testMe('tmpl_if_with_expr', 'TMPL_IF with expr=');

    testMe('tmpl_else', 'TMPL_ELSE');
    testMe('tmpl_elsif', 'TMPL_ELSIF');
    testMe('tmpl_elsif_with_expr', 'TMPL_ELSIF with expr=');

    testMe('tmpl_unless', 'TMPL_UNLESS');
    testMe('tmpl_unless_with_expr', 'TMPL_UNLESS with expr=');

    testMe('tmpl_loop', 'TMPL_LOOP');

    // complex
    testMe('tmpl_if_nested', 'TMPL_IF nested');

    /**
     * @todo Provide tests for strict mode with NAME attribute
     */

    test.done();
};
