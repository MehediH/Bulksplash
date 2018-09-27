const request = require('request')
const fs = require('fs')
const https = require('https')
const path = require('path')
const ProgressBar = require('progress')
const inquirer = require('inquirer')
const { firstQuestions, nextQuestions, } = require('./questions')

;(async () => {

  const options = {}

  const ask = async () => {
    await inquirer.prompt(firstQuestions).then(answers => {
      for (let a in answers) {
        options[a] = answers[a]
      }
      options.folder = `images/${answers.search ?
        answers.search :
        'random'}`
    })

    if (options.orientation === 'custom') {
      await inquirer.prompt(
        [
          nextQuestions({ required: true, side: 'width', }),
          nextQuestions({ required: true, side: 'height', }),
        ]
      ).then(answers => {
        options.width = answers.width
        options.height = answers.height
      })
    } else {
      await inquirer.prompt(
        [
          nextQuestions({ required: false, side: 'width', }),
        ]
      ).then(answers => {
        options.width = answers.width
      })
      if (!options.width) {
        await inquirer.prompt(
          [
            nextQuestions({ required: false, side: 'height', }),
          ]
        ).then(answers => {
          options.height = answers.height
        })
      }
    }

    if (options.orientation === 'custom' || options.orientation === 'mixed') {
      delete options.orientation
    }
    return options
  }
  await ask()

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
  const url = buildUrl(options)

  console.log('\nWelcome to Bulksplash! (Powered by Unsplash.com)')
  // eslint-disable-next-line max-len
  console.log(`\nDownloading ${options.amount}${options.featured ? ' featured' : ''}${options.search ? ' "' + options.search + '"' : ''} images :)`)
  console.log('\nDownloading images from:\n')

  const bar = new ProgressBar(':bar', {
    total: options.amount,
  })

  const download = ({ imageUrl, dest, dirname, }) => {
    const dir = `./${dirname}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    const file = fs.createWriteStream(dest)
    file.on('close', () => {
      bar.tick()
      if (bar.complete) {
        console.log('\nDone\n')
      }
    }, { once: true, })
    https.get(imageUrl, response => {
      response.pipe(file)
    }).on('error', function (e) {
      console.log('Error while downloading', imageUrl, e.code)
    })
  }

  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body)

      Object.values(body).forEach(v => {
        const img = options.width || options.height ? v.urls.custom : v.urls.raw

        console.log(`${v.user.name} (${v.user.links.html})`)
        // console.log(v)
        download({
          imageUrl: img,
          dest: path.join(__dirname, `/${options.folder}/image-${v.user.username}-${v.id}.jpg`),
          dirname: options.folder,
        })
      })
    } else {
      console.log('Got an error: ', error)
    }
  })
})()