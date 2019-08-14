import * as gutil from 'gulp-util';
import * as through from 'through2';
import {File} from 'gulp-util';
import replaceExt = require('replace-ext');
import * as fs from 'fs';
import * as path from 'path';

const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-conf-sourcemap';

const isFileExisted = async (file: string) => {
  return await new Promise((resolve, reject) => {
      fs.access(file, (err) => {
          if (err) {
              reject({err});
          } else {
              resolve({success: true});
          }
      })
  })
}


const handleFileFn = async (path: string) => {
  return await new Promise((resovle, reject) => {
      fs.readFile(path, 'utf8', (err: any, file: any) => {
          if (err) {
            reject({err});
          }
          resovle({file});
      })
  })
}

const createFolder = (to: string) => {
  const sep = path.sep
  const folders = path.dirname(to).split(sep);
  let p = '';
  while (folders.length) {
      p += folders.shift() + sep;
      if (!fs.existsSync(p)) {
          fs.mkdirSync(p);
      }
  }
};

const appendContents = (destFile: string, contents: any, moduleMap: object, path: string) => {
  for (const i in moduleMap) {
    for (const id in moduleMap[i]) {
      if (moduleMap[i].hasOwnProperty(id)) {
        Object.assign(contents, {[id]: path});
      }
    }
  }
  contents = JSON.stringify(contents)
  fs.writeFile(destFile, contents, (res: any) => {
    res ? console.log('res', res) : null;
});
}

export function sourceMap(param: any = {}) {
  return through.obj(function(file:File, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
      return cb();
    }

    if (Object.keys(param).length === 0) {
      this.emit('error', new PluginError('Lack of parameter'));
      cb();
    }
    else {
      if (file.isBuffer()) {
        let {fileType, moduleMap, dest, base} = param;
        const mapName = param.mapName || 'source-map.json';
        if (fileType && file.extname === fileType) {
          if (moduleMap == null) {
            this.emit('error', new PluginError('param are missing'));
            return cb();
          }
          // 开始文件处理
          // let dirname = file.dirname;
          let _base = file._base;
          let originPath = file.path;
          // let id = dirname.split(_base + '/')[1];
          let path = base + originPath.split(_base)[1];
          let destFile = `${dest}/${mapName}`;
          let contents = {};
          isFileExisted(destFile).then(() => {
            // 文件已经存在，追加文件内数据；
            handleFileFn(destFile).then((data: any) => {
              if (data.file) {
                let a = data.file;
                contents = JSON.parse(a);
                appendContents(destFile, contents, moduleMap, path);
              }
            }).catch(err => {
              console.log(err)
            })
          }).catch(() => {
            // 文件不存在，创建该文件，并且初始化第一条数据；
            createFolder(destFile);
            appendContents(destFile, contents, moduleMap, path);
          });
        }
      }
    }
    cb();
  })
}