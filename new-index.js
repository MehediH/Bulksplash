const request = require('request')
const fs = require('fs')
const https = require('https')
const path = require('path')
const inquirer = require('inquirer')
const { mainQuestions, secondaryQuestions, } = require('./questions')

;(async () => {

  const options = {}

  const ask = async () => {
    await inquirer.prompt(mainQuestions).then(answers => {
      for (let a in answers) {
        options[a] = answers[a]
      }
      options.folder = `images/${answers.search ?
        answers.search :
        'random'}`
    })
    if (options.orientation === 'custom') {
      delete options.custom
      const answers = await inquirer.prompt(
        secondaryQuestions
      )
      options.height = answers.height
    }
    return options
  }
  await ask()
  console.log(JSON.stringify(options, null, '  '))

})()