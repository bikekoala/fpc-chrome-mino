import axios from 'axios'

const api = 'https://douban.lovemefan.top/api/v2/search/movie?apikey=054022eaeae0b00e0fc068c0c0a2102a'

/**
 * 检索豆瓣电影
 */
function search(keyword, count = 6) {
  return new Promise((resolve, reject) => {
    keyword = `${keyword}`.trim()
    if (!keyword) resolve('')

    const params = { q: keyword, count }
    axios.get(api, { params }).then(ret => {
      if (ret.data.code) return reject(ret.data)
      resolve(ret.data.items.slice(0, count))
    }).catch(err => {
      reject(err)
    })
  })
}

export default search
