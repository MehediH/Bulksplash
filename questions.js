const DEFAULTS = {
  amount: 20,
  search: null,
  featured: true,
  width: 2400,
  height: 1600,
  color: null
}

const requiredQuestions = {
  amount: {
    type: 'input',
    name: 'amount',
    message: '👀 How many images?',
    validate: function (value) {
      value = parseInt(value, 10)
      const pass = typeof value === 'number' &&
      value > 0 &&
      value === parseInt(value.toFixed(), 10)
      if (pass) {
        return true
      }

      return '🚨 Please enter a number higher than 1'
    },
    filter: function(val) {
      return parseInt(val, 10)
    },
    default: DEFAULTS.amount,
  },


  featured: {
    type: 'list',
    name: 'featured',
    message: '⭐️ Only featured images?',
    choices: ['Yes', 'No', ],
    filter: function(val) {
      return val === 'Yes'
    },
    default: DEFAULTS.featured,
  },

  orientation: {
    type: 'list',
    name: 'orientation',
    message: '🤔 What orientation?',
    choices: ['Mixed', 'Portrait', 'Landscape', 'Squarish', 'Custom',],//todo: mixed
    filter: function(val) {
      return val.toLowerCase()
    },
  },
  
  color: {
    type: 'list',
    name: 'color',
    message: '🎨 What color?',
    choices: ['Any', 'Black and white', 'Black', 'White', 'Yellow', 'Orange', 'Red', 'Purple', 'Magenta', 'Green', 'Teal', 'Blue'],
    filter: function(val) {
      val = val.toLowerCase().split(' ').join('_')
      if(val === 'any')
        val = null
      return val
    },
    default: DEFAULTS.color
  },
}

const conditionalQuestions = {
  requiredwidth: {
    type: 'input',
    name: 'width',
    message: '🖼 Width?',
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
    default: DEFAULTS.width,
  },

  width: {
    type: 'input',
    name: 'width',
    message: '🖼 Width? (Optional, blank for original size)',
    validate: function (value) {
      if (!value) {
        return true
      }
      value = parseInt(value, 10)
      const pass = typeof value === 'number' &&
      value > 0 &&
      value === parseInt(value.toFixed(), 10)
      if (pass) {
        return true
      }

      return '🚨 Please enter a number greater than 0'
    },
    default: null,
  },

  requiredheight: {
    type: 'input',
    name: 'height',
    message: '🖼 Height?',
    validate: function (value) {
      value = parseInt(value, 10)
      const pass = typeof value === 'number' &&
        value > 0 &&
        value === parseInt(value.toFixed(), 10)
      if (pass) {
        return true
      }

      return '🚨 Please enter a number greater than 0'
    },
    default: DEFAULTS.height,
  },

  height: {
    type: 'input',
    name: 'height',
    message: '🖼 Height? (Optional, blank for original size)',
    validate: function (value) {
      if (!value) {
        return true
      }
      value = parseInt(value, 10)
      const pass = typeof value === 'number' &&
        value > 0 &&
        value === parseInt(value.toFixed(), 10)
      if (pass) {
        return true
      }

      return '🚨 Please enter a number greater than 0'
    },
    default: null,
  },
}

const firstQuestions = Object.values(requiredQuestions)

const nextQuestions = ({ required = true, side = 'width', }) => {
  return conditionalQuestions[`${required ? 'required' : ''}${side}`]
}

module.exports = {
  firstQuestions,
  nextQuestions,
}