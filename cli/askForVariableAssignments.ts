#!/usr/bin/env node
const inquirer = require('inquirer');

export default (variables: string[]): Promise<{[key: string]: 1 | 0 | null}> => {
  const questions = variables.map(variable => {
    return {
      name: variable,
      type: 'input',
      message: `${variable}: `,
      filter: (assignment: string) => {
        const parsed = parseInt(assignment)
        if ( parsed === 1 || parsed === 0 ) {
          return parsed
        } else if ( assignment === "" ) {
          return null
        } else {
          return assignment
        }
      },
      validate: ( assignment: number | null) => {
        if (assignment === 1 || assignment === 0  || assignment === null) {
          return true
        } else {
          return "Assignment must be 1, 0, or empty"
        }
      }
    }
  })
  
  return inquirer.prompt(questions)
}
