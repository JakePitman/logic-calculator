#!/usr/bin/env node
import evaluateRawDetails from "../src/helpers/Propositions"
import { colorizeDarkBlue } from "./colorize"
import { printBanner, printTable } from "./printOutput"

import clear from "clear"

import askForPropositionDetails from "./askForPropositionDetails"

clear();

printBanner()

askForPropositionDetails().then(details => {
  const { originalProposition, evaluatedRows } = evaluateRawDetails(details.proposition, details.variableAssignments)
  printTable(originalProposition, evaluatedRows)
})