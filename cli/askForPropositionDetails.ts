const inquirer = require('inquirer');
const chalk = require("chalk")

const askForProposition = () => {
  const questions = [
    {
      name: 'proposition',
      type: 'input',
      message: 'Please type your proposition: ',
      validate:( proposition: string) => {
        if (proposition.length) {
          return true;
        } else {
          return 'Please type your proposition: ';
        }
      }
    }
  ];
  return inquirer.prompt(questions);
}

const askForVariableAssignments = (variables: string[]) => {
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

export default async () => {
  const { proposition } = await askForProposition()
  // TODO - extract these from the proposition
  const variables = ["a", "b", "c"]
  const variableAssignments = await askForVariableAssignments(variables)

  return { proposition, variableAssignments }
}
