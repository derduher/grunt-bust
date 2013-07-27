# grunt-bust

> replace urls with bustable urls

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bust --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bust');
```

## The "bust" task

### Overview
In your project's Gruntfile, add a section named `bust` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bust: {
    options: {
        bustable: [ '**/*.html' ],
        regexes: [{
            filepath: 'js/index.js',
            regex: /(require\(\['index)/g
        }],
        basePath: 'test/fixtures/',
        prepend: 'bust',
    },
    your_target: {
          files: [{
              expand: true,     // Enable dynamic expansion.
              src: ['test/fixtures/require.html'], // Actual pattern(s) to match.
              dest: 'tmp/'   // Destination path prefix.
          }]
    },
  },
})
```

### Options

#### options.bustable
Type: `Array`

An Array of string file path globs matching the files that might have a url referencing it.

#### options.regexes
Type: `Array`
Default value: `[]`

an array of objects mapping pattern to filepath

#### options.prepend
Type: `String`
Default value: 'cbuster-'

A string to insert before the md5 inserted into urls

#### options.basePath
Type: `String`
Default value: ''

Remove basepath from files you are trying to match against.

#### options.baseDir
Type: `String`
Default value: ''

filepaths will be converted to be relative to baseDir

### Usage Examples

#### Default Options
In this example, the default options replace all references to all files in html files.

```js
grunt.initConfig({
  bust: {
    options: {
    },
    files: [{
        expand: true,     // Enable dynamic expansion.
        src: [
            '**/*.html'
        ],
        dest: '../dist/'   // Destination path prefix.
    }]
  }
})
```

#### Custom Options
In this example, regexes are used to insert a cachebuster after a require.js include. All cachebusters are prepended with bust instead of cbuster-, and only js files are replaced.

```js
grunt.initConfig({
  bust: {
    options: {
        regexes: [{
            filepath: 'js/index.js',
            regex: /(require\(\['index)/g //'])
        }],
        basePath: 'app/',
        prepend: 'bust',
        bustable: [ 'js/**/*.js' ]
    },
    files: [{
        expand: true,     // Enable dynamic expansion.
        src: [
            '**/*.html',
            '!node_modules/**/*.html'
        ],
        dest: '../dist/'   // Destination path prefix.
    }]
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
