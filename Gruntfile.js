module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        templates: {
            input: 'templates',
            output: 'templates_underscore'
        },

        watch: {
            templates: {
                files: '<%= templates.input %>/**',
                tasks: []
            },
            tests: {
                files: 'test/**',
                tasks: ['nodeunit']
            },
            updateCompile: {
                files: ['compile.js', 'compiler.js'],
                tasks: ['compile', 'nodeunit']
            }
        },

        nodeunit: {
            all: ['test/**.js']
        }
    });

    grunt.registerTask('compile', function () {
        var spawn = require('child_process').spawn,
            compile = spawn('node', [
                'compile.js',
                'templates/item.tmpl',
                'templates_underscore/item.tmpl'
            ]);

        compile.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });

        compile.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });
    });

    grunt.registerTask('default', ['watch']);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
};
