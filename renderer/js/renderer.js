const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError("Please Upload An Image File!");
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = "block";
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), "Fan Image Resizer");
}

// Send Image Data To Main
function sendImage(e) {
  e.preventDefault();
  const width = widthInput.value;
  const height = heightInput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertError("Please Upload An Image!");
    return;
  }

  if (width === "" || height === "") {
    alertError("Please Fill All The Fields!");
    return;
  }

  // Send to main using ipcRenderer
  ipcRenderer.send("image:resize", { imgPath, width, height });
}

// Catch Image Done Event
ipcRenderer.on("image:done", () => {
  alertSuccess(`Image resized to ${heightInput.value} x ${widthInput.value}`);
});

// Make sure file is image
function isFileImage(file) {
  const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"];
  return file && acceptedImageTypes.includes(file["type"]);
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}

img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
