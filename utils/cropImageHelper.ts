import { Area } from 'react-easy-crop';

export default async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image: HTMLImageElement = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Failed to get canvas context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/png');
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // To avoid CORS issues
    image.src = url;
  });
}
