//
module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: 'public/'
                        //base     : 'dist/'
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        watch: {
            project: {
                files: ['public/**/*.js', 'public/**/*.html', 'public/**/*.json', 'public/**/*.css', 'public/**/*.scss'],
                options: {
                    livereload: true
                }
            }
        },
        clean: ['dist', '.tmp'],
        copy: {
            main: {
                expand: true,
                cwd: 'public/',
                src: ['fonts/**', 'img/**', 'images/**', '**/*.html', '!js/**', '!css/*.css'],
                dest: 'dist/'
            }
        },
        'custom-rev': {
            options: {
                encoding: 'utf8',
                algorithm: 'sha1',
                length: 3
            },
            files: {
                src: ['dist/**/*.{js,css}', '!dist/js/shims/**']
            }
        },
        useminPrepare: {
            html: 'public/index.html'
        },
        usemin: {
            html: ['dist/index.html']
        },
        uglify: {
            options: {
                report: 'min',
                mangle: false
            }
        },
        ngconstant: {
            options: {
                name: 'rposts.services',
                wrap: '(function(){\n"use strict";\n{%= __ngModule %}})();',
                space: '  '
            },
            development: {
                options: {
                    dest: 'public/js/services/init.js'
                },
                constants: {
                    ENV: 'DEVELOPMENT',
                    config: grunt.file.readJSON('env_config/development.json')
                }
            },
            production: {
                options: {
                    dest: 'public/js/services/init.js'
                },
                constants: {
                    ENV: 'PRODUCTION',
                    config: grunt.file.readJSON('env_config/production.json')
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');

    /***********Build File names -> custom-rev***********/
    var fs = require('fs'),
        path = require('path'),
        crypto = require('crypto');
    grunt.registerMultiTask('custom-rev', 'Prefix static asset file names with time', function() {
        this.files.forEach(function(filePair) {
            filePair.src.forEach(function(f) {
                var hash = new Date().getTime(),
                    prefix = hash,
                    renamed = [prefix, path.basename(f)].join('.'),
                    outPath = path.resolve(path.dirname(f), renamed);

                grunt.verbose.ok().ok(hash);
                fs.renameSync(f, outPath);
                grunt.log.write(f + ' ').ok(renamed);
            });
        });
    });
    /****************************************/

    //build development
    grunt.registerTask('build_development', [
        'ngconstant:development', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'custom-rev', 'usemin'
    ]);

    //build production
    grunt.registerTask('build_production', [
        'ngconstant:production', 'clean', 'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'custom-rev', 'usemin'
    ]);

    //only listen
    grunt.registerTask('default', [
        'ngconstant:development', 'connect', 'concurrent:target'
    ]);

    grunt.registerTask('production_back', [
        'ngconstant:devproduction', 'connect', 'concurrent:target'
    ]);

};
