import type { Category, Product } from '@/types';

// Sample Categories
export const sampleCategories: Omit<Category, '$id' | 'createdAt'>[] = [
  {
    name: 'Outdoor Plants',
    slug: 'outdoor-plants',
    description: 'Beautiful plants perfect for your garden, balcony, or rooftop',
    order: 1,
    isActive: true,
  },
  {
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Bring nature indoors with our air-purifying and decorative plants',
    order: 2,
    isActive: true,
  },
  {
    name: 'Outdoor Fruit Plants',
    slug: 'outdoor-fruit-plants',
    description: 'Grow your own fresh fruits at home',
    order: 3,
    isActive: true,
  },
  {
    name: 'High Moisture Plants',
    slug: 'high-moisture-plants',
    description: 'Plants that thrive in humid and wet conditions',
    order: 4,
    isActive: true,
  },
  {
    name: 'Xerophytes',
    slug: 'xerophytes',
    description: 'Low water, drought-resistant plants perfect for dry climates',
    order: 5,
    isActive: true,
  },
  {
    name: 'Pots',
    slug: 'pots',
    description: 'Terracotta, ceramic, and hanging pots for your plants',
    order: 6,
    isActive: true,
  },
  {
    name: 'Organic Compost',
    slug: 'organic-compost',
    description: 'Nutrient-rich organic compost for healthy plant growth',
    order: 7,
    isActive: true,
  },
  {
    name: 'Vermicompost',
    slug: 'vermicompost',
    description: 'Premium worm-based compost for your garden',
    order: 8,
    isActive: true,
  },
  {
    name: 'Coco Peat',
    slug: 'coco-peat',
    description: 'Natural coconut fiber growing medium',
    order: 9,
    isActive: true,
  },
];

// Sample Products - Outdoor Plants
const outdoorPlants = [
  { name: 'Hibiscus', scientificName: 'Hibiscus rosa-sinensis', price: 249, stock: 50 },
  { name: 'Malli (Jasmine)', scientificName: 'Jasminum sambac', price: 199, stock: 45 },
  { name: 'Parijatham (Night Flowering Jasmine)', scientificName: 'Nyctanthes arbor-tristis', price: 299, stock: 30 },
  { name: 'Dachcha (Marigold)', scientificName: 'Tagetes erecta', price: 149, stock: 60 },
  { name: 'Bougainvillea', scientificName: 'Bougainvillea glabra', price: 349, stock: 40 },
  { name: 'Daffodil', scientificName: 'Narcissus pseudonarcissus', price: 199, stock: 35 },
  { name: 'Basil (Tulsi)', scientificName: 'Ocimum tenuiflorum', price: 99, stock: 80 },
  { name: 'Nandiyavattai (Pinwheel Flower)', scientificName: 'Tabernaemontana divaricata', price: 249, stock: 25 },
  { name: 'Lavender', scientificName: 'Lavandula angustifolia', price: 399, stock: 20 },
  { name: 'Jasmine (Mogra)', scientificName: 'Jasminum grandiflorum', price: 229, stock: 40 },
  { name: 'Geranium', scientificName: 'Pelargonium graveolens', price: 279, stock: 35 },
  { name: 'Petunia', scientificName: 'Petunia × atkinsiana', price: 179, stock: 50 },
  { name: 'Lemongrass', scientificName: 'Cymbopogon citratus', price: 149, stock: 55 },
  { name: 'Bamboo', scientificName: 'Bambusa vulgaris', price: 499, stock: 15 },
  { name: 'Hibiscus (Red)', scientificName: 'Hibiscus rosa-sinensis', price: 269, stock: 40 },
  { name: 'Tulsi (Rama)', scientificName: 'Ocimum sanctum', price: 89, stock: 70 },
  { name: 'Rettai (Rose)', scientificName: 'Rosa chinensis', price: 299, stock: 30 },
  { name: 'Karpooravalli (Indian Borage)', scientificName: 'Coleus amboinicus', price: 129, stock: 45 },
];

// Sample Products - Indoor Plants
const indoorPlants = [
  { name: 'Jade Plant', scientificName: 'Crassula ovata', price: 349, stock: 40 },
  { name: 'Green Pothos', scientificName: 'Epipremnum aureum', price: 249, stock: 60 },
  { name: 'Neon Pothos', scientificName: 'Epipremnum aureum Neon', price: 299, stock: 35 },
  { name: 'Marble Queen Pothos', scientificName: 'Epipremnum aureum Marble Queen', price: 349, stock: 30 },
  { name: 'Syngonium', scientificName: 'Syngonium podophyllum', price: 279, stock: 45 },
  { name: 'Lakshmi Kamal (Lucky Plant)', scientificName: 'Pilea peperomioides', price: 399, stock: 20 },
  { name: 'Zebra Succulent', scientificName: 'Haworthiopsis attenuata', price: 229, stock: 50 },
  { name: 'Haworthia Succulent', scientificName: 'Haworthia fasciata', price: 249, stock: 40 },
  { name: 'Oxalis (Purple Shamrock)', scientificName: 'Oxalis triangularis', price: 299, stock: 25 },
  { name: 'Schefflera (Umbrella Plant)', scientificName: 'Schefflera arboricola', price: 449, stock: 20 },
  { name: 'Calathea (Prayer Plant)', scientificName: 'Calathea orbifolia', price: 499, stock: 15 },
  { name: 'Dumb Cane', scientificName: 'Dieffenbachia seguine', price: 379, stock: 25 },
  { name: 'Peace Lily', scientificName: 'Spathiphyllum wallisii', price: 399, stock: 35 },
  { name: 'Areca Palm', scientificName: 'Dypsis lutescens', price: 599, stock: 20 },
  { name: 'Dracaena', scientificName: 'Dracaena marginata', price: 449, stock: 25 },
  { name: 'Aloe Vera', scientificName: 'Aloe barbadensis miller', price: 199, stock: 55 },
  { name: 'Pothos (Golden)', scientificName: 'Epipremnum aureum Golden', price: 269, stock: 45 },
  { name: 'Monstera', scientificName: 'Monstera deliciosa', price: 799, stock: 15 },
  { name: 'Kalanchoe', scientificName: 'Kalanchoe blossfeldiana', price: 299, stock: 30 },
  { name: 'Fittonia (Nerve Plant)', scientificName: 'Fittonia albivenis', price: 249, stock: 40 },
  { name: 'Snake Plant', scientificName: 'Dracaena trifasciata', price: 349, stock: 50 },
  { name: 'Rubber Plant', scientificName: 'Ficus elastica', price: 499, stock: 20 },
];

// Sample Products - Outdoor Fruit Plants
const fruitPlants = [
  { name: 'Guava Plant', scientificName: 'Psidium guajava', price: 349, stock: 25 },
  { name: 'Amla (Indian Gooseberry)', scientificName: 'Phyllanthus emblica', price: 299, stock: 30 },
  { name: 'Sapota (Chikoo)', scientificName: 'Manilkara zapota', price: 399, stock: 20 },
  { name: 'Pomegranate', scientificName: 'Punica granatum', price: 449, stock: 25 },
];

// Sample Products - High Moisture Plants
const highMoisturePlants = [
  { name: 'Colocasia (Elephant Ear)', scientificName: 'Colocasia esculenta', price: 349, stock: 20 },
  { name: 'Lotus Plant', scientificName: 'Nelumbo nucifera', price: 599, stock: 15 },
  { name: 'Water Lily', scientificName: 'Nymphaea spp.', price: 499, stock: 18 },
  { name: 'Canna Lily', scientificName: 'Canna indica', price: 299, stock: 25 },
  { name: 'Papyrus', scientificName: 'Cyperus papyrus', price: 399, stock: 15 },
];

// Sample Products - Xerophytes
const xerophytes = [
  { name: 'Aloe Vera', scientificName: 'Aloe barbadensis miller', price: 199, stock: 60 },
  { name: 'Prickly Pear Cactus', scientificName: 'Opuntia ficus-indica', price: 299, stock: 30 },
  { name: 'Jade Plant', scientificName: 'Crassula ovata', price: 349, stock: 40 },
  { name: 'Echeveria', scientificName: 'Echeveria elegans', price: 249, stock: 35 },
  { name: 'Sedum (Stonecrop)', scientificName: 'Sedum spectabile', price: 199, stock: 45 },
  { name: 'Agave', scientificName: 'Agave americana', price: 499, stock: 15 },
  { name: 'Barrel Cactus', scientificName: 'Echinocactus grusonii', price: 399, stock: 20 },
  { name: 'Zebra Plant', scientificName: 'Haworthiopsis attenuata', price: 229, stock: 40 },
];

// Sample Products - Pots
const pots = [
  { name: 'Terracotta Pot (6 inch)', scientificName: '', price: 149, stock: 100 },
  { name: 'Terracotta Pot (8 inch)', scientificName: '', price: 199, stock: 80 },
  { name: 'Terracotta Pot (10 inch)', scientificName: '', price: 299, stock: 60 },
  { name: 'Ceramic Pot White (6 inch)', scientificName: '', price: 249, stock: 50 },
  { name: 'Ceramic Pot White (8 inch)', scientificName: '', price: 349, stock: 40 },
  { name: 'Ceramic Pot Blue (6 inch)', scientificName: '', price: 279, stock: 35 },
  { name: 'Hanging Basket', scientificName: '', price: 199, stock: 45 },
  { name: 'Self-Watering Pot', scientificName: '', price: 449, stock: 25 },
  { name: 'Decorative Metal Pot', scientificName: '', price: 399, stock: 20 },
  { name: 'Wooden Planter Box', scientificName: '', price: 599, stock: 15 },
];

// Sample Products - Organic Compost
const organicCompost = [
  { name: 'Organic Compost (1kg)', scientificName: '', price: 99, stock: 100 },
  { name: 'Organic Compost (5kg)', scientificName: '', price: 399, stock: 60 },
  { name: 'Organic Compost (10kg)', scientificName: '', price: 699, stock: 40 },
  { name: 'Leaf Compost (2kg)', scientificName: '', price: 149, stock: 50 },
  { name: 'Kitchen Waste Compost (2kg)', scientificName: '', price: 179, stock: 45 },
];

// Sample Products - Vermicompost
const vermicompost = [
  { name: 'Vermicompost (1kg)', scientificName: '', price: 129, stock: 80 },
  { name: 'Vermicompost (5kg)', scientificName: '', price: 499, stock: 50 },
  { name: 'Vermicompost (10kg)', scientificName: '', price: 899, stock: 30 },
  { name: 'Premium Vermicompost (2kg)', scientificName: '', price: 249, stock: 40 },
];

// Sample Products - Coco Peat
const cocoPeat = [
  { name: 'Coco Peat Block (5kg)', scientificName: '', price: 199, stock: 60 },
  { name: 'Coco Peat Block (10kg)', scientificName: '', price: 349, stock: 40 },
  { name: 'Coco Peat Powder (1kg)', scientificName: '', price: 79, stock: 80 },
  { name: 'Coco Coins (Pack of 50)', scientificName: '', price: 149, stock: 50 },
  { name: 'Coco Husk Chips (1kg)', scientificName: '', price: 99, stock: 45 },
];

// Helper function to generate products
const generateProducts = (
  items: { name: string; scientificName: string; price: number; stock: number }[],
  categoryId: string,
  categoryName: string
): Omit<Product, '$id' | 'createdAt' | 'updatedAt'>[] => {
  return items.map((item) => ({
    name: item.name,
    scientificName: item.scientificName || undefined,
    description: `Premium quality ${item.name.toLowerCase()} perfect for your garden or home. Carefully nurtured for healthy growth.`,
    price: item.price,
    stock: item.stock,
    categoryId,
    categoryName,
    images: [],
    careTips: 'Water regularly, provide adequate sunlight, and use organic fertilizer monthly for best results.',
    isActive: true,
  }));
};

// Export all sample products
export const getSampleProducts = (categoryMap: Record<string, string>): Omit<Product, '$id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    ...generateProducts(outdoorPlants, categoryMap['outdoor-plants'], 'Outdoor Plants'),
    ...generateProducts(indoorPlants, categoryMap['indoor-plants'], 'Indoor Plants'),
    ...generateProducts(fruitPlants, categoryMap['outdoor-fruit-plants'], 'Outdoor Fruit Plants'),
    ...generateProducts(highMoisturePlants, categoryMap['high-moisture-plants'], 'High Moisture Plants'),
    ...generateProducts(xerophytes, categoryMap['xerophytes'], 'Xerophytes'),
    ...generateProducts(pots, categoryMap['pots'], 'Pots'),
    ...generateProducts(organicCompost, categoryMap['organic-compost'], 'Organic Compost'),
    ...generateProducts(vermicompost, categoryMap['vermicompost'], 'Vermicompost'),
    ...generateProducts(cocoPeat, categoryMap['coco-peat'], 'Coco Peat'),
  ];
};

// Care tips by category
export const careTipsByCategory: Record<string, string> = {
  'outdoor-plants': 'Place in area with 4-6 hours of direct sunlight. Water when top soil feels dry. Fertilize every 2 weeks during growing season.',
  'indoor-plants': 'Keep in bright indirect light. Water when top inch of soil is dry. Mist leaves occasionally for humidity.',
  'outdoor-fruit-plants': 'Requires full sun (6-8 hours). Deep watering twice a week. Use fruit-specific fertilizer monthly.',
  'high-moisture-plants': 'Keep soil consistently moist. High humidity preferred. Can be grown in water or very wet soil.',
  'xerophytes': 'Minimal watering needed - water only when soil is completely dry. Bright light to full sun. Well-draining soil essential.',
  'pots': 'Clean with mild soap and water. Ensure drainage holes are clear. Store in dry place when not in use.',
  'organic-compost': 'Mix with garden soil in 1:3 ratio. Apply as top dressing monthly. Store in cool dry place.',
  'vermicompost': 'Use 20-30% mixed with soil. Excellent for seedlings and potted plants. Keep moist but not wet.',
  'coco-peat': 'Soak in water before use. Mix with compost for best results. pH neutral, excellent water retention.',
};
