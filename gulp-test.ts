import * as gulp from 'gulp';
import {sourceMap} from './src/index';
const conf = require('./test/module-map.json');

gulp.src(['test/php-files/**/*'])
.pipe(sourceMap({
  base: 'test/php-files',
  moduleMap: conf.php,
  dest: 'test',
  fileType: '.php',
  mapName: 'php-map.json'
}))
.pipe(gulp.dest('test'));

// gulp.src(['test/js-file/**/*'])
// .pipe(sourceMap({
//   base: 'test/js-files',
//   moduleMap: conf.js,
//   dest: 'test',
//   fileType: '.js',
//   mapName: 'js-map.json'
// }))
// .pipe(gulp.dest('test'));