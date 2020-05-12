# Bulksplash

### A simple command line tool that lets you bulk download images from Unsplash, previously known as Unsplash Bulk Downloader.

![screenshot](https://raw.githubusercontent.com/MehediH/Bulksplash/images/demo.gif)

## Quick Start

To use Bulksplash, you need to [install Node.js](https://nodejs.org/en/download/). Once you have Node.js installed, you can simple use the `npx` command to run Bulksplash:

`npx bulksplash`

This will automatically download and let you use Bulksplash. To be able to use Bulksplash wherever you like, you can install it globally using `npm`:

`npm install bulksplash --g`

Once installed, you can simply run `bulksplash` from the terminal on any folder to download images from Unsplash. 

## What's New

Bulksplash is now [available as an NPM package.](https://www.npmjs.com/package/bulksplash)

Bulksplash now lets you download images from Collections. You can view the [Unsplash Collections here](https://unsplash.com/collections), and when using Bulksplash, you can enter any of the available collection links to download all/some images from that collection.

Bulksplash also now automatically generates a `bulksplash-credits.json` file that has the details of the photographers who made their pictures available on Unsplash. 


## Options

Prompts in the terminal will guide you through the options for downloading images, with some default values for quicker use. The prompts are as follows:

* `Which directory do you want to save to?` - The folder you want to download the pictures to. _Defaults to your current directory_
* `Which images do you want to download?` - Whether you want to download images randomly or from a specific collection. _Defaults to random_
* `What search term?` - A search term, or blank for random images. _Defaults to blank_
* `Enter the URL of the Unsplash collection you want to download from ` - The link of the Unsplash Collection you want to download _Defaults to blank, needs to be a valid link_
* `How many images (up to 50)?` - The number of images to retrieve. _Defaults to 20_
* `Only featured images?` - Should it only get featured images, curated by Unsplash? _Defaults to `Yes`_
* `What orientation?` - What orientation should the images be? The options are `Mixed`, `Portrait`, `Landscape`, `Squarish`, or `Custom`. `Mixed` will get images regardless of orientation, while `Custom` allows you to choose a specific width and height. _Defaults to `Mixed`_
* `Width?` - For any orientation, choose the width of the returned images. This is required when the `Custom` orientation is selected. _Defaults to blank for original size_
* `Height?` - For `Custom` orientation, specify a height. This option is not displayed if the orientation is not 
* `Export the credits for the photos to a .json file?` - Whether to generate the `bulksplash-credits.json` file with all the details about hte photographers. _Defaults to yes_

## Quick Usage

Bulksplash lets you directly use the tool without going through the prompt interface. 

For example: `bulksplash --amount=50 --d=basket  -c=https://unsplash.com/collections/9454911 --f --j` will download 50 featured images from the "Basketball" collection into the "test" sub-folder and generate a credits file.

Available options:

* `--d`: the directory you want to save images to.
* `--c`: if you want to download images from a collection, enter the link of the Unsplash collection you want to download images from.
* `--q`: if you want to download images about something specific, you can enter a search query.
* `--a`: the number of images you want to download.
* `--w`: the width of the images.
* `--h`: the height of the images.
* `--o`: the orientation of the images ("landscape", "portrait", "squarish")
* `--f`: whether you want to download featured images.
* `--j`: whether you want to generate a credits file.
---

Please feel free to contribute to this tiny project and make it better and [follow me on Twitter](https://twitter.com/mehedih_) for more projects like this!
