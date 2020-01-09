import * as gulp from 'gulp';
import * as fs from 'fs';
import * as path from 'path';
import {replacePath} from '../src/index';

const conf = {
    "php": {
        "glob": {
        "fetch": "whatwg-fetch/fetch.js",
        "from": "@searchfe/polyfills/array/from.js",
        "fill": "@searchfe/polyfills/array/prototype/fill.js",
        "find": "@searchfe/polyfills/array/prototype/find.js",
        "findIndex": "@searchfe/polyfills/array/prototype/findIndex.js"
        },
        "umd": {
        "polyfill": "promise-polyfill/lib/polyfill.js"
        }
    },
    "js": {
        "concat": {
        "Animation": "@baidu/web-animations-js/web-animations.min.js"
        }
    }
}

gulp.src(['test/js-file/**/*'])
.pipe(replacePath({
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

