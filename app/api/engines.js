import * as store from './localstore'
import KEYS from './storekeys'

/**
 * 所有的搜索引擎
 */
export const allEngines = [
  {
    name: '科普',
    action: 'https://www.google.com/search',
    inputName: 'q'
  },
  {
    name: '混剪',
    action: 'https://www.bing.com/search',
    inputName: 'q'
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
    let defaults = {
      [KEYS.ENGINIE]: 0
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
