function extractAmazonProduct() {
  const title = document.querySelector('#productTitle')?.innerText?.trim() || '';
  const brand = document.querySelector('#bylineInfo')?.innerText?.trim()   || '';
  const price = document.querySelector('.a-price .a-offscreen')?.innerText?.trim() || '';

  const descriptionParts = [];
  document.querySelectorAll('#feature-bullets li span').forEach(el => {
    descriptionParts.push(el.innerText.trim());
  });
  const description = descriptionParts.join(' ');
  const image = document.querySelector('#landingImage')?.src || '';

  return { title, brand, price, description, image, site: 'amazon' };
}

module.exports = { extractAmazonProduct };