#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"
import { colorizeDarkBlue } from "./colorize"
import { printBanner, printTable } from "./printOutput"

import clear from "clear"

import askForPropositionDetails from "./askForPropositionDetails"
import secondaryOptionsMenu from "./secondaryOptionsMenu"

const mainLoop = async () => {
  
  clear();
  printBanner()

  const {proposition, variables, variableAssignments} = await askForPropositionDetails()
  // This is a quick hack to get ALL permutations regardless of assignments,
  // so that I can run filters against the complete table.
  // This will allow users to change filters without re-evaluating the equation.
  const allVariablesAssignedNull: {[key: string]: null} = {}
  variables.forEach(variable => {
    allVariablesAssignedNull[variable] = null
  })

  const { originalProposition, evaluatedRows } = evaluateRawDetails(proposition, allVariablesAssignedNull)
  printTable(originalProposition, evaluatedRows, variableAssignments)
}

mainLoop()
