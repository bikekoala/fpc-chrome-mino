import axios from 'axios'

/**
 * 字幕下载
 */
function captionsDownload(text, engine = {}) {
  const _toBase64 = (arraybuffer, type = 'audio/mpeg') => {
    return new Promise((resolve) => {
      const blob = new Blob([arraybuffer], { type })
      var reader = new window.FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        resolve(reader.result)
      }
    })
  }

  return new Promise((resolve, reject) => {
    const config = {
      method: 'POST',
      url: engine.url,
      data: {
        text
      },
      responseType: 'arraybuffer'
    }
    axios(config).then(res => {
      _toBase64(res.data, 'application/zip').then(base64 => {
        resolve(base64)
      })
    }).catch(err => reject(err))
  })
}

export {
  captionsDownload
}
