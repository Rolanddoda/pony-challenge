<template>
  <v-dialog :value="!mazeId" persistent max-width="450">
    <v-snackbar v-model="snackbar" timeout="-1" multi-line>
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-card>
      <v-card-title class="headline">
        Pony vs Monster game
      </v-card-title>

      <ValidationObserver ref="validationObserver">
        <v-card-text>
          <template v-if="userAmount && userAmount >= 5">
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
              :outlined="!whoWins || whoWins !== 'monster'"
              :color="whoWins === 'monster' ? 'accent' : null"
              @click="changeWhoWins('monster')"
            >
              Monster ({{ monsterBet }} points)
            </v-btn>

            <v-btn
              :outlined="!whoWins || whoWins !== 'pony'"
              :color="whoWins === 'pony' ? 'accent' : null"
              class="ml-5"
              @click="changeWhoWins('pony')"
            >
              Pony ({{ ponyBet }} points)
            </v-btn>

            <div v-if="whoWins" class="text-subtitle-1 mt-5">
              If you win, your amount will become <b>{{ betToWin + userAmount }}</b> <br />
              If you lose, your amount will become <b>0</b>. <br />
              How many points can you get without losing ?
            </div>

            <div v-if="!!winnerChosenError" class="error--text v-messages ml-3">
              {{ winnerChosenError }}
            </div>
          </template>
          <div v-else class="text-subtitle-1 mb-5">
            Your amount is {{ userAmount }} and that means you can't p<span :class="{ word: showHelpCount > 1 }">l</span
            >ay anym<span :class="{ word: showHelpCount > 1 }">o</span>re. But if you are a
            <span :class="{ word: showHelpCount > 1 }">c</span>ool developer and you
            <span :class="{ word: showHelpCount > 1 }">a</span>re rea<span :class="{ word: showHelpCount > 1 }">l</span
            >ly <span :class="{ word: showHelpCount > 1 }">s</span>mar<span :class="{ word: showHelpCount > 1 }">t</span
            >, y<span :class="{ word: showHelpCount > 1 }">o</span>u know that
            <span :class="{ word: showHelpCount > 1 }">r</span>ules c<span :class="{ word: showHelpCount > 1 }">a</span
            >n be broken and you can hack this <span :class="{ word: showHelpCount > 1 }">g</span>am<span
              :class="{ word: showHelpCount > 1 }"
              >e</span
            >
            😉. <br />

            <template v-if="showHelpCount > 0"> <b>Tip:</b> This game doesn't uses a database. </template>
          </div>
        </v-card-text>
      </ValidationObserver>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="userAmount && userAmount >= 5"
          :disabled="!ponyName"
          :loading="isBtnLoading"
          color="primary"
          @click="validate"
        >
          Start the game
        </v-btn>

        <v-btn v-else color="primary" @click="onShowHelp">
          {{ helpBtnText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import '@/utils/validations'
import { isNumericAndPositive, randomInteger } from '@/utils/helpers'
import {
  amount as userAmount,
  changeBet,
  whoWins,
  changeWhoWins,
  ponyBet,
  changePonyBet,
  monsterBet,
  changeMonsterBet,
  changeAmount
} from '@/functionalities/bet/betState'
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
    difficulty: 10,
    betAmount: 5,
    startGameClicked: false,
    showHelpCount: 0,
    snackbarMessage: null,
    snackbar: false
  }),

  computed: {
    userAmount,
    whoWins,
    ponyBet,
    monsterBet,

    winnerChosenError() {
      if (!this.startGameClicked) return false
      if (this.whoWins) return false
      return 'You must select who wins'
    },

    betToWin() {
      if (!this.whoWins) return
      const property = this.whoWins + 'Bet'
      return this.betAmount * this[property]
    },

    helpBtnText() {
      if (!this.showHelpCount) return 'Give me some help'
      if (this.showHelpCount === 1) return 'I want more help'
      return 'Hide help'
    }
  },

  watch: {
    mazeId: {
      handler() {
        this.changePonyBet(randomInteger(2, 4))
        this.changeMonsterBet(randomInteger(5, 8))
      },
      immediate: true
    }
  },

  created() {
    window.onstorage = () => {
      const amountFromLS = localStorage.getItem('amount')

      if (isNumericAndPositive(amountFromLS) && Number(amountFromLS) <= 100 && Number(amountFromLS) >= 5) {
        this.snackbarMessage = 'Wow wow wow. You genius. You did it, you hacked the game. 😉'
        this.snackbar = true
        changeAmount(Number(amountFromLS))
      } else if (isNumericAndPositive(amountFromLS) && Number(amountFromLS) < 5) {
        this.snackbarMessage = `Not so smart 😎. You can't play with ${amountFromLS} points 🤣`
        this.snackbar = true
        changeAmount(Number(amountFromLS))
      } else if (isNumericAndPositive(amountFromLS) && Number(amountFromLS) > 100) {
        this.snackbarMessage = `Ha! This game won't allow an amount greater than 100. Can you do it though ?? 🤨`
        this.snackbar = true
        localStorage.setItem('amount', `${this.userAmount}`)
      } else {
        this.snackbarMessage = `What's up with you ? You can't enter a valid amount ?? pff humans...`
        this.snackbar = true
        localStorage.setItem('amount', `${this.userAmount}`)
      }
    }
  },

  methods: {
    changeWhoWins,
    changePonyBet,
    changeMonsterBet,

    validate() {
      this.$refs.validationObserver.validate().then(success => {
        if (success) {
          this.startGameClicked = true
          if (!this.winnerChosenError) this.startGame()
        }
      })
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
          changeBet(Number(this.betAmount))
          this.mazeId = data.maze_id
          this.$emit('start-game', {
            mazeId: this.mazeId,
            cols: Number(this.cols),
            rows: Number(this.rows)
          })
        })
        .catch(err => {
          this.$emit('error', 'Error: ' + err.response.data)
        })
        .finally(() => (this.isBtnLoading = false))
    },

    onNewGame() {
      // accessed from parent
      this.mazeId = null
      this.changeWhoWins(null)
      this.snackbar = false
      this.startGameClicked = false
    },

    onShowHelp() {
      if (this.showHelpCount === 2) this.showHelpCount = 0
      else this.showHelpCount++
    }
  }
}
</script>

<style lang="scss" scoped>
.word {
  font-weight: bold;
}
</style>
