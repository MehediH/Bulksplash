const request = require('request')
const fs = require('fs')
const https = require('https')
const path = require('path')
const ProgressBar = require('progress')
const inquirer = require('inquirer')
const { mainQuestions, secondaryQuestions, } = require('./questions')
const randomHash = () => {
  return Math.random().toString(36).substr(2)
}

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
      delete options.orientation
      const answers = await inquirer.prompt(
        secondaryQuestions
      )
      options.height = answers.height
    }
    return options
  }

  const download = (url, dest, dirname, total) => {
    const dir = `./${dirname}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    const bar = new ProgressBar(':bar', {
      total: total,
    })

    const file = fs.createWriteStream(dest)
    https.get(url, function (response) {
      response.pipe(file)
      //TODO: tick isn't working?
      bar.tick()
      if (bar.complete) {
        console.log('\ncomplete\n')
      }
    }).on('error', function (e) {
      console.log('Error while downloading', url, e.code)
    })
  }

  const buildUrl = ({ featured, orientation, search, width, height, amount, }) => {
    const base = 'https://api.unsplash.com/photos/random?'
    const clientId = '&client_id=1ced621f3ac7bb7836fc9b6bfbcff5656dd43eb2b60f4636e5ef53142ea19f2d'
    const f = featured ? '&featured' : ''
    const a = amount ? `count=${amount}` : ''
    const o = orientation ? `&orientation=${orientation}` : ''
    const s = search ? `&query=${search}` : ''
    const w = width ? `&w=${width}` : ''
    const h = height ? `&h=${height}` : ''
    return `${base}${a}${o}${f}${w}${h}${s}${clientId}`
  }

  await ask()
  console.log(JSON.stringify(options, null, '  '))

  console.log('\nWelcome to Bulksplash! (Powered by Unsplash.com)')

  console.log(`\nDownloading ${options.amount}${options.featured ? ' featured' : ''} images :)`)

  const url = buildUrl(options)

  console.log('\nDownloading images from:\n')
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body)

      for (let i in body) {
        const img = options.width || options.height ? body[i].urls.custom : body[i].urls.raw

        console.log(`${body[i].user.name} (${body[i].user.links.html})`)
        download(img, path.join(__dirname, `/${options.folder}/image-${randomHash()}.jpg`), options.folder, options.amount)
      }

    } else {
      console.log('Got an error: ', error)
    }
  })
})()