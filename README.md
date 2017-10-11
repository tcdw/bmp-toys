# BitMap Toys

Make fun between BMP image files and normal files!

## Hide in Pixel

This cli tool let you hide a file in a lossless image!

### How does it works

Modify each pixel's value to specified odd or even number, according to binary value of the file being hidden.

A header `STAR!` and a footer `0x00FF` will be injected to identify where the file starts / ends.

### Usage

```bash
pixel-hider <command> [arguments]
```

#### `write inputImg inputFile [--bare] [--stdout]`

* `inputImg`: Image you want to save data. Must be BMP format
* `inputFile`: File you want to storage
* `--bare`: Out 0 and 255 instead just modify original pixel
* `--stdout`: Print bitmap data to stdout

#### `read inputImg [--stdout]`

* `inputImg`: Image you want to export data. Must be BMP format
* `--stdout`: Print bitmap data to stdout

### Credit

This project is a Node.js remade of HFO4's text hider (https://aoaoao.me/1308.html).

The Node.js version is also support normal file hidding, and let you run in your own computer effortlessly, plus stdout printing.

## BIN-BMP

Convert any files into a weird BMP image directly, and it's possible to restore back.

### Usage

```bash
bin-bmp <command> [arguments]
```

#### `write inputFile width height [--stdout]`

* `inputFile`: File you want to convert
* `width`: Width of the output image
* `height`: Height of the output image  
If the program says "Out of bound", you should try to increase output image size.
* `--stdout`: Print bitmap data to stdout

#### `read inputImg [--stdout]`

* `inputImg`: Image you want to restore data. Must be BMP format
* `--stdout`: Print bitmap data to stdout

## Note

* Image being inputed with any commands must be BMP format. If not, use Imagemagick `convert` command first.
* NEVER convert outputed image to ANY lossy format, or your hidden data will be lost.

## License

BSD-3-Clause
