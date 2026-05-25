async function getPreferences() {
  return new Promise(resolve => {
    chrome.storage.local.get(['preferences'], result => {
      resolve(result.preferences || { priorities: [], savedProducts: [] });
    });
  });
}

async function savePreferences(prefs) {
  return new Promise(resolve => {
    chrome.storage.local.set({ preferences: prefs }, resolve);
  });
}

async function saveProduct(product) {
  const prefs = await getPreferences();
  const alreadySaved = prefs.savedProducts.find(p => p.url === product.url);
  if (!alreadySaved) {
    prefs.savedProducts.push({ ...product, savedAt: new Date().toISOString() });
    await savePreferences(prefs);
  }
}

async function removeSavedProduct(url) {
  const prefs = await getPreferences();
  prefs.savedProducts = prefs.savedProducts.filter(p => p.url !== url);
  await savePreferences(prefs);
}

module.exports = { getPreferences, savePreferences, saveProduct, removeSavedProduct };