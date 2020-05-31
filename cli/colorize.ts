import chalk from "chalk"

export const colorizeWhite = (string: string) => chalk.white(string)
export const colorizeLightBlue = (string: string) => chalk.cyan(string)
export const colorizeDarkBlue = (string: string) => chalk.cyanBright(string)
export const colorizeTrue = (string: string) => chalk.green(string)
export const colorizeFalse = (string: string) => chalk.red(string)