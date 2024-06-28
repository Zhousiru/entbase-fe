export function generateRandom7Hex() {
  const randomNum = Math.floor(Math.random() * Math.pow(16, 7))
  const hexString = randomNum.toString(16).padStart(7, '0')

  return hexString
}
