import consola from 'consola'
import { randomBytes } from 'crypto'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=?!?#{}<>~'

try {
  const argv = yargs(hideBin(process.argv))
    .option('digit', {
      alias: 'd',
      describe: 'Specify the digit length',
      type: 'number',
      demandOption: true,
    })
    .option('name', {
      alias: 'n',
      describe: 'Name to generate',
      type: 'string',
      demandOption: true,
    }).argv

  const digit = argv.digit
  const name = argv.name

  const bytes = randomBytes(digit)
  let result = ''
  for (let i = 0; i < digit; i++) {
    const idx = Math.floor(bytes[i] % characters.length)
    result += characters[idx]
  }

  consola.success(`Generated ${name} successfully:`)
  consola.log(result)
} catch (error) {
  consola.error('Error on generating characters:', error)
}
