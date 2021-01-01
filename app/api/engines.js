import * as store from './localstore'
import KEYS from './storekeys'

/**
 * 所有的搜索引擎
 */
export const allEngines = [
  {
    name: '素材',
    desc: '美国 国旗',
    key: 'video',
    actions: [
      {
        key: 'bilibili',
        url: 'https://search.bilibili.com/all?keyword=:keyword'
      },
      {
        key: 'youtube',
        url: 'https://www.youtube.com/results?search_query=:keyword'
      },
    ]
  },
  {
    name: '影视',
    desc: '肖申克的救赎',
    key: 'movie',
    url: 'https://search.douban.com/movie/subject_search?search_text=:keyword'
  },
  {
    name: '谷歌',
    desc: '维基百科',
    key: 'google',
    url: 'https://www.google.com/search?q=:keyword'
  }
]

/**
 * 获取默认的搜索引擎 index
 * @return {number}
 */
export const getEngineIndx = store.getData(KEYS.ENGINIE).then(data => {
  // 没有默认的搜索引擎
  // 设置 谷歌
  if (store.isEmptyData(data)) {
    const defaults = {
      [KEYS.ENGINIE]: 2
    }
    store.storeData(defaults)
    return defaults[KEYS.ENGINIE]
  }
  return data[KEYS.ENGINIE]
})

/**
 * 设置新的搜索引擎
 * @param {number} index
 */
export const setEngineIndx = index => {
  store.storeData({
    [KEYS.ENGINIE]: index
  })
}
