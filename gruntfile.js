module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // concatinating
        concat: {
            dist: {
                src: [
                '_dev/vector.js',
                '_dev/utils.js',
                '_dev/particle.js',                               
                '_dev/init.js',
                '_dev/sprite.js',
                '_dev/background.js',
                '_dev/explosion.js',
                '_dev/player.js',
                '_dev/playerBullet.js',                                
                '_dev/enemy.js',
                '_dev/boss.js',
                '_dev/enemyBullet.js',
                '_dev/loot.js',                                
                '_dev/wave.js',
                '_dev/ui.js',                                 
                '_dev/lights.js',                                
                '_dev/lights.js',                                 
                '_dev/text.js',    
                '_dev/state.js',                             
                '_dev/menu.js',
                '_dev/update.js',
                '_dev/level1.js',  
                '_dev/functions.js',                              
                ],
                dest: 'main.js',                
            }
        },
        //jshint
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
            },
            beforeconcat: [
            '_dev/vector.js',
            '_dev/utils.js', 
            '_dev/particle.js',
            '_dev/init.js',
            '_dev/sprite.js',
            '_dev/background.js',
            '_dev/explosion.js',
            '_dev/player.js',
            '_dev/playerBullet.js',
            '_dev/enemy.js',
            '_dev/boss.js',
            '_dev/enemyBullet.js',
            '_dev/loot.js',
            '_dev/wave.js',
            '_dev/lights.js',
            '_dev/ui.js',
            '_dev/text.js',
            '_dev/state.js',
            '_dev/menu.js',
            '_dev/update.js',
            '_dev/level1.js',
            '_dev/functions.js',
            ],
            afterconcat: [
            'main.js',
            ],
        },
        // minifying
        uglify: {
            build: {
                src: 'main.js',
                dest: 'main.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '_img/_dev/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '_img/_dist/' //DIST NEEDS TO BE A DIFFERENT FOLDER APARENTLY
                }]
            }
        },
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['_dev/*.js'],
                tasks: ['jshint', 'concat', 'uglify'],
                options: {
                    spawn: false,
                }
            },
            images: {
                files: ['_img/_dev/'],
                tasks: ['imagemin'],
                options: {
                    spawn: false,
                }
            }  
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'imagemin', 'watch']);
};