<template>
  <div class="game fill-height pa-16">
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    data: null
  }),

  computed: {
    closestPathToFinish() {
      if (!this.data) return []
      const ponyPos = this.data.pony[0]
      const finishPos = this.data['end-point'][0]
      const cells = this.data.data
      let pathFound = []

      if (this.canGoBottom(ponyPos)) {
        pathFound = this.tryPath(this.nextBottom(ponyPos), finishPos, cells, [])
      } else if (this.canGoRight(ponyPos)) {
        pathFound = this.tryPath(this.nextRight(ponyPos), finishPos, cells, [])
      } else if (this.canGoLeft(ponyPos)) {
        pathFound = this.tryPath(this.nextLeft(ponyPos), finishPos, cells, [])
      } else if (this.canGoTop(ponyPos)) {
        pathFound = this.tryPath(this.nextTop(ponyPos), finishPos, cells, [])
      }

      return pathFound
    }
  },

  created() {
    this.$axios.get(`/maze/${this.id}`).then(({ data }) => {
      this.data = data
    })
  },

  methods: {
    canGoTop(pos) {
      const maze = this.data.data
      return !maze[pos].includes('north')
    },

    canGoRight(pos) {
      const maze = this.data.data
      return (pos + 1) % this.cols !== 0 && !maze[pos + 1].includes('west')
    },

    canGoBottom(pos) {
      const maze = this.data.data
      return pos + this.cols < maze.length && !maze[pos + this.cols].includes('north')
    },

    canGoLeft(pos) {
      const maze = this.data.data
      return !maze[pos].includes('west')
    },

    nextTop(pos) {
      return pos - this.cols
    },

    nextRight(pos) {
      return pos + 1
    },

    nextBottom(pos) {
      return pos + this.cols
    },

    nextLeft(pos) {
      return pos - 1
    },

    tryPath(pos, finishPos, path) {
      // TODO implement algorithm
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
    }
  }
}
</style>
