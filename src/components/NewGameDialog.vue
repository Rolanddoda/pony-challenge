<template>
  <v-dialog :value="!mazeId" persistent max-width="450">
    <v-card>
      <v-card-title class="headline">
        Pony game
      </v-card-title>

      <ValidationObserver ref="validationObserver">
        <v-card-text>
          <ValidationProvider name="Columns" rules="required|integer|between:15,25" v-slot="{ errors }">
            <v-text-field
              v-model="cols"
              :error-messages="errors"
              label="Maze Columns 15-25"
              placeholder="Columns of the maze"
              outlined
            />
          </ValidationProvider>

          <ValidationProvider name="Rows" rules="required|integer|between:15,25" v-slot="{ errors }">
            <v-text-field
              v-model="rows"
              :error-messages="errors"
              label="Maze Rows 15-25"
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

          <div class="text-subtitle-1 mb-5">
            Your amount is <b>{{ userAmount }}</b> points to bet. Place your bet:
          </div>

          <ValidationProvider
            name="Bet amount"
            :rules="`required|integer|min_value:5|max_value:${userAmount}`"
            v-slot="{ errors }"
          >
            <v-text-field
              v-model="betAmount"
              :error-messages="errors"
              outlined
              placeholder="Bet amount"
              label="Bet amount"
            />
          </ValidationProvider>

          <div class="text-subtitle-1 mb-5">
            Who wins ?
          </div>

          <v-btn
            :outlined="!whoWins || whoWins !== 'pony'"
            :color="whoWins === 'pony' ? 'accent' : null"
            @click="whoWins = 'pony'"
          >
            Pony ({{ ponyBet }} points)
          </v-btn>

          <v-btn
            :outlined="!whoWins || whoWins !== 'monster'"
            :color="whoWins === 'monster' ? 'accent' : null"
            class="ml-5"
            @click="whoWins = 'monster'"
          >
            Monster ({{ monsterBet }} points)
          </v-btn>

          <div v-if="whoWins" class="text-subtitle-1 mt-5">
            If you win, your amount will become <b>{{ betToWin }}</b>
          </div>
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
import { randomInteger } from '@/utils/helpers'
import { amount as userAmount } from '@/functionalities/bet'
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
    difficulty: 0,
    betAmount: 5,
    whoWins: null,
    ponyBet: null,
    monsterBet: null
  }),

  computed: {
    userAmount,

    betToWin() {
      if (!this.whoWins) return
      const property = this.whoWins + 'Bet'
      return this.betAmount * this[property]
    }
  },

  watch: {
    mazeId: {
      handler() {
        this.ponyBet = randomInteger(1, 3)
        this.monsterBet = randomInteger(5, 8)
      },
      immediate: true
    }
  },

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
