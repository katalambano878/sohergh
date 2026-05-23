export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputType?: string;
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export async function compressImageForUpload(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    outputType = 'image/webp',
  } = options;

  const image = await loadImageFromFile(file);
  const widthRatio = maxWidth / image.width;
  const heightRatio = maxHeight / image.height;
  const scale = Math.min(1, widthRatio, heightRatio);
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return file;
  }

  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, outputType, quality);
  });

  if (!blob) {
    return file;
  }

  // If compression did not improve size, keep original file.
  if (blob.size >= file.size) {
    return file;
  }

  const outputExt = outputType === 'image/webp' ? 'webp' : file.name.split('.').pop() || 'jpg';
  const outputName = `${file.name.replace(/\.[^/.]+$/, '')}.${outputExt}`;

  return new File([blob], outputName, {
    type: outputType,
    lastModified: Date.now(),
  });
}

