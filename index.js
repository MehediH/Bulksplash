var request = require('request')
var fs = require('fs');
var https = require("https")
var path = require("path")
var program = require("commander")

program
  .version('1.0.0')
  .option('--amount [limit]', 'Amount of pictures to download (Default is 10)')
  .option('--folder [name]', 'Name of the folder you want to save the images to (Default is "images")')
  .option('--width [w]', 'Width of images (Default is 1200)')
  .option('--height [h]', 'Height of images (Default is 800)')
  .option('-g, --grayscale', 'Enable grayscale for images (disabled by default)')
  .option('-b, --blur', 'Blur images (disabled by default)')
  .parse(process.argv);

if(!program.amount){
    program.amount = 10
}

if(!program.folder){
    program.folder = "images"
}

if(!program.width){
    program.width = 1200
}

if(!program.height){
    program.height = 800
}

console.log("Downloading " + program.amount + " random images :)")
var ProgressBar = require('progress');
var bar = new ProgressBar(':bar', { total: parseInt(program.amount) });

function download(url, dest, dirname) {
    var dir = './' + dirname;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }

    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
        response.pipe(file)
        file.on('finish', function() {
            bar.tick()
        })
    }).on('error', function(err) { 
        fs.unlink(dest) 
    });
};

for (i = 0; i < program.amount; i++){
    if(program.grayscale){
        var url = "https://unsplash.it/g/" + program.width + "/" + program.height + "/?random"
    } else{
        var url = "https://unsplash.it/" + program.width + "/" + program.height + "/?random"
    }

    if(program.blur){
        var url = url + "&blur"
    }

    download(url, path.join(__dirname, "/" + program.folder + "/image-" + (i+1) + ".jpg"), program.folder)
}