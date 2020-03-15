#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"
import createTable from "./createTable"
import { colorizeDarkBlue } from "./colorize"

import clear from "clear"
import figlet from "figlet"

import askForPropositionDetails from "./askForPropositionDetails"

clear();

console.log(
  colorizeDarkBlue(
    figlet.textSync('Logic\nCalculator', { font: "Small Poison" , horizontalLayout: 'fitted' })
  )
);

askForPropositionDetails().then(details => {
  const { originalProposition, evaluatedRows } = evaluateRawDetails(details.proposition, details.variableAssignments)
  const table = createTable(originalProposition, evaluatedRows)
  console.log(table)
})