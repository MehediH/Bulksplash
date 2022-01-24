const DEFAULTS = {
  amount: 20,
  search: null,
  featured: true,
  width: 2400,
  height: 1600,
  nameScheme: 0,
}

const helpMessage = `Usage: npx bulksplash 
       npx bulksplash --amount=50 --d=basket  -c=https://unsplash.com/collections/9454911 --f --j

Available options:

* --d: the directory you want to save images to.
* --c: if you want to download images from a collection, enter the link of the Unsplash collection you want to download images from.
* --q: if you want to download images about something specific, you can enter a search query.
* --a: the number of images you want to download.
* --w: the width of the images.
* --h: the height of the images.
* --o: the orientation of the images ("landscape", "portrait", "squarish")
* --f: whether you want to download featured images.
* --n: the name scheme of the downloaded images (0 for "authorname-randomstring", 1 for numbered list)
* --j: whether you want to generate a credits file.
`

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
    filter: function (val) {
      return parseInt(val, 10)
    },
    default: DEFAULTS.amount,
  },


  featured: {
    type: 'list',
    name: 'featured',
    message: '⭐️ Only featured images?',
    choices: ['Yes', 'No',],
    filter: function (val) {
      return val === 'Yes'
    },
    default: DEFAULTS.featured,
  },

  nameScheme: {
    type: 'list',
    name: 'nameScheme',
    message: '🏷 What naming scheme?',
    choices: [
      { name: 'Default (bulksplash-authorname-QckxruozjRg.jpg)', value: 0, short: 'Default', },
      { name: 'Numbered List (bulksplash-1.jpg, bulksplash-2.jpg, etc.)', value: 1, short: 'Numbered List', },
    ],
    default: 0,
  },

  orientation: {
    type: 'list',
    name: 'orientation',
    message: '🤔 What orientation?',
    choices: ['Mixed', 'Portrait', 'Landscape', 'Squarish', 'Custom',],//todo: mixed
    filter: function (val) {
      return val.toLowerCase()
    },
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
  helpMessage,
}