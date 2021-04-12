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
    name: '目录',
    desc: '测试-蒙娜丽莎\n测试-戴珍珠耳环的少女',
    key: 'dirsmake'
  },
  {
    name: '字幕',
    desc: '我-\n步入丛林，希望活得更有意义。\n我-\n希望活得深刻，汲取所有生命之精髓！\n击溃所有非生命的事物...\n在生命终结时，不想感叹自己从没火【活】过...',
    key: 'captions'
  },
  {
    name: '裁剪',
    desc: '\\\\10.0.0.10\\剪辑\\项目\\科普\\素材\\2.18\\薛定谔的猫',
    key: 'videoscut'
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
