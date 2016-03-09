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
                '_dev/init.js',
                '_dev/sprite.js',
                '_dev/background.js',
                '_dev/explosion.js',
                '_dev/player.js',
                '_dev/playerBullet.js',
                '_dev/enemies/enemy.js',
                '_dev/enemies/enemyMinion.js',
                '_dev/enemies/enemyMiniBoss.js',
                '_dev/enemies/enemyBase.js',
                '_dev/enemies/wave.js',
                '_dev/boss.js',
                '_dev/bossSectoid.js',
                '_dev/enemyBullet.js',
                '_dev/loot.js',
                '_dev/ui.js',
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
                options: {                       // Target options
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: '_img/_dev/mobile/**/*.jpg',
                    dest: '_img/',
                    ext: '.mob.jpg'
                },
                {
                    expand: true,
                    flatten: true,
                    src: '_img/_dev/desktop/**/*.jpg',
                    dest: '_img/',
                    ext: '.dkt.jpg'
                },
                {
                    expand: true,
                    flatten: true,
                    src: '_img/_dev/mobile/**/*.gif',
                    dest: '_img/',
                    ext: '.mob.gif'
                },
                {
                    expand: true,
                    flatten: true,
                    src: '_img/_dev/desktop/**/*.gif',
                    dest: '_img/',
                    ext: '.dkt.gif'
                }]
            }
        },
        tinypng: {
            options: {
                apiKey: "vksUF-rjWb-32GKKtBw-lqR9gRShvLNJ",
                checkSigs: true,
                sigFile: '_img/file_sigs.json', //checks for image minification signatures avoiding minifying files which are already minified
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },
            compress1: {
                expand: true,
                flatten: true,
                src: '_img/_dev/mobile/**/*.png',
                dest: '_img/',
                ext: '.mob.png'
            },
            compress2: {
                expand: true,
                flatten: true,
                src: '_img/_dev/desktop/**/*.png',
                dest: '_img/',
                ext: '.dkt.png'
            },
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
    grunt.loadNpmTasks('grunt-tinypng');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'imagemin', 'tinypng', 'watch']);
};
