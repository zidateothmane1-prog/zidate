export const products = [
  {
    slug: "white-oversized-tshirt",
    name: "Oversized White T-Shirt",
    category: "T-Shirts",
    status: "Available",
    color: "White",
    image: "/products/white-tshirt.jpg",
    orderPath: "/order?product=white-oversized-tshirt&offer=3-tshirts",
    description: "The clean everyday ZIDATE essential.",
  },
  {
    slug: "black-oversized-tshirt",
    name: "Oversized Black T-Shirt",
    category: "T-Shirts",
    status: "Coming Soon",
    color: "Black",
    image: "/products/black-tshirt.jpg",
    description: "A darker essential for future drops.",
  },
  {
    slug: "beige-oversized-tshirt",
    name: "Oversized Beige T-Shirt",
    category: "T-Shirts",
    status: "Coming Soon",
    color: "Beige",
    image: "/products/beige-tshirt.jpg",
    description: "Soft neutral tone, made for clean outfits.",
  },
  {
    slug: "gray-oversized-tshirt",
    name: "Oversized Gray T-Shirt",
    category: "T-Shirts",
    status: "Coming Soon",
    color: "Gray",
    image: "/products/gray-tshirt.jpg",
    description: "A simple gray daily basic for later release.",
  },
  {
    slug: "hoodie",
    name: "Hoodie",
    category: "Hoodies",
    status: "Coming Soon",
    color: "Core",
    image: "/products/hoodie.jpg",
    description: "A future warm layer for the ZIDATE rotation.",
  },
  {
    slug: "sweatpants",
    name: "Sweatpants",
    category: "Pants",
    status: "Coming Soon",
    color: "Core",
    image: "/products/sweatpants.jpg",
    description: "Relaxed bottoms for clean daily comfort.",
  },
  {
    slug: "cap",
    name: "Cap",
    category: "Accessories",
    status: "Coming Soon",
    color: "Core",
    image: "/products/cap.jpg",
    description: "A minimal accessory for future ZIDATE drops.",
  },
];

export const offers = [
  {
    slug: "2-tshirts",
    title: "2 T-Shirts",
    price: 179,
    label: "2 T-Shirts - 179 DH",
    description: "Clean oversized essentials for everyday wear.",
    features: ["Oversized fit", "Clean white design", "Soft cotton feel", "Everyday essential", "Cash on Delivery"],
  },
  {
    slug: "3-tshirts",
    title: "3 T-Shirts",
    price: 229,
    label: "3 T-Shirts - 229 DH",
    description: "The best value pack for a clean daily rotation.",
    best: true,
    features: ["Oversized fit", "Clean white design", "Soft cotton feel", "Everyday essential", "Cash on Delivery"],
  },
];

export const categories = ["T-Shirts", "Hoodies", "Pants", "Accessories", "Coming Soon"];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug) || products[0];
}

export function getOfferBySlug(slug) {
  return offers.find((offer) => offer.slug === slug) || offers[1];
}
