// Mock catalog until the client's real products and photos are available.
// Prices are whole EGP; stock is the opening quantity in the warehouse.

type SeedCategory = {
  slug: string;
  icon: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

type SeedProduct = {
  category: string;
  slug: string;
  sku: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  materialAr: string;
  materialEn: string;
  dimensions: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isFeatured?: boolean;
};

export const seedCategories: SeedCategory[] = [
  {
    slug: "living-rooms",
    icon: "sofa",
    nameAr: "أنتريهات",
    nameEn: "Living rooms",
    descriptionAr: "أنتريهات مريحة بتصميمات مودرن وكلاسيك تناسب كل بيت.",
    descriptionEn: "Comfortable living room sets in modern and classic designs.",
  },
  {
    slug: "salons",
    icon: "armchair",
    nameAr: "صالونات",
    nameEn: "Salons",
    descriptionAr: "صالونات كلاسيك ونيو كلاسيك بحفر يدوي وخشب زان طبيعي.",
    descriptionEn: "Classic and neo-classic salons with hand carving and solid beech.",
  },
  {
    slug: "bedrooms",
    icon: "bed",
    nameAr: "غرف نوم",
    nameEn: "Bedrooms",
    descriptionAr: "غرف نوم كاملة: سرير، دولاب، تسريحة وكومودينو.",
    descriptionEn: "Complete bedroom sets: bed, wardrobe, dresser and nightstands.",
  },
  {
    slug: "dining-rooms",
    icon: "dining",
    nameAr: "غرف سفرة",
    nameEn: "Dining rooms",
    descriptionAr: "سفرة وبوفيه ونيش لعزوماتك وتجمعات العيلة.",
    descriptionEn: "Dining tables, buffets and display cabinets for family gatherings.",
  },
  {
    slug: "kids-rooms",
    icon: "kids",
    nameAr: "غرف أطفال",
    nameEn: "Kids rooms",
    descriptionAr: "غرف أطفال وشباب آمنة وعملية بألوان مبهجة.",
    descriptionEn: "Safe, practical kids and teen rooms in cheerful colours.",
  },
  {
    slug: "tv-units",
    icon: "tv",
    nameAr: "مكتبات تلفزيون",
    nameEn: "TV units",
    descriptionAr: "مكتبات وترابيزات تلفزيون بتخزين ذكي.",
    descriptionEn: "TV units and media walls with smart storage.",
  },
  {
    slug: "office",
    icon: "office",
    nameAr: "مكاتب",
    nameEn: "Office",
    descriptionAr: "مكاتب منزلية وإدارية وكراسي مريحة.",
    descriptionEn: "Home and executive desks with comfortable chairs.",
  },
  {
    slug: "decor",
    icon: "decor",
    nameAr: "ديكور وإكسسوارات",
    nameEn: "Decor & accessories",
    descriptionAr: "ترابيزات جانبية، مرايات، وإضاءة تكمّل ذوقك.",
    descriptionEn: "Side tables, mirrors and lighting to finish the room.",
  },
];

const BEECH = { materialAr: "خشب زان طبيعي", materialEn: "Solid beech wood" };
const BEECH_VELVET = { materialAr: "خشب زان وقماش قطيفة", materialEn: "Beech frame, velvet upholstery" };
const BEECH_LINEN = { materialAr: "خشب زان وقماش كتان", materialEn: "Beech frame, linen upholstery" };
const MDF_VENEER = { materialAr: "MDF مكسو قشرة أرو", materialEn: "MDF with oak veneer" };
const OAK = { materialAr: "خشب أرو", materialEn: "Oak wood" };

export const seedProducts: SeedProduct[] = [
  // Living rooms
  {
    category: "living-rooms", slug: "nile-modern-living-set", sku: "LIV-001", ...BEECH_LINEN,
    nameAr: "أنتريه النيل مودرن", nameEn: "Nile Modern Living Set",
    descriptionAr: "كنبة ٣ مقاعد + ٢ فوتيه + ترابيزة وسط، خطوط بسيطة ومريحة للاستخدام اليومي.",
    descriptionEn: "3-seat sofa, two armchairs and a coffee table with clean, everyday-comfortable lines.",
    dimensions: "220 × 90 × 85 cm", price: 58500, compareAtPrice: 64000, stock: 6, isFeatured: true,
  },
  {
    category: "living-rooms", slug: "zamalek-corner-sofa", sku: "LIV-002", ...BEECH_VELVET,
    nameAr: "ركنة الزمالك", nameEn: "Zamalek Corner Sofa",
    descriptionAr: "ركنة على شكل L بقماش قطيفة مقاوم للبقع ومخدات قابلة للفك.",
    descriptionEn: "L-shaped corner sofa in stain-resistant velvet with removable cushions.",
    dimensions: "300 × 200 × 85 cm", price: 47000, stock: 4, isFeatured: true,
  },
  {
    category: "living-rooms", slug: "maadi-sofa-bed", sku: "LIV-003", ...BEECH_LINEN,
    nameAr: "كنبة سرير المعادي", nameEn: "Maadi Sofa Bed",
    descriptionAr: "كنبة بتتفتح سرير بمرتبة مريحة، مثالية للضيوف.",
    descriptionEn: "Converts into a bed with a comfortable mattress — ideal for guests.",
    dimensions: "200 × 95 × 90 cm", price: 22500, stock: 9,
  },
  {
    category: "living-rooms", slug: "garden-city-living-set", sku: "LIV-004", ...BEECH_VELVET,
    nameAr: "أنتريه جاردن سيتي", nameEn: "Garden City Living Set",
    descriptionAr: "أنتريه ٧ مقاعد بأرجل نحاسي وقماش قطيفة زيتي.",
    descriptionEn: "Seven-seat set with brass legs and olive velvet upholstery.",
    dimensions: "240 × 95 × 88 cm", price: 72000, stock: 2,
  },

  // Salons
  {
    category: "salons", slug: "louis-classic-salon", sku: "SAL-001", ...BEECH,
    nameAr: "صالون لويس كلاسيك", nameEn: "Louis Classic Salon",
    descriptionAr: "صالون ٩ مقاعد بحفر يدوي ودهان ذهبي مطفي.",
    descriptionEn: "Nine-seat salon with hand carving and a matte gold finish.",
    dimensions: "230 × 85 × 110 cm", price: 128000, compareAtPrice: 139000, stock: 2, isFeatured: true,
  },
  {
    category: "salons", slug: "neo-classic-salon", sku: "SAL-002", ...BEECH_VELVET,
    nameAr: "صالون نيو كلاسيك", nameEn: "Neo-Classic Salon",
    descriptionAr: "تصميم يجمع بين فخامة الكلاسيك وبساطة المودرن.",
    descriptionEn: "Blends classic grandeur with modern simplicity.",
    dimensions: "215 × 85 × 100 cm", price: 94000, stock: 3,
  },
  {
    category: "salons", slug: "royal-salon", sku: "SAL-003", ...BEECH,
    nameAr: "صالون رويال", nameEn: "Royal Salon",
    descriptionAr: "صالون فاخر بقماش جاكار مستورد وأويما دقيقة.",
    descriptionEn: "Luxury salon in imported jacquard with fine wood carving.",
    dimensions: "240 × 90 × 115 cm", price: 156000, stock: 1,
  },

  // Bedrooms
  {
    category: "bedrooms", slug: "cairo-master-bedroom", sku: "BED-001", ...MDF_VENEER,
    nameAr: "غرفة نوم القاهرة", nameEn: "Cairo Master Bedroom",
    descriptionAr: "سرير ١٨٠ سم، دولاب ٦ ضلف، تسريحة بمرآة و٢ كومودينو.",
    descriptionEn: "180 cm bed, six-door wardrobe, dresser with mirror and two nightstands.",
    dimensions: "Bed 180 × 200 cm", price: 118000, compareAtPrice: 129000, stock: 3, isFeatured: true,
  },
  {
    category: "bedrooms", slug: "alexandria-bedroom", sku: "BED-002", ...BEECH,
    nameAr: "غرفة نوم إسكندرية", nameEn: "Alexandria Bedroom",
    descriptionAr: "غرفة نوم زان طبيعي بدهان أبيض عاجي ولمسات ذهبي.",
    descriptionEn: "Solid beech bedroom in ivory white with gold accents.",
    dimensions: "Bed 160 × 200 cm", price: 145000, stock: 2,
  },
  {
    category: "bedrooms", slug: "luxor-modern-bedroom", sku: "BED-003", ...MDF_VENEER,
    nameAr: "غرفة نوم الأقصر مودرن", nameEn: "Luxor Modern Bedroom",
    descriptionAr: "سرير بظهر منجد، دولاب سحاب بمرايات، تصميم عملي للمساحات الصغيرة.",
    descriptionEn: "Upholstered headboard and mirrored sliding wardrobe — great for smaller rooms.",
    dimensions: "Bed 160 × 200 cm", price: 86000, stock: 5,
  },
  {
    category: "bedrooms", slug: "aswan-wardrobe", sku: "BED-004", ...MDF_VENEER,
    nameAr: "دولاب أسوان ٤ ضلف", nameEn: "Aswan 4-Door Wardrobe",
    descriptionAr: "دولاب بأرفف وشماعات ودرج داخلي.",
    descriptionEn: "Wardrobe with shelves, hanging rails and an inner drawer.",
    dimensions: "180 × 60 × 220 cm", price: 31000, stock: 1,
  },

  // Dining rooms
  {
    category: "dining-rooms", slug: "heliopolis-dining-room", sku: "DIN-001", ...OAK,
    nameAr: "سفرة مصر الجديدة", nameEn: "Heliopolis Dining Room",
    descriptionAr: "ترابيزة ٨ كراسي + بوفيه + نيش بزجاج.",
    descriptionEn: "Eight-chair table, buffet and glass display cabinet.",
    dimensions: "Table 240 × 110 cm", price: 112000, stock: 2, isFeatured: true,
  },
  {
    category: "dining-rooms", slug: "sheikh-zayed-dining-set", sku: "DIN-002", ...MDF_VENEER,
    nameAr: "سفرة الشيخ زايد مودرن", nameEn: "Sheikh Zayed Modern Dining Set",
    descriptionAr: "ترابيزة ٦ كراسي بسطح رخام صناعي.",
    descriptionEn: "Six-chair table with a sintered-stone top.",
    dimensions: "Table 180 × 95 cm", price: 54000, stock: 4,
  },
  {
    category: "dining-rooms", slug: "classic-buffet", sku: "DIN-003", ...BEECH,
    nameAr: "بوفيه كلاسيك", nameEn: "Classic Buffet",
    descriptionAr: "بوفيه بأدراج وضلف ومرآة محفورة.",
    descriptionEn: "Buffet with drawers, doors and a carved mirror.",
    dimensions: "200 × 50 × 95 cm", price: 38500, stock: 0,
  },
  {
    category: "dining-rooms", slug: "velvet-dining-chair", sku: "DIN-004", ...BEECH_VELVET,
    nameAr: "كرسي سفرة قطيفة", nameEn: "Velvet Dining Chair",
    descriptionAr: "كرسي سفرة منجد بظهر مريح، يباع بالقطعة.",
    descriptionEn: "Upholstered dining chair with a supportive back, sold individually.",
    dimensions: "48 × 55 × 98 cm", price: 4200, stock: 24,
  },

  // Kids rooms
  {
    category: "kids-rooms", slug: "little-star-kids-room", sku: "KID-001", ...MDF_VENEER,
    nameAr: "غرفة أطفال ليتل ستار", nameEn: "Little Star Kids Room",
    descriptionAr: "سرير ١٢٠ سم، دولاب، مكتب وكومودينو بحواف آمنة.",
    descriptionEn: "120 cm bed, wardrobe, desk and nightstand with rounded safe edges.",
    dimensions: "Bed 120 × 200 cm", price: 52000, stock: 3, isFeatured: true,
  },
  {
    category: "kids-rooms", slug: "bunk-bed-explorer", sku: "KID-002", ...BEECH,
    nameAr: "سرير دورين إكسبلورر", nameEn: "Explorer Bunk Bed",
    descriptionAr: "سرير دورين بسلم ودرابزين حماية وأدراج تخزين.",
    descriptionEn: "Bunk bed with ladder, safety rails and storage drawers.",
    dimensions: "100 × 200 × 165 cm", price: 27500, stock: 4,
  },
  {
    category: "kids-rooms", slug: "teen-study-room", sku: "KID-003", ...MDF_VENEER,
    nameAr: "غرفة شباب ستادي", nameEn: "Teen Study Room",
    descriptionAr: "سرير، مكتب بمكتبة علوية، ودولاب ضلفتين.",
    descriptionEn: "Bed, desk with overhead shelving and a two-door wardrobe.",
    dimensions: "Bed 120 × 200 cm", price: 46000, stock: 2,
  },

  // TV units
  {
    category: "tv-units", slug: "zamalek-tv-unit", sku: "TV-001", ...MDF_VENEER,
    nameAr: "مكتبة تلفزيون الزمالك", nameEn: "Zamalek TV Unit",
    descriptionAr: "وحدة تلفزيون حائط بإضاءة LED وأرفف عرض.",
    descriptionEn: "Wall media unit with LED lighting and display shelves.",
    dimensions: "260 × 40 × 200 cm", price: 24500, stock: 5, isFeatured: true,
  },
  {
    category: "tv-units", slug: "floating-tv-console", sku: "TV-002", ...OAK,
    nameAr: "ترابيزة تلفزيون معلقة", nameEn: "Floating TV Console",
    descriptionAr: "ترابيزة معلقة بأدراج سوفت كلوز.",
    descriptionEn: "Wall-mounted console with soft-close drawers.",
    dimensions: "180 × 35 × 30 cm", price: 9800, stock: 8,
  },
  {
    category: "tv-units", slug: "classic-tv-cabinet", sku: "TV-003", ...BEECH,
    nameAr: "نيش تلفزيون كلاسيك", nameEn: "Classic TV Cabinet",
    descriptionAr: "كابينة تلفزيون بحفر يدوي وضلف زجاج.",
    descriptionEn: "Hand-carved TV cabinet with glass doors.",
    dimensions: "200 × 50 × 180 cm", price: 33000, stock: 1,
  },

  // Office
  {
    category: "office", slug: "executive-desk", sku: "OFF-001", ...OAK,
    nameAr: "مكتب مدير إكزكيوتف", nameEn: "Executive Desk",
    descriptionAr: "مكتب مدير بسطح جلد ووحدة أدراج جانبية.",
    descriptionEn: "Executive desk with a leather inlay top and side drawer unit.",
    dimensions: "180 × 85 × 76 cm", price: 36000, stock: 3,
  },
  {
    category: "office", slug: "home-office-desk", sku: "OFF-002", ...MDF_VENEER,
    nameAr: "مكتب هوم أوفيس", nameEn: "Home Office Desk",
    descriptionAr: "مكتب عملي بمخرج كابلات ودرج.",
    descriptionEn: "Practical desk with cable management and a drawer.",
    dimensions: "120 × 60 × 75 cm", price: 8900, stock: 12, isFeatured: true,
  },
  {
    category: "office", slug: "ergonomic-office-chair", sku: "OFF-003",
    materialAr: "شبك وألومنيوم", materialEn: "Mesh and aluminium",
    nameAr: "كرسي مكتب طبي", nameEn: "Ergonomic Office Chair",
    descriptionAr: "كرسي بمسند ظهر قابل للتعديل ودعم للفقرات القطنية.",
    descriptionEn: "Adjustable chair with lumbar support.",
    dimensions: "65 × 65 × 120 cm", price: 7400, stock: 15,
  },

  // Decor
  {
    category: "decor", slug: "brass-side-table", sku: "DEC-001",
    materialAr: "نحاس ورخام", materialEn: "Brass and marble",
    nameAr: "ترابيزة جانبية نحاس", nameEn: "Brass Side Table",
    descriptionAr: "ترابيزة جانبية بسطح رخام وقاعدة نحاس.",
    descriptionEn: "Side table with a marble top and brass base.",
    dimensions: "Ø 45 × 55 cm", price: 5600, stock: 10, isFeatured: true,
  },
  {
    category: "decor", slug: "arabesque-mirror", sku: "DEC-002", ...BEECH,
    nameAr: "مرآة أرابيسك", nameEn: "Arabesque Mirror",
    descriptionAr: "مرآة حائط بإطار أرابيسك محفور يدويًا.",
    descriptionEn: "Wall mirror with a hand-carved arabesque frame.",
    dimensions: "80 × 120 cm", price: 6800, stock: 2,
  },
  {
    category: "decor", slug: "mashrabiya-floor-lamp", sku: "DEC-003", ...BEECH,
    nameAr: "أباجورة مشربية", nameEn: "Mashrabiya Floor Lamp",
    descriptionAr: "أباجورة أرضية بتصميم مشربية يعكس ظلال دافئة.",
    descriptionEn: "Floor lamp with a mashrabiya shade that casts warm patterns.",
    dimensions: "Ø 40 × 160 cm", price: 4300, stock: 7,
  },
  {
    category: "decor", slug: "nesting-coffee-tables", sku: "DEC-004", ...OAK,
    nameAr: "ترابيزات وسط متداخلة", nameEn: "Nesting Coffee Tables",
    descriptionAr: "طقم ٣ ترابيزات متداخلة توفر المساحة.",
    descriptionEn: "Set of three space-saving nesting tables.",
    dimensions: "60 × 60 × 45 cm", price: 7900, stock: 0,
  },
];
