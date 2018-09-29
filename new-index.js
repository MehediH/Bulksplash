const request = require('request')
const fs = require('fs')
const https = require('https')
const path = require('path')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'input',
    name: 'amount',
    message: 'How many images (up to 50)?',
    validate: function (value) {
      value = parseInt(value, 10)
      const pass = typeof value === 'number' &&
      value > 0 &&
      value < 50 &&
      value === parseInt(value.toFixed(), 10)
      if (pass) {
        return true
      }

      return 'Please enter a number between 0 and 50'
    },
    default: function () {
      return 20
    },
  },
  {
    type: 'input',
    name: 'search',
    message: 'What search term?',
  },
  {
    type: 'confirm',
    name: 'featured',
    message: 'Only featured images?',
    default: true,
  },
  {
    type: 'list',
    name: 'orientation',
    message: 'What orientation?',
    choices: ['Portrait', 'Landscape', 'Squarish', 'Custom',],
    filter: function(val) {
      return val.toLowerCase()
    },
    default: 'landscape',
  },
  {
    type: 'input',
    name: 'width',
    message: 'Width?',
    validate: function (value) {
      value = parseInt(value, 10)
      const pass = typeof value === 'number' &&
      value > 0 &&
      value === parseInt(value.toFixed(), 10)
      if (pass) {
        return true
      }

      return 'Please enter a number greater than 0'
    },
    default: function () {
      return 1200
    },
  },
]

const options = {}

inquirer.prompt(questions).then(answers => {
  for (let a in answers) {
    options[a] = answers[a]
  }
  options.folder = `images/${answers.search ?
    answers.search :
    'random'}`
}).then(() => {
  if (options.orientation === 'custom') {
    delete options.custom
    inquirer.prompt(
      {
        type: 'input',
        name: 'height',
        message: 'Height?',
        validate: function (value) {
          value = parseInt(value, 10)
          const pass = typeof value === 'number' &&
          value > 0 &&
          value === parseInt(value.toFixed(), 10)
          if (pass) {
            return true
          }

          return 'Please enter a number greater than 0'
        },
        default: function () {
          return 800
        },
      },
    )
  }
// }).then(answers => {
//   options.height = answers.height
}).then(() => {
  console.log(JSON.stringify(options, null, '  '))
})