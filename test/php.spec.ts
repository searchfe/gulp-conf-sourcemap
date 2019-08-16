import * as gulp from 'gulp';
import * as fs from 'fs';
import * as path from 'path';
import {replacePath} from '../src/index';

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

gulp.src(['test/php-files/**/*'])
  .pipe(replacePath({
    base: 'test/php-files',
    moduleMap: conf.php,
    dest: 'test',
    fileType: '.php',
    mapName: 'php-map.json'
  }))
  .pipe(gulp.dest('test'));


describe('test php gulp-conf-sourcemap', () => {
    test('测试生成map生成', () => {
        fs.readFile(path.resolve('./test/php-map.json'), (err: any, file: any) => {
            if (err) {
              expect(file).toBeUndefined();
            }
            if (file) {
                const distContent = file.toString();
                expect(distContent.trim()).toMatch('whatwg-fetch');
            }
        })
        
    });
});

