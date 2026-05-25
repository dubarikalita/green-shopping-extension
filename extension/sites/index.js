const { extractAmazonProduct }         = require('./amazon.js');
const { extractFlipkartProduct }       = require('./flipkart.js');
const { extractEtsyProduct }           = require('./etsy.js');
const { extractGoogleShoppingProduct } = require('./google.js');

function extractProductData() {
  const url = window.location.hostname;
  if (url.includes('amazon'))   return extractAmazonProduct();
  if (url.includes('flipkart')) return extractFlipkartProduct();
  if (url.includes('etsy'))     return extractEtsyProduct();
  if (url.includes('google'))   return extractGoogleShoppingProduct();
  return null;
}

module.exports = { extractProductData };