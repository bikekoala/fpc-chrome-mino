import * as store from './localstore.js'
import KEYS from './storekeys.js'

/**
 * 默认设置
 */
export const defaluts = {
  search_youtube_trans: {
    name: 'search_youtube_trans',
    text: 'Youtube 自动翻译',
    status: false,
    storeKey: KEYS.SETTING_SEARCH_YOUTUBE_TRANS
  },
  application: {
    name: 'application',
    text: '业务网站',
    status: true,
    storeKey: KEYS.SETTING_APPLICATION
  },
  commonsites: {
    name: 'commonsites',
    text: '常用网站',
    status: true,
    storeKey: KEYS.SETTING_COMMONSITES
  }
}

/**
 * bing 设置
 */
export const bing = {
  name: 'bing',
  status: true,
  inital : true
}

/**
 * 获取一个配置项
 * 当配置项在本地存储不存在时
 * 需要指定一个默认值 写入本地存储
 * @param {string} key
 * @param {Object} value
 * @return {Promise}
 */
function fetch(key, value) {
  return new Promise((resolve, reject) => {
    store.getData(key).then(data => {
      if (store.isEmptyData(data)) { //maybe frist store this data
        store.storeData({
          [key]: value
        })
        resolve(value)
      }
      resolve(data[key])
    })
  })
}

const fetchSearchYoutubeTrans = fetch(KEYS.SETTING_SEARCH_YOUTUBE_TRANS, defaluts.search_youtube_trans)
const fetchApplication = fetch(KEYS.SETTING_APPLICATION, defaluts.application)
const fetchCommonsites = fetch(KEYS.SETTING_COMMONSITES, defaluts.commonsites)

/**
 * 查询 搜索 设置项
 */
export const fetchSearches = Promise.all([fetchSearchYoutubeTrans]).then(datas => {
  const data = {
    search_youtube_trans: datas[0]
  }
  return Promise.resolve(data)
})

/**
 * 查询 模块 设置项
 */
export const fetchFeatures = Promise.all([fetchApplication, fetchCommonsites]).then(datas => {
  const data = {
    application: datas[0],
    commonsites: datas[1]
  }
  return Promise.resolve(data)
})

/**
 * 查询 必应设置项
 */
export const fetchBing = fetch(KEYS.SETTING_BING, bing)

function set(key, status, source) {
  if (typeof status === 'boolean') {
    Object.assign(source, {
      status: status
    })
    store.storeData({
      [key]: source
    })
  }
}

/**
 * 修改 设置项
 * @param {string} type
 * @param {boolean} value
 */
export const modify = (type, value) => {
  switch (type) {
    case 'search_youtube_trans':
      set(KEYS.SETTING_SEARCH_YOUTUBE_TRANS, value, defaluts.search_youtube_trans)
      break;
    case 'application':
      set(KEYS.SETTING_APPLICATION, value, defaluts.application)
      break;
    case 'commonsites':
      set(KEYS.SETTING_COMMONSITES, value, defaluts.commonsites)
      break;
    case 'bing':
      set(KEYS.SETTING_BING, value, bing)
      break;
    default:
      break;
  }
}

/**
 * 默认颜色
 */
export const colors = ['#3b5998','#5f7ec1','#2b6b73','#337ab7','#f0ad4e',
  '#3b987a','#cdbfe3','#d9534f', '#983b59','#987a3b','#88983b','#674a34','#67758a']

/**
 * 存储颜色到本地存储
 * @param {String} value
 */
export const setColor = value => {
  store.storeData({
    [KEYS.SETTING_COLOR]: value
  })
}

/**
 * 获取本地存储的颜色
 * @return {String}
 */
export const fetchColor = fetch(KEYS.SETTING_COLOR,colors[0])

// store.getAll().then(v=>{
//   console.log(v)
// })

//store.clearAll()
