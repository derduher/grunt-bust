'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.bust = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  vanilla: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/test/fixtures/index.html');
    var expected = grunt.file.read('test/expected/index.html');
    test.equal(actual, expected, 'Replaces all external resource links with cachebuster type links');

    test.done();
  },
  strip: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/test/fixtures/index-strip.html');
    var expected = grunt.file.read('test/expected/index-strip.html');
    test.equal(actual, expected, 'strip be base off of the filepath to match');

    test.done();
  },
  requirejs: function (test) {
      test.expect(1);

      var actual = grunt.file.read('tmp/test/fixtures/require.html');
      var expected = grunt.file.read('test/expected/require.html');
      test.equal(actual, expected, 'Replace custom file pattern');

      test.done();
  },
  nocopy: function (test) {
      test.expect(1);
      test.equal(grunt.file.exists('tmp/test/fixtures/slug.html'), false, "Dont copy what hasnt changed");
      test.done();
  }
};
