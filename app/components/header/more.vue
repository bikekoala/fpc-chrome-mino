<template>
  <div>
    <h3 class="title">更多</h3>
    <div class="item">
      <span @click="redirectPluginPages">安装下载插件</span>
    </div>
    <div class="item">
      <span @click="clearLocalstore">清空缓存</span>
    </div>
    <div class="item">
      <a href="https://github.com/bikekoala/fpc-mino/issues">反馈</a>
    </div>
  </div>
</template>

<script>
import { clearAll } from '../../api/localstore.js'

export default {
  data() {
    return {
      plugins: [
        // 哔哩哔哩下载助手 [Chrome 扩展]
        'https://chrome.google.com/webstore/detail/bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B/bfcbfobhcjbkilcbehlnlchiinokiijp',
        // 油猴脚本 [Chrome 扩展]
        'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN',
        // Youtube 视频下载 [油猴脚本]
        'https://greasyfork.org/en/scripts/369400-local-youtube-downloader',
        // 豆瓣电影资源助手 [油猴脚本]
        'https://greasyfork.org/en/scripts/419335-fpc-%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B',
      ]
    }
  },
  methods: {
    // 清空本地缓存
    clearLocalstore() {
      clearAll()
      window.location.reload()
    },

    // 跳转到插件安装页面
    redirectPluginPages() {
      for (const url of this.plugins) {
        this.redirect(url)
      }
    },

    // 跳转
    redirect(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.more {
  font-size: 13px;
  color: rgba(0,0,0,.74);
  line-height: 18px;

  & > a {
    text-decoration: underline;
    color: rgba(0,0,0,1)
  }
}
</style>
