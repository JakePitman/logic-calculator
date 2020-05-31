#!/usr/bin/env node
const inquirer = require('inquirer');

const secondaryOptionMenu = () => {
  const questions = [
    {
      name: 'selectedOption',
      type: 'list',
      message: 'Options:',
      choices: [
        'Modify variable assignments',
        'Write a different proposition',
        'Exit'
      ]
    }
  ];
  return inquirer.prompt(questions);
}

export default async () => {
  return await secondaryOptionMenu()
}