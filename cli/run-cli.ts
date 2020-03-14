#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"

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
    console.log(chalk.cyanBright("-------------------------------"))
    console.log(chalk.cyanBright("Original Proposition: "))
    console.log(originalProposition)
  evaluatedRows.forEach(evaluation => {
    console.log(chalk.cyanBright("With these variable assignments: "))
    console.log(evaluation.variableAssignments)
    console.log(chalk.cyanBright("Working:"))
    console.log(evaluation.rowObject.evaluatedRow)
    console.log(chalk.cyanBright("Truth value of permutation:"))
    console.log(evaluation.rowObject.workingRow)
    console.log(chalk.cyanBright("-------------------------------"))
  })
})