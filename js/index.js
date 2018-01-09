// TODO: Clean up everything

let hasImage = false;
let fileInput = null;
let imageCanvas = null;
let actualCanvas = null;
let pixelSizeSlider = null;
let origImageData = null;
let currImageData = null;
let origActualData = null;
let pixelateAbove = true;
const points = [null, null];
const reader = new FileReader();
const img = new Image();
const maxSize = 500;

const switchPixelateSide = () => {
	pixelateAbove = !pixelateAbove;
	pixelate(true);
	if (points[0]) {
		drawPoint('#FF0000', points[0]);
	}
	if (points[1]) {
		drawPoint('#0000FF', points[1]);

		// formula for a line: y - y_0 = m * (x - x_0)
		drawLine();
	}
}

const drawLine = () => {
	const context = imageCanvas.getContext('2d');
	context.beginPath();
	context.strokeStyle = '#00FF00';

	// formula for a line: y - y_0 = m * (x - x_0)
	const slope = points[1].x - points[0].x != 0 ? 1.0 * (points[1].y - points[0].y) / (points[1].x - points[0].x) : null;
	const newPoints = [];
	if (slope == null) {
		newPoints.push({
			x: points[0].x,
			y: 0
		});
		newPoints.push({
			x: points[0].x,
			y: imageCanvas.height
		});
	}
	else if (slope == 0) {
		newPoints.push({
			x: 0,
			y: points[0].y
		});
		newPoints.push({
			x: imageCanvas.width,
			y: points[0].y
		});
	}
	else {
		const leftY = slope * (0 - points[0].x) + points[0].y;
		const rightY = slope * (imageCanvas.width - points[0].x) + points[0].y;
		const topX = points[0].x + (0 - points[0].y) / slope;
		const botX = points[0].x + (imageCanvas.height - points[0].y) / slope;
		if (newPoints.length < 2 && leftY >= 0 && leftY <= imageCanvas.height) {
			newPoints.push({
				x: 0,
				y: leftY
			});
		}
		if (newPoints.length < 2 && rightY >= 0 && rightY <= imageCanvas.height) {
			newPoints.push({
				x: imageCanvas.width,
				y: rightY
			});
		}
		if (newPoints.length < 2 && topX >= 0 && topX <= imageCanvas.width) {
			newPoints.push({
				x: topX,
				y: 0
			});
		}
		if (newPoints.length < 2 && botX >= 0 && botX <= imageCanvas.width) {
			newPoints.push({
				x: botX,
				y: imageCanvas.height
			});
		}
	}
	context.moveTo(newPoints[0].x, newPoints[0].y);
	context.lineTo(newPoints[1].x, newPoints[1].y);
	context.stroke();
	context.closePath();
}

const drawPoint = (color, point) => {
	const context = imageCanvas.getContext('2d');
	context.beginPath();
	context.strokeStyle = color;
	context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
	context.stroke();
	context.closePath();
}

const init = () => {
	fileInput = document.getElementById('imageUpload');
	imageCanvas = document.getElementById('imageCanvas');
	actualCanvas = document.getElementById('actualCanvas');
	imageCanvas.addEventListener('click', (event) => {
		const rect = imageCanvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		if (points[1] || points[0] == null) {
			pixelate(true);
			points[0] = {
				x: mouseX,
				y: mouseY
			};
			points[1] = null;
			drawPoint('#FF0000', points[0]);
		}
		else if (points[0]) {
			if (mouseX == points[0].x && mouseY == points[0].y) {
				return;
			}
			points[1] = {
				x: mouseX,
				y: mouseY
			};
			pixelate(true);
			drawPoint('#FF0000', points[0]);
			drawPoint('#0000FF', points[1]);

			// formula for a line: y - y_0 = m * (x - x_0)
			drawLine();
		}
	});
	pixelSizeSlider = document.getElementById('pixelSizeSlider');
	pixelSize = parseInt(pixelSizeSlider.value);
	document.getElementById('downloadLink').addEventListener('click', downloadImage);
}

const pixelSizeChange = () => {
	pixelSize = parseInt(pixelSizeSlider.value);
	pixelate(true);
	const context = imageCanvas.getContext('2d');
	if (points[0]) {
		drawPoint('#FF0000', points[0]);
	}
	if (points[1]) {
		drawPoint('#0000FF', points[1]);

		// formula for a line: y - y_0 = m * (x - x_0)
		drawLine();
	}
}

const drawImage = () => {
	if (fileInput.files && fileInput.files[0] && fileInput.files[0].type.match('image.*')) {
		reader.onload = (event) => {
			img.onload = () => {

				// actual full-size image
				actualCanvas.width = img.width;
				actualCanvas.height = img.height;
				actualCanvas.getContext('2d').drawImage(img, 0, 0, actualCanvas.width, actualCanvas.height);
				origActualData = actualCanvas.getContext('2d').getImageData(0, 0, actualCanvas.width, actualCanvas.height);

				let newWidth = maxSize;
				let newHeight = maxSize;
				if (img.width > maxSize || img.height > maxSize) {
					newWidth = (img.width > img.height) ? maxSize : maxSize * img.width * 1.0 / img.height;
					newHeight = (img.width < img.height) ? maxSize : maxSize * img.height * 1.0 / img.width;
				}
				imageCanvas.width = newWidth;
				imageCanvas.height = newHeight;
				imageCanvas.getContext('2d').drawImage(img, 0, 0, newWidth, newHeight);
				origImageData = imageCanvas.getContext('2d').getImageData(0, 0, imageCanvas.width, imageCanvas.height);
				currImageData = origImageData;
				hasImage = true;
				pixelate(true);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(fileInput.files[0]); // need to check that file is image
	}
};

const downloadImage = () => {
	pixelate(false);
	if (hasImage) {
		const img = actualCanvas.toDataURL('image/png');
		document.getElementById('downloadLink').href = img;
	}
}