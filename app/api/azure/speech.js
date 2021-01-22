import xmlbuilder from 'xmlbuilder'
import axios from 'axios'

const mKey = '0d2009f4c37c41819413e5316d4560b7'
const mLocation = 'southeastasia'

/**
 * 微软晓晓文字转语音
 */
function speech(text) {
  return new Promise((resolve, reject) => {
      getAccessToken().then(res => {
        textToSpeech(res.data, text).then(res1 => {
          toBase64(res1.data).then(base64 => {
            resolve(base64)
          })
        }).catch(err => reject(err))
      }).catch(err => reject(err))
  })
}

function toBase64(arraybuffer) {
  return new Promise((resolve) => {
    const blob = new Blob([arraybuffer], { type: 'audio/mpeg' })
    var reader = new window.FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      resolve(reader.result)
    }
  })
}

function getAccessToken() {
  const config = {
    method: 'POST',
    url: `https://${mLocation}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`,
    headers: {
      'Ocp-Apim-Subscription-Key': mKey
    }
  }
  return axios(config)
}

function textToSpeech(accessToken, text) {
  // Create the SSML request.
  const xmlBody = xmlbuilder.create('speak')
    .att('version', '1.0')
    .att('xml:lang', 'zh-CN')
    .ele('voice')
    .att('xml:lang', 'zh-CN')
    .att('name', 'zh-CN-XiaoxiaoNeural')
    .txt(text)
    .end()

  // Convert the XML into a string to send in the TTS request.
  const body = xmlBody.toString()

  const config = {
    method: 'POST',
    baseURL: `https://${mLocation}.tts.speech.microsoft.com/`,
    url: 'cognitiveservices/v1',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'cache-control': 'no-cache',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'Content-Type': 'application/ssml+xml'
    },
    responseType: 'arraybuffer',
    data: body
  }

  return axios(config)
}

export default speech
