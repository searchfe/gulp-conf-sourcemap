import * as gulp from 'gulp';
import * as fs from 'fs';
import * as path from 'path';
import {sourceMap} from '../src/index';

const conf = {
  "php": {
    "glob": {
      "whatwg-fetch": "whatwg-fetch/fetch.js"
    },
    "umd": {
      "promise-polyfill": "promise-polyfill/lib/polyfill.js"
    }
  },
  "js": {
    "concat": {
      "@baidu/web-animations-js": "@baidu/web-animations-js/web-animations.min.js"
    }
  }
}

gulp.src(['test/js-file/**/*'])
.pipe(sourceMap({
  base: 'test/js-files',
  moduleMap: conf.js,
  dest: 'test',
  fileType: '.js',
  mapName: 'js-map.json'
}))
.pipe(gulp.dest('test'));


describe('test js gulp-conf-sourcemap', () => {
    test('测试生成map生成', () => {
        fs.readFile(path.resolve('./test/js-map.json'), (err: any, file: any) => {
            if (err) {
              expect(file).toBeUndefined();
            }
            if (file) {
                const distContent = file.toString();
                expect(distContent.trim()).toMatch('web-animations-js');
            }
        })
        
    });
});

