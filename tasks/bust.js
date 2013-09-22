/*
 * grunt-bust
 * https://github.com/derduher/grunt-bust
 *
 * Copyright (c) 2013 Patrick Weygand
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var crypto = require('crypto'),
    path = require('path');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('bust', 'Replace urls in html with cache bustable urls', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            prepend: 'cbuster-',
            bustable: ['**/*'],
            basePath: '',
            regexes: []
        });

        var self = this,
        basedir = null,
        fileprops = {},
        basePathLen = options.basePath.length,
        hashes = {};

        if (options.basedir) {
            basedir = path.resolve(options.basedir);
        }

        var filesToHash = grunt.file.expand(
            { filter: 'isFile' },
            options.bustable
        );

        filesToHash.forEach(function(filename) {
            // Concat specified files.
            if (grunt.file.exists(filename)) {
                var source = grunt.file.read(filename, {
                    encoding: null
                });
                // Create MD5 of file
                var hash = crypto.
                    createHash('md5').
                    update(source).
                    digest('hex');

                var url = filename;
                if (basedir) {
                    url = path.relative(basedir, filename);
                    grunt.verbose.writeln('rewriting ' + filename + ' relative to ' + basedir + ' as ' + url);
                }

                if (options.basePath && url.indexOf(options.basePath) === 0) {
                    url = url.slice(options.basePath.length);
                    grunt.verbose.writeln('removed ' + basedir + ' from ' + url);
                }
                var pathDots = url.split('.');
                fileprops[url] = {
                    end: pathDots.slice(-1)[0], //file extension most likely
                    begining: pathDots.slice(0, pathDots.length - 1).join('.') // everything but extension
                };
                hashes[url] = hash;

            } else {
                grunt.log.warn('bustable file "' + filename + '" not found.');
            }

        });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                return true;

            }).map(function(filepath) {
                // Read file source.
                return grunt.file.read(filepath);
            }).join(grunt.util.linefeed);

            var originalFileSize = src.length,
            changed = false;
            options.regexes.forEach(function (matcher) {
                // Insert a cachebuster where the regex matcher matches
                src = src.replace(
                    matcher.regex,
                    ['$1', options.prepend + hashes[matcher.filepath]].join('.')
                );
                if (src.length !== originalFileSize) {
                    changed = true;
                }
            });

            for ( var filepath in hashes ) {
                // Insert the cachebuster
                src = src.replace(filepath, 
                                  [ fileprops[filepath].begining,
                                      options.prepend + hashes[filepath],
                                      fileprops[filepath].end
                                  ].join('.'),
                                  "g");
                                  if (src.length !== originalFileSize) {
                                      changed = true;
                                  }
            }

            // Write the destination file.
            if (changed) {
                grunt.file.write(f.dest, src);
                // Print a success message.
                grunt.log.ok('File "' + f.dest + '" created.');
            }
        });
    });
};
