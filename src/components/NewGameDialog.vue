<template>
  <v-dialog :value="!mazeId" persistent max-width="450">
    <v-card>
      <v-card-title class="headline">
        Enter dimensions of the maze
      </v-card-title>

      <ValidationObserver ref="validationObserver">
        <v-card-text>
          <ValidationProvider name="Columns" rules="required|integer|between:15,25" v-slot="{ errors }">
            <v-text-field
              v-model="cols"
              :error-messages="errors"
              label="Columns 15-25"
              placeholder="Columns of the maze"
              outlined
            />
          </ValidationProvider>

          <ValidationProvider name="Rows" rules="required|integer|between:15,25" v-slot="{ errors }">
            <v-text-field
              v-model="rows"
              :error-messages="errors"
              label="Rows 15-25"
              placeholder="Rows of the maze"
              outlined
            />
          </ValidationProvider>

          <ValidationProvider name="Rows" rules="required|integer|between:0,10" v-slot="{ errors }">
            <v-text-field
              v-model="difficulty"
              :error-messages="errors"
              label="Difficulty 0-10"
              placeholder="Difficulty"
              outlined
            />
          </ValidationProvider>
        </v-card-text>
      </ValidationObserver>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!ponyName" :loading="isBtnLoading" color="primary" @click="validate">
          Start the game
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import '@/utils/validations'
// Libraries
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },

  data: () => ({
    isBtnLoading: false,
    ponyName: 'Fluttershy',
    mazeId: null,
    cols: 15,
    rows: 15,
    difficulty: 0
  }),

  methods: {
    validate() {
      this.$refs.validationObserver.validate().then(success => success && this.startGame())
    },

    startGame() {
      this.isBtnLoading = true
      this.$axios
        .post('/maze', {
          'maze-width': Number(this.cols),
          'maze-height': Number(this.rows),
          'maze-player-name': this.ponyName,
          difficulty: Number(this.difficulty)
        })
        .then(({ data }) => {
          this.mazeId = data.maze_id
          this.$emit('start-game', {
            mazeId: this.mazeId,
            cols: this.cols,
            rows: this.rows
          })
        })
        .catch(err => {
          this.$emit('error', 'Error: ' + err.response.data)
        })
        .finally(() => (this.isBtnLoading = false))
    },

    onNewGame() {
      // accessed from parent
      if (this.difficulty < 10) this.difficulty++
      this.mazeId = null
    }
  }
}
</script>
