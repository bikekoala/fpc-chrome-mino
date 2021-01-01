<template>
  <div>
    <h3 class="title">搜索</h3>
    <div
      class="item"
      v-for="(item, idx) in searches"
      :key="item.name">
      <span>{{item.text}}</span>
      <Choose
        :id="idx"
        :initial="item.status"
        @hanlder='searchesHanlder'></Choose>
    </div>
  </div>
</template>

<script>
import Choose from '../common/choose.vue'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['searches'])
  },
  methods: {
    searchesHanlder(index) {
      const item = this.searches[index]
      this.$store.dispatch('modifySearches',{ type: item.name, status: !item.status })
    }
  },
  components: {
    Choose
  }
}
</script>
