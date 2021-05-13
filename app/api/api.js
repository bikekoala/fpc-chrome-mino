import axios from 'axios'

const mClient = axios.create({
  baseURL: 'http://10.10.0.10:3001',
  //baseURL: 'http://localhost:3001',
  timeout: 60000 * 10
})

/**
 * 播放配音
 */
function speechSpeak(data) {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'POST',
      url: `/speech/speak`,
      data,
      responseType: 'arraybuffer'
    }
    mClient(config).then(res => {
      _toBase64(res.data).then(base64 => {
        resolve(base64)
      })
    }).catch(err => reject(err))
  })
}

/**
 * 字幕下载
 */
function speechSubtitlesDownload(data) {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'POST',
      url: `/speech/subtitles`,
      data,
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
function videoSlice(source, config) {
  return _fmt(mClient.post('/video/slice', { source, config }))
}

function _toBase64(arraybuffer, type = 'audio/mpeg') {
  return new Promise((resolve) => {
    const blob = new Blob([arraybuffer], { type })
    var reader = new window.FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      resolve(reader.result)
    }
  })
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
  speechSpeak,
  speechSubtitlesDownload,
  videoSlice
}
