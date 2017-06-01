# Bulksplash

### A simple command line tool that lets you bulk download images from Unsplash, previously known as Unsplash Bulk Downloader

![screenshot](http://i.imgur.com/uK9pqbW.jpg)

## What's New

Bulksplash is now powered by the official Unsplash API. The new API gives us access to some new features, including:

* You can now download the featured images from Unsplash
* You can now download images with a specific search query
* You can now choose the orientation of the images

## Getting Started

To get started with Bulksplash, simply clone the repo, install the modules with `npm  install` and run `node index`

Here are some of the available options:

```
Usage: index [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    --amount [limit]   Amount of pictures to download (Default is 10)
    --folder [name]    Name of the folder you want to save the images to (Default is "images")
    --width [w]        Width of images (Default is 1200)
    --height [h]       Height of images (Default is 800)
    --featured [f]     Download featured images only
    --search [s]       Download images with a specific term
    --orientation [o]  Image orientation (landscape, portrait, and squarish)
````

---

Please feel free to contribute to this tiny project and make it better :)
