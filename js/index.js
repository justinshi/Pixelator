let hasImage = false;
let fileInput = null;
let imageCanvas = null;
const reader = new FileReader();
const img = new Image();
const maxSize = 500;

const init = () => {
	fileInput = document.getElementById('imageUpload');
	imageCanvas = document.getElementById('imageCanvas');
}

const drawImage = () => {
	if (fileInput.files && fileInput.files[0]) {
		reader.onload = (event) => {
			img.onload = () => {
				let newWidth = maxSize;
				let newHeight = maxSize;
				if (img.width > maxSize || img.height > maxSize) {
					newWidth = (img.width > img.height) ? maxSize : maxSize * img.width * 1.0 / img.height;
					newHeight = (img.width < img.height) ? maxSize : maxSize * img.height * 1.0 / img.width;
				}
				imageCanvas.width = newWidth;
				imageCanvas.height = newHeight;
				imageCanvas.getContext('2d').drawImage(img, 0, 0, newWidth, newHeight);
				hasImage = true;
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(fileInput.files[0]); // need to check that file is image
	}
};