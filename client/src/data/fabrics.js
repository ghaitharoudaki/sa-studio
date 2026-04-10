export const WHATSAPP_NUMBER = '963 944 231 337' // replace with real number later
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`
export const MAPS_LINK = 'https://maps.google.com/?q=Mazzeh+Street+Damascus+Syria'

export const PARTNER_BRANDS = [
  'Rubelli',
  'Pierre Frey',
  'Dedar',
  'Loro Piana',
  'Armani Casa',
  'Fine',
  'Omexco',
  'Arte',          
  'Casamance',
  'Texam',
  'Roberto Cavali', 
  'Marburg',
]

export const fabrics = [
  {
    id: 'quartz-velvet',
    name: 'Quartz Velvet',
    collection: 'Minerale',
    category: 'Velvet',
    texture: 'tex-velvet',
    image: null,
    description:
      'A sumptuous cut velvet with the depth and luminosity of polished stone. The pile has been precision-sheared to create a surface that shifts between matte and brilliant as the light moves across it.',
    specs: {
      Composition: '80% Viscose, 20% Cotton',
      Martindale: '30,000 rubs',
      Weight: '420 g/m²',
      Width: '140 cm',
      Origin: 'Italy',
      Finish: 'Anti-static',
    },
  },
  {
    id: 'alabaster-linen',
    name: 'Alabaster Linen',
    collection: 'Essentials',
    category: 'Linen',
    texture: 'tex-linen',
    image: null,
    description:
      'Pure European linen woven with a fine slub that celebrates the natural character of the fibre. Stonewashed to achieve a lived-in softness that only improves with time.',
    specs: {
      Composition: '100% Linen',
      Martindale: '18,000 rubs',
      Weight: '280 g/m²',
      Width: '150 cm',
      Origin: 'Belgium',
      Finish: 'Stonewashed',
    },
  },
  {
    id: 'nocturne-damask',
    name: 'Nocturne Damask',
    collection: 'Heritage',
    category: 'Jacquard',
    texture: 'tex-damask',
    image: null,
    description:
      'A complex Jacquard weave drawing from 18th-century Venetian archives. The ground is woven in midnight silk, with the pattern emerging in matt viscose — a study in controlled contrast.',
    specs: {
      Composition: '58% Silk, 42% Viscose',
      Martindale: '15,000 rubs',
      Weight: '380 g/m²',
      Width: '130 cm',
      Origin: 'France',
      Finish: 'Natural',
    },
  },
  {
    id: 'cashmere-cloud',
    name: 'Cashmere Cloud',
    collection: 'Soft Touch',
    category: 'Cashmere',
    texture: 'tex-cashmere',
    image: null,
    description:
      'A featherlight woven cashmere in a plain structure that drapes with incomparable fluidity. Sourced from the finest Mongolian herds and processed in the Scottish Borders.',
    specs: {
      Composition: '100% Cashmere',
      Martindale: '12,000 rubs',
      Weight: '220 g/m²',
      Width: '145 cm',
      Origin: 'Scotland',
      Finish: 'Brushed',
    },
  },
  {
    id: 'travertine-boucle',
    name: 'Travertine Bouclé',
    collection: 'Minerale',
    category: 'Texture',
    texture: 'tex-boucle',
    image: null,
    description:
      'A richly textured bouclé weave inspired by the warm, porous surface of travertine stone. The looped weft creates a three-dimensional relief that rewards close study.',
    specs: {
      Composition: '55% Wool, 35% Linen, 10% Polyamide',
      Martindale: '25,000 rubs',
      Weight: '460 g/m²',
      Width: '140 cm',
      Origin: 'Germany',
      Finish: 'Natural',
    },
  },
  {
    id: 'amber-silk',
    name: 'Amber Silk',
    collection: 'Heritage',
    category: 'Silk',
    texture: 'tex-silk',
    image: null,
    description:
      'A dupioni silk in warm amber woven with a subtle horizontal slub that catches light in the manner of raw honey held to the window.',
    specs: {
      Composition: '100% Silk',
      Martindale: '8,000 rubs',
      Weight: '180 g/m²',
      Width: '120 cm',
      Origin: 'India',
      Finish: 'Natural',
    },
  },
  {
    id: 'forest-mohair',
    name: 'Forest Mohair',
    collection: 'Soft Touch',
    category: 'Mohair',
    texture: 'tex-mohair',
    image: null,
    description:
      'South African kid mohair woven into a velvet of extraordinary softness and depth. The pile length has been calibrated to produce a gentle sheen while retaining tactile warmth.',
    specs: {
      Composition: '70% Mohair, 30% Wool',
      Martindale: '35,000 rubs',
      Weight: '390 g/m²',
      Width: '137 cm',
      Origin: 'South Africa',
      Finish: 'Sheared velvet',
    },
  },
  {
    id: 'ottoman-weave',
    name: 'Ottoman Weave',
    collection: 'Essentials',
    category: 'Jacquard',
    texture: 'tex-ottoman',
    image: null,
    description:
      'A structured Ottoman weave in warm terracotta with horizontal ribs that create a subtle rhythm across the surface. Exceptionally durable and suited to upholstery applications.',
    specs: {
      Composition: '60% Cotton, 40% Polyester',
      Martindale: '50,000 rubs',
      Weight: '510 g/m²',
      Width: '140 cm',
      Origin: 'Turkey',
      Finish: 'Anti-soil',
    },
  },
  {
    id: 'pearl-velvet',
    name: 'Pearl Velvet',
    collection: 'Soft Touch',
    category: 'Velvet',
    texture: 'tex-quartz',
    image: null,
    description:
      'A pale silver-grey velvet with the lustre of sea pearls. Woven on traditional Jacquard looms in Lyon, the pile has been carefully sheared to create a surface of quiet magnificence.',
    specs: {
      Composition: '75% Viscose, 25% Silk',
      Martindale: '22,000 rubs',
      Weight: '400 g/m²',
      Width: '138 cm',
      Origin: 'France',
      Finish: 'Sheared',
    },
  },
]

export const categories = ['All', ...new Set(fabrics.map((f) => f.category))]
export const collections = [...new Set(fabrics.map((f) => f.collection))]