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
    // const url = buildUrl(options)

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
              bar.tick()
              return resolve(`File from ${imageUrl} downloaded.`)
            })
        }).on('error', function (e) {

          return reject(`Error while downloading ${imageUrl} ${e.code}`)

        })
      })
    }

    const makeRequestCall = (progressBarSize, options) => {
      return new Promise((resolve, reject) => {

        let url = buildUrl(options)

        request(url, (error, response, body) => {

          if (error) reject(error)

          if (!error && response.statusCode === 404)
            return reject("No images found for this search term. Please search using a different term.")

          if (!error && response.statusCode === 200) {
            body = JSON.parse(body)

            var arrayOfPromises = []
            const bar = new ProgressBar('[:percent Done] :bar', {
              total: progressBarSize,
            })

            console.log("RAW ->>>> ", body)

            Object.values(body).forEach((v, idx) => {


              const img = options.width || options.height ? v.urls.custom : v.urls.raw

              console.log(`${v.user.name} (${v.user.links.html})`)

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
                return resolve("Batch completed!")
              })

          } else {
            return reject(error)
          }
        })

      })
    }

    // the api only serves 30 files in a page...
    if (options.amount <= 30) {
      makeRequestCall(options.amount, options)
        .then(() => {
          console.log(`Completed downloading ${options.amount} images. Check the 'images' folder.`)
        })
        .catch((err) => {
          console.log(`Some error : ${err}`)
        })
    }
    else {
      let totalImagesToDownload = options.amount
      let totalPagesExcludingLast = Number.parseInt(options.amount / 30)
      let remainder = options.amount % 30

        ; (async () => {
          for (let i = 0; i < totalPagesExcludingLast; i++) {
            //this is imp here......
            try {
              await makeRequestCall(30, Object.assign(options, { page: i, amount: 30 }))
            }
            catch (err) {
              console.error(`Some error : ${err}`)
            }
          }

          remainder ? await makeRequestCall(remainder,Object.assign(options, { amount: remainder })) : null

          console.log(`Completed downloading ${totalImagesToDownload} images. Check the 'images' folder.`)

        })()

    }

  })()