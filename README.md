## 使用方式

```bash
npm install --save-dev gulp-conf-sourcemap
```

`gulpfile.js` 配置：

```javascript
const sourceMap = require('gulp-conf-sourcemap').sourceMap;
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


```

> ps: 该插件的作用是通过conf文件的id获取文件的实际路径，并且重新生成map；
