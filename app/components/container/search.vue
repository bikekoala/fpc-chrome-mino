<template>
  <div
    class="search"
    :class="(commonsites && commonsites.status) ? styles.hasCommonsites : styles.noCommonsites">

    <div class="engines">
      <div
        v-for="(engine, index) in engines"
        :key="engine.name"
        :class="current.name === engine.name ? 'selected' : 'unselected'"
        @click="changeEngine(index)">
        <span>{{engine.name}}</span>
      </div>
    </div>

    <div class="bar">
      <input
        v-if="['baidu', 'video', 'movie'].includes(current.key)"
        autofocus
        autocomplete="off"
        ref="keyword"
        v-model="keyword"
        :placeholder="current.desc"
        @keyup.enter="searchIt">

      <template v-else-if="current.key === 'speech'">
        <textarea
          autofocus
          autocomplete="off"
          ref="keyword"
          v-model="keyword"
          :disabled="loading"
          :placeholder="current.desc">
        </textarea>
        <i @click="downloadSpeechSubtitles" class="material-icons speech-icon-download-subtitles">file_download</i>
        <i @click="downloadSpeechAudio" class="material-icons speech-icon-download-audio">cloud_download</i>
        <i @click="speakSpeech" class="material-icons speech-icon-play">play_arrow</i>
        <select class="speech-option name" v-model="options.speech.name">
          <option disabled>语音</option>
          <option v-for="option in current.options" :value="option.value">{{option.text}}</option>
        </select>
        <select class="speech-option style" v-model="options.speech.style">
          <option disabled>风格</option>
          <option v-for="style in current.options.find(v => v.value === options.speech.name).styles" :value="style[0]">{{style[1]}}</option>
        </select>
        <select class="speech-option rate" v-model="options.speech.rate">
          <option disabled>语速</option>
          <option value="-100%">0.0</option>
          <option value="-80%">0.2</option>
          <option value="-60%">0.4</option>
          <option value="-40%">0.6</option>
          <option value="-20%">0.8</option>
          <option value="0%" selected>1.0</option>
          <option value="20%">1.2</option>
          <option value="40%">1.4</option>
          <option value="60%">1.6</option>
          <option value="80%">1.8</option>
          <option value="100%">2.0</option>
          <option value="120%">2.2</option>
          <option value="140%">2.4</option>
          <option value="160%">2.6</option>
          <option value="180%">2.8</option>
          <option value="200%">3.0</option>
        </select>
        <select class="speech-option pitch" v-model="options.speech.pitch">
          <option disabled>音调</option>
          <option value="-50%">0.0</option>
          <option value="-60%">0.2</option>
          <option value="-70%">0.4</option>
          <option value="-80%">0.6</option>
          <option value="-90%">0.8</option>
          <option value="0%" selected>1.0</option>
          <option value="10%">1.2</option>
          <option value="20%">1.4</option>
          <option value="30%">1.6</option>
          <option value="40%">1.8</option>
          <option value="50%">2.0</option>
        </select>
        <img src="/static/icons/loading.svg" class="loading" :class="loading ? '' : 'hide'">
      </template>

      <template v-else-if="current.key === 'videoslice'">
        <input
            autofocus
            autocomplete="off"
            v-model="options.videoslice.source"
            ref="keyword"
            :disabled="loading"
            :placeholder="current.desc[0]">
          <textarea
              autocomplete="off"
              v-model="options.videoslice.config"
              :disabled="loading"
              :placeholder="current.desc[1]">
          </textarea>
        <i @click="sliceVideo" class="material-icons videoslice-icon-action">content_cut</i>
        <img src="/static/icons/loading.svg" class="loading" :class="loading ? '' : 'hide'">
      </template>
    </div>

    <div class="suggest" v-if="['baidu', 'video'].includes(current.key)">
      <ul>
        <li
          v-for="(text, index) in suggest"
          :key="index">
          <a href="#" @click="searchIt(text)">{{text}}</a>
        </li>
      </ul>
    </div>

    <div class="suggest" v-if="current.key === 'movie'">
      <ul>
        <li
          v-for="(movie, index) in suggest"
          :key="movie.target.id">
          <a href="#" @click="redirectDouban(movie.target.id)">
            <img :src="movie.target.cover_url" width="42">
            <p>
            <em>{{movie.target.title}}</em>
            <br>
            <span>{{movie.target.card_subtitle.split('/').slice(0, 2).join(' / ')}}</span>
            <br>
            <span>{{movie.target.card_subtitle.split('/').slice(2, 4).join(' / ')}}</span>
            <br>
            <span>{{movie.target.card_subtitle.split('/').slice(4).join(' / ')}}</span>
            </p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as engineAPI from '../../api/engines'
import translate from '../../api/google/translate'
import suggest from '../../api/google/suggest'
import { speechSubtitlesDownload, speechSpeak, videoSlice } from '../../api/api.js'
import doubanMovieSearch from '../../api/douban/movie'
import download from '../../api/download.js'

const mSpeechAudio = new Audio()

export default {
  data() {
    return {
      engines: null,
      current: {},
      keyword: '',
      options: {
        speech: {
          name: 'zh-CN-XiaoxiaoNeural',
          style: '',
          rate: '0%',
          pitch: '0%'
        },
        videoslice: {
          source: '',
          config: ''
        },
      },
      suggest: [],
      loading: false,
      styles: {
        hasCommonsites: '',
        noCommonsites: 'noCommonsites'
      }
    }
  },
  created() {
    this.engines = engineAPI.allEngines
    engineAPI.getEngineIndx.then(idx => {
      this.current = this.engines[idx]
    })
  },
  watch: {
    keyword: function (text) {
      if (!['baidu', 'video', 'movie'].includes(this.current.key)) return
      this.suggestKeywords(text)
    }
  },
  computed: {
    ...mapGetters([
      'commonsites',
      'searches'
    ])
  },
  methods: {
    // 更改默认的搜素引擎
    changeEngine(idx) {
      this.current = this.engines[idx]
      engineAPI.setEngineIndx(idx)
      setTimeout(() => this.$refs.keyword && this.$refs.keyword.focus(), 100)

      this.suggest = []
      this.suggestKeywords(this.keyword)
    },

    // 播放配音
    speakSpeech() {
      const data = this._getSpeechRequestData()

      this.loading = true
      mSpeechAudio.pause()
      speechSpeak(data).then(res => {
        mSpeechAudio.src = res
        mSpeechAudio.play()
      }).catch(err => {
        alert('播放失败：' + err)
      }).finally(() => {
        this.loading = false
      })
    },

    // 下载配音
    downloadSpeechAudio() {
      const data = this._getSpeechRequestData()

      this.loading = true
      speechSpeak(data).then(res => {
        download(res, '配音.mp3')
      }).catch(err => {
        alert('下载失败：' + err)
      }).finally(() => {
        this.loading = false
      })
    },

    // 下载字幕
    downloadSpeechSubtitles() {
      const data = this._getSpeechRequestData()

      this.loading = true
      speechSubtitlesDownload(data).then(res => {
        download(res, '配音字幕.zip')
      }).catch(err => {
        alert('下载失败：' + err)
      }).finally(() => {
        this.loading = false
      })
    },

    // 裁切视频
    sliceVideo() {
      const source = this.options.videoslice.source.trim()
      const config = this.options.videoslice.config.trim()
      if (!source || !config) return alert('视频路径或片段配置不能为空')

      this.loading = true
      videoSlice(source, config).then(res => {
        alert('裁剪成功：' + res)
      }).catch(err => {
        alert('裁剪失败：' + err)
      }).finally(() => {
        this.loading = false
      })
    },

    // 关键字推荐
    suggestKeywords(text) {
      text = text.trim()
      if (text.length < 2) {
        this.suggest = []
        return
      }

      if (this.current.key === 'movie') {
        doubanMovieSearch(text).then(items => {
          this.suggest = items
        })
      } else {
        suggest(text).then(items => {
          this.suggest = items
        })
      }
    },

    // 搜索
    searchIt(keyword) {
      keyword = typeof keyword === 'string' ? keyword : (this.keyword || this.current.desc)
      if (this.current.key === 'video') {
        for (const action of this.current.actions) {
          if (action.key === 'bilibili') {
            this.redirectUrl(action.url, keyword, true)
          }

          if (action.key === 'youtube') {
            if (this.searches.search_youtube_trans.status) {
              translate(keyword).then(text => {
                this.redirectUrl(action.url, text)
              })
            } else {
              this.redirectUrl(action.url, keyword)
            }
          }
        }
      } else {
        this.redirectUrl(this.current.url, keyword)
      }
    },

    // 跳转页面
    redirectUrl(url, keyword, isNewPage = false) {
      keyword = encodeURIComponent(keyword)
      url = url.replace(':keyword', keyword)
      if (isNewPage) {
        window.open(url, '_blank')
      } else {
        window.location.href = url
      }
    },

    // 跳转豆瓣
    redirectDouban(id) {
      const url = `https://movie.douban.com/subject/${id}/`
      window.location.href = url
    },

    // 获取配音参数
    _getSpeechRequestData() {
      const data = this.options.speech
      data.text = this.keyword || this.current.desc

      const style = this.current.options.find(v => v.value === data.name)
        .styles.find(v => v[0] === data.style)
      if (!style) {
        data.style = ''
      }

      return data
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  width: 50%;
  height: 55px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: inherit;

  & > .engines {
    position: absolute;
    margin-top: -97px;
    z-index: 2;

    & > div {
      position: relative;
      display: inline-block;
      height: 26px;
      line-height: 26px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      padding: 5px 17px;
      margin-right: 2px;
      color: #464646;

      &:after {
        content: '';
        position: absolute;
        top: 4px;
        right: 0;
        bottom: -10px;
        left: 0;
        z-index: -1;
        transform: scale(1.1,1.3) perspective(.5em) rotateX(2.2deg);
        transform-origin: bottom left;
        background: rgba(255,255,255,.8);
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }
    }

    & > div.selected {
      color: #010101;
      cursor: auto;
      z-index: 1;

      &:before {
        content: '';
        background: #fff;
        position: absolute;
        left: 0;
        height: 5px;
        bottom: -13px;
        width: 72px;
        z-index: 1;
      }

      &:after {
        background: #fff;
      }
    }

    & > div.unselected {
      text-shadow: 0 0 3px white;

      &:after {
        border: 1px rgba(255,255,255,.2) solid;
        border-bottom: none;
      }
    }
  }

  & > .bar {
    width: 100%;
    height: 100%;
    background: #fff;
    display: inline-block;

    & > form {
      width: 100%;
      height: 100%;
    }
  }

  & > .suggest {
    background: #fff;
    position: absolute;
    z-index: 99;
    top: 55px;
    width: 100%;
    border: 1px solid #ddd;
    border-top: 0 none;

    & li:first-child {
      border-top: 1px solid #eee;
    }

    & li {
      overflow: hidden;
      border-bottom: 1px solid #eee;
      font-size: 12px;

      & > a:link, & > a:visited {
        text-decoration: none;
      }

      & > a {
        color: #999;
        display: block;
        overflow: hidden;
        padding: 6px;
        padding-left: 12px;
        zoom: 1;

        & > img {
          float: left;
          margin-right: 8px;
          margin-top: 3px;
        }

        & > p {
          margin: 0;
          zoom: 1;
          overflow: hidden;

          & > em {
            font-style: normal;
            color: #369;
          }
        }
      }
    }
  }
}

.noCommonsites {
  top: 20%;
  left: 50%;
}

input {
  display: block;
  width: 90%;
  height: 55px;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  background: #fff;
  outline: none;
  color: rgba(0,0,0,.74)
}

textarea {
  display: block;
  width: 100%;
  height: 300px;
  padding: 15px 11px;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  background: #fff;
  outline: none;
  border: 1px solid #eee;
  color: rgba(0,0,0,.74)
}

.loading {
  display: block;
  position: absolute;
  top: 95px;
  left: calc((100% - 100px ) / 2);
  width: 100px;
  color: grey;
  cursor: pointer;
}

.hide {
  display: none;
}

.speech-icon-download-subtitles {
  position: absolute;
  top: 16px;
  right: 10px;
  color: grey;
  cursor: pointer;
}

.speech-icon-download-audio {
  position: absolute;
  top: 16px;
  right: 50px;
  color: grey;
  cursor: pointer;
}

.speech-icon-play {
  position: absolute;
  top: 16px;
  right: 90px;
  color: grey;
  cursor: pointer;
}

.speech-option {
  position: absolute;
  top: 270px;
  right: 0;
  cursor: pointer;
  border: none;
  color: grey;

  &.name {
    right: 10px;
  }

  &.style {
    right: 105px;
  }

  &.rate {
    right: 160px;
  }

  &.pitch {
    right: 215px;
  }
}

.videoslice-icon-action {
  position: absolute;
  top: 16px;
  right: 10px;
  color: grey;
  cursor: pointer;
}
</style>
