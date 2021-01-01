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
        type="text"
        autofocus
        autocomplete="off"
        ref="keyword"
        v-model="keyword"
        :placeholder="current.desc"
        @keyup.enter="searchIt">
    </div>
  </div>
</template>

<script>
import * as engineAPI from '../../api/engines'
import translate from '../../api/google/translate'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      engines: null,
      current: {},
      keyword: '',
      styles: {
        hasCommonsites: '',
        noCommonsites: 'noCommonsites'
      }
    }
  },
  created() {
    // get data from api
    this.engines = engineAPI.allEngines
    engineAPI.getEngineIndx.then(idx => {
      this.current = this.engines[idx]
    })
  },
  computed: {
    ...mapGetters([
      'commonsites',
      'searches'
    ])
  },
  components: {
  },
  methods: {
    // 更改默认的搜素引擎
    changeEngine(idx) {
      this.current = this.engines[idx]
      engineAPI.setEngineIndx(idx)
      this.$refs.keyword.focus()
    },

    // 搜索
    searchIt() {
      const keyword = this.keyword || this.current.desc
      if (this.current.key === 'video') {
        for (const action of this.current.actions) {
          if (action.key === 'bilibili') {
            this.redirect(action.url, keyword, true)
          }

          if (action.key === 'youtube') {
            if (this.searches.search_youtube_trans.status) {
              translate(keyword).then(text => {
                this.redirect(action.url, text)
              })
            } else {
              this.redirect(action.url, keyword)
            }
          }
        }
      } else {
        this.redirect(this.current.url, keyword)
      }
    },

    // 跳转
    redirect(url, keyword, isNewPage = false) {
      keyword = encodeURIComponent(keyword)
      url = url.replace(':keyword', keyword)
      if (isNewPage) {
        window.open(url, '_blank')
      } else {
        window.location.href = url
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.engines {
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
}

.noCommonsites {
  top: 20%;
  left: 50%;
}

input[type="text"] {
  display: block;
  width: 100%;
  height: 55px;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  background: rgba(255,255,255,.84);
  outline: none;
  border: 1px solid #eee;
  border-radius: 2px;
  color: rgba(0,0,0,.74)
}

</style>
