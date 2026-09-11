export interface SubCategoryGroup {
  name: string;
  items: string[];
}

export interface Subcategory {
  name: string;
  icon?: string;
  groups: SubCategoryGroup[];
}

export interface MainCategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export const KINNE_HO_CATEGORIES: MainCategory[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    subcategories: [
      {
        name: "Men's Wear",
        groups: [
          { name: 'Tops & Outerwear', items: ['Jackets & Hoodies', 'T-Shirts & Polos', 'Shirts', 'Sweaters', 'Suits & Blazers'] },
          { name: 'Bottoms & Traditional', items: ['Jeans & Trousers', 'Joggers & Shorts', 'Daura Suruwal / Kurta', 'Activewear'] }
        ]
      },
      {
        name: "Women's Wear",
        groups: [
          { name: 'Modern Wear', items: ['Dresses & Skirts', 'Tops & Tees', 'Jackets & Coats', 'Jeans & Trousers'] },
          { name: 'Ethnic & Traditional', items: ['Sarees', 'Kurtha & Salwar', 'Lehengas', 'Shawls & Pashminas'] }
        ]
      },
      {
        name: 'Shoes & Accessories',
        groups: [
          { name: 'Footwear', items: ['Sneakers & Casual', 'Boots', 'Formal Shoes', 'Heels & Flats'] },
          { name: 'Accessories', items: ['Watches', 'Bags & Backpacks', 'Sunglasses', 'Belts & Wallets'] }
        ]
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics',
    subcategories: [
      {
        name: 'Mobile Phones & Gadgets',
        groups: [
          { name: 'Smartphones', items: ['iPhones (Apple)', 'Samsung Galaxy', 'Xiaomi / Poco', 'OnePlus', 'Google Pixel'] },
          { name: 'Wearables & Audio', items: ['Smartwatches & Bands', 'AirPods / Wireless Earbuds', 'Bluetooth Speakers'] }
        ]
      },
      {
        name: 'Laptops & Computers',
        groups: [
          { name: 'Laptops', items: ['MacBooks (M1/M2/M3)', 'Gaming Laptops', 'Ultrabooks / Business Laptops'] },
          { name: 'Accessories', items: ['Monitors', 'Mechanical Keyboards', 'Mice & Trackpads', 'Laptop Bags'] }
        ]
      },
      {
        name: 'Cameras & Gear',
        groups: [
          { name: 'Photography', items: ['DSLR & Mirrorless', 'Lenses', 'Action Cameras / GoPros', 'Tripods & Gimbals'] }
        ]
      }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    subcategories: [
      {
        name: 'Consoles & Handhelds',
        groups: [
          { name: 'PlayStation', items: ['PlayStation 5', 'PlayStation 4 Pro / Slim', 'PS VR2', 'DualSense Controllers'] },
          { name: 'Xbox & Nintendo', items: ['Xbox Series X / S', 'Nintendo Switch OLED', 'Steam Deck / ROG Ally'] }
        ]
      },
      {
        name: 'Games & Gear',
        groups: [
          { name: 'Discs & Games', items: ['PS5 Game Discs', 'PS4 Games', 'Nintendo Cartridges'] },
          { name: 'Gaming Gear', items: ['Gaming Headsets', 'Racing Wheels', 'Gaming Chairs'] }
        ]
      }
    ]
  },
  {
    id: 'furniture',
    name: 'Furniture',
    subcategories: [
      {
        name: 'Living Room & Bedroom',
        groups: [
          { name: 'Seating & Beds', items: ['Sofas & Couches', 'Bed Frames & Mattresses', 'Recliners', 'Bean Bags'] },
          { name: 'Tables & Storage', items: ['Coffee Tables', 'Wardrobes & Almirahs', 'Shoe Racks', 'TV Units'] }
        ]
      },
      {
        name: 'Work & Study',
        groups: [
          { name: 'Home Office', items: ['Study & Computer Desks', 'Ergonomic Office Chairs', 'Bookshelves'] }
        ]
      }
    ]
  },
  {
    id: 'books',
    name: 'Books & Media',
    subcategories: [
      {
        name: 'Nepali & English Literature',
        groups: [
          { name: 'Fiction & Novels', items: ['Nepali Novels & Sahitya', 'Bestselling Fiction', 'Thrillers & Mystery', 'Sci-Fi & Fantasy'] },
          { name: 'Non-Fiction', items: ['Self-Help & Psychology', 'Business & Finance', 'Biographies & History'] }
        ]
      },
      {
        name: 'Academic & Entrance',
        groups: [
          { name: 'Exams & Study', items: ['IOE / Engineering Books', 'IOM / Medical Entrance', 'Loksewa Aayog Preparation', '+2 & College Textbooks'] }
        ]
      }
    ]
  }
];