function detectCategory() {
  const title = document.querySelector(
    '#productTitle, h1, [itemprop="name"], [class*="title"], [class*="product-title"]'
  )?.innerText?.toLowerCase() || '';

  const url        = window.location.href.toLowerCase();
  const breadcrumb = document.querySelector(
    '#wayfinding-breadcrumbs_feature_div, nav[aria-label="breadcrumb"], [class*="breadcrumb"]'
  )?.innerText?.toLowerCase() || '';

  const text = `${title} ${url} ${breadcrumb}`;

  if (text.match(/bottle|flask|tumbler|thermos|water.?bottle/))               return 'water-bottle';
  if (text.match(/toothbrush|dental|oral.?care/))                             return 'beauty';
  if (text.match(/shirt|dress|pant|jacket|clothing|apparel|t-shirt|jeans/))  return 'clothing';
  if (text.match(/moisturizer|serum|shampoo|beauty|skincare|makeup|lotion/)) return 'beauty';
  if (text.match(/bag|backpack|tote|purse|handbag|luggage/))                 return 'bags';
  if (text.match(/shoe|sneaker|boot|sandal|footwear/))                       return 'footwear';
  if (text.match(/phone|laptop|tablet|electronic|charger|cable/))            return 'electronics';

  return 'general';
}

module.exports = { detectCategory };