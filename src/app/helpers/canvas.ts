export const fillCanvasWithColour = (canvas: HTMLCanvasElement, color: string) => {
  // see https://stackoverflow.com/questions/50104437/set-background-color-to-save-canvas-chart/50126796#50126796
  const context = canvas.getContext('2d');
  context.save();
  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
};
