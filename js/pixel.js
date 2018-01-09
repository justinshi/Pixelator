// TODO: Clean up everything

let pixelSize = 1;

// determinant is flipped because Y-value grow downwards
const belowLine = (x, y, preview) => {
	if (!(points[0] && points[1])) {
		return false;
	}
	let x0 = points[0].x;
	let x1 = points[1].x;
	let y0 = points[0].y;
	let y1 = points[1].y;
	if (!preview) {
		const scale = 1.0 * actualCanvas.width / imageCanvas.width;
		x0 *= scale;
		x1 *= scale;
		y0 *= scale;
		y1 *= scale;
	}
	const slope = x1 - x0 != 0 ? 1.0 * (y1 - y0) / (x1 - x0) : null;
	if (slope == null) { // handles x = x_0 case
		return x < x0;
	}
	const det = slope * x - y + (y0 - slope * x0);
	return det < 0;
}

const pixelate = (preview) => {
	if (hasImage) {
		const context = preview ? imageCanvas.getContext('2d') : actualCanvas.getContext('2d');
		const origData = preview ? origImageData : origActualData;
		const newImageData = context.createImageData(origData);
		const actualPixelSize = preview ? pixelSize : Math.round(pixelSize * 1.0 * actualCanvas.width / imageCanvas.width);
		for (let i = 0; i < origData.height; i += actualPixelSize) {
			for (let j = 0; j < origData.width; j += actualPixelSize) {
				const topLeftIndex = 4 * i * origData.width + 4 * j;
				const pixelWidth = Math.min(actualPixelSize, origData.width - j);
				const pixelHeight = Math.min(actualPixelSize, origData.height - i);
				if (belowLine(j + actualPixelSize / 2, i + actualPixelSize / 2, preview) == pixelateAbove) {
					for (let k = 0; k < pixelHeight; k++) {
						for (let l = 0; l < pixelWidth; l++) {
							newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l] = origData.data[topLeftIndex + 4 * k * origData.width + 4 * l];
							newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 1] = origData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 1];
							newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 2] = origData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 2];
							newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 3] = origData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 3];
						}
					}
					continue;
				}
				let average = [0, 0, 0, 0];
				for (let k = 0; k < pixelHeight; k++) {
					for (let l = 0; l < pixelWidth; l++) {
						average[0] += origData.data[topLeftIndex + 4 * k * origData.width + 4 * l];
						average[1] += origData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 1];
						average[2] += origData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 2];
						average[3] += origData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 3];
					}
				}
				for (let k = 0; k < 4; k++) {
					average[k] /= (pixelWidth * pixelHeight);
				}
				for (let k = 0; k < pixelHeight; k++) {
					for (let l = 0; l < pixelWidth; l++) {
						newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l] = average[0];
						newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 1] = average[1];
						newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 2] = average[2];
						newImageData.data[topLeftIndex + 4 * k * origData.width + 4 * l + 3] = average[3];
					}
				}
			}
		}
		if (preview) {
			currImageData = newImageData;
		}
		context.putImageData(newImageData, 0, 0);
	}
}