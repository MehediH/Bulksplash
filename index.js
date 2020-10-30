const request = require('request')
const fs = require('fs')
const https = require('https')
const path = require('path')
const ProgressBar = require('progress')
const inquirer = require('inquirer')
const { firstQuestions, nextQuestions, } = require('./questions')

const bulksplash = async (args) => {
  
  let basePath = "";

  const options = {}

  const ask = async () => {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message: '📂 Which directory do you want to save to?',
        default: "."
      },
      {
        type: 'list',
        name: 'random',
        message: '📸 Which images do you want to download?',
        choices: ['Random', 'From a collection', ],
        filter: function(val) {
          return val === 'Random'
        }
      }
    ]).then(answers => {
      options.random = answers.random;
      basePath = answers.path === "." ? "" : answers.path
    })

    if(options.random){ // random
      await inquirer.prompt([
        {
          type: 'input',
          name: 'search',
          message: '🔍 What search term?'
        }
      ]).then(answers => options.search = answers.search)
    } else{ // from a collection
      await inquirer.prompt([
        {
          type: 'input',
          name: 'collection',
          message: '📎 Enter the URL of the Unsplash collection you want to download from',
          validate: (value) => {
            if(value.startsWith("https://unsplash.com/collections/")){
              return true;
            }

            return "🚨 Please enter a valid Unsplash Collections URL!"
          }
        }
      ]).then(answers => options.collection = answers.collection)
    }

    await inquirer.prompt(firstQuestions).then(answers => {
      for (let a in answers) {
        options[a] = answers[a]
      }
    })

    if(options.random){
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
    }

    if (options.orientation === 'custom' || options.orientation === 'mixed') {
      delete options.orientation
    }

    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'saveCredits',
        message: '🗂  Export the credits for the photos to a .json file?',
        default: true
      }
    ]).then(answers => {
      options.saveCredits = answers.saveCredits;
    })

    return options
  }


  if(args.length != 0){
    args = require("minimist")(args)

    basePath = args["d"] ? args["d"] : ""

    options.random = true;

    if(args["c"] && args["c"].startsWith("https://unsplash.com/collections/")){
      options.random = false;
      options.collection = args["c"]
    } 


    options.search = args["q"] ? args["q"] : ""
    options.amount = args["a"] && parseInt(args["a"]) > 0 ? parseInt(args["a"]) : 20
    options.width  = args["w"] && parseInt(args["w"]) > 0 ? parseInt(args["w"]) : null
    options.height  = args["h"] && parseInt(args["h"]) > 0 ? parseInt(args["h"]) : null
    options.orientation = args["o"] && ["landscape", "portrait", "squarish"].includes(args["o"]) ? args["o"] : ""
    options.color = args["r"] && ["black and white", "black", "white", "yellow", "orange", "red", "purple", "magenta", "green", "teal", "blue"].includes(args["r"]) ? args["r"] : ""
    options.featured = args["f"] ? args["f"] : false
    options.saveCredits = args["j"] ? args["j"] : false
  } else{
    await ask()
  }
  

  let apiKeys = ["KU76e-L5LwjeOxB98AWi_NJ1BfnSe1bFQ1A7Aul9foA", "ttUqGcFjnw_kag6oa9X-oM_9H5BSHFG32rFa9sIbwKs", "HQtqmJS7bjUyzlWJd8D1EKSmugm6CNTlYul58-DVN3Q", "fymYR5htky3PF1O4-P8YN4FqcpVim6lHd2S5bv79F5M"];
  let apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  // console.log(options)

  const buildUrl = ({ featured, orientation, color, search, width, height, amount, random, collection}) => {
    let base;

    if(random){
      base = 'https://api.unsplash.com/photos/random?'
    } else if(collection){
      let collectionId = collection.split("/")[4];
      base = `https://api.unsplash.com/collections/${collectionId}/photos?`
    }

    const clientId = '&client_id=' + apiKey;
    const f = random && featured ? '&featured' : ''
    const a = random ? (amount > 30 ? `&count=30` : `&count=${amount}`) : ""
    const p = !random && collection ? (amount > 30 ? `&per_page=30` : `&per_page=${amount}`) : ""
    const o = orientation ? `&orientation=${orientation}` : ''
    const c = color ? `&color=${color}` : ''
    const s = search && random ? `&query=${search}` : ''
    const w = width ? `&w=${width}` : ''
    const h = height ? `&h=${height}` : ''
    return `${base}${a}${p}${o}${c}${f}${w}${h}${s}${clientId}`
  }

  let url;


  console.log('\n🤖 Welcome to Bulksplash! (Powered by Unsplash.com)')
  // eslint-disable-next-line max-len
  console.log(`\n🔰 Downloading ${options.amount}${options.featured ? ' featured' : ''}${options.search ? ' "' + options.search + '"' : ''} images from:`)

  let bar;

  let creditsAlreadyPrinted = {};
  let c = 0;
  const saveCredits = (credits, dest) => {
    credits = Object.values(credits)

    fs.writeFile(dest + "/bulksplash-credits.json", JSON.stringify(credits, null, "\t"), "utf8", (err) => {
      if(err){
        return;
      }
      console.log("🗂  A .json file with details about the photographers has been saved to " + dest + "/bulksplash-credits.json\n")
    })
  }

  const download = ({ imageUrl, dest, img }) => {
    let dir = path.parse(dest).dir;

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    let {owner} = img

    if(!(owner.username in creditsAlreadyPrinted)){
      console.log(`📸 ${owner.name} (${owner.link})`)
      creditsAlreadyPrinted[owner.username] = owner;
    }
    
    c+=1;
    if(c == bar.total){
      console.log("\n⏳ Preparing download...\n")
    }

    const file = fs.createWriteStream(dest)

    file.on('close', () => {
      bar.tick()
      if (bar.complete) {
        console.log('\n😌 All the photos have been downloaded!\n')

        if(options.saveCredits){
          saveCredits(creditsAlreadyPrinted, dir)
        }
      }
    }, { once: true, })
    
    https.get(imageUrl, response => {
      response.pipe(file)
    }).on('error', function (e) {
      fs.unlink(dest, () => {});
      console.log('🚨 Error while downloading', imageUrl, e.code)
    })

    // make request to Unsplash download endpoint to meet API requirements
    // we don't download from endpoint because it deosn't let us download custom sizes
    request(`https://api.unsplash.com/photos/${img.id}/download?client_id=${apiKey}`, (error, response, body) => {
      // do nothing
    })
  }


  let promises = [];
  let images = []
  let iterations = 1;
  let tAmount = options.amount-30;

  if(tAmount > 30){
    while(tAmount > 0){
      iterations += 1;
      tAmount -= 30;
    }  
  }


  let processImages = () => {
    return new Promise(resolve => {
      request(url, (error, response, body) => {

        if (!error && response.statusCode === 200) {
          body = JSON.parse(body)

          Object.values(body).forEach(v => {
              const img = (options.random && (options.width || options.height)) ? v.urls.custom : v.urls.full
              images.push({
                imageUrl: img,
                id: v.id,
                owner: {
                  username: v.user.username,
                  name: v.user.name,
                  link: v.user.links.html
                }
              })

            })

            resolve(images)
        } else {
          console.log(`🚨 Something went wrong, got response code ${response.statusCode} from Unsplash - ${response.statusMessage}`)
        }
      })
    })
  }

  let page = 1;
  for(let i = 0; i < iterations; i++){
    url = buildUrl(options);
    if(options.random && options.amount > 30){
      options.amount -= 30;
    } else if(!options.random && page <= iterations){
      options.amount -= 30;
      url += "&page=" + page;
      page+=1;
    }

    promises.push(processImages())
  }

  Promise.all(promises).then((images) => {
    images = [].concat.apply([], [...new Set(images)]);

    bar = new ProgressBar('🤩 DOWNLOADING [:bar]', {
      total: images.length,
      complete: "=",
      incomplete: " "
    })

    images.map(img => {
      download({
        imageUrl: img.imageUrl,
        dest: path.join(process.cwd(), `${basePath}/bulksplash-${img.owner.username}-${img.id}.jpg`),
        img
      })
    })
  })


  
};

module.exports = bulksplash;