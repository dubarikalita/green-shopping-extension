const CATEGORY_RULES = {
  'water-bottle': {
    keywords: {
      materials:      ['stainless steel','glass','bamboo','recycled plastic','bpa-free'],
      certifications: ['b corp','fsc','oeko-tex'],
      packaging:      ['plastic-free','recyclable packaging','minimal packaging'],
      brand:          ['carbon neutral','ethical','sustainable brand'],
      durability:     ['lifetime warranty','durable','reusable']
    }
  },
  'clothing': {
    keywords: {
      materials:      ['organic cotton','recycled polyester','hemp','linen','tencel','lyocell'],
      certifications: ['gots','fair trade','oeko-tex','bluesign','b corp'],
      packaging:      ['plastic-free','recycled packaging'],
      brand:          ['ethical manufacturing','living wage','carbon neutral'],
      durability:     ['durable','long-lasting','timeless design']
    }
  },
  'beauty': {
    keywords: {
      materials:      ['natural ingredients','organic','cruelty-free','vegan','biodegradable'],
      certifications: ['ecocert','cosmos','leaping bunny','b corp'],
      packaging:      ['refillable','glass packaging','recycled packaging','plastic-free'],
      brand:          ['ethical','sustainable brand','carbon neutral'],
      durability:     ['concentrated formula','long-lasting']
    }
  },
  'bags': {
    keywords: {
      materials:      ['recycled materials','organic cotton','cork','hemp','upcycled'],
      certifications: ['fair trade','b corp','gots'],
      packaging:      ['minimal packaging','plastic-free'],
      brand:          ['ethical manufacturing','carbon neutral'],
      durability:     ['durable','lifetime warranty','repairable']
    }
  },
  'footwear': {
    keywords: {
        materials:      ['recycled rubber','natural leather','organic cotton','hemp','cork'],
        certifications: ['fair trade','b corp','bluesign','oeko-tex'],
        packaging:      ['plastic-free','recycled box','minimal packaging'],
        brand:          ['carbon neutral','ethical manufacturing','living wage'],
        durability:     ['resolable','lifetime repair','durable','long-lasting']
    }
  },
  'electronics': {
    keywords: {
        materials:      ['recycled materials','recycled plastic','conflict-free minerals','bio-based'],
        certifications: ['energy star','epeat','tco certified','b corp'],
        packaging:      ['plastic-free','recycled packaging','minimal packaging'],
        brand:          ['carbon neutral','renewable energy','ethical supply chain'],
        durability:     ['repairable','modular','long warranty','software updates']
    }
  },
  'general': {
    keywords: {
        materials:      ['organic','recycled','natural','biodegradable','sustainable materials'],
        certifications: ['fair trade','b corp','gots','fsc','oeko-tex'],
        packaging:      ['plastic-free','compostable','recyclable packaging'],
        brand:          ['carbon neutral','ethical','sustainable brand'],
        durability:     ['durable','long-lasting','reusable','lifetime warranty']
    }
  }
};

module.exports = CATEGORY_RULES;