import Vue from 'vue'
import { isNumericAndPositive } from '@/utils/helpers'

const bet = Vue.observable({
  value: 5
})

function setBet(bet) {
  localStorage.setItem('bet', `${bet}`)
}

export function runBetOnInitialRender() {
  if (!localStorage.getItem('bet')) setBet(bet.value)
  else bet.value = Number(localStorage.getItem('bet'))
}

export function changeBet(newBet) {
  bet.value = newBet
  setBet(bet.value)
}

export function betValue() {
  return bet.value
}

window.onstorage = () => {
  const betFromLS = localStorage.getItem('bet')
  if (isNumericAndPositive(betFromLS) && Number(betFromLS) < 100) {
    alert('Wow wow wow. You genius. You did it. ;)')
    bet.value = Number(betFromLS)
  } else if (isNumericAndPositive(betFromLS) && Number(betFromLS) > 100) {
    alert(
      "Ha! This game is pretty smart and it won't allow you to enter a bet greater than 100. Can you hack it to get a bet greater than 100 ?? ;) "
    )
    setBet(bet.value)
  } else {
    alert(`What's up with you ? You wanna bet with ${betFromLS} ?? pff humans...`)
    setBet(bet.value)
  }
}
