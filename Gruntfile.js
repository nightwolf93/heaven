module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-ts");

  grunt.initConfig({

    ts: {
      compile: {
        src: ['src/**/*.ts'],
        out: 'dist/app.js',
        options: {
          target: 'es3',
          sourceMaps: false,
          declaration: true,
          removeComments: false,
          failOnTypeErrors: false,
        }
      },
    },

    watch: {
      scripts: {
        files: '**/*.ts',
        tasks: ['ts:compile', 'watch']
      },
    }
  });

  grunt.registerTask('default', ['ts:compile' ,'watch']);
};
