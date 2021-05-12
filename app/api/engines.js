import * as store from './localstore'
import KEYS from './storekeys'

/**
 * 所有的搜索引擎
 */
export const allEngines = [
  {
    name: '百度',
    desc: '',
    key: 'baidu',
    url: 'https://www.baidu.com/s?wd=:keyword'
  },
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
    name: '配音',
    desc: '我-\n步入丛林，希望活得更有意义。\n我-\n希望活得深刻，汲取所有生命之精髓！\n击溃所有非生命的事物...\n在生命终结时，不想感叹自己从没火【活】过...',
    key: 'speech',
    options: [
      {
        text: '普通话-晓晓',
        value: 'zh-CN-XiaoxiaoNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['affectionate', '亲切'],
          ['gentle', '温和'],
          ['lyrical', '抒情'],
          ['calm', '冷静'],
          ['serious', '严肃'],
          ['fearful', '紧张'],
          ['newscast', '新闻'],
          ['chat', '聊天'],
          ['assistant', '助理'],
          ['customerservice', '客服'],
          ['disgruntled', '不悦'],
          ['sad', '悲伤'],
          ['angry', '生气'],
        ]
      },
      {
        text: '普通话-晓悠',
        value: 'zh-CN-XiaoyouNeural',
        styles: [
          ['', '正常'],
        ]
      },
      {
        text: '普通话-晓涵',
        value: 'zh-CN-XiaohanNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['affectionate', '亲切'],
          ['gentle', '温和'],
          ['calm', '冷静'],
          ['serious', '严肃'],
          ['fearful', '紧张'],
          ['disgruntled', '不悦'],
          ['sad', '悲伤'],
          ['angry', '生气'],
          ['embarrassed', '犹豫'],
        ]
      },
      {
        text: '普通话-晓墨',
        value: 'zh-CN-XiaomoNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['gentle', '温和'],
          ['calm', '冷静'],
          ['serious', '严肃'],
          ['fearful', '紧张'],
          ['disgruntled', '不悦'],
          ['depressed', '沮丧'],
          ['angry', '生气'],
        ]
      },
      {
        text: '普通话-晓睿',
        value: 'zh-CN-XiaoruiNeural',
        styles: [
          ['', '正常'],
          ['calm', '冷静'],
          ['fearful', '紧张'],
          ['sad', '悲伤'],
          ['angry', '生气'],
        ]
      },
      {
        text: '普通话-晓萱',
        value: 'zh-CN-XiaoxuanNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['gentle', '温和'],
          ['calm', '冷静'],
          ['serious', '严肃'],
          ['fearful', '紧张'],
          ['disgruntled', '不悦'],
          ['sad', '悲伤'],
          ['angry', '生气'],
        ]
      },
      {
        text: '普通话-云扬',
        value: 'zh-CN-YunyangNeural',
        styles: [
          ['', '正常'],
          ['customerservice', '客服'],
          ['narration', '叙述'],
        ]
      },
      {
        text: '普通话-云野',
        value: 'zh-CN-YunyeNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['calm', '冷静'],
          ['serious', '严肃'],
          ['fearful', '紧张'],
          ['disgruntled', '不悦'],
          ['sad', '悲伤'],
          ['angry', '生气'],
        ]
      },
      {
        text: '普通话-云希',
        value: 'zh-CN-YunxiNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['calm', '冷静'],
          ['serious', '严肃'],
          ['fearful', '紧张'],
          ['assistant', '助理'],
          ['disgruntled', '不悦'],
          ['sad', '悲伤'],
          ['angry', '生气'],
          ['depressed', '沮丧'],
          ['embarrassed', '犹豫'],
        ]
      },
      {
        text: '英音-Mia',
        value: 'en-GB-MiaNeural',
        styles: [
          ['', '正常'],
        ]
      },
      {
        text: '英音-Libby',
        value: 'en-GB-LibbyNeural',
        styles: [
          ['', '正常'],
        ]
      },
      {
        text: '英音-Ryan',
        value: 'en-GB-RyanNeural',
        styles: [
          ['', '正常'],
        ]
      },
      {
        text: '美音-Jenny',
        value: 'en-US-JennyNeural',
        styles: [
          ['', '正常'],
          ['newscast', '新闻'],
          ['chat', '聊天'],
          ['assistant', '助理'],
          ['customerservice', '客服'],
        ]
      },
      {
        text: '美音-Guy',
        value: 'en-US-GuyNeural',
        styles: [
          ['', '正常'],
          ['newscast', '新闻'],
        ]
      },
      {
        text: '美音-Aria',
        value: 'en-US-AriaNeural',
        styles: [
          ['', '正常'],
          ['cheerful', '欢快'],
          ['gentle', '温和'],
          ['newscast-casual', '新闻C'],
          ['newscast-formal', '新闻F'],
          ['chat', '聊天'],
          ['customerservice', '客服'],
          ['narration', '叙述'],
        ]
      },
    ]
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
