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

    possibleDirections(pos, path) {
      const directions = []
      const goesBack = direction => {
        const pathPositions = path.map(item => item.pos)
        return !!pathPositions.includes(this.nextPos(pos, direction))
      }

      if (this.canGoTop(pos) && !goesBack('top')) directions.push('top')
      if (this.canGoRight(pos) && !goesBack('right')) directions.push('right')
      if (this.canGoBottom(pos) && !goesBack('bottom')) directions.push('bottom')
      if (this.canGoLeft(pos) && !goesBack('left')) directions.push('left')

      return directions
    },

    nextPos(pos, direction) {
      if (direction === 'top' && this.canGoTop(pos)) return this.nextTop(pos)
      if (direction === 'right' && this.canGoRight(pos)) return this.nextRight(pos)
      if (direction === 'bottom' && this.canGoBottom(pos)) return this.nextBottom(pos)
      if (direction === 'left' && this.canGoLeft(pos)) return this.nextLeft(pos)
    }
  }
}
