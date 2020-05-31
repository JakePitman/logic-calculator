#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"
import { colorizeDarkBlue } from "./colorize"
import { printBanner, printTable } from "./printOutput"

import clear from "clear"

import askForPropositionDetails from "./askForPropositionDetails"

clear();

printBanner()

askForPropositionDetails().then(details => {

  // This is a quick hack to get ALL permutations regardless of assignments,
  // so that I can run filters against the complete table.
  // This will allow users to change filters without re-evaluating the equation.
  const allVariablesAssignedNull: {[key: string]: null} = {}
  details.variables.forEach(variable => {
    allVariablesAssignedNull[variable] = null
  })

  const { originalProposition, evaluatedRows } = evaluateRawDetails(details.proposition, allVariablesAssignedNull)
  printTable(originalProposition, evaluatedRows, details.variableAssignments)
})
