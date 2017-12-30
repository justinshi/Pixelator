let pixelSize = 1;

// determinant is flipped because Y-value grow downwards
const belowLine = (x, y) => {
	if (!(points[0] && points[1])) {
		return false;
	}
	const slope = points[1].x - points[0].x != 0 ? 1.0 * (points[1].y - points[0].y) / (points[1].x - points[0].x) : null;
	if (slope == null) { // handles x = x_0 case
		return x < points[0].x;
	}
	const det = slope * x - y + (points[0].y - slope * points[0].x);
	return det < 0;
}

const pixelate = () => {
	if (hasImage) {
		const context = imageCanvas.getContext('2d');
		const newImageData = context.createImageData(origImageData);
		for (let i = 0; i < origImageData.height; i += pixelSize) {
			for (let j = 0; j < origImageData.width; j += pixelSize) {
				const topLeftIndex = 4 * i * origImageData.width + 4 * j;
				const pixelWidth = Math.min(pixelSize, origImageData.width - j);
				const pixelHeight = Math.min(pixelSize, origImageData.height - i);
				if (belowLine(j + pixelSize / 2, i + pixelSize / 2) == pixelateAbove) {
					for (let k = 0; k < pixelHeight; k++) {
						for (let l = 0; l < pixelWidth; l++) {
							newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l] = origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l];
							newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 1] = origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 1];
							newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 2] = origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 2];
							newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 3] = origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 3];
						}
					}
					continue;
				}
				let average = [0, 0, 0, 0];
				for (let k = 0; k < pixelHeight; k++) {
					for (let l = 0; l < pixelWidth; l++) {
						average[0] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l];
						average[1] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 1];
						average[2] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 2];
						average[3] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 3];
					}
				}
				for (let k = 0; k < 4; k++) {
					average[k] /= (pixelWidth * pixelHeight);
				}
				for (let k = 0; k < pixelHeight; k++) {
					for (let l = 0; l < pixelWidth; l++) {
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l] = average[0];
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 1] = average[1];
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 2] = average[2];
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 3] = average[3];
					}
				}
			}
		}
		currImageData = newImageData;
		context.putImageData(newImageData, 0, 0);
	}
}