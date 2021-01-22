/**
 * 下载文件
 */
const download = (url, filename = 'download', cb) => {
  const options = { url, filename }
  typeof cb === 'function' ?
    chrome.downloads.download(options, cb) :
    chrome.downloads.download(options)
}

export default download
