export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

export function cropImage(
  img: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/jpeg'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }
      resolve(blob);
    }, type);
  });
}

export async function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const img = await loadImage(imageSrc);
  const canvas = cropImage(img, crop);
  return await canvasToBlob(canvas);
}
