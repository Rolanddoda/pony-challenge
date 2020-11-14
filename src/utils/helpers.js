export function isNumericAndPositive(value) {
  return /^\d+$/.test(value)
}

export function randomInteger(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1)) + min
}
