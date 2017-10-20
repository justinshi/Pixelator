const drawImage = () => {
	const fileInput = document.getElementById('imageUpload');
	const imageCanvas = document.getElementById('imageCanvas');

	if (fileInput.files && fileInput.files[0]) {
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				let newWidth = 500;
				let newHeight = 500;
				if (img.width > 500 || img.height > 500) {
					newWidth = (img.width > img.height) ? 500 : 500 * img.width * 1.0 / img.height;
					newHeight = (img.width < img.height) ? 500 : 500 * img.height * 1.0 / img.width;
				}
				imageCanvas.width = newWidth;
				imageCanvas.height = newHeight;
				imageCanvas.getContext('2d').drawImage(img, 0, 0, newWidth, newHeight);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(fileInput.files[0]); // need to check that file is image
	}
};