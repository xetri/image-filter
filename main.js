document.addEventListener("DOMContentLoaded", main)

let canvas, ctx
let fname = "filter.png"
let savename = "original.png"
let origImage
let transform

function main() {
    let imgInput = document.getElementById("upload-img")
    canvas = document.querySelector("#preview canvas")
    ctx = canvas.getContext("2d")
    transform = document.getElementById("transform")

    canvas.addEventListener("click", function(_) { imgInput.click() })
    imgInput.addEventListener("change", showPreview)
    transform.addEventListener("change", filterPreview)

    document.getElementById("save").addEventListener("click", saveImage)
}

function showPreview(e) {
    transform.selectedIndex = 0
    let curfile = e.target.files[0]
    if (!curfile) return

    fname = curfile.name
    savename = "original-"+fname
    const freader = new FileReader()
    freader.readAsDataURL(curfile)

    freader.onload = e => {
        let img = new Image()
        img.src = e.target.result

        img.onload = e => {
            origImage = e.target
            const ratio = canvas.width / e.target.width
            canvas.height = e.target.height * ratio

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
    }

}

const filters = {
    "original": showOrig,
    "ascii": showAscii,
    "invert": showInvert,
    "grayscale": showGrayscale,
    "redish": showRedish,
    "greenish": showGreenish,
    "bluish": showBluish,
}

function filterPreview(e) {
    savename = e.target.value + "-" + fname
    filters[e.target.value]()
}

function imgReset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(origImage, 0, 0, canvas.width, canvas.height)
}

function showOrig() {
    imgReset()
}

function showAscii() {
    imgReset()
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for( let y = 0; y < canvas.height; y += 4 ) {
        for( let x = 0; x < canvas.width; x += 4 ) {
            const index = (y * canvas.width + x) * 4;
            const r = pixels[index];
            const g = pixels[index+1];
            const b = pixels[index+2];
            const a = pixels[index+3];

            if(a > 0) {
                const color = `rgb(${r}, ${g}, ${b})`;
                const grayScale = (r + g + b) / 3;
                const sym = getAsciiSymbol(grayScale);

                ctx.fillStyle = '#ffffff';
                ctx.fillText(sym, x + 0.3, y + 0.3);
                ctx.fillStyle = color;
                ctx.fillText(sym, x, y);
            }
        }
    }
}

function getAsciiSymbol(gscale) {
    const syms = " .:-=+*#%@".split("");
    return syms[Math.ceil(((syms.length - 1) * gscale) / 255)];
}

function showInvert() {
    imgReset()
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i+3] > 0) {
            pixels[i] = 255 - pixels[i]
            pixels[i + 1] = 255 - pixels[i + 1]
            pixels[i + 2] = 255 - pixels[i + 2]
        }
    }

    ctx.putImageData(imgData, 0, 0);

}

function showGrayscale() {
    imgReset()
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < pixels.length; i += 4) {
        let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3)
            
        if (pixels[i+3] > 0) {
            pixels[i] = lightness;
            pixels[i + 1] = lightness
            pixels[i + 2] = lightness
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function showRedish() {
    imgReset()
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i+3] > 0) {
            pixels[i] += 255
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function showGreenish() {
    imgReset()
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i+3] > 0) {
            pixels[i + 1] += 255
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function showBluish() {
    imgReset()
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imgData.data
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i+3] > 0) {
            pixels[i + 2] += 255
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

function saveImage() {
    const downloadImage = document.createElement("a")
    downloadImage.href = canvas.toDataURL()
    downloadImage.download = savename
    downloadImage.click()
}
