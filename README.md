# BitMap Toys

Make fun between BMP image files and normal files!

## Hide in Pixel

This cli tool let you hide a file in a lossless image!

### How does it works

Modify each pixel's value to specified odd or even number, according to binary value of the file being hidden.

A header `STAR!` and a footer `0x00FF` will be injected to identify where the file starts / ends.

### Usage

```bash
hide-in-pixel <command> [arguments]
```

#### `write <inputImg> <inputFile> [--bare] [--stdout]`

* `<inputImg>`: Image you want to save data. Must be BMP format
* `<inputFile>`: File you want to storage
* `--bare`: Out 0 and 255 instead just modify original pixel
* `--stdout`: Print bitmap data to stdout

#### `read <inputImg> [--stdout]`

* `<inputImg>`: Image you want to export data. Must be BMP format
* `--stdout`: Print bitmap data to stdout

### Note

* Image being inputed must be BMP format. If not, use Imagemagick `convert` command first.
* NEVER convert outputed image to ANY lossy format, or your hidden data will be lost.
* Use `file` command to identify file you read from an image.

### Credit

This project is a Node.js remade of HFO4's text hider (https://aoaoao.me/1308.html).

The Node.js version is also support normal file hidding, and let you run in your own computer effortlessly, plus stdout printing.

## License

BSD-3-Clause
