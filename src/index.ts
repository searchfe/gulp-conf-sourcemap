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

const getFile = async (path: string) => {
  return await new Promise((resovle, reject) => {
      fs.readFile(path, 'utf8', (err: any, file: any) => {
          if (err) {
            reject({err});
          }
          resovle({file});
      })
  })
}

const handleContents = (destFile: string, contents: any, map: object, path: string) => {
  for (const i in map) {
    if (typeof(map[i]) === 'object') {
      handleContents(destFile, contents, map[i], path);
    }
    if (typeof(map[i]) === 'string') {
      let id = i.toLowerCase();
      let value = path.toLowerCase();
      if (value.indexOf(`/${id}`) !== -1) {
        map[i] = path;
      }
    }
  }
}

const handle = (contents: any, destFile: string, path: string, cb: any, confFile: string) => {
  getFile(confFile).then((data: any) => {
    if (data.file) {
      let obj = data.file;
      contents = JSON.parse(obj);
      let map =  Object.assign({}, contents);
      handleContents(destFile, contents, map, path);
      contents = Object.assign({}, contents, map);
      contents = JSON.stringify(contents);
      fs.writeFile(destFile, contents, (res: any) => {
        if (res) console.log('res', res);
        cb();
      });
    }
    else {
      cb();
    }
  }).catch(err => {
    cb();
    console.log(err)
  })
}

export function replacePath(param: any = {}) {
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
        let {fileType, dest, base, confFile} = param;
        const mapName = param.mapName || 'source-map.json';
        if (fileType && file.extname === fileType && confFile) {
          // 开始文件处理
          let _base = file._base;
          let originPath = file.path;
          let path = base + originPath.split(_base)[1];
          let destFile = `${dest}/${mapName}`;
          let contents = {};
          isFileExisted(destFile).then(() => {
              handle(contents, destFile, path, cb, destFile);
          }).catch(() => {
            createFolder(destFile);
            handle(contents, destFile, path, cb, confFile);
          });
        }
        else {
          cb();
        }
      }
      else {
        cb();
      }
    }
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

const formatHandle = (map: any, contents: any, shim: any, destFile: string, cb: any) => {
  for (const i in map) {
    if (typeof(map[i]) === 'object') {
      formatHandle(map[i], contents, shim, destFile, cb);
    }
    if (typeof(map[i]) === 'string') {
      let value = map[i].replace('.js', '');
      Object.assign(contents, {[i]: value});
      Object.assign(shim, {[i]: {exports: [i]}});
    }
  }
}

export function formatConf(param: any = {}) {
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
        let {dest, isShim} = param;
        const name = param.name || 'async-conf.js';
        let destFile = `${dest}/${name}`;
        let contents = {};
        let shim = {};
        let map: any = file.contents.toString();
        map = JSON.parse(map);
        isFileExisted(destFile).then(() => {
          this.emit('error', new PluginError('The file already exists'));
          cb();
        }).catch(() => {
          createFolder(destFile);
          formatHandle(map, contents, shim, destFile, cb);
          contents = JSON.stringify(contents);
          shim = JSON.stringify(shim);
          let conf = '';
          if (isShim) {
            conf = `'paths': ${contents}, shim: ${shim}`
          }
          else {
            conf = `'paths': ${contents}`
          }
          contents = `(function () {
            require.config({
              ${conf}
            });
          })();`
          fs.writeFile(destFile, contents, (res: any) => {
            res ? console.log('res', res) : null;
            cb();
          });
        });
      }
      else {
        cb();
      }
    }
  })
}