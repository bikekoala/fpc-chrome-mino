import axios from 'axios'

/**
 * Translate with iso-639_1
 *
 * @param text $text
 * @param sl = 'zh' $sl = 'zh'
 * @param tl = 'en' $tl = 'en'
 * @access public
 * @return void
 */
function translate (text, sl = 'zh', tl = 'en') {
  return new Promise((resolve, reject) => {
    let api = 'http://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=:sl&tl=:tl&q=:q'
    api = api.replace(':sl', sl).replace(':tl', tl).replace(':q', encodeURIComponent(text))
    text = `${text}`.trim()
    if (!text) resolve('')

    axios.get(api).then(ret => {
      resolve(ret.data[0].map(el => el[0]).join(' '))
    }).catch(err => {
      reject(err)
    })
  })
}

export default translate
