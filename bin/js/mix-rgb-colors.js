/**
 * @typedef {object} mixRgbColors_color - Format de l'objet de couleur attendu
 *
 * @property {string} r - Red
 * @property {string} g - Green
 * @property {string} b - Blue
 */

/**
 * @function mixRgbColors
 *
 * @description Mélanger 2 couleurs
 *
 * @param {mixRgbColors_color} color1 - Couleur 1
 * @param {mixRgbColors_color} color2 - Couleur 2
 * @param {number} weight - Poids du mélange
 * @return false
 */

var mixRgbColors = function (color1, color2, weight) {

  return {
    r: Math.round(color1.r + (color2.r - color1.r) * (weight / 100)),
    g: Math.round(color1.g + (color2.g - color1.g) * (weight / 100)),
    b: Math.round(color1.b + (color2.b - color1.b) * (weight / 100))
  };
};
