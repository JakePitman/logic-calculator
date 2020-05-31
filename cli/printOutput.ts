import { colorizeDarkBlue } from "./colorize"
import { EvaluatedRows, VariableAssignments } from "../src/sharedTypes"
import figlet from "figlet"
import createTable from "./createTable"

export const printBanner = () => {
  console.log(
    colorizeDarkBlue(
      figlet.textSync('Logic\nCalculator', { font: "Small Poison" , horizontalLayout: 'fitted' })
    )
  );
}

const filterRowsByVariableAssignments = (evaluatedRows: EvaluatedRows, variableAssignments: VariableAssignments) => {
  const filters: {[key: string]: 1 | 0 | null} = {}
  Object.keys(variableAssignments).forEach((variable) => {
    const assignedValue = variableAssignments[variable]
    if (assignedValue !== null) {
      filters[variable] = assignedValue
    }
  })
  return evaluatedRows.filter(row => {
    let noAssignmentMismatch = true
    Object.keys(filters).forEach(filter => {
      if (filters[filter] !== row.variableAssignments[filter]) {
        noAssignmentMismatch = false
      }
    })
    return noAssignmentMismatch
  })
}

export const printTable = (originalProposition: string[], evaluatedRows: EvaluatedRows, variableAssignmentFilters: VariableAssignments) => {
  const filteredRows = filterRowsByVariableAssignments(evaluatedRows, variableAssignmentFilters)
  const table = createTable(originalProposition, filteredRows)
  console.log(table)
}