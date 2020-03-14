#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"
import createTable from "./createTable"

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

askForPropositionDetails().then(details => {
  const { originalProposition, evaluatedRows } = evaluateRawDetails(details.proposition, details.variableAssignments)
  const table = createTable(originalProposition, evaluatedRows)
  console.log(table)
})