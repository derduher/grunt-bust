/*
 * grunt-bust
 * https://github.com/derduher/grunt-bust
 *
 * Copyright (c) 2013 Patrick Weygand
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('bust', 'Your task description goes here.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
        prepend: 'cbuster-',
      busters: 'busters',
      basePath: '',
      regexes: []
    });
      this.requires(['cachebuster']);
      options.busters = grunt.config.get([options.busters]);

    var fileprops = {},
    basePathLen = options.basePath.length;
    for (var filepath in options.busters) {
        if (options.basePath && filepath.indexOf(options.basePath) === 0) {
            var newfilepath = filepath.slice(options.basePath.length);
            options.busters[newfilepath] = options.busters[filepath];
            delete options.busters[filepath];
            filepath = newfilepath;
            console.log(filepath);
        }
        var pathDots = filepath.split('.');
        fileprops[filepath] = {
            end: pathDots.slice(-1)[0],
            begining: pathDots.slice(0, pathDots.length - 1).join('.')
        };
    }
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

      options.regexes.forEach(function (matcher) {
          src = src.replace(
              matcher.regex,
              ['$1', options.prepend + options.busters[matcher.filepath]].join('.')
          );
      });

      for ( var filepath in options.busters ) {
          src = src.replace(filepath, [fileprops[filepath].begining, options.prepend + options.busters[filepath], fileprops[filepath].end].join('.'), "g");
      }

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
