<template>
  <v-dialog v-model="dialog" persistent max-width="370">
    <v-card>
      <v-card-title class="headline">
        <h2 v-if="userWon">You won!!!</h2>
        <h2 v-else>You lost!!!</h2>
      </v-card-title>

      <v-card-text>
        <h3 v-if="apiBug">It's not your fault. Trustpilot api has a bug.</h3>
        <h3>
          Your new amount is <b>{{ amount }}</b>
        </h3>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('new-game')">
          New game ?
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { amount, bet, changeAmount, whoWins, ponyBet, monsterBet } from '@/functionalities/bet/betState'

export default {
  props: {
    value: Boolean,
    ponyWon: Boolean,
    apiBug: Boolean
  },

  computed: {
    amount,
    bet,
    whoWins,
    ponyBet,
    monsterBet,

    userWon() {
      if (this.ponyWon && this.whoWins === 'pony') return true
      return !this.ponyWon && this.whoWins === 'monster'
    },

    dialog: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
      }
    }
  },

  watch: {
    dialog() {
      if (this.ponyWon && this.whoWins === 'pony') this.onNewAmount(this.ponyBet * this.bet + this.amount)
      else if (!this.ponyWon && this.whoWins === 'monster') this.onNewAmount(this.monsterBet * this.bet + this.amount)
      else this.onNewAmount(0)
    }
  },

  methods: {
    onNewAmount(newAmount) {
      changeAmount(newAmount)
      localStorage.setItem('amount', `${newAmount}`)
    }
  }
}
</script>
