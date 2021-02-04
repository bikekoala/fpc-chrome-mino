import axios from 'axios'

const mClient = axios.create({
  baseURL: 'http://10.0.0.12:3001',
  timeout: 60000 * 10
})


/**
 * 字幕下载
 */
function captionsDownload(text) {
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
      url: `/captions/download`,
      data: {
        text
      },
      responseType: 'arraybuffer'
    }
    mClient(config).then(res => {
      _toBase64(res.data, 'application/zip').then(base64 => {
        resolve(base64)
      })
    }).catch(err => reject(err))
  })
}

/**
 * 视频裁剪
 */
function videosCut(path) {
  return _fmt(mClient.get('/videos/cut', { params: { path } }))
}

function _fmt(client) {
  return new Promise((resolve, reject) => {
    client.then(res => {
      if (res.data.code === 200) return resolve(res.data.data)
      else return reject(res.data.message)
    }).catch(err => {
      return reject(err)
    })
  })
}

export {
  captionsDownload,
  videosCut
}
