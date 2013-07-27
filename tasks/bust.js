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

  grunt.registerMultiTask('bust', 'Your task description goes here.', function() {
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

    var filesToHash = grunt.file.expand({
        filter: 'isFile'
    }, options.bustable
                                   );

    filesToHash.forEach(function(filename) {
        // Concat specified files.
        if (grunt.file.exists(filename)) {
             var source = grunt.file.read(filename, {
                encoding: null
            });
            var hash = crypto.
                createHash('md5').
                update(source).
                digest('hex');

            var key = filename;
            if (basedir) {
                key = path.relative(basedir, filename);
            }

            if (options.basePath && key.indexOf(options.basePath) === 0) {
                key = key.slice(options.basePath.length);
            }
            var pathDots = key.split('.');
            fileprops[key] = {
                end: pathDots.slice(-1)[0],
                begining: pathDots.slice(0, pathDots.length - 1).join('.')
            };
            hashes[key] = hash;

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
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.linefeed);

      var before = src.length,
      changed = false;
      options.regexes.forEach(function (matcher) {
          src = src.replace(
              matcher.regex,
              ['$1', options.prepend + hashes[matcher.filepath]].join('.')
          );
          if (src.length !== before) {
              changed = true;
          }
      });

      for ( var filepath in hashes ) {
          src = src.replace(filepath, [fileprops[filepath].begining, options.prepend + hashes[filepath], fileprops[filepath].end].join('.'), "g");
          if (src.length !== before) {
              changed = true;
          }
      }

      // Write the destination file.
      if (changed) {
          grunt.file.write(f.dest, src);
      }

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
