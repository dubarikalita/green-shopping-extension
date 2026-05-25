function extractEtsyProduct() {
  const title =
    document.querySelector('h1[data-buy-box-listing-title]')?.innerText?.trim() ||
    document.querySelector('h1.wt-text-body-03')?.innerText?.trim() ||
    document.querySelector('h1')?.innerText?.trim() ||
    document.title?.split('|')[0]?.trim() ||
    '';

  const brand =
    document.querySelector('a[href*="/shop/"]')?.innerText?.trim() ||
    document.querySelector('[class*="shop-name"]')?.innerText?.trim() ||
    '';

  const price =
    document.querySelector('[data-selector="price-only"]')?.innerText?.trim() ||
    document.querySelector('.wt-text-title-03')?.innerText?.trim() ||
    document.querySelector('[class*="price"]')?.innerText?.trim() ||
    '';

  const description =
    document.querySelector('#wt-content-toggle-product-details-read-more p')?.innerText?.trim() ||
    document.querySelector('[class*="listing-description"]')?.innerText?.trim() ||
    document.querySelector('p[class*="description"]')?.innerText?.trim() ||
    '';

  const image =
    document.querySelector('img[data-src*="listing"]')?.src ||
    document.querySelector('.wt-max-width-full img')?.src ||
    '';

  return { title, brand, price, description, image, site: 'etsy' };
}

module.exports = { extractEtsyProduct };