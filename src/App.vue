<template>
  <v-app>
    <v-main>
      <NewGameDialog ref="newGameDialog" @error="error = $event" @start-game="startGame" />
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
import NewGameDialog from './components/NewGameDialog'
import Maze from './components/Maze'

export default {
  name: 'App',

  components: {
    NewGameDialog,
    Maze
  },

  data: () => ({
    mazeId: null,
    cols: null,
    rows: null,
    error: null
  }),

  methods: {
    onNewGame() {
      this.mazeId = null
      this.$refs.newGameDialog.onNewGame()
    },

    startGame({ mazeId, rows, cols }) {
      this.mazeId = mazeId
      this.rows = rows
      this.cols = cols
    }
  }
}
</script>

<style lang="scss">
html {
  overflow: hidden;
}
</style>
