# Bulksplash

### A simple command line tool that lets you bulk download images from Unsplash, previously known as Unsplash Bulk Downloader

![screenshot](https://i.imgur.com/Y4SzEMP.gif)

## What's New

Bulksplash is now powered by the official Unsplash API. The new API gives us access to some new features, including:

* You can now download the featured images from Unsplash
* You can now download images with a specific search query
* You can now choose the orientation of the images

Additionally, the images are now saved in the `images` folder grouped by the search term, or `images/random` if no search term is supplied. The photo's file name will contain the photographer's Unsplash username and the photo's unique ID. This will allow you to keep adding new images to your existing folders.

## Getting Started

To get started with Bulksplash, simply clone the repo, install the modules with `npm  install` and run `node index`

Prompts in the terminal will guide you through the options for downloading images, with some default values for quicker use. The prompts are as follows:

* `How many images (up to 50)?` - The number of images to retrieve. _Defaults to 20_
* `What search term?` - A search term, or blank for random images. _Defaults to blank_
* `Only featured images?` - Should it only get featured images, curated by Unsplash? _Defaults to `Yes`_
* `What orientation?` - What orientation should the images be? The options are `Mixed`, `Portrait`, `Landscape`, `Squarish`, or `Custom`. `Mixed` will get images regardless of orientation, while `Custom` allows you to choose a specific width and height. _Defaults to `Mixed`_
* `Width?` - For any orientation, choose the width of the returned images. This is required when the `Custom` orientation is selected. _Defaults to blank for original size_
* `Height?` - For `Custom` orientation, specify a height. This option is not displayed if the orientation is not `Custom` and a width is specified. _Defaults to blank for original size_


---

Please feel free to contribute to this tiny project and make it better :)
