const pixelSize = 3; // need to make this a parameter the user can choose

const pixelate = () => {
	if (hasImage) {
		const context = imageCanvas.getContext('2d');
		const origImageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
		const newImageData = context.createImageData(origImageData);
		for (let i = 0; i < origImageData.height; i += pixelSize) {
			for (let j = 0; j < origImageData.width; j += pixelSize) {
				const topLeftIndex = 4 * i * origImageData.width + 4 * j;
				let average = [0, 0, 0, 0];
				for (let k = 0; k < pixelSize; k++) {
					for (let l = 0; l < pixelSize; l++) {
						average[0] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l];
						average[1] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 1];
						average[2] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 2];
						average[3] += origImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 3];
					}
				}
				for (let k = 0; k < 4; k++) {
					average[k] /= (pixelSize * pixelSize);
				}
				for (let k = 0; k < pixelSize; k++) {
					for (let l = 0; l < pixelSize; l++) {
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l] = average[0];
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 1] = average[1];
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 2] = average[2];
						newImageData.data[topLeftIndex + 4 * k * origImageData.width + 4 * l + 3] = average[3];
					}
				}
			}
			// need to handle left-over row/column
		}
		context.putImageData(newImageData, 0, 0);
	}
}