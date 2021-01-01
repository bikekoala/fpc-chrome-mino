import axios from 'axios'

const api = 'http://translate.googleapis.com/translate_a/single?client=gtx&dt=t'

/**
 * Translate with iso-639_1
 */
function translate(text, sl = 'zh', tl = 'en') {
  return new Promise((resolve, reject) => {
    text = `${text}`.trim()
    if (!text) resolve('')

    const params = { sl, tl, q: text }
    axios.get(api, { params }).then(ret => {
      resolve(ret.data[0].map(el => el[0]).join(' '))
    }).catch(err => {
      reject(err)
    })
  })
}

export default translate
