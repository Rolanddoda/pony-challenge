<template>
  <div class="game fill-height pa-2">
    <GameOverDialog :api-bug="apiBug" :pony-won="won" v-model="dialog" @new-game="$emit('new-game')" />

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
        <span class="pony icon" data-flip-key="pony-icon" v-if="index === pony">🐎</span>
        <span class="domokun icon" v-if="index === data.domokun[0]">👾</span>
        <span class="finish icon" v-if="index === data['end-point'][0]">🏁</span>
      </div>
    </div>
  </div>
</template>

<script>
import mazeUtilitiesMixin from './maze-utilities-mixin'
import GameOverDialog from '@/components/GameOverDialog'
import Flipping from 'flipping/dist/flipping.web'

export default {
  mixins: [mazeUtilitiesMixin],

  components: {
    GameOverDialog
  },

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
    ponyPathPos: 1,
    dialog: false,
    won: false,
    apiBug: false
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
    async ponyToTheNextPosition(pos, data) {
      const flipping = new Flipping({ duration: 300, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' })
      flipping.read()
      this.pony = pos
      await this.$nextTick()
      flipping.flip()

      if (pos !== this.data['end-point'][0] && data.state === 'active') {
        setTimeout(() => this.play(), 300)
      } else {
        if (data.state === 'over' && pos !== this.data['end-point'][0]) this.apiBug = true
        this.dialog = true
      }
    },

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

      this.$axios.post(`/maze/${this.id}`, { direction }).then(({ data }) => {
        if (data.state === 'won') this.won = true
        else if (data.state === 'over') this.won = false
        this.ponyPathPos++
        this.ponyToTheNextPosition(pos, data)
      })
    },

    findPath(pos, finishPos, path, route = [...path]) {
      if (pos === finishPos) return route
      const possibleDirections = this.possibleDirections(pos, route)

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

    div[class*='border'] {
      border-image: url('https://www.w3schools.com/cssref/border.png') 30 stretch;
    }

    .cell {
      position: relative;

      &.border-right {
        border-right: 5px solid;
      }

      &.border-bottom {
        border-bottom: 5px solid;
      }

      &.border-top {
        border-top: 5px solid;
      }

      &.border-left {
        border-left: 5px solid;
      }

      &.pony,
      &.domokun,
      &.finish {
        display: grid;
        place-items: center;

        > span {
          grid-area: 1 / -1;

          &.icon {
            font-size: 1rem;
          }
        }
      }

      .pony-icon {
        z-index: 1;
        margin-left: 7px;
        margin-top: 3px;
      }

      .finish-icon {
        margin-left: -7px;
        margin-top: -3px;
      }
    }
  }
}
</style>
