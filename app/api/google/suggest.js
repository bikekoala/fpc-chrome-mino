import axios from 'axios'
import he from 'he'

const api = 'https://clients1.google.com/complete/search'

/**
 * Translate with iso-639_1
 */
function translate(text) {
  return new Promise((resolve, reject) => {
    text = `${text}`.trim()
    if (!text) resolve('')

    const params = {
      client: 'heirloom-hp',
      hl: 'cn',
      gs_rn: 0,
      gs_ri: 'heirloom-hp',
      cp: text.length,
      gs_id: 0,
      q: text
    }
    axios.get(api, { params }).then(ret => {
      if (typeof ret.data !== 'string') return reject(ret.data)

      try {
        const suggestions = parseData(ret.data)
        resolve(suggestions)
      } catch (err) {
        reject(err)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

function parseData(data) {
  const regex = /^window\.google\.ac\.h\((.*)\)$/
  const temp = regex.exec(data)
  const body = temp ? JSON.parse(temp[1]) : []

  if (Array.isArray(body) && body.length) {
    return body[1].map(item => he.decode(stripTags(item[0])))
  }

  return []
}

function stripTags(s) {
  const regex = /\<\/?[^\>]+\>/g
  return s.replace(regex, '')
}

export default translate
