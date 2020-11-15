import { amount, changeAmount } from '@/functionalities/bet/betState'
import { isNumericAndPositive } from '@/utils/helpers'

export function runBetOnInitialRender() {
  if (!localStorage.getItem('amount')) localStorage.setItem('amount', `${amount}`)
  else changeAmount(Number(localStorage.getItem('amount')))
}

window.onstorage = () => {
  const amount = localStorage.getItem('amount')
  if (isNumericAndPositive(amount) && Number(amount) < 100) {
    alert('Wow wow wow. You genius. You did it. ;)')
    changeAmount(Number(amount))
  } else if (isNumericAndPositive(amount) && Number(amount) > 100) {
    alert(
      "Ha! This game is pretty smart and it won't allow you to enter a bet greater than 100. Can you hack it to get a bet greater than 100 ?? ;) "
    )
    localStorage.setItem('amount', `${amount}`)
  } else {
    alert(`What's up with you ? You wanna bet with ${amount} ?? pff humans...`)
    localStorage.setItem('amount', `${amount}`)
  }
}
