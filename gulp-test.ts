import * as gulp from 'gulp';
import {replacePath, formatConf} from './src/index';
const conf = require('./test/module-map.json');

// gulp.src(['test/files/**/*'])
// .pipe(replacePath({
//   base: 'test/js-files',
//   confFile: './test/module-map.json',
//   dest: 'test',
//   fileType: '.js',
//   mapName: 'js-map.json'
// }))
// .pipe(gulp.dest('test'));

gulp.src('test/php-files/**/*')
    .pipe(replacePath({
      base: 'test/php-files',
      confFile: './test/module-map.json',
      dest: 'test',
      fileType: '.php',
      mapName: 'php-map.json'
    }))
    .pipe(gulp.dest('dist'));

// gulp.src(['test/async-map.json'])
// .pipe(formatConf({
//   isShim: true,
//   dest: 'test',
//   name: 'async-conf.js'
// }))
// .pipe(gulp.dest('test'));