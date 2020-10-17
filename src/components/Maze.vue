<template>
  <div class="game fill-height pa-16">
    <v-btn @click="closestPathToFinish">Find path</v-btn>
    <div class="maze fill-height" :style="{ '--cols': cols, '--rows': rows }" v-if="data">
      <div
        class="cell"
        v-for="(cell, index) of data.data"
        :class="[
          { pony: index === data.pony[0] },
          { domokun: index === data.domokun[0] },
          { finish: index === data['end-point'][0] },
          { 'border-right': index !== 0 && (index + 1) % cols === 0 },
          { 'border-bottom': index > cols * rows - cols - 1 },
          { 'border-top': cell.includes('north') },
          { 'border-left': cell.includes('west') }
        ]"
        :data-index="index"
        :key="index"
      >
        <span v-if="index === data.pony[0]">🐎</span>
        <span v-if="index === data.domokun[0]">👾</span>
        <span v-if="index === data['end-point'][0]">🏁</span>
        <span class="index">{{ index }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import mazeUtilitiesMixin from './maze-utilities-mixin'

export default {
  mixins: [mazeUtilitiesMixin],

  props: {
    id: {
      type: String,
      required: true
    },

    cols: {
      type: Number,
      required: true
    },

    rows: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    data: null,
    ponyPathPos: 0
  }),

  computed: {
    // closestPathToFinish() {
    //   if (!this.data) return []
    //
    //   const ponyPos = this.data.pony[0]
    //   const finishPos = this.data['end-point'][0]
    //   return this.tryPath(ponyPos, finishPos, [])
    // }
  },

  created() {
    this.$axios.get(`/maze/${this.id}`).then(({ data }) => {
      this.data = data
      // this.initGame()
    })
  },

  methods: {
    closestPathToFinish() {
      if (!this.data) return []

      const ponyPos = this.data.pony[0]
      const finishPos = this.data['end-point'][0]
      const path = this.tryPath(ponyPos, finishPos, [])
      console.log(path)
    },

    initGame() {
      const { closestPathToFinish: path, ponyPathPos } = this
      const map = {
        top: 'north',
        right: 'east',
        bottom: 'south',
        left: 'west'
      }

      const step = path[ponyPathPos].step
      const pos = path[ponyPathPos].pos
      const direction = map[step]

      this.$axios.post(`/maze/${this.id}`, { direction }).then(() => {
        this.ponyPathPos++
        if (pos !== this.data.pony[0]) this.initGame()
      })
    },

    tryPath(pos, finishPos, path) {
      let writePath = cloneDeep(path)

      function goesBack(nextPos) {
        const previousPositions = writePath.map(path => path.pos)
        return !!previousPositions.includes(nextPos)
      }

      if (this.canGoBottom(pos) && !goesBack(this.nextBottom(pos))) {
        return this.makeNextStep(pos, writePath, finishPos, 'bottom')
      } else if (this.canGoRight(pos) && !goesBack(this.nextRight(pos))) {
        return this.makeNextStep(pos, writePath, finishPos, 'right')
      } else if (this.canGoLeft(pos) && !goesBack(this.nextLeft(pos))) {
        return this.makeNextStep(pos, writePath, finishPos, 'left')
      } else if (this.canGoTop(pos) && !goesBack(this.nextTop(pos))) {
        return this.makeNextStep(pos, writePath, finishPos, 'top')
      }

      return { writePath, pos }
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  background: #2193b0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #6dd5ed, #2193b0); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #6dd5ed,
    #2193b0
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .maze {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);

    .cell {
      border: 1px solid rgba(black, 0.1);

      &.border-right {
        border-right: 1px solid;
      }

      &.border-bottom {
        border-bottom: 1px solid;
      }

      &.border-top {
        border-top: 1px solid;
      }

      &.border-left {
        border-left: 1px solid;
      }

      &.pony,
      &.domokun,
      &.finish {
        font-size: 2rem;
        display: grid;
        place-items: center;
      }

      > .index {
        position: absolute;
        font-size: 0.625rem;
      }
    }
  }
}
</style>
