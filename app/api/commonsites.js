import * as store from './localstore.js'
import KEYS from './storekeys'

const path = './static/sites'

/**
 * 默认的 lovesites
 */
const defaults = [
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/',
    icon: `${path}/youtube.png`
  },
  {
    name: '西瓜视频',
    url: 'https://www.ixigua.com/',
    icon: `${path}/xigua.png`
  },
  {
    name: '哔哩哔哩',
    url: 'https://www.bilibili.com/',
    icon: `${path}/bilibili.png`
  },
  {
    name: '维基百科',
    url: 'https://www.wikipedia.org/',
    icon: `${path}/wiki.png`
  }
]

/**
 * 获取所有lovesites
 * @return {Array}
 */
export const getCommonsites = store.getData(KEYS.LOVESITES).then(data => {

  // 常用网站为空
  if (store.isEmptyData(data)) {
    store.storeData({
      [KEYS.LOVESITES]: defaults
    })
    return defaults
  }

  return data[KEYS.LOVESITES]
})
