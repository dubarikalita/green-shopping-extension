function extractGoogleShoppingProduct() {
  const title =
    document.querySelector('h1.sh-np__product-title')?.innerText?.trim() ||
    document.querySelector('h1[class*="product"]')?.innerText?.trim() ||
    document.querySelector('h1')?.innerText?.trim() ||
    document.title?.split('-')[0]?.trim() ||
    '';

  const brand =
    document.querySelector('.sh-np__seller-info')?.innerText?.trim() ||
    document.querySelector('[class*="brand"]')?.innerText?.trim() ||
    '';

  const price =
    document.querySelector('[aria-label*="$"], [aria-label*="₹"]')?.innerText?.trim() ||
    document.querySelector('.sh-np__price')?.innerText?.trim() ||
    document.querySelector('[class*="price"]')?.innerText?.trim() ||
    '';

  const description =
    document.querySelector('.sh-ds__desc')?.innerText?.trim() ||
    document.querySelector('[data-attrid="description"]')?.innerText?.trim() ||
    document.querySelector('[class*="description"]')?.innerText?.trim() ||
    '';

  const image = document.querySelector('.sh-div__image img')?.src || '';

  return { title, brand, price, description, image, site: 'google' };
}

module.exports = { extractGoogleShoppingProduct };