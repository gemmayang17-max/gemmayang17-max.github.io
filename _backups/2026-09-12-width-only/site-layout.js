/* Shared canvas geometry: halve the previous outer gutters on every page.
   Everything is snapped to whole pixels so the scaled canvas never leaves a
   half-pixel seam down its edge against the page background. */
window.portfolioCanvasLayout = function (width, height) {
  var previousScale = Math.min(width / 1440, 1,
    width >= 900 ? Math.max(0.65, (height - 80) / 1100) : 1);
  var gutter = Math.max(0, (width - 1440 * previousScale) / 4);
  var left = Math.round(gutter);
  var canvas = Math.round(width - 2 * left);
  return { scale: canvas / 1440, left: left };
};
