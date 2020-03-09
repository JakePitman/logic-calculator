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
  const evaluatedPermutations = evaluateRawDetails(details.proposition, details.variableAssignments)
    console.log(chalk.cyanBright("-------------------------------"))
    console.log(chalk.cyanBright("Original Proposition: "))
    //TODO This is the same as workingRow for some reason...
    console.log(evaluatedPermutations[0].rowObject.originalRow)
  evaluatedPermutations.forEach(evaluation => {
    console.log(chalk.cyanBright("With these variable assignments: "))
    console.log(evaluation.variableAssignments)
    console.log(chalk.cyanBright("Working:"))
    console.log(evaluation.rowObject.evaluatedRow)
    console.log(chalk.cyanBright("Truth value of permutation:"))
    console.log(evaluation.rowObject.workingRow)
    console.log(chalk.cyanBright("-------------------------------"))
  })
})