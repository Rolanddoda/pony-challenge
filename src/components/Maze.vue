<template>
  <div class="game fill-height pa-16">
    <div class="maze fill-height" :style="{ '--cols': cols, '--rows': rows }" v-if="data">
      <div
        class="cell"
        v-for="(cell, index) of data.data"
        :class="[
          { pony: index === pony },
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
        <span v-if="index === pony">🐎</span>
        <span v-if="index === data.domokun[0]">👾</span>
        <span v-if="index === data['end-point'][0]">🏁</span>
        <span class="index">{{ index }}</span>
      </div>
    </div>
  </div>
</template>

<script>
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
    pony: null,
    ponyPathPos: 1
  }),

  computed: {
    closestPath() {
      if (!this.data) return []

      let ponyPos = this.data.pony[0]
      const finishPos = this.data['end-point'][0]
      const path = [{ pos: ponyPos, step: null }]

      return this.findPath(ponyPos, finishPos, path)
    }
  },

  created() {
    this.$axios.get(`/maze/${this.id}`).then(({ data }) => {
      this.data = data
      this.pony = data.pony[0]
      this.play()
    })
  },

  methods: {
    play() {
      const { closestPath: path, ponyPathPos } = this
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
        this.pony = pos
        if (pos !== this.data['end-point'][0]) this.play()
      })
    },

    findPath(pos, finishPos, path, route = [...path]) {
      const possibleDirections = this.possibleDirections(pos, route)

      if (pos === finishPos) {
        return route
      }

      possibleDirections.forEach(direction => {
        const nextPos = this.nextPos(pos, direction)
        const newRoute = [...route, { pos: nextPos, step: direction }]
        path = this.findPath(nextPos, finishPos, path, newRoute)
      })

      return path
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
