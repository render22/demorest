module.exports=function(grunt) {

    [
        'grunt-cafe-mocha',
        'debug-replacer'

    ].forEach(function (task) {

            grunt.loadNpmTasks(task);

        });

    grunt.initConfig({

        cafemocha: {

            all: {src: 'tests/*-tests.js', options: {ui: 'tdd'}}

        },

        debug_replacer:{
            all: {
                options:{
                    dir:__dirname,
                    skip:['node_modules']


                }
            }
         }
    });

    grunt.registerTask('test', ['debug_replacer']);

};