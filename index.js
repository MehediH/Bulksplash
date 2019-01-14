const request = require('request')
const fs = require('fs')
const https = require('https')
const path = require('path')
const ProgressBar = require('progress')
const inquirer = require('inquirer')
const { firstQuestions, nextQuestions, } = require('./questions')


  ; (async () => {

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

    const buildUrl = ({ featured, orientation, search, width, height, amount, page }) => {
      const base = 'https://api.unsplash.com/photos/random?'
      const clientId = '&client_id=1ced621f3ac7bb7836fc9b6bfbcff5656dd43eb2b60f4636e5ef53142ea19f2d'
      const f = featured ? '&featured' : ''
      const a = amount ? `count=${amount}` : ''
      const o = orientation ? `&orientation=${orientation}` : ''
      const s = search ? `&query=${search}` : ''
      const w = width ? `&w=${width}` : ''
      const h = height ? `&h=${height}` : ''
      const p = page ? `&page=${page}` : ''
      return `${base}${a}${o}${f}${w}${h}${p}${s}${clientId}`
    }
    const url = buildUrl(options)

    console.log('\nWelcome to Bulksplash! (Powered by Unsplash.com)')
    // eslint-disable-next-line max-len
    console.log(`\nDownloading ${options.amount}${options.featured ? ' featured' : ''}${options.search ? ' "' + options.search + '"' : ''} images :)`)
    console.log('\nDownloading images from:\n')


    const download = ({ bar, imageUrl, dest, dirname, }) => {
      return new Promise((resolve, reject) => {

        const dir = `./${dirname}`
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }

        const file = fs.createWriteStream(dest)
        file.on('close', () => {
          // bar.tick()
          if (bar.complete) {
            console.log('\nDone\n')
          }
        }, { once: true, })

        https.get(imageUrl, response => {
          response.pipe(file)
            .on('close', () => {
              // console.log("Completed!")
              bar.tick()
              return resolve(`File from ${imageUrl} downloaded.`)
            })
        }).on('error', function (e) {

          console.log('Error while downloading', imageUrl, e.code)
          return reject(`Error while downloading ${imageUrl} ${e.code}`)

        })
      })
    }

    //this
    const makeRequestCall = (progressBarSize, url) => {
      return new Promise((resolve, reject) => {

        console.log(`url : ${url}`)
        request(url, (error, response, body) => {
          console.log(`${error}, ${response.statusCode}`)
          if (!error && response.statusCode === 200) {
            body = JSON.parse(body)

            var arrayOfPromises = []
            const bar = new ProgressBar('[:percent Done] :bar', {
              total: progressBarSize,
            })

            Object.values(body).forEach(v => {
              const img = options.width || options.height ? v.urls.custom : v.urls.raw

              // console.log(`${v.user.name} (${v.user.links.html})`)
              // console.log(`${img}`)

              arrayOfPromises.push(download({
                bar,
                // progressBarSize,
                imageUrl: img,
                dest: path.join(__dirname, `/${options.folder}/image-${v.user.username}-${v.id}.jpg`),
                dirname: options.folder,
              }))
            })


            Promise.all(arrayOfPromises)
              .then(() => {
                console.log("HHHHHHHHHHHHHHHHHHHHHHHhh")
                return resolve("Batch completed!")
              })

          } else {
            // console.log('Got an error: ', error)
            return reject(`Got an error: ${error}`)
          }
        })

      })
    }

    // the api only serves 30 files in a page...
    if (options.amount <= 30) {
      makeRequestCall(options.amount, url)
    }
    else {

      let totalPagesExcludingLast = Number.parseInt(options.amount / 30)
      let remainder = options.amount % 30

      console.log(` totalPagesExcludingLast : ${totalPagesExcludingLast}`)

        ; (async () => {
          for (let i = 0; i < totalPagesExcludingLast; i++) {
            //this is imp here......
            // console.log("url obj ->>>>> ", buildUrl(Object.assign(options, { page: i, amount: 30 })))

            try {
              // console.log(`ccccccccccccccccc ->>> ${JSON.stringify(options,2)}`)
              await makeRequestCall(30, buildUrl(Object.assign(options, { page: i, amount: 30 })))
            }
            catch (err) {
              console.error(`Some error : ${err}`)
            }
          }

          remainder ? await makeRequestCall(remainder, buildUrl(Object.assign(options, { amount: remainder }))) : null

          console.log(`Completed ${options.amount} downloads.... check the folder`)

        })()

    }

  })()