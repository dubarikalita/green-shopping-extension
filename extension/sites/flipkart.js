function extractFlipkartProduct() {
  // Title — try multiple stable selectors
  const title =
    document.querySelector('[class*="VU-ZEz"]')?.innerText?.trim() ||
    document.querySelector('[class*="title"] h1')?.innerText?.trim() ||
    document.querySelector('h1')?.innerText?.trim() ||
    document.querySelector('[itemprop="name"]')?.innerText?.trim() ||
    document.title?.split('|')[0]?.trim() ||
    '';

  // Brand — often inside the title or a separate element
  const brand =
    document.querySelector('[class*="mEh187"]')?.innerText?.trim() ||
    document.querySelector('[class*="brand"]')?.innerText?.trim() ||
    title.split(' ')[0] || // fallback: first word of title is usually brand
    '';

  // Price
  const price =
    document.querySelector('[class*="Nx9bqj"]')?.innerText?.trim() ||
    document.querySelector('[class*="CEmiEU"]')?.innerText?.trim() ||
    document.querySelector('[class*="price"]')?.innerText?.trim() ||
    '';

  // Description — bullet points
  const descriptionParts = [];
  document.querySelectorAll('[class*="xFVion"] li, [class*="_2cLu-l"] li, [class*="highlights"] li').forEach(el => {
    descriptionParts.push(el.innerText.trim());
  });
  const description = descriptionParts.join(' ') ||
    document.querySelector('[class*="description"]')?.innerText?.trim() || '';

  const image =
    document.querySelector('img[class*="DByuf4"]')?.src ||
    document.querySelector('img[class*="product"]')?.src ||
    '';

  return { title, brand, price, description, image, site: 'flipkart' };
}

module.exports = { extractFlipkartProduct };