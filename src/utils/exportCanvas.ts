import Konva from 'konva';

export const exportCanvasToPNG = (
  stage: Konva.Stage | null,
  canvasBackground: string,
  filename: string = 'canvas.png'
) => {
  if (!stage) {
    console.error('Stage is not available');
    return;
  }

  try {
    const width = stage.width();
    const height = stage.height();

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    tempCanvas.width = width;
    tempCanvas.height = height;


    if (canvasBackground.includes('gradient')) {
      drawGradientBackground(ctx, canvasBackground, width, height);
    } else {
      ctx.fillStyle = canvasBackground;
      ctx.fillRect(0, 0, width, height);
    }

    // Save original scale
    const originalScaleX = stage.scaleX();
    const originalScaleY = stage.scaleY();

    // Set scale to 1 to get unscaled content
    stage.scaleX(1);
    stage.scaleY(1);

    // Draw stage content on top of background
    const stageCanvas = stage.toCanvas();
    ctx.drawImage(stageCanvas, 0, 0);

    // Restore original scale
    stage.scaleX(originalScaleX);
    stage.scaleY(originalScaleY);

    // Convert to PNG and download
    tempCanvas.toBlob((blob) => {
      if (!blob) {
        console.error('Could not create blob');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting canvas:', error);
  }
};

function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  gradientCSS: string,
  width: number,
  height: number
) {

  const gradientMatch = gradientCSS.match(
    /linear-gradient\((\d+)deg,\s*([^,]+)\s+(\d+)%,\s*([^,]+)\s+(\d+)%\)/
  );

  if (!gradientMatch) {
    // Fallback to solid color if parsing fails
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  const angle = parseInt(gradientMatch[1]);
  const color1 = gradientMatch[2].trim();
  const color2 = gradientMatch[4].trim();

  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180;

  // Calculate gradient line endpoints
  const diagonal = Math.sqrt(width * width + height * height);
  const centerX = width / 2;
  const centerY = height / 2;

  const x1 = centerX - (Math.cos(angleRad) * diagonal) / 2;
  const y1 = centerY - (Math.sin(angleRad) * diagonal) / 2;
  const x2 = centerX + (Math.cos(angleRad) * diagonal) / 2;
  const y2 = centerY + (Math.sin(angleRad) * diagonal) / 2;

  // Create gradient
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

