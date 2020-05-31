import { permittedVars, permittedChars } from "../src/sharedTypes/PermittedChars"
import askForVariableAssignments from "./askForVariableAssignments"
const inquirer = require('inquirer');

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

export default async (): Promise<{proposition: string, variables: string[], variableAssignments: {[key: string]: 1 | 0 | null}}> => {
  const { proposition } = await askForProposition()
  const variables: string[] = proposition.split("").filter(( char: string ) => {
    if (!permittedChars.includes(char) && char !== " ") {
      throw Error(`Non-permitted char found: ${char}`)
    }
    return permittedVars.includes(char)
  }).reduce((arr: string[], char: string) => {
    return arr.includes(char) ? arr : [...arr, char]
  }, [])
  const variableAssignments = await askForVariableAssignments(variables)

  return { proposition, variables, variableAssignments }
}
