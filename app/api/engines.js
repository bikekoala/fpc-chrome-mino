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
    name: '微信',
    desc: '薛定谔的猫',
    key: 'wechat',
    url: 'https://weixin.sogou.com/weixin?type=2&query=:keyword'
  },
  {
    name: '配音',
    desc: '我步入丛林，希望活得更有意义。\n我希望活得深刻，汲取所有生命之精髓！\n击溃所有非生命的事物...\n在生命终结时，不想感叹自己从没活过...',
    key: 'tts',
    url: ''
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
