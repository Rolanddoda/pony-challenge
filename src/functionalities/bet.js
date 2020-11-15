import Vue from 'vue'
import { isNumericAndPositive } from '@/utils/helpers'

const state = Vue.observable({
  amount: 5,
  bet: null
})

export function amount() {
  return state.amount
}

export function changeAmount(amount) {
  state.amount = amount
  setAmount(state.amount)
}

export function bet() {
  return state.bet
}

export function changeBet(bet) {
  state.bet = bet
}

function setAmount(amount) {
  localStorage.setItem('amount', `${amount}`)
}

export function runBetOnInitialRender() {
  if (!localStorage.getItem('amount')) setAmount(state.amount)
  else state.amount = Number(localStorage.getItem('amount'))
}

window.onstorage = () => {
  const amount = localStorage.getItem('amount')
  if (isNumericAndPositive(amount) && Number(amount) < 100) {
    alert('Wow wow wow. You genius. You did it. ;)')
    state.amount = Number(amount)
  } else if (isNumericAndPositive(amount) && Number(amount) > 100) {
    alert(
      "Ha! This game is pretty smart and it won't allow you to enter a bet greater than 100. Can you hack it to get a bet greater than 100 ?? ;) "
    )
    setAmount(amount)
  } else {
    alert(`What's up with you ? You wanna bet with ${amount} ?? pff humans...`)
    setAmount(amount)
  }
}
