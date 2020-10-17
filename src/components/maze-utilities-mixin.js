export default {
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

    makeNextStep(pos, path, finishPos, step) {
      const map = {
        bottom: this.nextBottom,
        right: this.nextRight,
        left: this.nextLeft,
        top: this.nextTop
      }

      const nextPos = map[step](pos)
      path.push({ pos: nextPos, step })
      if (nextPos === finishPos) return path
      return this.tryPath(nextPos, finishPos, path)
    }
  }
}
