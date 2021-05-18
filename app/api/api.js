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
  return _fmtBuffer(mClient({
    method: 'POST',
    url: `/speech/speak`,
    data,
    responseType: 'arraybuffer'
  }), 'audio/mpeg')
}

/**
 * 配音字幕下载
 */
function speechSubtitlesDownload(data) {
  return _fmtBuffer(mClient({
    method: 'POST',
    url: `/speech/subtitles`,
    data,
    responseType: 'arraybuffer'
  }), 'application/zip')
}

/**
 * 音频字幕下载
 */
function audioSubtitlesDownload(data) {
  return _fmtBuffer(mClient({
    method: 'POST',
    url: `/audio/subtitles`,
    data,
    responseType: 'arraybuffer'
  }), 'application/octet-stream')
}

/**
 * 视频裁剪
 */
function videoSlice(source, config) {
  return _fmtNormal(mClient.post('/video/slice', { source, config }))
}

function _fmtBuffer(client, type) {
  return new Promise((resolve, reject) => {
    client.then(res => {
      const data = _buffer2json(res.data)
      if (data.message) {
        reject(data.message)
      } else {
        _toBase64(res.data, type).then(base64 => {
          resolve(base64)
        })
      }
    }).catch(err => reject(err))
  })
}

function _fmtNormal(client) {
  return new Promise((resolve, reject) => {
    client.then(res => {
      if (res.data.code === 200) return resolve(res.data.data)
      else return reject(res.data.message)
    }).catch(err => {
      return reject(err)
    })
  })
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

function _buffer2json(buffer) {
  const uint8Data = new Uint8Array(buffer)
  const decodedString = String.fromCharCode.apply(null, uint8Data)

  try {
    return JSON.parse(decodedString)
  } catch (e) {
    return buffer
  }
}

export {
  speechSpeak,
  speechSubtitlesDownload,
  audioSubtitlesDownload,
  videoSlice
}
