/*
 * grunt-bust
 * https://github.com/derduher/grunt-bust
 *
 * Copyright (c) 2013 Patrick Weygand
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    busters: false,
    // Configuration to be run (and then tested).
    bust: {
      requirejs: {
          options: {
              busters: 'busters',
              regexes: [{
                  filepath: 'test/fixtures/index.js',
                  regex: /(require\(\['index)/g
              }]
          },
          files: [{
              expand: true,     // Enable dynamic expansion.
              src: ['test/fixtures/require.html'], // Actual pattern(s) to match.
              dest: 'tmp/'   // Destination path prefix.
          }]
      },
      vanilla: {
          options: {
              busters: 'busters',
          },
        files: [{
            expand: true,     // Enable dynamic expansion.
            src: ['test/fixtures/index.html'], // Actual pattern(s) to match.
            dest: 'tmp/'   // Destination path prefix.
        }],
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
    cachebuster: {
        build: {
            options: {
                complete: function (hashes) {
                    grunt.config.set('busters', hashes);
                    return hashes;
                }
            },
            src: [ 'test/fixtures/**/*' ],
            dest: 'tmp/cachebusters.json'
        }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-cachebuster');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'cachebuster', 'bust', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
