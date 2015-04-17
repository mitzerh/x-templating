module.exports = function(grunt) {

    var conf = grunt.file.readJSON('package.json'),
        demo = grunt.option("demo") || false;

    // comment banner
    var comment = [
        '/**',
        conf.name + ' v' + conf.version + ' | ' + grunt.template.today("yyyy-mm-dd"),
        conf.description,
        'by ' + conf.author,
        conf.license
    ].join('\n* ') + '\n**/';

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dest: 'dest/**/*',
            tmp: 'dest/tmp'
        },

        copy: {

            dist: {

                src: 'src/xtpl.embed.js',
                dest: 'dest/xtpl.embed.js',
                options: {
                    process: function (content, srcpath) {
                        
                        content = content.replace('${version}', conf.version);

                        content = content.replace('\/\/inclue:domready', (function(){
                            var ret = grunt.file.read(__dirname + '/dest/tmp/domready.js');
                            return ret;
                        }()));

                        content = content.replace('\/\/inclue:messenger', (function(){
                            var ret = grunt.file.read(__dirname + '/dest/tmp/messenger.js');
                            return ret;
                        }()));

                        content = [comment, content].join('\n\n');

                        return content;

                    }

                }

            },

            app: {
                files: [
                    {
                        src: 'src/app.js',
                        dest: 'dest/assets/app.js'

                    }
                ]
            },

            assets: {
                cwd: 'src/assets',
                src: '**/*',
                dest: 'dest/assets',
                expand: true
            }
            
        },

        jshint: {

            build: {

                options: grunt.file.readJSON('.jshintrc'),
                expand: true,
                src: ['src/xpl.embed.js', 'src/app.js']

            }

        },

        uglify: {

            dist: {

                options: {
                    mangle: true,
                    banner: comment + '\n'
                },
                files: {
                    'dest/xtpl.embed.min.js' : 'dest/xtpl.embed.js',
                    'dest/assets/app.min.js': 'dest/assets/app.js'
                }

            },

            tmp: {
                options: {
                    mangle: true
                },
                files: {
                    'dest/tmp/messenger.js': 'src/messenger.js',
                    'dest/tmp/domready.js': 'src/domready.js'
                }
            }

        }

    };

    // load npm's
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var tasks = [
        'jshint',
        'clean:dest',
        'uglify:tmp',
        'copy:dist',
        'copy:assets',
        'copy:app',
        'uglify:dist',
        'clean:tmp'
    ];

    grunt.registerTask('default', tasks);

    grunt.initConfig(config);

};