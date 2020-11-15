import Vue from 'vue'

const state = Vue.observable({
  amount: 5,
  bet: null,
  whoWins: null,
  ponyBet: null,
  monsterBet: null
})

export function amount() {
  return state.amount
}

export function changeAmount(amount) {
  state.amount = amount
}

export function bet() {
  return state.bet
}

export function changeBet(bet) {
  state.bet = bet
}

export function whoWins() {
  return state.whoWins
}

export function changeWhoWins(winner) {
  state.whoWins = winner
}

export function ponyBet() {
  return state.ponyBet
}

export function changePonyBet(bet) {
  state.ponyBet = bet
}

export function monsterBet() {
  return state.monsterBet
}

export function changeMonsterBet(bet) {
  state.monsterBet = bet
}
