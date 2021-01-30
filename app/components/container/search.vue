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
        v-if="!['tts', 'tts-new'].includes(current.key)"
        autofocus
        autocomplete="off"
        ref="keyword"
        v-model="keyword"
        :placeholder="current.desc"
        @keyup.enter="searchIt"></input>
      <template v-else>
        <textarea
          class="tts-input"
          autofocus
          autocomplete="off"
          :disabled="ttsLoading"
          ref="keyword"
          v-model="keyword"
          :placeholder="current.desc">
        </textarea>
        <i @click="downloadVoice"
          class="material-icons tts-download">file_download</i>
        <img src="/static/icons/loading.svg" class="tts-loading" :class="ttsLoading ? '' : 'hide'">
      </template>
    </div>

    <div class="suggest" v-if="!['movie', 'tts', 'tts-new'].includes(current.key)">
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
import speech from '../../api/azure/speech'
import doubanMovieSearch from '../../api/douban/movie'
import download from '../../api/download.js'

export default {
  data() {
    return {
      engines: null,
      current: {},
      keyword: '',
      suggest: [],
      ttsLoading: false,
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
      if (['tts', 'tts-new'].includes(this.current.key)) return
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
      setTimeout(() => this.$refs.keyword.focus(), 100)

      this.suggest = []
      this.suggestKeywords(this.keyword)
    },

    // 下载 TTS 语音
    downloadVoice() {
      const text = this.keyword || this.current.desc
      this.ttsLoading = true
      speech(text, this.current).then(res => {
        if (this.current.key === 'tts') download(res, '配音.mp3')
        if (this.current.key === 'tts-new') download(res, '配音字幕.zip')
      }).catch(err => {
        alert(err)
      }).finally(() => {
        this.ttsLoading = false
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
  width: 100%;
  height: 55px;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  background: #fff;
  outline: none;
  border: 1px solid #eee;
  border-radius: 2px;
  color: rgba(0,0,0,.74)
}

.tts-input {
  display: block;
  width: 100%;
  height: 300px;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  background: #fff;
  outline: none;
  border: 1px solid #eee;
  border-radius: 2px;
  color: rgba(0,0,0,.74)
}

.tts-download {
  position: absolute;
  top: 7px;
  right: 10px;
  color: grey;
  cursor: pointer;
}

.tts-loading {
  display: block;
  position: absolute;
  top: 95px;
  left: 45%;
  width: 100px;
  color: grey;
  cursor: pointer;
}

.hide {
  display: none;
}

</style>
