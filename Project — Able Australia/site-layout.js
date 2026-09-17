/* All project pages use the same width-only canvas. Window height must never
   shrink type or increase horizontal gutters. */
window.portfolioCanvasLayout = function (width) {
  var gutter = Math.round(Math.max(0, width - 1440) / 4);
  return { scale: (width - 2 * gutter) / 1440, left: gutter };
};
