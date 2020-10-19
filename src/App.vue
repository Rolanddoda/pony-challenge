<template>
  <v-app>
    <v-main>
      <v-dialog :value="!mazeId" persistent max-width="450">
        <v-card>
          <v-card-title class="headline">
            Enter dimensions of the maze
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model.number="cols"
              min="15"
              max="25"
              type="number"
              label="Columns"
              placeholder="Columns of the maze"
              outlined
            />

            <v-text-field
              v-model.number="rows"
              min="15"
              max="25"
              type="number"
              label="Rows"
              placeholder="Rows of the maze"
              outlined
            />

            <v-text-field
              v-model.number="difficulty"
              min="0"
              max="10"
              type="number"
              label="Difficulty"
              placeholder="Difficulty"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!ponyName" :loading="isBtnLoading" color="primary" @click="startGame">
              Start the game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar :value="!!error" @input="error = null">
        {{ error }}

        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="error = null">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <Maze v-if="mazeId" :id="mazeId" :cols="cols" :rows="rows" @new-game="onNewGame" />
    </v-main>
  </v-app>
</template>

<script>
import Maze from './components/Maze'

export default {
  name: 'App',

  components: {
    Maze
  },

  data: () => ({
    isBtnLoading: false,
    ponyName: 'Fluttershy',
    error: null,
    mazeId: null,
    cols: 15,
    rows: 15,
    difficulty: 0
  }),

  methods: {
    startGame() {
      this.isBtnLoading = true
      this.$axios
        .post('/maze', {
          'maze-width': this.cols,
          'maze-height': this.rows,
          'maze-player-name': this.ponyName,
          difficulty: this.difficulty
        })
        .then(({ data }) => {
          this.mazeId = data.maze_id
        })
        .catch(err => {
          this.error = 'Error: ' + err.response.data
        })
        .finally(() => (this.isBtnLoading = false))
    },

    onNewGame() {
      if (this.difficulty < 10) this.difficulty++
      this.mazeId = null
    }
  }
}
</script>

<style lang="scss">
html {
  overflow: hidden;
}
</style>
