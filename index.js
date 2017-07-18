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
  .option('--featured [f]', 'Download featured images only')
  .option('--search [s]', 'Download images with a specific term')
  .option('--orientation [o]', 'Image orientation (landscape, portrait, and squarish)')
  .parse(process.argv);

if(!program.amount){
    program.amount = 10
}

if(!program.folder){
    program.folder = "images"
}

if(!program.orientation){
    program.orientation= "landscape"
}

console.log("\nWelcome to Bulksplash! (Powered by Unsplash.com)")

console.log("\nDownloading " + program.amount + " random images :)")

var ProgressBar = require('progress');
var bar = new ProgressBar(':bar', { total: parseInt(program.amount) });

function download(url, dest, dirname) {
    var dir = './' + dirname;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }

    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
        response.pipe(file);
        bar.tick();
    }).on("error", function (e) {
        console.log("Error while downloading", url, e.code);
    });
};

var url = "https://api.unsplash.com/photos/random?count=" + program.amount + "&orientation=" + program.orientation + "&client_id=1ced621f3ac7bb7836fc9b6bfbcff5656dd43eb2b60f4636e5ef53142ea19f2d";

if(program.width){
    var url = url + "&w=" + program.width;
}

if(program.height){
    var url = url + "&h=" + program.height;
}

if(program.search){
    var url = url + "&query=" + program.search;
}

console.log("\nDownloading images from:\n")
request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        var body = JSON.parse(body);

        
        for (i in body){
            if(program.width || program.height){
                var img = body[i]["urls"].custom
            } else{
                var img = body[i]["urls"].raw
            }

            console.log(body[i]["user"].name + " (" + body[i]["user"].links["html"] + ")")
            download(img, path.join(__dirname, "/" + program.folder + "/image-" + i + ".jpg"), program.folder)
        }

    } else {
        console.log("Got an error: ", error)
    }
})