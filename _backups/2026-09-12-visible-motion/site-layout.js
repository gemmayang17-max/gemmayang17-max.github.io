/* Shared canvas geometry: halve the previous outer gutters on every page. */
window.portfolioCanvasLayout = function (width, height) {
  var previousScale = Math.min(width / 1440, 1,
    width >= 900 ? Math.max(0.65, (height - 80) / 1100) : 1);
  var gutter = Math.max(0, (width - 1440 * previousScale) / 4);
  return { scale: (width - 2 * gutter) / 1440, left: gutter };
};
