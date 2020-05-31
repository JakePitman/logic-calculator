#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"
import { colorizeDarkBlue } from "./colorize"
import { printBanner, printTable } from "./printOutput"

import clear from "clear"

import askForPropositionDetails from "./askForPropositionDetails"
import secondaryOptionsMenu from "./secondaryOptionsMenu"
import askForVariableAssignments from "./askForVariableAssignments"

const mainLoop = async (modifiedPropositionDetails?: {proposition: string, variables: string[], variableAssignments: {[key: string]: 1 | 0 | null}}) => {
  
  clear();
  printBanner()

  const { proposition, variables, variableAssignments } = modifiedPropositionDetails ? modifiedPropositionDetails : await askForPropositionDetails()

  // This is a quick hack to get ALL permutations regardless of assignments,
  // so that I can run filters against the complete table.
  // This will allow users to change filters without re-evaluating the equation.
  const allVariablesAssignedNull: {[key: string]: null} = {}
  variables.forEach(variable => {
    allVariablesAssignedNull[variable] = null
  })

  const { originalProposition, evaluatedRows } = evaluateRawDetails(proposition, allVariablesAssignedNull)
  clear()
  printBanner()
  printTable(originalProposition, evaluatedRows, variableAssignments)

  const { selectedOption } = await secondaryOptionsMenu()
  switch(selectedOption) {
    case 'Modify variable assignments':
      const modifiedVariableAssignments = await askForVariableAssignments(variables)
      mainLoop({
        proposition,
        variables,
        variableAssignments: modifiedVariableAssignments
      })
      break
    case 'Write a different proposition':
      mainLoop()
      break
    case 'Exit':
      console.log("Exiting")
      process.exit(0)
    default:
      console.log("Unrecognised option selected")
      process.exit(1)
  }
}

mainLoop()
