import https from 'https'
import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import webpack from 'webpack'
// @ts-ignore
import download from 'download-git-repo'
import { promisify } from 'util'
import { exec } from 'child_process'
import { Optional } from '../interface/option'

const webpackWithPromise = promisify(webpack)

const tsUrl = 'https://raw.githubusercontent.com/zhusjfaker/egg-react-ssr/backup/example/ssr-with-ts/package.json'
const jsUrl = 'https://raw.githubusercontent.com/ykfe/egg-react-ssr/master/example/ssr-with-js/package.json'

const processError = (err: string) => {
  if (err) {
    console.log('err', err)
    process.exit()
  }
}

const execWithPromise = promisify(exec)

const downloadWithPromise = promisify(download)

const resolveApp = (source: string) => {
  // 以根目录为基准
  return path.resolve(__dirname, `../../${source}`)
}

const getWithPromise = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data: string = ''
    https.get(url, res => {
      res.on('data', (chunk: Buffer) => { data += chunk.toString() })
      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    }).on('error', () => reject())
  })
}

/**
 * http
 * 缓存判断是否有效处理
 * @export
 * @param {Optional} option
 * @returns {Promise<boolean>}
 */
async function getVersionEffective (option: Optional): Promise<boolean> {
  if (fs.existsSync(resolveApp('./cache'))) {
    const url = option.language === 'typescript' ? tsUrl : jsUrl
    const language = option.language === 'javascript' ? 'js' : 'ts'
    const { version } = await getWithPromise(url)
    const localVersion = require(resolveApp(`./cache/example/ssr-with-${language}/package.json`)).version.trim()
    // 如果版本一样就不用更新
    return version.trim() === localVersion
  }
  return false
}

/**
 * 渲染 Nunjuncks
 *
 * @export
 * @param {string} template 模板路径
 * @param {string} file 写入文件
 * @param {Optional} content 写入内容
 */
function renderTemplate (template: string, file: string, content: Optional): void {
  if (fs.existsSync(template)) {
    const templateContent = fs.readFileSync(template).toString()
    const result = nunjucks.renderString(templateContent, content)
    fs.writeFileSync(file, result)
  }
}
export {
  webpackWithPromise,
  renderTemplate,
  getVersionEffective,
  processError,
  execWithPromise,
  downloadWithPromise,
  getWithPromise,
  resolveApp
}
