'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  var src = ['tests/**/*.js'];

  // Project configuration.
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coverage/blanket'
        },
        src: ['tests/api-class.test.js']
      },
      testAll: {
        src: ['tests/api-communication.test.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: src
      }
    },
    clean: {
      "coverage.html" : {
        src: ['coverage.html']
      }
    },
    jshint: {
      all: ['lib/*']
    }
  });

  // Default task.
  grunt.registerTask('default', ['clean', 'mochaTest', 'jshint']);
};