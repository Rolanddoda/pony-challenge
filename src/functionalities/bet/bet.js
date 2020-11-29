import { amount, changeAmount } from '@/functionalities/bet/betState'

export function runBetOnInitialRender() {
  if (!localStorage.getItem('amount')) localStorage.setItem('amount', `${amount}`)
  else changeAmount(Number(localStorage.getItem('amount')))
}
