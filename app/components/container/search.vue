<template>
  <div
    class="search"
    :class="(commonsites && commonsites.status) ? styles.hasCommonsites : styles.noCommonsites">

    <div class="engines">
      <div
        v-for="(engine,index) in engines"
        :key="engine.name"
        :class="current.name === engine.name ? 'selected' : 'unselected'"
        @click="changeEngine(index)">
        <span>{{engine.name}}</span>
      </div>
    </div>

    <div class="bar">
      <form :action="current.action">
        <input
          type="text"
          :name="current.inputName"
          autofocus autocomplete="off" placeholder="Go anywhere.">
      </form>
    </div>
  </div>
</template>

<script>
import * as engineAPI from '../../api/engines'
import { mapGetters } from 'vuex'

export default {
  data() {
    return{
      engines: null,
      current: {},
      styles: {
        hasCommonsites: '',
        noCommonsites: 'noCommonsites'
      }
    }
  },
  created() {
    // get data from api
    this.engines = engineAPI.allEngines
    engineAPI.getEngineIndx.then( idx =>{
      this.current = this.engines[idx]
      console.log(1111, this.current.name)
    })
  },
  computed: {
    ...mapGetters([
      'commonsites'
    ])
  },
  components: {
  },
  methods: {
    // 更改默认的搜素引擎
    changeEngine(idx) {
      this.current = this.engines[idx]
      engineAPI.setEngineIndx(idx)
    }
  }
};
</script>

<style lang="scss" scoped>
.engines {
  position: absolute;
  margin-top: -97px;
  margin-left: 18px;
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
  width: 680px;
  height: 70px;
  padding: 0 2px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: inherit;

  & > .icon {
    width: 55px;
    height: 55px;

    padding: 2px;
    background: #fff;
    opacity: .84;

    border: 1px solid #eee;
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    & > img {
      width: 36px;
      height: 36px;
    }
  }

  & > .bar {
    width: 520px;
    height: 55px;
    margin-left: 18px;
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
