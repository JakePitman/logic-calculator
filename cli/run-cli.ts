#!/usr/bin/env node

import chalk from "chalk"
import clear from "clear"
import figlet from "figlet"

import askForPropositionDetails from "./askForPropositionDetails"

clear();

console.log(
  chalk.cyanBright(
    figlet.textSync('Logic\nCalculator', { font: "Small Poison" , horizontalLayout: 'fitted' })
  )
);

askForPropositionDetails().then(details => console.log("DETAILS", details))