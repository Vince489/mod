document.getElementById('generate-button').addEventListener('click', () => {
  const fileInput = document.getElementById('image-upload');
  const quantizationAmount = parseInt(document.getElementById('quantization-amount').value, 10);
  if (!fileInput.files.length) {
      alert('Please upload an image first.');
      return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
          const canvas = document.getElementById('image-canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const pixels = [];
          for (let i = 0; i < imageData.data.length; i += 4) {
              pixels.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]]);
          }

          // Perform quantization (web worker or main thread)
          const quantizedPalette = quantize(pixels, quantizationAmount);

          // Update canvas with new colors
          const newImageData = ctx.createImageData(imageData.width, imageData.height);
          for (let i = 0; i < newImageData.data.length; i += 4) {
              const pixelIndex = Math.floor(i / 4);
              const [r, g, b, a] = quantizedPalette[pixelIndex];
              newImageData.data[i] = r;
              newImageData.data[i + 1] = g;
              newImageData.data[i + 2] = b;
              newImageData.data[i + 3] = a;
          }
          ctx.putImageData(newImageData, 0, 0);

          // Display palette
          displayPalette(quantizedPalette);
      };
      img.src = event.target.result;
  };
  reader.readAsDataURL(fileInput.files[0]);
});

function quantize(pixels, k) {
  // Placeholder for quantization logic
  // Example: Simple K-means or Median Cut algorithm
  // Return a palette and new pixel data
  // Ensure to handle transparency here

  // For demonstration, just returning original pixels
  return pixels.slice(0, k);
}

function displayPalette(palette) {
  const paletteContainer = document.getElementById('palette');
  paletteContainer.innerHTML = ''; // Clear previous palette
  const uniqueColors = Array.from(new Set(palette.map(p => JSON.stringify(p)))).map(p => JSON.parse(p));
  uniqueColors.forEach(([r, g, b, a]) => {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '20px';
      colorDiv.style.height = '20px';
      colorDiv.style.backgroundColor = `rgba(${r},${g},${b},${a / 255})`;
      colorDiv.style.display = 'inline-block';
      colorDiv.style.margin = '2px';
      paletteContainer.appendChild(colorDiv);
  });
}
