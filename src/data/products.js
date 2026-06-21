export const DEFAULT_CATS = [
  { id: 'business-cards',   l: 'Business Cards',      i: '🪪' },
  { id: 'flyers-postcards', l: 'Flyers & Postcards',  i: '📄' },
  { id: 'signs-banners',    l: 'Signs & Banners',      i: '🪧' },
  { id: 'vehicle-graphics', l: 'Vehicle Graphics',     i: '🚗' },
  { id: 'marketing',        l: 'Marketing Material',   i: '📋' },
  { id: 'stationery',       l: 'Business Stationery',  i: '✉️' },
  { id: 'restaurant',       l: 'Restaurant Printing',  i: '🍽️' },
  { id: 'foam-boards',      l: 'Foam Boards',          i: '🖼️' },
  { id: 'labels-stickers',  l: 'Labels & Stickers',   i: '🏷️' },
  { id: 'real-estate',      l: 'Real Estate',          i: '🏡' },
  { id: 'calendars',        l: 'Calendars',            i: '📅' },
  { id: 'posters-canvas',   l: 'Posters & Canvas',    i: '🎨' },
];

export const CAT_BG = {
  'business-cards': '#1a1a2e', 'flyers-postcards': '#0d1b2a',
  'signs-banners': '#1a0a00', 'vehicle-graphics': '#0a1a0a',
  'marketing': '#1a1a0a', 'stationery': '#0a0a1a',
  'restaurant': '#1a0a0a', 'foam-boards': '#0a1a1a',
  'labels-stickers': '#1a0a1a', 'real-estate': '#0a1505',
  'calendars': '#1a1500', 'posters-canvas': '#1a0a15',
};

export const DEFAULT_PRODS = [
  {
    "id": "best-value-business-cards",
    "cat": "business-cards",
    "name": "Best Value Business Cards",
    "badge": "Most Popular",
    "imgs": [],
    "desc": "Professional full-colour business cards on 14pt C2S gloss stock — sharp, vibrant, and budget-friendly for any business.", "long_desc": "Our best-value business cards deliver professional results without the premium price tag. Printed in full-colour CMYK on 14pt coated two-sides (C2S) gloss card stock, these cards are ideal for networking events, trade shows, and everyday use. Standard 3.5″ × 2″ size fits every cardholder and wallet perfectly.",
    "opts": [
      {
        "key": "paper",
        "label": "Paper Stock",
        "opts": [
          {
            "id": "14pt",
            "l": "14pt Economy",
            "m": 1
          },
          {
            "id": "16pt",
            "l": "16pt Standard",
            "m": 1.12
          },
          {
            "id": "18pt",
            "l": "18pt Premium",
            "m": 1.22
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 24.32
      },
      {
        "q": 250,
        "p": 37.12
      },
      {
        "q": 500,
        "p": 49.92
      },
      {
        "q": 1000,
        "p": 62.72
      },
      {
        "q": 2500,
        "p": 126.72
      },
      {
        "q": 5000,
        "p": 199
      },
      {
        "q": 10000,
        "p": 349
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss coating both sides"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "File Format", "v": "PDF, AI, EPS, PNG 300dpi+"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "most-popular-business-cards",
    "cat": "business-cards",
    "name": "Most Popular Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Our most ordered business cards — 16pt gloss UV stock with a high-shine coating that makes colours pop and protects against wear.", "long_desc": "The most popular choice among our GTA clients. Printed on premium 16pt coated stock with a UV gloss coating applied after printing, these cards have a bright, high-contrast finish that stands out in any stack. The UV coating also adds durability — resistant to fingerprints, moisture, and everyday handling.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 24.32
      },
      {
        "q": 250,
        "p": 37.12
      },
      {
        "q": 500,
        "p": 49.92
      },
      {
        "q": 1000,
        "p": 62.72
      },
      {
        "q": 2500,
        "p": 126.72
      },
      {
        "q": 5000,
        "p": 199
      },
      {
        "q": 10000,
        "p": 349
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "16pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV coating front"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "File Format", "v": "PDF, AI, EPS, PNG 300dpi+"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "matte-business-cards",
    "cat": "business-cards",
    "name": "Matte Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Sophisticated matte finish business cards on 16pt stock — writable surface, elegant look, perfect for a professional first impression.", "long_desc": "Matte business cards have a refined, non-reflective finish that reads as premium and understated. The matte coating is writable — great for jotting notes on the back. Popular with lawyers, consultants, designers, and real estate professionals who want a clean, high-end look.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 24.32
      },
      {
        "q": 250,
        "p": 37.12
      },
      {
        "q": 500,
        "p": 49.92
      },
      {
        "q": 1000,
        "p": 62.72
      },
      {
        "q": 2500,
        "p": 126.72
      },
      {
        "q": 5000,
        "p": 199
      },
      {
        "q": 10000,
        "p": 349
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "16pt C2S Coated"},
      {"k": "Finish", "v": "Matte coating both sides"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Writable", "v": "Yes — matte surface accepts pen/pencil"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "glossy-business-cards",
    "cat": "business-cards",
    "name": "Glossy Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "High-gloss business cards with vivid colour reproduction — ideal for photos, bold graphics, and brands that want to make a strong impact.", "long_desc": "Gloss business cards are the go-to choice when your design features photography, rich gradients, or bold brand colours. The high-gloss finish amplifies colour saturation and gives images exceptional depth and clarity. Printed on 16pt coated stock for a sturdy, premium feel.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 24.32
      },
      {
        "q": 250,
        "p": 37.12
      },
      {
        "q": 500,
        "p": 49.92
      },
      {
        "q": 1000,
        "p": 62.72
      },
      {
        "q": 2500,
        "p": 126.72
      },
      {
        "q": 5000,
        "p": 199
      },
      {
        "q": 10000,
        "p": 349
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "16pt C2S Coated"},
      {"k": "Finish", "v": "High-gloss UV both sides"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Best for", "v": "Photos, bold colours, graphics-heavy designs"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "uncoated-business-cards",
    "cat": "business-cards",
    "name": "Uncoated Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Classic uncoated business cards with a natural paper feel — writable, eco-friendly aesthetic, great for handwritten notes and stamps.", "long_desc": "Uncoated cards have a natural, tactile paper feel that many professionals prefer. Without a surface coating, they’re fully writable with pen, pencil, or stamp — ideal for appointment cards, referral cards, and brands with a natural or artisan aesthetic. Printed on 14pt uncoated stock.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 24.32
      },
      {
        "q": 250,
        "p": 37.12
      },
      {
        "q": 500,
        "p": 49.92
      },
      {
        "q": 1000,
        "p": 62.72
      },
      {
        "q": 2500,
        "p": 126.72
      },
      {
        "q": 5000,
        "p": 199
      },
      {
        "q": 10000,
        "p": 349
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "14pt Uncoated"},
      {"k": "Finish", "v": "No coating — natural paper feel"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Writable", "v": "Yes — ideal for stamps and handwriting"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "thicker-business-cards-18pt",
    "cat": "business-cards",
    "name": "Thicker Business Cards (18pt)",
    "badge": null,
    "imgs": [],
    "desc": "Premium 18pt thick business cards — noticeably heavier than standard cards, making a strong tactile impression at networking events.", "long_desc": "At 18pt, these cards are significantly thicker than standard business cards and feel substantial and premium in hand. The extra thickness signals quality before the recipient even reads your name. Popular with executives, real estate agents, and any professional where first impressions matter most.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 112.64
      },
      {
        "q": 250,
        "p": 122.88
      },
      {
        "q": 500,
        "p": 138.88
      },
      {
        "q": 1000,
        "p": 153.6
      },
      {
        "q": 2500,
        "p": 222.72
      },
      {
        "q": 5000,
        "p": 379
      },
      {
        "q": 10000,
        "p": 699
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "18pt Extra Thick"},
      {"k": "Finish", "v": "Gloss UV or Matte (your choice)"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Thickness", "v": "18pt — 25% thicker than standard 14pt"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "folded-business-cards",
    "cat": "business-cards",
    "name": "Folded Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Folded business cards that open to reveal more content — double the space for menus, portfolios, appointment details, or service lists.", "long_desc": "Folded business cards are standard business card size when closed (3.5″ × 2″) but open to 3.5″ × 4″ — giving you double the content area. Perfect for hair stylists listing services, photographers showing portfolio samples, restaurants printing a mini-menu, or anyone who needs more information than a standard card allows.",
    "opts": [
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 129.02
      },
      {
        "q": 250,
        "p": 165.89
      },
      {
        "q": 500,
        "p": 188.48
      },
      {
        "q": 1000,
        "p": 201.6
      },
      {
        "q": 2500,
        "p": 324.8
      },
      {
        "q": 5000,
        "p": 589
      },
      {
        "q": 10000,
        "p": 999
      }
    ]
  ,
    "specs": [
      {"k": "Closed Size", "v": "3.5″ × 2″"},
      {"k": "Open Size", "v": "3.5″ × 4″"},
      {"k": "Stock", "v": "16pt C2S Coated"},
      {"k": "Finish", "v": "Matte or Gloss UV"},
      {"k": "Print", "v": "Full colour CMYK, 4 panels"},
      {"k": "Fold Type", "v": "Single score fold, centre"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "matte-laminated-business-cards",
    "cat": "business-cards",
    "name": "Matte Laminated Business Cards",
    "badge": "Premium",
    "imgs": [],
    "desc": "Matte laminated business cards with a luxurious soft feel — lamination adds durability and a premium tactile quality that stands out.", "long_desc": "A matte laminate film is applied over the printed card, creating a smooth, silky surface with exceptional durability. Matte laminated cards are resistant to scratches, moisture, and bending. The laminate gives the card a premium weight and feel that clients immediately notice. One of our most popular premium options.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 101.38
      },
      {
        "q": 250,
        "p": 110.59
      },
      {
        "q": 500,
        "p": 116.07
      },
      {
        "q": 1000,
        "p": 129.6
      },
      {
        "q": 2500,
        "p": 217.15
      },
      {
        "q": 5000,
        "p": 389
      },
      {
        "q": 10000,
        "p": 699
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "16pt C2S Coated"},
      {"k": "Finish", "v": "Matte laminate film, front & back"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Durability", "v": "Scratch, moisture & bend resistant"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "suede-soft-touch-business-cards",
    "cat": "business-cards",
    "name": "Suede Soft Touch Business Cards",
    "badge": "Premium",
    "imgs": [],
    "desc": "Suede soft-touch business cards with a velvety, rubber-like feel — the most tactile and memorable card finish available.", "long_desc": "Soft-touch (suede) laminate creates a velvety, rubber-like texture that is instantly recognizable and memorable. When someone picks up your soft-touch card, they feel the difference immediately. The finish reduces glare and fingerprints, giving printed colours a deep, rich appearance. Highly recommended for luxury brands and premium service providers.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "corners",
        "label": "Corners",
        "opts": [
          {
            "id": "sq",
            "l": "Square",
            "m": 1
          },
          {
            "id": "rd",
            "l": "Rounded (+5%)",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 112.32
      },
      {
        "q": 250,
        "p": 129.6
      },
      {
        "q": 500,
        "p": 138.24
      },
      {
        "q": 1000,
        "p": 150.34
      },
      {
        "q": 2500,
        "p": 249.98
      },
      {
        "q": 5000,
        "p": 439
      },
      {
        "q": 10000,
        "p": 799
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "18pt C2S Coated"},
      {"k": "Finish", "v": "Soft-touch (suede) velvet laminate"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Feel", "v": "Velvety, rubber-like texture"},
      {"k": "Best for", "v": "Luxury brands, premium services"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "embossed-spot-uv-19pt",
    "cat": "business-cards",
    "name": "Embossed Spot UV (19PT)",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "19pt business cards with embossing and spot UV highlights — raised texture and glossy accents create a stunning premium effect.", "long_desc": "Embossed spot UV cards combine two premium effects: embossing raises selected design elements (logo, text, patterns) above the card surface, while spot UV adds a high-gloss varnish to those same areas. The result is a dramatic visual and tactile contrast that makes your card truly unforgettable.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 81.92
      },
      {
        "q": 50,
        "p": 107.52
      },
      {
        "q": 100,
        "p": 153.6
      },
      {
        "q": 250,
        "p": 174.08
      },
      {
        "q": 500,
        "p": 188.48
      },
      {
        "q": 1000,
        "p": 201.6
      },
      {
        "q": 2500,
        "p": 399.04
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "19pt Extra Thick"},
      {"k": "Base Finish", "v": "Matte laminate"},
      {"k": "Special Effect", "v": "Embossed + Spot UV highlights"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Effect Areas", "v": "Specify in your artwork file"},
      {"k": "Turnaround", "v": "7–10 business days"}
    ]
  },
  {
    "id": "embossed-spot-uv-27pt",
    "cat": "business-cards",
    "name": "Embossed Spot UV (27PT)",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "Ultra-premium 27pt cards with embossing and spot UV — the thickest, most impressive business card we offer.", "long_desc": "At 27pt, these are our thickest business cards — nearly twice the thickness of standard 14pt cards. Combined with embossing and spot UV highlights, these cards deliver an unmatched premium impression. Ideal for CEOs, luxury real estate, high-end hospitality, and any brand where the card itself is a statement.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 81.92
      },
      {
        "q": 50,
        "p": 107.52
      },
      {
        "q": 100,
        "p": 153.6
      },
      {
        "q": 250,
        "p": 174.08
      },
      {
        "q": 500,
        "p": 188.48
      },
      {
        "q": 1000,
        "p": 201.6
      },
      {
        "q": 2500,
        "p": 399.04
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "27pt Ultra Thick"},
      {"k": "Base Finish", "v": "Matte laminate"},
      {"k": "Special Effect", "v": "Embossed + Spot UV highlights"},
      {"k": "Thickness", "v": "27pt — nearly 2x standard thickness"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Turnaround", "v": "7–10 business days"}
    ]
  },
  {
    "id": "metallic-foil-business-cards",
    "cat": "business-cards",
    "name": "Metallic Foil Business Cards",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "Metallic foil business cards with real foil stamping in gold, silver, rose gold, or holographic — eye-catching and luxurious.", "long_desc": "Real metallic foil is heat-stamped onto the card surface, creating a brilliant reflective effect that cannot be replicated by printing alone. Available in gold, silver, rose gold, copper, and holographic foil. Combine with matte or soft-touch laminate for maximum contrast. Perfect for luxury brands, jewellers, wedding professionals, and premium service providers.",
    "opts": [
      {
        "key": "foil",
        "label": "Foil Colour",
        "opts": [
          {
            "id": "gold",
            "l": "Gold Foil",
            "m": 1
          },
          {
            "id": "silver",
            "l": "Silver Foil",
            "m": 1
          },
          {
            "id": "copper",
            "l": "Copper Foil",
            "m": 1
          },
          {
            "id": "rose",
            "l": "Rose Gold",
            "m": 1.05
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 163.2
      },
      {
        "q": 250,
        "p": 172.8
      },
      {
        "q": 500,
        "p": 201.6
      },
      {
        "q": 1000,
        "p": 250.56
      },
      {
        "q": 2500,
        "p": 473.28
      },
      {
        "q": 5000,
        "p": 829
      },
      {
        "q": 10000,
        "p": 1499
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "18pt C2S Coated"},
      {"k": "Finish", "v": "Soft-touch or matte laminate base"},
      {"k": "Foil Options", "v": "Gold, Silver, Rose Gold, Copper, Holographic"},
      {"k": "Foil Process", "v": "Hot foil stamping"},
      {"k": "Print", "v": "Full colour CMYK + foil areas"},
      {"k": "Turnaround", "v": "7–10 business days"}
    ]
  },
  {
    "id": "painted-edge-32pt",
    "cat": "business-cards",
    "name": "Painted Edge Cards (32PT)",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "32pt painted edge business cards — ultra-thick with a coloured edge that creates a striking, distinctive look unlike any standard card.", "long_desc": "Painted edge cards are our most distinctive option. At 32pt (the thickest available), these cards have their edges hand-painted in your choice of colour — revealing a pop of colour when viewed from the side. The effect is dramatic and instantly recognizable. Available with matte or soft-touch laminate on the face.",
    "opts": [
      {
        "key": "edge",
        "label": "Edge Colour",
        "opts": [
          {
            "id": "red",
            "l": "Red",
            "m": 1
          },
          {
            "id": "blue",
            "l": "Blue",
            "m": 1
          },
          {
            "id": "gold",
            "l": "Gold",
            "m": 1.05
          },
          {
            "id": "black",
            "l": "Black",
            "m": 1
          },
          {
            "id": "orange",
            "l": "Orange",
            "m": 1
          },
          {
            "id": "green",
            "l": "Green",
            "m": 1
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 121.6
      },
      {
        "q": 250,
        "p": 172.8
      },
      {
        "q": 500,
        "p": 259.2
      },
      {
        "q": 1000,
        "p": 403.2
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "32pt Ultra Premium"},
      {"k": "Face Finish", "v": "Matte or soft-touch laminate"},
      {"k": "Edge", "v": "Hand-painted in your choice of colour"},
      {"k": "Available Edge Colours", "v": "Gold, Silver, Red, Blue, Green, Black, White, Orange, Pink — ask us"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Turnaround", "v": "7–10 business days"}
    ]
  },
  {
    "id": "magnetic-business-cards",
    "cat": "business-cards",
    "name": "Magnetic Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Magnetic business cards that stick to fridges, filing cabinets, and metal surfaces — customers keep them instead of throwing them away.", "long_desc": "Magnetic business cards have a magnetic backing that lets customers stick your card to their fridge, filing cabinet, or whiteboard — keeping your contact info visible every day. Ideal for service businesses like plumbers, electricians, cleaners, pizza shops, and anyone who wants to stay top of mind at home or in the office.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 122.88
      },
      {
        "q": 250,
        "p": 133.12
      },
      {
        "q": 500,
        "p": 148.8
      },
      {
        "q": 1000,
        "p": 249.6
      },
      {
        "q": 2000,
        "p": 464
      },
      {
        "q": 5000,
        "p": 879
      },
      {
        "q": 10000,
        "p": 1599
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Material", "v": "14pt card stock with flexible magnetic backing"},
      {"k": "Finish", "v": "Gloss UV front"},
      {"k": "Print", "v": "Full colour CMYK front only"},
      {"k": "Back", "v": "Magnetic — no printing on back"},
      {"k": "Use", "v": "Sticks to fridge, filing cabinets, metal surfaces"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "coupon-card",
    "cat": "business-cards",
    "name": "Coupon Cards",
    "badge": null,
    "imgs": [],
    "desc": "Coupon cards combining your business information with a promotional offer — drive repeat visits and new customer acquisition.", "long_desc": "Coupon cards are business card size but designed to function as promotional offers — a discount, free service, or introductory offer on one side, with your business info on the other. Highly effective for restaurants, salons, retail shops, and any business wanting to incentivize a first or repeat visit.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 53.76
      },
      {
        "q": 250,
        "p": 83.2
      },
      {
        "q": 500,
        "p": 101.12
      },
      {
        "q": 1000,
        "p": 115.2
      },
      {
        "q": 2500,
        "p": 172.8
      },
      {
        "q": 5000,
        "p": 249.6
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ (Standard)"},
      {"k": "Stock", "v": "14pt or 16pt C2S"},
      {"k": "Finish", "v": "Gloss UV or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Common Uses", "v": "Discount offers, loyalty punch cards, gift cards"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "scratch-cards",
    "cat": "business-cards",
    "name": "Scratch Cards",
    "badge": null,
    "imgs": [],
    "desc": "Custom scratch cards for contests, promotions, loyalty programs, and special reveals — a proven engagement tool for any business.", "long_desc": "Custom scratch cards are an interactive promotional tool that creates excitement and drives engagement. The scratch-off area conceals a prize, discount code, or message that is revealed by the customer. Used by retailers, restaurants, events, and marketing campaigns. Minimum reveal area can be customized to your campaign.",
    "opts": [
      {
        "key": "panels",
        "label": "Scratch Panels",
        "opts": [
          {
            "id": "1",
            "l": "1 Panel",
            "m": 1
          },
          {
            "id": "2",
            "l": "2 Panels",
            "m": 1.12
          },
          {
            "id": "3",
            "l": "3 Panels",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 50,
        "p": 48.64
      },
      {
        "q": 100,
        "p": 92.16
      },
      {
        "q": 250,
        "p": 117.76
      },
      {
        "q": 500,
        "p": 183.04
      },
      {
        "q": 1000,
        "p": 247.04
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5″ × 2″ or custom"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Scratch Area", "v": "Silver scratch-off panel, custom position"},
      {"k": "Print", "v": "Full colour CMYK, front; B&W or colour back"},
      {"k": "Common Uses", "v": "Contests, discounts, loyalty rewards, events"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "7–10 business days"}
    ]
  },
  {
    "id": "flyers",
    "cat": "flyers-postcards",
    "name": "Flyers",
    "badge": "Best Seller",
    "imgs": [],
    "desc": "Full-colour flyers on gloss or matte stock — the most cost-effective marketing tool for events, promotions, and local advertising.", "long_desc": "Flyers remain one of the highest-ROI marketing tools for local businesses. Distributed door-to-door, at events, or in-store, a well-designed flyer reaches your audience directly. Available in popular sizes from 4×6″ to 11×17″, printed on 100lb gloss text stock with UV coating for vivid colour reproduction.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "3.5x8.5",
            "l": "3.5\"×8.5\"",
            "m": 0.75
          },
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 0.8
          },
          {
            "id": "5.5x8.5",
            "l": "5.5\"×8.5\"",
            "m": 1
          },
          {
            "id": "8.5x11",
            "l": "8.5\"×11\"",
            "m": 1.35
          },
          {
            "id": "11x17",
            "l": "11\"×17\"",
            "m": 1.8
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "paper",
        "label": "Paper",
        "opts": [
          {
            "id": "100gloss",
            "l": "100lb Gloss",
            "m": 1
          },
          {
            "id": "100matte",
            "l": "100lb Matte",
            "m": 1.08
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 44.24
      },
      {
        "q": 250,
        "p": 55.3
      },
      {
        "q": 500,
        "p": 71.88
      },
      {
        "q": 1000,
        "p": 99
      },
      {
        "q": 2500,
        "p": 173.38
      },
      {
        "q": 5000,
        "p": 299
      },
      {
        "q": 10000,
        "p": 529
      }
    ]
  ,
    "specs": [
      {"k": "Sizes Available", "v": "4×6″, 5×7″, 5.5×8.5″, 8.5×11″, 11×17″"},
      {"k": "Stock", "v": "100lb Gloss Text"},
      {"k": "Finish", "v": "Aqueous gloss coating"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "File Format", "v": "PDF, AI, EPS, PNG 300dpi+"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "postcards",
    "cat": "flyers-postcards",
    "name": "Postcards",
    "badge": null,
    "imgs": [],
    "desc": "Custom postcards for direct mail campaigns, announcements, thank-you notes, and promotions — durable and professional.", "long_desc": "Postcards are a direct mail staple — mailed directly to potential customers or handed out in person. Heavier than flyers, postcards use 14pt card stock for a stiff, premium feel that survives mailing without an envelope. Available in standard Canada Post sizes for automated mailing discounts.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 0.85
          },
          {
            "id": "5x7",
            "l": "5\"×7\"",
            "m": 1
          },
          {
            "id": "5.5x8.5",
            "l": "5.5\"×8.5\"",
            "m": 1.25
          },
          {
            "id": "6x9",
            "l": "6\"×9\"",
            "m": 1.5
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 67.2
      },
      {
        "q": 250,
        "p": 97.92
      },
      {
        "q": 500,
        "p": 105.6
      },
      {
        "q": 1000,
        "p": 128.96
      },
      {
        "q": 2500,
        "p": 228.16
      },
      {
        "q": 5000,
        "p": 399
      },
      {
        "q": 10000,
        "p": 699
      }
    ]
  ,
    "specs": [
      {"k": "Sizes Available", "v": "4×6″, 5×7″, 5.5×8.5″, 6×9″, 6×11″"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Mail Ready", "v": "Yes — Canada Post standard sizes available"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "brochures",
    "cat": "flyers-postcards",
    "name": "Brochures",
    "badge": "10% OFF",
    "imgs": [],
    "desc": "Tri-fold and bi-fold brochures on gloss or matte stock — ideal for service menus, company profiles, and information packages.", "long_desc": "Brochures are the go-to format for presenting detailed information in an organized, professional way. Available as tri-fold (6 panels) or bi-fold (4 panels) in 8.5×11″ or 8.5×14″ formats. Printed on 100lb gloss or matte text stock for a professional finish that holds a clean fold.",
    "opts": [
      {
        "key": "fold",
        "label": "Fold Type",
        "opts": [
          {
            "id": "tri",
            "l": "Tri-Fold",
            "m": 1
          },
          {
            "id": "bi",
            "l": "Bi-Fold",
            "m": 1
          },
          {
            "id": "z",
            "l": "Z-Fold",
            "m": 1
          },
          {
            "id": "dbl",
            "l": "Double Parallel",
            "m": 1.05
          },
          {
            "id": "gate",
            "l": "Gate Fold",
            "m": 1.1
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "paper",
        "label": "Paper",
        "opts": [
          {
            "id": "80lb",
            "l": "80lb Gloss",
            "m": 1
          },
          {
            "id": "100lb",
            "l": "100lb Gloss",
            "m": 1.15
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 36.86
      },
      {
        "q": 50,
        "p": 66.82
      },
      {
        "q": 100,
        "p": 149.76
      },
      {
        "q": 250,
        "p": 201.6
      },
      {
        "q": 500,
        "p": 259.2
      },
      {
        "q": 1000,
        "p": 343.3
      },
      {
        "q": 2500,
        "p": 443.52
      }
    ]
  ,
    "specs": [
      {"k": "Sizes", "v": "8.5×11″ or 8.5×14″"},
      {"k": "Fold Options", "v": "Tri-fold (letter fold) or Bi-fold"},
      {"k": "Stock", "v": "100lb Gloss or Matte Text"},
      {"k": "Finish", "v": "Aqueous gloss or matte coating"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Panels", "v": "6 panels (tri-fold) or 4 panels (bi-fold)"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "door-hangers",
    "cat": "flyers-postcards",
    "name": "Door Hangers",
    "badge": "30% OFF",
    "imgs": [],
    "desc": "Door hanger cards for targeted neighbourhood marketing — no mailbox, no envelope, delivers directly to the door.", "long_desc": "Door hangers are a highly targeted local marketing tool. Delivered directly to residential and commercial doors without a mailbox, they have extremely high visibility — everyone who enters or exits sees your message. Popular with pizza shops, landscapers, cleaners, realtors, and contractors targeting specific neighbourhoods.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 58.82
      },
      {
        "q": 250,
        "p": 99.98
      },
      {
        "q": 500,
        "p": 115.26
      },
      {
        "q": 1000,
        "p": 147.02
      },
      {
        "q": 2500,
        "p": 276.42
      },
      {
        "q": 5000,
        "p": 468.13
      },
      {
        "q": 10000,
        "p": 870.4
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "3.5×8.5″ with die-cut hole (standard door hanger)"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Die Cut", "v": "Standard door hanger hole at top"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "retractable-banners",
    "cat": "signs-banners",
    "name": "Retractable Banners",
    "badge": null,
    "imgs": [],
    "desc": "Portable retractable banner stands for trade shows, events, lobbies, and retail — prints and hardware included.", "long_desc": "Retractable banners (also called roll-up banners or pull-up banners) are the most popular portable display solution. The printed graphic retracts into an aluminium base for easy transport and storage. Setup takes under 30 seconds. Ideal for trade shows, conferences, lobbies, retail environments, and any situation requiring a professional branded display.",
    "opts": [
      {
        "key": "size",
        "label": "Banner Size",
        "opts": [
          {
            "id": "24x80",
            "l": "24\"×80\" Slim",
            "m": 1
          },
          {
            "id": "33x80",
            "l": "33\"×80\" Standard",
            "m": 1.3
          },
          {
            "id": "36x80",
            "l": "36\"×80\" Wide",
            "m": 1.55
          },
          {
            "id": "48x80",
            "l": "48\"×80\" XL",
            "m": 1.9
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 160
      },
      {
        "q": 6,
        "p": 281.6
      },
      {
        "q": 11,
        "p": 486.4
      },
      {
        "q": 21,
        "p": 1152
      },
      {
        "q": 51,
        "p": 2176
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "33″ × 81″ (most common) — custom sizes available"},
      {"k": "Material", "v": "Scratch-resistant 10mil banner film"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Hardware", "v": "Aluminium retractable base + carrying bag included"},
      {"k": "Setup Time", "v": "Under 30 seconds"},
      {"k": "Use", "v": "Indoor only"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "x-frame-signs",
    "cat": "signs-banners",
    "name": "X-Frame Banner Stands",
    "badge": null,
    "imgs": [],
    "desc": "X-frame banner stands for retail, events, and indoor promotions — lightweight, portable, and easy to swap graphics.", "long_desc": "X-frame banner stands use a lightweight X-shaped frame that holds a printed fabric or vinyl graphic taut without creasing. Available in sizes from 24×63″ to 32×71″. The graphic attaches with bungee loops, making it easy to swap artwork for different promotions. Excellent for retail floors, showrooms, and indoor events.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "24x63",
            "l": "24\"×63\"",
            "m": 1
          },
          {
            "id": "32x63",
            "l": "32\"×63\"",
            "m": 1.25
          },
          {
            "id": "40x63",
            "l": "40\"×63\"",
            "m": 1.5
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 441.6
      },
      {
        "q": 6,
        "p": 832
      },
      {
        "q": 11,
        "p": 1510.4
      },
      {
        "q": 21,
        "p": 3520
      },
      {
        "q": 51,
        "p": 6656
      }
    ]
  ,
    "specs": [
      {"k": "Standard Sizes", "v": "24×63″, 28×71″, 32×71″"},
      {"k": "Material", "v": "Lightweight vinyl graphic with bungee attachment"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Hardware", "v": "X-frame stand + carrying bag included"},
      {"k": "Use", "v": "Indoor only"},
      {"k": "Graphic Change", "v": "Easy swap — attach with bungee loops"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "hanging-banners",
    "cat": "signs-banners",
    "name": "Hanging Banners",
    "badge": null,
    "imgs": [],
    "desc": "Hanging fabric banners for retail, events, and trade shows — suspended from ceiling or mounted to a stand for maximum visibility.", "long_desc": "Hanging banners are suspended from the ceiling or mounted overhead, providing visibility from a distance above crowd level. Available in horizontal and vertical orientations, in fabric or vinyl. Common in retail stores, shopping malls, trade show halls, and sports venues.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "2x3",
            "l": "2ft×3ft",
            "m": 1
          },
          {
            "id": "2x4",
            "l": "2ft×4ft",
            "m": 1.35
          },
          {
            "id": "3x5",
            "l": "3ft×5ft",
            "m": 1.8
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 768
      },
      {
        "q": 3,
        "p": 2496
      },
      {
        "q": 4,
        "p": 1792
      },
      {
        "q": 5,
        "p": 4992
      },
      {
        "q": 8,
        "p": 3072
      },
      {
        "q": 13,
        "p": 5120
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "13oz Vinyl or Fabric (specify)"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Finish", "v": "Hemmed edges with grommets for hanging"},
      {"k": "Orientation", "v": "Horizontal or vertical"},
      {"k": "Sizes", "v": "Custom — priced per sq ft"},
      {"k": "Use", "v": "Indoor (vinyl or fabric) / Outdoor (vinyl only)"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "feather-flags",
    "cat": "signs-banners",
    "name": "Feather Flags",
    "badge": null,
    "imgs": [],
    "desc": "Feather flags and teardrop flags for outdoor business promotion — eye-catching, wind-activated movement draws attention from the road.", "long_desc": "Feather flags (also called swooper flags or flutter flags) are tall, fabric flags mounted on a flexible fibreglass pole that moves naturally in the breeze. Their motion attracts attention from drivers and pedestrians that static signs cannot. Ideal for car dealerships, restaurants, retail fronts, open houses, and events. Printed on dye-sublimated fabric for vivid colour.",
    "opts": [
      {
        "key": "flag",
        "label": "Flag Height",
        "opts": [
          {
            "id": "sm",
            "l": "Small 8ft",
            "m": 1
          },
          {
            "id": "md",
            "l": "Medium 11ft",
            "m": 1.35
          },
          {
            "id": "lg",
            "l": "Large 15ft",
            "m": 1.7
          }
        ]
      },
      {
        "key": "base",
        "label": "Base Type",
        "opts": [
          {
            "id": "spike",
            "l": "Ground Spike",
            "m": 1
          },
          {
            "id": "cross",
            "l": "Cross Base",
            "m": 1.08
          },
          {
            "id": "water",
            "l": "Water Base",
            "m": 1.12
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 359.04
      },
      {
        "q": 3,
        "p": 870.4
      },
      {
        "q": 6,
        "p": 1958.4
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Dye-sublimated polyester fabric"},
      {"k": "Print", "v": "Full colour, single or double sided"},
      {"k": "Standard Sizes", "v": "8ft, 10ft, 12ft, 15ft heights"},
      {"k": "Shapes", "v": "Feather, Teardrop, Rectangular"},
      {"k": "Hardware", "v": "Fibreglass pole + ground stake or base"},
      {"k": "Use", "v": "Outdoor — wind activated"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "vinyl-banners",
    "cat": "signs-banners",
    "name": "Vinyl Banners",
    "badge": "Most Popular",
    "imgs": [],
    "desc": "Custom vinyl banners for indoor and outdoor use — durable, weatherproof, and available in any size for maximum visibility.", "long_desc": "Vinyl banners are the most versatile large-format display option. Printed on 13oz scrim vinyl with UV-resistant inks, they’re suitable for indoor and outdoor use in all weather conditions. Available in any custom size. Hemming and grommets every 2 feet are standard, making them easy to hang anywhere.",
    "opts": [
      {
        "key": "size",
        "label": "Banner Size",
        "opts": [
          {
            "id": "2x4",
            "l": "2×4 ft",
            "m": 1,
            "sqft": 8
          },
          {
            "id": "2x6",
            "l": "2×6 ft",
            "m": 1.4,
            "sqft": 12
          },
          {
            "id": "3x6",
            "l": "3×6 ft",
            "m": 1.9,
            "sqft": 18
          },
          {
            "id": "4x8",
            "l": "4×8 ft",
            "m": 2.8,
            "sqft": 32
          },
          {
            "id": "4x10",
            "l": "4×10 ft",
            "m": 3.4,
            "sqft": 40
          },
          {
            "id": "5x10",
            "l": "5×10 ft",
            "m": 4.2,
            "sqft": 50
          },
          {
            "id": "custom",
            "l": "Custom Size",
            "m": 0
          }
        ]
      },
      {
        "key": "mat",
        "label": "Material",
        "opts": [
          {
            "id": "13oz",
            "l": "13oz Vinyl (Standard)",
            "m": 1
          },
          {
            "id": "18oz",
            "l": "18oz Vinyl (Heavy Duty)",
            "m": 1.2
          },
          {
            "id": "mesh",
            "l": "Mesh Vinyl (Wind-Through)",
            "m": 1.15
          }
        ]
      },
      {
        "key": "finish",
        "label": "Finishing",
        "opts": [
          {
            "id": "hemgrom",
            "l": "Hemmed + Grommets (Recommended)",
            "m": 1
          },
          {
            "id": "hemonly",
            "l": "Hemmed Only",
            "m": 0.95
          },
          {
            "id": "none",
            "l": "No Finishing (Raw Edge)",
            "m": 0.88
          }
        ]
      }
    ],
    "addons": [
      {
        "key": "grommets",
        "label": "Extra Grommets",
        "desc": "Additional grommets every 2 ft along all edges",
        "price": 8
      },
      {
        "key": "pockets",
        "label": "Pole Pockets",
        "desc": "Top and/or bottom pole pockets instead of grommets",
        "price": 12
      },
      {
        "key": "stand",
        "label": "Banner Stand",
        "desc": "Retractable stand for indoor use",
        "price": 45
      }
    ],
    "sqft": {
      "enabled": true,
      "rate": 6.5,
      "min": 8
    },
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 3,
        "p": 153.6
      },
      {
        "q": 5,
        "p": 236.8
      },
      {
        "q": 10,
        "p": 422.4
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "13oz Scrim Vinyl"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant inks"},
      {"k": "Finish", "v": "Hemmed edges, #2 brass grommets every 2ft"},
      {"k": "Weatherproof", "v": "Yes — suitable for indoor & outdoor"},
      {"k": "Sizes", "v": "Any custom size — priced per sq ft"},
      {"k": "File Format", "v": "PDF or AI at 100dpi at full size, or 300dpi at 25%"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "lawn-signs",
    "cat": "signs-banners",
    "name": "Lawn Signs (Coroplast)",
    "badge": "25% OFF",
    "imgs": [],
    "desc": "Corrugated plastic lawn signs (coroplast) for real estate, elections, events, and outdoor advertising — lightweight and weather-resistant.", "long_desc": "Lawn signs (coroplast signs) are printed on 4mm corrugated plastic, making them lightweight, waterproof, and durable for outdoor use. They’re the go-to choice for real estate listings, political campaigns, construction sites, yard sales, and event directional signage. Standard 18×24″ fits universal H-stakes (sold separately).",
    "opts": [
      {
        "key": "size",
        "label": "Sign Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.65
          },
          {
            "id": "24x48",
            "l": "24\"×48\"",
            "m": 2.2
          }
        ]
      },
      {
        "key": "sides",
        "label": "Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided",
            "m": 1.45
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 10,
        "p": 66.24
      },
      {
        "q": 20,
        "p": 108.2
      },
      {
        "q": 50,
        "p": 171.12
      },
      {
        "q": 100,
        "p": 292.56
      },
      {
        "q": 200,
        "p": 472.51
      },
      {
        "q": 500,
        "p": 1099.58
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "4mm Corrugated Plastic (Coroplast)"},
      {"k": "Standard Size", "v": "18″ × 24″"},
      {"k": "Print", "v": "Full colour CMYK, single or double sided"},
      {"k": "Weatherproof", "v": "Yes — UV-resistant, waterproof"},
      {"k": "Stakes", "v": "H-wire stakes available (ask us)"},
      {"k": "Use", "v": "Indoor & outdoor"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "custom-coroplast-sign",
    "cat": "signs-banners",
    "name": "Custom Coroplast Signs",
    "badge": null,
    "imgs": [],
    "desc": "Custom coroplast signs in any size — lightweight, waterproof corrugated plastic for outdoor and indoor use.", "long_desc": "Coroplast (corrugated plastic) signs are the industry standard for cost-effective outdoor signage. Lightweight, waterproof, and UV-resistant, they’re used for construction site signage, directional signs, temporary outdoor displays, and election signage. Available in 4mm and 6mm thickness, single or double sided.",
    "opts": [
      {
        "key": "size",
        "label": "Sign Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.65
          },
          {
            "id": "24x48",
            "l": "24\"×48\"",
            "m": 2.2
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "m": 0
          }
        ]
      },
      {
        "key": "sides",
        "label": "Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided",
            "m": 1.45
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 268.8
      },
      {
        "q": 3,
        "p": 729.6
      },
      {
        "q": 4,
        "p": 609.28
      },
      {
        "q": 5,
        "p": 1382.4
      },
      {
        "q": 8,
        "p": 998.4
      },
      {
        "q": 13,
        "p": 1587.2
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 7,
      "min": 4
    }
  ,
    "specs": [
      {"k": "Material", "v": "4mm or 6mm Corrugated Plastic (Coroplast)"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Sides", "v": "Single or double sided"},
      {"k": "Weatherproof", "v": "Yes — UV-resistant, waterproof"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Mounting", "v": "H-stakes, zip ties, or adhesive"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "adhesive-vinyl-sign",
    "cat": "signs-banners",
    "name": "Adhesive Vinyl Signs & Graphics",
    "badge": null,
    "imgs": [],
    "desc": "Adhesive vinyl signs and graphics for walls, doors, windows, and surfaces — removable or permanent options available.", "long_desc": "Adhesive vinyl graphics are printed on cast or calendered vinyl with a pressure-sensitive adhesive backing. Applied directly to walls, doors, floors, vehicles, or any smooth surface. Available in permanent (outdoor-grade) or removable (repositionable) adhesive. Cut to shape or supplied as a flat panel.",
    "opts": [
      {
        "key": "size",
        "label": "Size (presets or enter custom)",
        "opts": [
          {
            "id": "1x1",
            "l": "12\"×12\" (1 sq ft)",
            "sqft": 1
          },
          {
            "id": "1.5x2",
            "l": "18\"×24\" (3 sq ft)",
            "sqft": 3
          },
          {
            "id": "2x3",
            "l": "24\"×36\" (6 sq ft)",
            "sqft": 6
          },
          {
            "id": "3x4",
            "l": "36\"×48\" (12 sq ft)",
            "sqft": 12
          },
          {
            "id": "4x8",
            "l": "48\"×96\" (32 sq ft)",
            "sqft": 32
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "sqft": 0
          }
        ]
      },
      {
        "key": "finish",
        "label": "Vinyl Finish",
        "opts": [
          {
            "id": "gloss",
            "l": "Gloss",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "chrome",
            "l": "Chrome/Metallic",
            "m": 1.25
          }
        ]
      },
      {
        "key": "lamination",
        "label": "Lamination",
        "opts": [
          {
            "id": "none",
            "l": "No Lamination",
            "m": 1
          },
          {
            "id": "gloss",
            "l": "Gloss Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "matte",
            "l": "Matte Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "satin",
            "l": "Satin / Soft-Touch (+18%)",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 18
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 9,
      "min": 2
    }
  ,
    "specs": [
      {"k": "Material", "v": "Cast or Calendered Vinyl"},
      {"k": "Adhesive", "v": "Permanent or Removable (specify)"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Laminate", "v": "Gloss or matte laminate available"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Application", "v": "Walls, doors, floors, windows, vehicles"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "vinyl-window-graphics",
    "cat": "signs-banners",
    "name": "Vinyl Window Graphics",
    "badge": null,
    "imgs": [],
    "desc": "Vinyl window graphics for storefronts, office doors, and vehicles — perforated or solid vinyl for privacy or visibility.", "long_desc": "Window graphics transform plain glass into a branded display surface. Printed on optically clear vinyl or perforated vinyl (see-through from inside, solid from outside). Used for storefront branding, hours of operation, promotional graphics, privacy screening, and vehicle rear windows.",
    "opts": [
      {
        "key": "size",
        "label": "Size (presets or enter custom)",
        "opts": [
          {
            "id": "1x1",
            "l": "12\"×12\" (1 sq ft)",
            "sqft": 1
          },
          {
            "id": "1.5x2",
            "l": "18\"×24\" (3 sq ft)",
            "sqft": 3
          },
          {
            "id": "2x3",
            "l": "24\"×36\" (6 sq ft)",
            "sqft": 6
          },
          {
            "id": "3x4",
            "l": "36\"×48\" (12 sq ft)",
            "sqft": 12
          },
          {
            "id": "4x8",
            "l": "48\"×96\" (32 sq ft)",
            "sqft": 32
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "sqft": 0
          }
        ]
      },
      {
        "key": "lamination",
        "label": "Lamination",
        "opts": [
          {
            "id": "none",
            "l": "No Lamination",
            "m": 1
          },
          {
            "id": "gloss",
            "l": "Gloss Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "matte",
            "l": "Matte Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "satin",
            "l": "Satin / Soft-Touch (+18%)",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 16
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 8,
      "min": 2
    }
  ,
    "specs": [
      {"k": "Material Options", "v": "Clear vinyl, white vinyl, or perforated see-through vinyl"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Laminate", "v": "UV gloss laminate standard"},
      {"k": "See-Through", "v": "Available with 50% perforated vinyl"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Application", "v": "Interior or exterior window surface"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "see-through-perforated-sign",
    "cat": "signs-banners",
    "name": "See-Through Perforated Vinyl",
    "badge": null,
    "imgs": [],
    "desc": "Perforated vinyl window signs — solid printed graphics on the outside, see-through view from inside. Perfect for storefronts.", "long_desc": "Perforated vinyl (also called one-way vision) has thousands of tiny holes that allow visibility from the inside while displaying a full-colour graphic on the outside. Used on storefront windows, vehicle rear windows, and glass partitions. The standard perforation ratio is 50/50 (50% solid, 50% holes).",
    "opts": [
      {
        "key": "size",
        "label": "Size (presets or enter custom)",
        "opts": [
          {
            "id": "2x3",
            "l": "24\"×36\" (6 sq ft)",
            "sqft": 6
          },
          {
            "id": "3x4",
            "l": "36\"×48\" (12 sq ft)",
            "sqft": 12
          },
          {
            "id": "4x8",
            "l": "48\"×96\" (32 sq ft)",
            "sqft": 32
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "sqft": 0
          }
        ]
      },
      {
        "key": "lamination",
        "label": "Lamination",
        "opts": [
          {
            "id": "none",
            "l": "No Lamination",
            "m": 1
          },
          {
            "id": "gloss",
            "l": "Gloss Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "matte",
            "l": "Matte Lamination (+15%)",
            "m": 1.15
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 40
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 10,
      "min": 4
    }
  ,
    "specs": [
      {"k": "Material", "v": "50/50 Perforated Vinyl"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Visibility", "v": "One-way — opaque outside, see-through inside"},
      {"k": "Laminate", "v": "UV gloss laminate"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Application", "v": "Window exterior surface"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "backlit-translucent-vinyl",
    "cat": "signs-banners",
    "name": "Backlit Translucent Vinyl",
    "badge": null,
    "imgs": [],
    "desc": "Backlit translucent vinyl for lightboxes, illuminated signs, and light panels — vibrant colours that glow when backlit.", "long_desc": "Backlit vinyl is a special translucent film designed for use with illuminated displays, lightboxes, and LED panels. When light shines through from behind, colours appear vivid and luminous. Used in retail lightboxes, menu boards, trade show displays, and architectural signage.",
    "opts": [
      {
        "key": "size",
        "label": "Size (presets or enter custom)",
        "opts": [
          {
            "id": "2x2",
            "l": "24\"×24\" (4 sq ft)",
            "sqft": 4
          },
          {
            "id": "2x4",
            "l": "24\"×48\" (8 sq ft)",
            "sqft": 8
          },
          {
            "id": "3x4",
            "l": "36\"×48\" (12 sq ft)",
            "sqft": 12
          },
          {
            "id": "4x8",
            "l": "48\"×96\" (32 sq ft)",
            "sqft": 32
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "sqft": 0
          }
        ]
      },
      {
        "key": "lamination",
        "label": "Lamination",
        "opts": [
          {
            "id": "none",
            "l": "No Lamination",
            "m": 1
          },
          {
            "id": "gloss",
            "l": "Gloss Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "matte",
            "l": "Matte Lamination (+15%)",
            "m": 1.15
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 48
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 12,
      "min": 4
    }
  ,
    "specs": [
      {"k": "Material", "v": "Translucent backlit vinyl film"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant inks"},
      {"k": "Use", "v": "Lightboxes, LED panels, illuminated signs"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Opacity", "v": "Translucent — allows backlight to pass through"},
      {"k": "File Format", "v": "PDF or AI at 100dpi full size"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "full-colour-vinyl-decals",
    "cat": "signs-banners",
    "name": "Full Colour Vinyl Decals",
    "badge": null,
    "imgs": [],
    "desc": "Custom full-colour vinyl decals for vehicles, equipment, windows, and products — durable and weatherproof.", "long_desc": "Vinyl decals are die-cut or contour-cut stickers printed on outdoor-grade cast vinyl. Available with a glossy or matte laminate for added durability and UV protection. Used for vehicle identification, product labels, equipment markings, and branded merchandise. Outdoor lifespan 3–5 years depending on conditions.",
    "opts": [
      {
        "key": "size",
        "label": "Size (presets or enter custom)",
        "opts": [
          {
            "id": "0.5x0.5",
            "l": "6\"×6\" (0.25 sq ft)",
            "sqft": 0.25
          },
          {
            "id": "1x1",
            "l": "12\"×12\" (1 sq ft)",
            "sqft": 1
          },
          {
            "id": "1.5x2",
            "l": "18\"×24\" (3 sq ft)",
            "sqft": 3
          },
          {
            "id": "2x3",
            "l": "24\"×36\" (6 sq ft)",
            "sqft": 6
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "sqft": 0
          }
        ]
      },
      {
        "key": "lamination",
        "label": "Lamination",
        "opts": [
          {
            "id": "none",
            "l": "No Lamination",
            "m": 1
          },
          {
            "id": "gloss",
            "l": "Gloss Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "matte",
            "l": "Matte Lamination (+15%)",
            "m": 1.15
          },
          {
            "id": "satin",
            "l": "Satin / Soft-Touch (+18%)",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 8
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 8,
      "min": 1
    }
  ,
    "specs": [
      {"k": "Material", "v": "Cast vinyl, 3–5 year outdoor rating"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Laminate", "v": "Gloss or matte overlaminate"},
      {"k": "Cut", "v": "Die-cut to shape or rectangular"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Application", "v": "Vehicles, windows, equipment, walls"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "indoor-wallpaper",
    "cat": "signs-banners",
    "name": "Indoor Wallpaper & Murals",
    "badge": null,
    "imgs": [],
    "desc": "Custom printed wallpaper and wall murals for offices, retail spaces, restaurants, and feature walls — dramatic and impactful.", "long_desc": "Custom wall murals transform a plain wall into a branded statement. Printed on removable peel-and-stick wallpaper or traditional paste wallpaper, murals are used in offices, restaurants, retail stores, and hospitality spaces. The removable option allows redecoration without wall damage.",
    "opts": [
      {
        "key": "size",
        "label": "Size (presets or enter custom)",
        "opts": [
          {
            "id": "4x4",
            "l": "4'×4' (16 sq ft)",
            "sqft": 16
          },
          {
            "id": "4x8",
            "l": "4'×8' (32 sq ft)",
            "sqft": 32
          },
          {
            "id": "8x8",
            "l": "8'×8' (64 sq ft)",
            "sqft": 64
          },
          {
            "id": "8x10",
            "l": "8'×10' (80 sq ft)",
            "sqft": 80
          },
          {
            "id": "custom",
            "l": "Custom Size — Enter Dimensions",
            "sqft": 0
          }
        ]
      },
      {
        "key": "finish",
        "label": "Wall Finish",
        "opts": [
          {
            "id": "matte",
            "l": "Matte (Standard)",
            "m": 1
          },
          {
            "id": "satin",
            "l": "Satin Finish",
            "m": 1.1
          },
          {
            "id": "textured",
            "l": "Textured Fabric",
            "m": 1.2
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 80
      }
    ],
    "addons": [],
    "sqft": {
      "enabled": true,
      "rate": 8,
      "min": 10
    }
  ,
    "specs": [
      {"k": "Material", "v": "Peel-and-stick removable or paste wallpaper"},
      {"k": "Print", "v": "Full colour CMYK, high-resolution"},
      {"k": "Finish", "v": "Satin"},
      {"k": "Sizes", "v": "Custom — floor-to-ceiling or accent wall"},
      {"k": "Removal", "v": "Removable option leaves no wall damage"},
      {"k": "Use", "v": "Interior only"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "polybag-signs",
    "cat": "signs-banners",
    "name": "Polybag Signs",
    "badge": null,
    "imgs": [],
    "desc": "Polybag signs that slip over standard wire stakes — weatherproof plastic sleeve signs for real estate, construction, and events.", "long_desc": "Polybag signs are printed sheets inserted into a clear weatherproof plastic polybag that slips over a wire H-stake. They’re a cost-effective alternative to rigid coroplast signs, easy to insert and remove for seasonal campaigns. Popular with real estate agents, contractors, and event organizers.",
    "opts": [
      {
        "key": "sides",
        "label": "Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided",
            "m": 1.45
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 472.32
      },
      {
        "q": 200,
        "p": 765.44
      },
      {
        "q": 500,
        "p": 1721.6
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Printed insert in weatherproof polybag sleeve"},
      {"k": "Standard Size", "v": "18″ × 24″ (fits standard H-stakes)"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Weather Resistance", "v": "Polybag sleeve protects from rain"},
      {"k": "Stakes", "v": "H-wire stakes sold separately"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "pole-rigid-sign",
    "cat": "signs-banners",
    "name": "Pole Rigid Signs",
    "badge": null,
    "imgs": [],
    "desc": "Rigid pole signs mounted to poles or posts — aluminium composite or coroplast for durable outdoor directional and identification signage.", "long_desc": "Pole-mounted rigid signs use aluminium composite (ACM/Dibond) or thick coroplast panels attached to a vertical pole or post. Common for street addresses, commercial directional signage, parking lot signs, and building identification. Extremely durable — ACM panels are used in permanent outdoor installations.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 1
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1.55
          },
          {
            "id": "24x24",
            "l": "24\"×24\"",
            "m": 2.1
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 50,
        "p": 124.16
      },
      {
        "q": 100,
        "p": 177.92
      },
      {
        "q": 200,
        "p": 313.6
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "3mm Aluminium Composite (ACM) or 6mm Coroplast"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Finish", "v": "Gloss or matte laminate"},
      {"k": "Mounting", "v": "Pre-drilled holes for pole or post mounting"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Weather Resistance", "v": "Permanent outdoor rated"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "pole-vinyl-sticker",
    "cat": "signs-banners",
    "name": "Pole Vinyl Stickers",
    "badge": null,
    "imgs": [],
    "desc": "Vinyl stickers designed for pole wrapping and cylindrical surface application — stretchy material conforms to curves.", "long_desc": "Pole wrap vinyl stickers use a conformable cast vinyl that stretches slightly to wrap around cylindrical surfaces like poles, pillars, and columns. Unlike standard flat vinyl, conformable vinyl eliminates bubbles and wrinkles on curved surfaces. Used for branded street poles, utility poles, and pillar graphics.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "6x6",
            "l": "6\"×6\"",
            "m": 1
          },
          {
            "id": "8x8",
            "l": "8\"×8\"",
            "m": 1.4
          },
          {
            "id": "12x12",
            "l": "12\"×12\"",
            "m": 2.2
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 190.72
      },
      {
        "q": 250,
        "p": 408.32
      },
      {
        "q": 500,
        "p": 637.44
      },
      {
        "q": 1000,
        "p": 893.44
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Conformable cast vinyl"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Laminate", "v": "Gloss overlaminate"},
      {"k": "Application", "v": "Poles, pillars, columns, cylinders"},
      {"k": "Sizes", "v": "Custom — sized to your pole circumference"},
      {"k": "Outdoor Life", "v": "3–5 years"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "20pt-styrene",
    "cat": "signs-banners",
    "name": "20pt Styrene Signs",
    "badge": null,
    "imgs": [],
    "desc": "Lightweight 20pt styrene plastic signs — ideal for indoor POP displays, retail shelf signs, and event signage.", "long_desc": "Styrene (polystyrene) signs are lightweight rigid plastic panels used for indoor point-of-purchase displays, retail price signs, event signage, and window displays. At 20pt thickness, they’re stiff enough to stand alone in a frame or be hung, yet light enough to handle easily. Not for outdoor use.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "8.5x11",
            "l": "8.5\"×11\"",
            "m": 1
          },
          {
            "id": "11x17",
            "l": "11\"×17\"",
            "m": 1.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 2.4
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 1248
      },
      {
        "q": 3,
        "p": 4083.2
      },
      {
        "q": 4,
        "p": 2903.04
      },
      {
        "q": 5,
        "p": 8140.8
      },
      {
        "q": 8,
        "p": 4953.6
      },
      {
        "q": 13,
        "p": 8217.6
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "20pt Polystyrene (Styrene) Plastic"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Use", "v": "Indoor only"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Mounting", "v": "Frame, tape, hang, or stand"},
      {"k": "Common Uses", "v": "Retail POP, shelf signs, window displays"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "vehicle-full-wrap",
    "cat": "vehicle-graphics",
    "name": "Vehicle Full Wrap",
    "badge": "Premium",
    "imgs": [],
    "desc": "Full vehicle wraps that cover your entire vehicle in a custom design — the ultimate mobile billboard for any business.", "long_desc": "A full vehicle wrap covers the entire exterior surface of the vehicle — hood, roof, sides, doors, bumpers — in a seamless custom design. Printed on 3M or Avery cast vinyl with UV-resistant inks, a full wrap transforms any vehicle into a moving billboard visible to thousands of potential customers daily. Wraps also protect the original paint and can be removed without damage.",
    "opts": [
      {
        "key": "vehicle",
        "label": "Vehicle Type",
        "opts": [
          {
            "id": "car",
            "l": "Passenger Car",
            "m": 1
          },
          {
            "id": "suv",
            "l": "SUV/Crossover",
            "m": 1.2
          },
          {
            "id": "truck",
            "l": "Pickup Truck",
            "m": 1.35
          },
          {
            "id": "van",
            "l": "Cargo Van",
            "m": 1.45
          },
          {
            "id": "box",
            "l": "Box Truck",
            "m": 1.9
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 2200
      },
      {
        "q": 2,
        "p": 4000
      },
      {
        "q": 3,
        "p": 5700
      },
      {
        "q": 5,
        "p": 9000
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "3M or Avery cast vinyl, 3–7 year outdoor rating"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant solvent inks"},
      {"k": "Laminate", "v": "Gloss or matte overlaminate"},
      {"k": "Coverage", "v": "Full exterior — hood, roof, sides, bumpers"},
      {"k": "Paint Protection", "v": "Yes — wrap protects original paint"},
      {"k": "Removal", "v": "Professionally removable without paint damage"},
      {"k": "Turnaround", "v": "7–10 business days (design approval to installation)"}
    ]
  },
  {
    "id": "vehicle-partial-wrap",
    "cat": "vehicle-graphics",
    "name": "Vehicle Partial Wrap",
    "badge": null,
    "imgs": [],
    "desc": "Partial vehicle wraps for doors, hoods, or side panels — branded impact at a fraction of the full wrap cost.", "long_desc": "A partial wrap covers a specific section of the vehicle — typically the doors, lower half, hood, or rear — combined with spot graphics or lettering on the remaining areas. Partial wraps deliver significant visual impact at a lower investment than a full wrap, making them ideal for businesses with a tight marketing budget.",
    "opts": [
      {
        "key": "coverage",
        "label": "Coverage",
        "opts": [
          {
            "id": "rear",
            "l": "Rear Bumper/Tailgate",
            "m": 1
          },
          {
            "id": "doors",
            "l": "Door Panels",
            "m": 1.45
          },
          {
            "id": "hood",
            "l": "Hood & Roof",
            "m": 1.3
          },
          {
            "id": "half",
            "l": "Half Wrap",
            "m": 1.7
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 800
      },
      {
        "q": 2,
        "p": 1500
      },
      {
        "q": 3,
        "p": 2100
      },
      {
        "q": 5,
        "p": 3300
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "3M or Avery cast vinyl"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Coverage", "v": "Partial — doors, lower half, hood, rear (specify)"},
      {"k": "Laminate", "v": "Gloss or matte overlaminate"},
      {"k": "Paint Protection", "v": "Yes — on wrapped areas"},
      {"k": "Removal", "v": "Professionally removable without paint damage"},
      {"k": "Turnaround", "v": "5–7 business days (design to installation)"}
    ]
  },
  {
    "id": "vehicle-lettering",
    "cat": "vehicle-graphics",
    "name": "Vehicle Lettering & Decals",
    "badge": null,
    "imgs": [],
    "desc": "Cut vinyl vehicle lettering and decals for business name, phone number, and logo — clean, professional, and cost-effective.", "long_desc": "Vehicle lettering uses precision cut vinyl applied directly to the vehicle surface. It’s the most affordable vehicle branding option — perfect for tradespeople, delivery vehicles, and any business that wants a professional look without a full wrap. Available in any colour from a standard vinyl colour chart, or digitally printed for full-colour logos.",
    "opts": [
      {
        "key": "colour",
        "label": "Vinyl Colour",
        "opts": [
          {
            "id": "white",
            "l": "White",
            "m": 1
          },
          {
            "id": "black",
            "l": "Black",
            "m": 1
          },
          {
            "id": "red",
            "l": "Red",
            "m": 1
          },
          {
            "id": "gold",
            "l": "Gold",
            "m": 1.05
          },
          {
            "id": "chrome",
            "l": "Chrome",
            "m": 1.15
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 180
      },
      {
        "q": 2,
        "p": 320
      },
      {
        "q": 3,
        "p": 450
      },
      {
        "q": 5,
        "p": 700
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Cast or calendered vinyl, 3–5 year outdoor rating"},
      {"k": "Type", "v": "Cut vinyl letters/logos or digitally printed decals"},
      {"k": "Colours", "v": "Solid colours from vinyl chart, or full CMYK print"},
      {"k": "Application", "v": "Doors, hood, rear, windows"},
      {"k": "Removal", "v": "Removable without paint damage (if proper vinyl used)"},
      {"k": "Common Use", "v": "Company name, phone, website, logo, tagline"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "vinyl-window-graphics-vehicle",
    "cat": "vehicle-graphics",
    "name": "Vehicle Window Graphics",
    "badge": null,
    "imgs": [],
    "desc": "Vehicle window graphics using perforated see-through vinyl — full-colour exterior display while maintaining driver visibility.", "long_desc": "Vehicle window graphics use perforated vinyl applied to the rear or side windows of a vehicle. From outside, a full-colour graphic is visible. From inside, the driver maintains visibility through the perforations. A popular choice for vans, box trucks, and SUVs wanting maximum graphic coverage including windows.",
    "opts": [
      {
        "key": "type",
        "label": "Window Film",
        "opts": [
          {
            "id": "opaque",
            "l": "Opaque Full Colour",
            "m": 1
          },
          {
            "id": "frosted",
            "l": "Frosted/Etched",
            "m": 1.1
          },
          {
            "id": "perf",
            "l": "See-Through Perforated",
            "m": 1.2
          },
          {
            "id": "backlit",
            "l": "Backlit Translucent",
            "m": 1.35
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 95
      },
      {
        "q": 2,
        "p": 175
      },
      {
        "q": 4,
        "p": 310
      },
      {
        "q": 6,
        "p": 430
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "50/50 Perforated Vinyl"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Visibility", "v": "See-through from inside, solid from outside"},
      {"k": "Application", "v": "Rear window, side windows, box truck windows"},
      {"k": "Laminate", "v": "UV gloss laminate"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "magnetic-vehicle-signs",
    "cat": "vehicle-graphics",
    "name": "Magnetic Vehicle Signs",
    "badge": null,
    "imgs": [],
    "desc": "Magnetic vehicle signs that attach and remove instantly — use your vehicle for business by day, personal by night.", "long_desc": "Magnetic vehicle signs are the ideal solution for those who use a personal vehicle for business. They attach securely to any ferrous (magnetic) metal surface and remove in seconds with no adhesive residue. Perfect for part-time businesses, tradespeople, and anyone needing a flexible, damage-free vehicle branding option.",
    "opts": [
      {
        "key": "size",
        "label": "Sign Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 1
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1.55
          },
          {
            "id": "24x24",
            "l": "24\"×24\"",
            "m": 1.9
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 65
      },
      {
        "q": 2,
        "p": 115
      },
      {
        "q": 4,
        "p": 200
      },
      {
        "q": 6,
        "p": 280
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Heavy-duty magnetic sheet, 30mil"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Laminate", "v": "Gloss UV laminate"},
      {"k": "Standard Size", "v": "12×18″, 12×24″ or custom"},
      {"k": "Attaches to", "v": "Any ferrous metal vehicle surface"},
      {"k": "Removal", "v": "Instant — no adhesive, no residue"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "fleet-graphics",
    "cat": "vehicle-graphics",
    "name": "Fleet Graphics",
    "badge": "Best Value",
    "imgs": [],
    "desc": "Consistent branded graphics across your entire vehicle fleet — ensures every vehicle carries a unified, professional brand identity.", "long_desc": "Fleet graphics apply consistent branding across multiple vehicles — vans, trucks, cars, or trailers. A well-branded fleet builds instant recognition and professionalism. We manage the entire process from design templating to production and installation, ensuring colour consistency across all vehicles. Volume discounts available for fleets of 3 or more vehicles.",
    "opts": [
      {
        "key": "type",
        "label": "Service",
        "opts": [
          {
            "id": "letter",
            "l": "Lettering & Logos",
            "m": 1
          },
          {
            "id": "partial",
            "l": "Partial Wraps",
            "m": 1.8
          },
          {
            "id": "full",
            "l": "Full Wraps",
            "m": 2.8
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 3,
        "p": 3900
      },
      {
        "q": 5,
        "p": 6000
      },
      {
        "q": 10,
        "p": 10500
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "3M or Avery cast vinyl, 3–7 year outdoor rating"},
      {"k": "Print", "v": "Full colour CMYK, UV-resistant"},
      {"k": "Coverage", "v": "Full wrap, partial wrap, or lettering"},
      {"k": "Consistency", "v": "Colour-matched across all vehicles"},
      {"k": "Vehicles", "v": "Cars, vans, trucks, trailers"},
      {"k": "Volume Discount", "v": "Available for 3+ vehicles — contact us"},
      {"k": "Turnaround", "v": "Per vehicle: 5–10 business days"}
    ]
  },
  {
    "id": "booklets",
    "cat": "marketing",
    "name": "Booklets",
    "badge": null,
    "imgs": [],
    "desc": "Saddle-stitched or perfect-bound booklets for catalogues, programs, training manuals, and company profiles.", "long_desc": "Custom booklets are the professional choice for catalogues, product guides, annual reports, event programs, and training materials. Available as saddle-stitched (stapled spine, ideal for 8–48 pages) or perfect-bound (glued flat spine, ideal for 48+ pages). Printed on your choice of coated or uncoated text paper with a heavier cover stock.",
    "opts": [
      {
        "key": "pages",
        "label": "Pages",
        "opts": [
          {
            "id": "8",
            "l": "8 Pages",
            "m": 1
          },
          {
            "id": "12",
            "l": "12 Pages",
            "m": 1.3
          },
          {
            "id": "16",
            "l": "16 Pages",
            "m": 1.55
          },
          {
            "id": "24",
            "l": "24 Pages",
            "m": 2
          },
          {
            "id": "32",
            "l": "32 Pages",
            "m": 2.4
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "paper",
        "label": "Paper",
        "opts": [
          {
            "id": "80lb",
            "l": "80lb Gloss",
            "m": 1
          },
          {
            "id": "100lb",
            "l": "100lb Gloss",
            "m": 1.15
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 117.5
      },
      {
        "q": 50,
        "p": 186.62
      },
      {
        "q": 100,
        "p": 228.1
      },
      {
        "q": 200,
        "p": 349.06
      },
      {
        "q": 250,
        "p": 466.56
      },
      {
        "q": 500,
        "p": 552.96
      }
    ]
  ,
    "specs": [
      {"k": "Sizes", "v": "5.5×8.5″, 8.5×11″ (standard)"},
      {"k": "Binding", "v": "Saddle-stitch (8–48pp) or Perfect bind (48pp+)"},
      {"k": "Cover Stock", "v": "80–100lb gloss or matte cover"},
      {"k": "Interior Stock", "v": "60–80lb gloss or matte text"},
      {"k": "Print", "v": "Full colour CMYK throughout"},
      {"k": "Page Count", "v": "Minimum 8 pages — multiples of 4"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "presentation-folders",
    "cat": "marketing",
    "name": "Presentation Folders",
    "badge": null,
    "imgs": [],
    "desc": "Custom presentation folders for proposals, information packages, and sales materials — makes a strong first impression.", "long_desc": "Presentation folders (also called pocket folders) hold your documents, brochures, and business card in an organized, professional package. The standard 9×12″ format holds letter-size documents and features one or two interior pockets with a business card slit. Printed on 14pt coated stock with your full brand design.",
    "opts": [
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 140.8
      },
      {
        "q": 50,
        "p": 281.6
      },
      {
        "q": 100,
        "p": 460.8
      },
      {
        "q": 150,
        "p": 576
      },
      {
        "q": 200,
        "p": 672
      },
      {
        "q": 250,
        "p": 739.2
      },
      {
        "q": 500,
        "p": 992
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "9″ × 12″ (holds letter-size documents)"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV, Matte, or Soft-Touch Laminate"},
      {"k": "Pockets", "v": "Single or dual interior pockets"},
      {"k": "Business Card Slit", "v": "Yes — standard"},
      {"k": "Print", "v": "Full colour CMYK, outside + inside"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "event-posters",
    "cat": "marketing",
    "name": "Event Posters",
    "badge": null,
    "imgs": [],
    "desc": "Large-format event posters on gloss or matte stock — bold, vibrant printing that commands attention.", "long_desc": "Event posters are printed on premium paper stock for maximum visual impact at concerts, community events, promotions, and retail displays. Available in standard poster sizes from 11×17″ up to 24×36″. Gloss paper stock delivers vivid colour reproduction ideal for photography and graphic-heavy designs.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "11x17",
            "l": "11\"×17\"",
            "m": 1
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1.85
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 3.2
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 5.5
          }
        ]
      },
      {
        "key": "paper",
        "label": "Paper",
        "opts": [
          {
            "id": "100gloss",
            "l": "100lb Gloss",
            "m": 1
          },
          {
            "id": "100matte",
            "l": "100lb Matte",
            "m": 1.08
          },
          {
            "id": "cardstock",
            "l": "Heavy Cardstock (120lb)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 5,
        "p": 12.77
      },
      {
        "q": 10,
        "p": 22.78
      },
      {
        "q": 25,
        "p": 44.8
      },
      {
        "q": 50,
        "p": 70.4
      },
      {
        "q": 100,
        "p": 125.44
      },
      {
        "q": 250,
        "p": 248
      }
    ]
  ,
    "specs": [
      {"k": "Sizes", "v": "11×17″, 18×24″, 24×36″"},
      {"k": "Stock", "v": "100lb Gloss Text or Matte"},
      {"k": "Print", "v": "Full colour CMYK, single sided"},
      {"k": "Finish", "v": "Aqueous coating"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "File Format", "v": "PDF or AI, 300dpi at full size"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "bookmarks",
    "cat": "marketing",
    "name": "Bookmarks",
    "badge": null,
    "imgs": [],
    "desc": "Custom printed bookmarks — cost-effective promotional giveaways for bookstores, libraries, schools, and literacy campaigns.", "long_desc": "Bookmarks are an affordable, practical promotional item that gets used and kept. Standard bookmark size is 2×7″, printed on 14pt coated stock. Popular with bookstores, libraries, schools, publishers, churches, and any organization wanting an inexpensive branded takeaway.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 15.36
      },
      {
        "q": 50,
        "p": 28.16
      },
      {
        "q": 100,
        "p": 43.72
      },
      {
        "q": 250,
        "p": 46.18
      },
      {
        "q": 500,
        "p": 51.05
      },
      {
        "q": 1000,
        "p": 60.7
      },
      {
        "q": 2500,
        "p": 93.63
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "2″ × 7″"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Options", "v": "Corner rounding, punch hole available"},
      {"k": "Bleed", "v": "0.0625″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "thank-you-card",
    "cat": "marketing",
    "name": "Thank You Cards",
    "badge": null,
    "imgs": [],
    "desc": "Branded thank-you cards for customer appreciation, packaging inserts, and handwritten notes — builds loyalty and referrals.", "long_desc": "Thank-you cards are a powerful, low-cost tool for building customer loyalty. Including a branded thank-you card with every order or service creates a personal touch that customers remember and share. Available in standard card sizes with optional envelopes. Often used by e-commerce brands, salons, restaurants, and service businesses.",
    "opts": [
      {
        "key": "size",
        "label": "Card Size",
        "opts": [
          {
            "id": "4x3",
            "l": "4\"×3\"",
            "m": 1
          },
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 1.3
          },
          {
            "id": "5x7",
            "l": "5\"×7\"",
            "m": 1.55
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 53.76
      },
      {
        "q": 250,
        "p": 83.2
      },
      {
        "q": 500,
        "p": 101.12
      },
      {
        "q": 1000,
        "p": 115.2
      },
      {
        "q": 2500,
        "p": 172.8
      },
      {
        "q": 5000,
        "p": 249.6
      }
    ]
  ,
    "specs": [
      {"k": "Standard Sizes", "v": "4×6″, 5×7″, A2 (4.25×5.5″)"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Envelopes", "v": "Available — ask us"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "plastic-cards",
    "cat": "marketing",
    "name": "Plastic Cards (PVC)",
    "badge": null,
    "imgs": [],
    "desc": "PVC plastic loyalty cards, gift cards, and membership cards — durable credit-card-feel with optional magnetic strip or barcode.", "long_desc": "PVC plastic cards are the same thickness and feel as a standard credit card (30mil). Used for loyalty programs, gift cards, membership cards, hotel key cards, and ID cards. Available with magnetic stripe, barcode, QR code, scratch-off panel, or sequential numbering for tracking and redemption programs.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "feature",
        "label": "Card Feature",
        "opts": [
          {
            "id": "plain",
            "l": "Plain Full Colour",
            "m": 1
          },
          {
            "id": "bar",
            "l": "With Barcode",
            "m": 1.05
          },
          {
            "id": "mag",
            "l": "Magnetic Stripe",
            "m": 1.15
          },
          {
            "id": "scratch",
            "l": "Scratch Panel",
            "m": 1.2
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 50,
        "p": 168.54
      },
      {
        "q": 100,
        "p": 182.17
      },
      {
        "q": 250,
        "p": 188.33
      },
      {
        "q": 500,
        "p": 198.22
      },
      {
        "q": 1000,
        "p": 262.63
      },
      {
        "q": 2000,
        "p": 533.66
      },
      {
        "q": 5000,
        "p": 1091.33
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "30mil PVC Plastic (credit card thickness)"},
      {"k": "Size", "v": "3.375″ × 2.125″ (CR80 standard credit card size)"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Options", "v": "Magnetic strip, barcode, QR code, scratch panel, sequential numbering"},
      {"k": "Finish", "v": "Gloss standard"},
      {"k": "Durability", "v": "Waterproof, flexible, long lifespan"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "digital-sheets",
    "cat": "marketing",
    "name": "Digital Sheets",
    "badge": null,
    "imgs": [],
    "desc": "Short-run digital printing on single sheets — ideal for one-page documents, certificates, menus, and test prints.", "long_desc": "Digital sheet printing offers full-colour output on individual sheets for short runs where offset printing is cost-prohibitive. Perfect for restaurant daily specials, certificates, legal documents, test prints before large runs, and any single-sheet need in quantities too small for offset but too professional for a desktop printer.",
    "opts": [
      {
        "key": "size",
        "label": "Sheet Size",
        "opts": [
          {
            "id": "ltr",
            "l": "8.5\"×11\"",
            "m": 1
          },
          {
            "id": "tbl",
            "l": "11\"×17\"",
            "m": 1.65
          },
          {
            "id": "13x19",
            "l": "13\"×19\"",
            "m": 2.2
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 3.71
      },
      {
        "q": 11,
        "p": 7.17
      },
      {
        "q": 21,
        "p": 17.28
      },
      {
        "q": 51,
        "p": 33.28
      },
      {
        "q": 101,
        "p": 345.6
      }
    ]
  ,
    "specs": [
      {"k": "Sizes", "v": "Up to 13″ × 19″"},
      {"k": "Stock", "v": "24lb bond, 60lb text, or 80lb text/cover (specify)"},
      {"k": "Print", "v": "Full colour CMYK or black & white"},
      {"k": "Finish", "v": "Uncoated standard; coated stock available"},
      {"k": "Sides", "v": "Single or double sided"},
      {"k": "Minimum", "v": "1 sheet"},
      {"k": "Turnaround", "v": "1–3 business days"}
    ]
  },
  {
    "id": "letterheads",
    "cat": "stationery",
    "name": "Letterheads",
    "badge": null,
    "imgs": [],
    "desc": "Custom branded letterheads for professional correspondence — full-colour header on premium paper for a polished business image.", "long_desc": "A professionally printed letterhead elevates every piece of correspondence you send. Printed on 24lb premium bond paper with your full-colour logo, contact information, and brand design. Suitable for laser printing and inkjet printing, making it easy to add content in your office and maintain a professional appearance.",
    "opts": [
      {
        "key": "paper",
        "label": "Paper Stock",
        "opts": [
          {
            "id": "24lb",
            "l": "24lb Bond Economy",
            "m": 1
          },
          {
            "id": "60lb",
            "l": "60lb Offset Standard",
            "m": 1.15
          },
          {
            "id": "80lb",
            "l": "80lb Premium",
            "m": 1.28
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 50,
        "p": 96
      },
      {
        "q": 100,
        "p": 125.44
      },
      {
        "q": 250,
        "p": 152.32
      },
      {
        "q": 500,
        "p": 216.32
      },
      {
        "q": 1000,
        "p": 331.52
      },
      {
        "q": 2000,
        "p": 485.12
      },
      {
        "q": 5000,
        "p": 689.92
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "8.5″ × 11″ (letter) or custom"},
      {"k": "Stock", "v": "24lb Premium Bond or 60lb Text"},
      {"k": "Print", "v": "Full colour CMYK header, single sided"},
      {"k": "Compatible With", "v": "Laser printers and inkjet printers"},
      {"k": "Finish", "v": "Uncoated (writeable, printable)"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "envelopes",
    "cat": "stationery",
    "name": "Envelopes",
    "badge": null,
    "imgs": [],
    "desc": "Custom printed envelopes with your logo and return address — professional branded correspondence from the first touch.", "long_desc": "Printed envelopes carry your brand identity from the moment they’re received. Available in #10 (standard business), A2, A6, and A7 sizes. Full-colour printing on the front face with your logo, return address, and brand colours. Optional interior tint for privacy. Compatible with standard postage.",
    "opts": [
      {
        "key": "size",
        "label": "Envelope Size",
        "opts": [
          {
            "id": "#10",
            "l": "#10 Standard",
            "m": 1
          },
          {
            "id": "6x9",
            "l": "6\"×9\"",
            "m": 1.3
          },
          {
            "id": "9x12",
            "l": "9\"×12\"",
            "m": 1.7
          },
          {
            "id": "10x13",
            "l": "10\"×13\"",
            "m": 2.1
          }
        ]
      },
      {
        "key": "win",
        "label": "Window",
        "opts": [
          {
            "id": "none",
            "l": "No Window",
            "m": 1
          },
          {
            "id": "left",
            "l": "Left Window",
            "m": 1.08
          },
          {
            "id": "right",
            "l": "Right Window",
            "m": 1.08
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 153.92
      },
      {
        "q": 250,
        "p": 210.75
      },
      {
        "q": 500,
        "p": 280
      },
      {
        "q": 1000,
        "p": 475.2
      },
      {
        "q": 2000,
        "p": 664.64
      },
      {
        "q": 3000,
        "p": 863.04
      },
      {
        "q": 5000,
        "p": 1183.68
      }
    ]
  ,
    "specs": [
      {"k": "Sizes", "v": "#10 (4.125×9.5″), A2, A6, A7"},
      {"k": "Stock", "v": "24lb White Wove"},
      {"k": "Print", "v": "Full colour CMYK, exterior front"},
      {"k": "Seal", "v": "Gummed flap or peel-and-seal"},
      {"k": "Interior", "v": "Optional privacy tint available"},
      {"k": "Compatible", "v": "Standard Canada Post postage rates"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "notepads",
    "cat": "stationery",
    "name": "Notepads",
    "badge": "20% OFF",
    "imgs": [],
    "desc": "Custom branded notepads for offices, events, and client gifts — functional promotional items that stay on desks for months.", "long_desc": "Custom notepads are practical promotional items that keep your brand visible every day. A notepad on someone’s desk means your logo is seen every time they write a note. Available in 25, 50, or 100-sheet options, padded with chipboard backing for stability. Popular as client gifts, trade show giveaways, and office stationery.",
    "opts": [
      {
        "key": "size",
        "label": "Notepad Size",
        "opts": [
          {
            "id": "qtr",
            "l": "4\"×5.5\" Quarter",
            "m": 1
          },
          {
            "id": "half",
            "l": "5.5\"×8.5\" Half",
            "m": 1.5
          },
          {
            "id": "full",
            "l": "8.5\"×11\" Full",
            "m": 2.2
          }
        ]
      },
      {
        "key": "sheets",
        "label": "Sheets/Pad",
        "opts": [
          {
            "id": "25",
            "l": "25 Sheets",
            "m": 0.8
          },
          {
            "id": "50",
            "l": "50 Sheets",
            "m": 1
          },
          {
            "id": "100",
            "l": "100 Sheets",
            "m": 1.45
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 239.41
      },
      {
        "q": 50,
        "p": 292.61
      },
      {
        "q": 100,
        "p": 390.71
      },
      {
        "q": 250,
        "p": 701.61
      },
      {
        "q": 500,
        "p": 927.72
      },
      {
        "q": 1000,
        "p": 1264.38
      }
    ]
  ,
    "specs": [
      {"k": "Standard Sizes", "v": "4×5″, 5.5×8.5″, 8.5×11″"},
      {"k": "Stock", "v": "60lb uncoated bond"},
      {"k": "Sheet Count", "v": "25, 50, or 100 sheets per pad"},
      {"k": "Backing", "v": "Chipboard backing included"},
      {"k": "Binding", "v": "Glue-padded at top"},
      {"k": "Print", "v": "Full colour CMYK, single sided per sheet"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "ncr-forms",
    "cat": "stationery",
    "name": "NCR Carbonless Forms",
    "badge": null,
    "imgs": [],
    "desc": "NCR (no-carbon-required) carbonless forms for invoices, receipts, work orders, and contracts — duplicate or triplicate copies instantly.", "long_desc": "NCR (no carbon required) forms use a chemical coating that transfers writing from the top sheet to the copies below without carbon paper. Available in 2-part (white + yellow) or 3-part (white + yellow + pink) sets. Used for invoices, work orders, delivery receipts, contracts, and any situation where multiple parties need a copy immediately.",
    "opts": [
      {
        "key": "parts",
        "label": "Number of Parts",
        "opts": [
          {
            "id": "2",
            "l": "2-Part White+Yellow",
            "m": 1
          },
          {
            "id": "3",
            "l": "3-Part +Pink",
            "m": 1.45
          },
          {
            "id": "4",
            "l": "4-Part",
            "m": 1.85
          }
        ]
      },
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "half",
            "l": "5.5\"×8.5\" Half",
            "m": 0.85
          },
          {
            "id": "full",
            "l": "8.5\"×11\" Full",
            "m": 1
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 100,
        "p": 113.92
      },
      {
        "q": 250,
        "p": 126.72
      },
      {
        "q": 500,
        "p": 165.12
      },
      {
        "q": 1000,
        "p": 203.52
      }
    ]
  ,
    "specs": [
      {"k": "Sets", "v": "2-part (duplicate) or 3-part (triplicate)"},
      {"k": "Parts", "v": "White original + Yellow + Pink (3-part)"},
      {"k": "Standard Sizes", "v": "5.5×8.5″, 8.5×11″"},
      {"k": "Print", "v": "Full colour CMYK or black & white on top sheet"},
      {"k": "Binding", "v": "Glue-padded (books of 25 or 50 sets)"},
      {"k": "Sequentially Numbered", "v": "Available — ask us"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "tent-cards",
    "cat": "restaurant",
    "name": "Tent Cards",
    "badge": null,
    "imgs": [],
    "desc": "Table tent cards for restaurants, hotels, and events — displays promotions, daily specials, and QR codes right at the table.", "long_desc": "Tent cards are folded cards that stand on tables, counters, and reception desks. Used by restaurants for specials and promotions, hotels for amenity information, and events for wayfinding. Printed on heavy stock and folded to an A-frame shape so they’re stable without a stand.",
    "opts": [
      {
        "key": "size",
        "label": "Card Size",
        "opts": [
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 1
          },
          {
            "id": "5x7",
            "l": "5\"×7\"",
            "m": 1.3
          },
          {
            "id": "6x8",
            "l": "6\"×8\"",
            "m": 1.55
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "coat",
        "label": "Coating",
        "opts": [
          {
            "id": "none",
            "l": "No Coating",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.08
          },
          {
            "id": "uv",
            "l": "UV Gloss",
            "m": 1.12
          },
          {
            "id": "lam_m",
            "l": "Matte Laminate",
            "m": 1.22
          },
          {
            "id": "lam_g",
            "l": "Gloss Laminate",
            "m": 1.18
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 250,
        "p": 382.72
      },
      {
        "q": 500,
        "p": 497.92
      },
      {
        "q": 1000,
        "p": 753.92
      },
      {
        "q": 2500,
        "p": 1009.92
      },
      {
        "q": 5000,
        "p": 1662.72
      },
      {
        "q": 10000,
        "p": 2814.72
      }
    ]
  ,
    "specs": [
      {"k": "Flat Size", "v": "4×6″, 5×7″, or 4×10″ (folded in half)"},
      {"k": "Folded Size", "v": "4×3″, 5×3.5″, or 4×5″"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Score", "v": "Pre-scored for clean fold"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "restaurant-laminated-menu",
    "cat": "restaurant",
    "name": "Laminated Menus",
    "badge": null,
    "imgs": [],
    "desc": "Laminated restaurant menus on heavy card stock — waterproof, wipe-clean, and durable for daily table use.", "long_desc": "Laminated menus are the standard for casual dining, cafes, and fast-casual restaurants. Printed on heavy card stock and laminated front and back with a gloss or matte film, they’re waterproof and wipe-clean — surviving daily use in a busy restaurant environment. Available as single-sheet or folded formats.",
    "opts": [
      {
        "key": "size",
        "label": "Menu Size",
        "opts": [
          {
            "id": "ltr",
            "l": "8.5\"×11\"",
            "m": 1
          },
          {
            "id": "legal",
            "l": "8.5\"×14\"",
            "m": 1.25
          },
          {
            "id": "tbl",
            "l": "11\"×17\"",
            "m": 1.55
          },
          {
            "id": "lg",
            "l": "12\"×18\"",
            "m": 1.85
          }
        ]
      },
      {
        "key": "lam",
        "label": "Lamination",
        "opts": [
          {
            "id": "gloss",
            "l": "Gloss Laminated",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte Laminated",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 10,
        "p": 38.4
      },
      {
        "q": 20,
        "p": 76.8
      },
      {
        "q": 30,
        "p": 115.2
      },
      {
        "q": 50,
        "p": 192
      },
      {
        "q": 70,
        "p": 268.8
      },
      {
        "q": 100,
        "p": 320
      },
      {
        "q": 200,
        "p": 576
      }
    ]
  ,
    "specs": [
      {"k": "Standard Sizes", "v": "8.5×11″, 8.5×14″, 11×17″"},
      {"k": "Stock", "v": "14pt or 16pt C2S Coated"},
      {"k": "Laminate", "v": "Gloss or matte laminate, both sides"},
      {"k": "Waterproof", "v": "Yes — wipe-clean surface"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Format", "v": "Single sheet or bi-fold"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "restaurant-table-tent-menu",
    "cat": "restaurant",
    "name": "Table Tent Menus",
    "badge": null,
    "imgs": [],
    "desc": "Table tent menus for restaurants — displays food and drink items right at the table in an eye-catching upright format.", "long_desc": "Table tent menus stand on the table surface, putting your food and drink offerings directly in front of every customer. The upright A-frame format is visible from multiple angles and draws the eye to featured items and promotions. Printed on heavy card stock, laminated or UV coated for durability.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 1
          },
          {
            "id": "5x7",
            "l": "5\"×7\"",
            "m": 1.3
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 5,
        "p": 112.64
      },
      {
        "q": 10,
        "p": 216.32
      },
      {
        "q": 20,
        "p": 368.64
      },
      {
        "q": 30,
        "p": 495.36
      },
      {
        "q": 50,
        "p": 751.36
      }
    ]
  ,
    "specs": [
      {"k": "Flat Size", "v": "8.5×11″ or 8.5×14″ (folds to A-frame)"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV or Matte laminate"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Panels", "v": "2–4 panels depending on fold"},
      {"k": "Durability", "v": "Wipe-clean surface"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "leather-booklet-menu",
    "cat": "restaurant",
    "name": "Leather Booklet Menus",
    "badge": "Premium",
    "imgs": [],
    "desc": "Leather or faux-leather booklet menus for fine dining — premium presentation that elevates the guest experience.", "long_desc": "Leather booklet menus signal fine dining and premium service. Our leather (or high-quality faux-leather) menu covers with inserted printed pages deliver the tactile quality your guests expect at an upscale establishment. Available in various cover colours with custom printing on the interior pages.",
    "opts": [
      {
        "key": "pages",
        "label": "Pages",
        "opts": [
          {
            "id": "4",
            "l": "4 Pages",
            "m": 1
          },
          {
            "id": "8",
            "l": "8 Pages",
            "m": 1.55
          },
          {
            "id": "12",
            "l": "12 Pages",
            "m": 2.1
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 5,
        "p": 448
      },
      {
        "q": 11,
        "p": 1228.8
      },
      {
        "q": 31,
        "p": 1920
      },
      {
        "q": 51,
        "p": 3584
      }
    ]
  ,
    "specs": [
      {"k": "Cover Material", "v": "Faux leather or genuine leather"},
      {"k": "Standard Size", "v": "5×9″, 8×11″ (page size)"},
      {"k": "Interior Pages", "v": "Printed on 80–100lb text stock"},
      {"k": "Interior Print", "v": "Full colour CMYK"},
      {"k": "Cover Colours", "v": "Black, brown, burgundy, navy (ask for options)"},
      {"k": "Page Attachment", "v": "Sewn binding or removable inserts"},
      {"k": "Turnaround", "v": "10–14 business days"}
    ]
  },
  {
    "id": "restaurant-check-holder",
    "cat": "restaurant",
    "name": "Restaurant Check Holders",
    "badge": null,
    "imgs": [],
    "desc": "Custom branded check holders and bill presenters for restaurants — branded to match your establishment’s look.", "long_desc": "Branded check presenters turn the bill delivery moment into a brand touchpoint. Available in leatherette or vinyl with your logo printed or embossed on the cover. The interior holds a standard bill, receipt, or payment card sleeve. A subtle but professional finishing touch for any dining establishment.",
    "opts": [],
    "pricing": [
      {
        "q": 1,
        "p": 19.2
      },
      {
        "q": 5,
        "p": 25.6
      },
      {
        "q": 10,
        "p": 38.4
      },
      {
        "q": 25,
        "p": 64
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Leatherette or PU vinyl"},
      {"k": "Standard Size", "v": "5×9″ (holds standard receipts)"},
      {"k": "Branding", "v": "Logo printed or debossed on cover"},
      {"k": "Interior", "v": "Card slot for payment or receipt"},
      {"k": "Colour Options", "v": "Black, brown, navy, burgundy"},
      {"k": "Minimum Order", "v": "10 units"},
      {"k": "Turnaround", "v": "10–14 business days"}
    ]
  },
  {
    "id": "wedding-signs",
    "cat": "foam-boards",
    "name": "Wedding Signs",
    "badge": null,
    "imgs": [],
    "desc": "Custom wedding signs on foam board, acrylic, or coroplast — welcome signs, seating charts, and directional signs for your big day.", "long_desc": "Wedding signs add personalization and elegance to your ceremony and reception. From large welcome signs to bar menus, directional arrows, and table numbers, we create beautiful custom signage that matches your wedding theme. Popular materials include foam board for indoor displays, acrylic for a premium look, and coroplast for outdoor ceremony signage.",
    "opts": [
      {
        "key": "size",
        "label": "Board Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.75
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 3
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 4,
        "p": 122.88
      },
      {
        "q": 9,
        "p": 153.6
      }
    ]
  ,
    "specs": [
      {"k": "Materials", "v": "Foam board, Acrylic, or Coroplast"},
      {"k": "Popular Sizes", "v": "18×24″, 24×36″, 36×48″"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Foam Board Thickness", "v": "3/16″ or 1/2″"},
      {"k": "Finish", "v": "Gloss or matte"},
      {"k": "Common Types", "v": "Welcome signs, seating charts, bar menus, directional"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "baby-shower-signs",
    "cat": "foam-boards",
    "name": "Baby Shower Signs",
    "badge": null,
    "imgs": [],
    "desc": "Custom baby shower signs and decorations — welcome signs, milestone boards, and themed displays for the perfect celebration.", "long_desc": "Baby shower signs add a personalized, professional touch to the celebration. Custom welcome signs, diaper raffle boards, advice cards, and milestone photo props make the event feel special and coordinated. Printed on foam board or coroplast for stability, or as flat printed panels for framing.",
    "opts": [
      {
        "key": "size",
        "label": "Board Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.75
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 3
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 4,
        "p": 122.88
      },
      {
        "q": 9,
        "p": 153.6
      }
    ]
  ,
    "specs": [
      {"k": "Materials", "v": "Foam board, Coroplast, or Printed Board"},
      {"k": "Popular Sizes", "v": "18×24″, 24×36″"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Finish", "v": "Gloss or matte"},
      {"k": "Common Types", "v": "Welcome signs, diaper raffle boards, advice cards"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "seating-chart-signs",
    "cat": "foam-boards",
    "name": "Seating Chart Signs",
    "badge": null,
    "imgs": [],
    "desc": "Large-format seating chart signs for weddings, galas, and events — clearly displays guest table assignments in an elegant format.", "long_desc": "Seating chart signs let guests quickly find their table at weddings, galas, and corporate events. Available in large poster sizes (24×36″ up to 36×48″) mounted on foam board or printed on a freestanding display. Can be organized alphabetically, by table, or in a custom format matching your event theme.",
    "opts": [
      {
        "key": "size",
        "label": "Board Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.75
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 3
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 4,
        "p": 122.88
      },
      {
        "q": 9,
        "p": 153.6
      }
    ]
  ,
    "specs": [
      {"k": "Popular Sizes", "v": "24×36″, 30×40″, 36×48″"},
      {"k": "Material", "v": "Foam board (3/16″ or 1/2″) or mounted print"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Format", "v": "Alphabetical, by table, or custom layout"},
      {"k": "Stand Options", "v": "Easel back, freestanding frame"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "event-directional-signs",
    "cat": "foam-boards",
    "name": "Event Directional Signs",
    "badge": null,
    "imgs": [],
    "desc": "Directional signs and arrows for events, conferences, and venues — guides guests to the right rooms, tables, and areas.", "long_desc": "Event directional signs keep guests moving smoothly through your venue. Arrow signs, room identification signs, and wayfinding boards are printed on foam board, coroplast, or mounted rigid substrates. Available with easel backs for freestanding use or as hanging signs.",
    "opts": [
      {
        "key": "size",
        "label": "Board Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.75
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 3
          }
        ]
      },
      {
        "key": "arrow",
        "label": "Arrow Style",
        "opts": [
          {
            "id": "right",
            "l": "→ Arrow Right",
            "m": 1
          },
          {
            "id": "left",
            "l": "← Arrow Left",
            "m": 1
          },
          {
            "id": "both",
            "l": "↔ Both Ways",
            "m": 1
          },
          {
            "id": "custom",
            "l": "Custom Layout",
            "m": 1.1
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 4,
        "p": 122.88
      },
      {
        "q": 9,
        "p": 153.6
      }
    ]
  ,
    "specs": [
      {"k": "Popular Sizes", "v": "8.5×11″, 11×17″, 18×24″"},
      {"k": "Material", "v": "Foam board, Coroplast, or Foam-mounted print"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Mounting", "v": "Easel back, stake, hanging, or table stand"},
      {"k": "Common Types", "v": "Arrows, room signs, wayfinding, schedules"},
      {"k": "Turnaround", "v": "1–3 business days"}
    ]
  },
  {
    "id": "custom-foam-board",
    "cat": "foam-boards",
    "name": "Custom Foam Board",
    "badge": null,
    "imgs": [],
    "desc": "Custom foam board signs and displays — lightweight, rigid, and ideal for indoor presentations, events, and retail displays.", "long_desc": "Foam board (foamcore) is a lightweight rigid panel consisting of a foam core between two paper faces. Printed graphics are mounted or directly printed on the surface. It’s the go-to material for presentations, trade show displays, real estate open houses, school projects, and retail displays. Not suitable for outdoor use.",
    "opts": [
      {
        "key": "size",
        "label": "Board Size",
        "opts": [
          {
            "id": "12x18",
            "l": "12\"×18\"",
            "m": 0.65
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.75
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 3
          }
        ]
      },
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 4,
        "p": 122.88
      },
      {
        "q": 9,
        "p": 153.6
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "3/16″ or 1/2″ White Foam Board"},
      {"k": "Print", "v": "Full colour CMYK, direct print or mounted"},
      {"k": "Sizes", "v": "Custom — any size up to 48×96″"},
      {"k": "Finish", "v": "Gloss or matte"},
      {"k": "Mounting", "v": "Easel back available"},
      {"k": "Use", "v": "Indoor only"},
      {"k": "Turnaround", "v": "1–3 business days"}
    ]
  },
  {
    "id": "giant-cheques",
    "cat": "foam-boards",
    "name": "Giant Cheques",
    "badge": null,
    "imgs": [],
    "desc": "Oversized ceremonial giant cheques for charity events, prize presentations, and media moments — printed professionally for maximum impact.", "long_desc": "Giant ceremonial cheques are a staple of charity fundraisers, contest prize presentations, grand openings, and media events. Our giant cheques are printed on rigid foam board or coroplast in your bank’s design, a custom branded design, or a generic cheque template. The standard size is 24×48″ or 30×60″ for maximum photo and media visibility.",
    "opts": [
      {
        "key": "size",
        "label": "Cheque Size",
        "opts": [
          {
            "id": "24x48",
            "l": "24\"×48\" Standard",
            "m": 1
          },
          {
            "id": "32x60",
            "l": "32\"×60\" Large",
            "m": 1.75
          },
          {
            "id": "36x72",
            "l": "36\"×72\" XL",
            "m": 2.4
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 57.6
      },
      {
        "q": 2,
        "p": 99.84
      },
      {
        "q": 3,
        "p": 134.4
      },
      {
        "q": 4,
        "p": 172.8
      },
      {
        "q": 5,
        "p": 198.4
      }
    ]
  ,
    "specs": [
      {"k": "Standard Sizes", "v": "24×48″, 30×60″ or custom"},
      {"k": "Material", "v": "Foam board (1/2″) or Coroplast"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Design", "v": "Custom branded or generic template — your choice"},
      {"k": "Finish", "v": "Gloss or matte"},
      {"k": "Use", "v": "Charity events, prize presentations, media photos"},
      {"k": "Turnaround", "v": "1–3 business days"}
    ]
  },
  {
    "id": "google-review-sticker",
    "cat": "labels-stickers",
    "name": "Google Review Sticker",
    "badge": "Popular",
    "imgs": [],
    "desc": "Google Review stickers with your unique QR code — makes it effortless for customers to leave a 5-star review.", "long_desc": "Google Review stickers are one of the simplest ways to increase your Google review count. Place them on your front door, counter, receipt, or packaging — customers scan the QR code and go directly to your Google Review page. We encode your unique Google Business Profile review URL into the QR code. Printed on durable vinyl.",
    "opts": [
      {
        "key": "size",
        "label": "Sticker Size",
        "opts": [
          {
            "id": "3in",
            "l": "3\" Round",
            "m": 1
          },
          {
            "id": "4in",
            "l": "4\" Round",
            "m": 1.25
          },
          {
            "id": "4x6",
            "l": "4\"×6\" Rect",
            "m": 1.4
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 37.12
      },
      {
        "q": 5,
        "p": 21.73
      },
      {
        "q": 10,
        "p": 17.28
      },
      {
        "q": 25,
        "p": 12.8
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Durable vinyl with permanent adhesive"},
      {"k": "Standard Size", "v": "4″ round or 3×4″ rectangle"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "QR Code", "v": "Your unique Google Review URL encoded — provide your Google Place URL"},
      {"k": "Finish", "v": "Gloss laminate"},
      {"k": "Adhesive", "v": "Permanent — for glass, walls, signage"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "sheet-stickers",
    "label_configurator": true,
    "lbl_shapes": ["Circle","Oval","Square","Rectangle","Custom"],
    "lbl_sizes": ["1\" × 1\"","1.5\" × 1.5\"","2\" × 2\"","2\" × 2.5\"","3\" × 3\"","3.5\" × 3.5\"","4\" × 4\""],
    "lbl_stocks": ["Semi Gloss Paper"],
    "lbl_ink": ["CMYK (Full Colour)"],
    "lbl_finishing": ["Standard"],
    "cat": "labels-stickers",
    "name": "Sheet Stickers",
    "badge": "30% OFF",
    "imgs": [],
    "desc": "Custom sticker sheets with multiple designs or die-cut shapes on a single sheet — perfect for product packaging, events, and giveaways.", "long_desc": "Sticker sheets allow multiple individual stickers to be printed on a single sheet, maximizing value. Common uses include planner stickers, product labels, packaging accents, kids activities, promotional giveaways, and branding kits. Available with any shape or combination of shapes die-cut on one sheet.",
    "opts": [
      {
        "key": "size",
        "label": "Sheet Size",
        "opts": [
          {
            "id": "4x6",
            "l": "4\"×6\" Sheet",
            "m": 0.8
          },
          {
            "id": "ltr",
            "l": "8.5\"×11\" Sheet",
            "m": 1
          }
        ]
      },
      {
        "key": "cut",
        "label": "Cut Type",
        "opts": [
          {
            "id": "kiss",
            "l": "Kiss Cut",
            "m": 1
          },
          {
            "id": "die",
            "l": "Die Cut",
            "m": 1.15
          }
        ]
      },
      {
        "key": "finish",
        "label": "Finish",
        "opts": [
          {
            "id": "gloss",
            "l": "Gloss",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte",
            "m": 1.06
          },
          {
            "id": "holo",
            "l": "Holographic",
            "m": 1.35
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 50,
        "p": 44.8
      },
      {
        "q": 100,
        "p": 70.4
      },
      {
        "q": 250,
        "p": 134.4
      },
      {
        "q": 500,
        "p": 224
      }
    ]
  ,
    "specs": [
      {"k": "Sheet Sizes", "v": "4×6″, 5×7″, 8.5×11″"},
      {"k": "Material", "v": "White gloss or matte vinyl"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Cut", "v": "Die-cut to your shapes on the sheet"},
      {"k": "Finish", "v": "Gloss or matte laminate"},
      {"k": "Adhesive", "v": "Permanent or removable"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "roll-labels",
    "label_configurator": true,
    "lbl_shapes": ["Circle","Oval","Square","Rectangle","Custom"],
    "lbl_sizes": ["1\" × 1\"","1.5\" × 1.5\"","2\" × 2\"","2\" × 1\"","2.5\" × 2.5\"","2\" × 3\"","3\" × 3\"","3.5\" × 3.5\"","2\" × 4\"","3.5\" × 2\"","4\" × 3\"","4\" × 4\"","4\" × 6\"","5\" × 5\""],
    "lbl_stocks": ["Semi Gloss Paper"],
    "lbl_ink": ["CMYK (Full Colour)"],
    "lbl_finishing": ["Standard"],
    "cat": "labels-stickers",
    "name": "Roll Labels (Paper)",
    "badge": null,
    "imgs": [],
    "desc": "Custom roll labels for product packaging, jars, bottles, and boxes — high-quality paper labels wound on a roll for easy application.", "long_desc": "Roll labels are the standard for product labelling in food, beverage, cosmetics, and manufacturing. Wound on a core for use with label applicators or hand application. Printed on white semi-gloss paper stock with a permanent adhesive. Custom shapes and sizes available.",
    "opts": [
      {
        "key": "size",
        "label": "Label Size",
        "opts": [
          {
            "id": "1x1",
            "l": "1\"×1\"",
            "m": 0.7
          },
          {
            "id": "2x2",
            "l": "2\"×2\"",
            "m": 1
          },
          {
            "id": "2x4",
            "l": "2\"×4\"",
            "m": 1.4
          },
          {
            "id": "3x3",
            "l": "3\"×3\"",
            "m": 1.6
          },
          {
            "id": "4x4",
            "l": "4\"×4\"",
            "m": 1.9
          },
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 2.5
          }
        ]
      },
      {
        "key": "finish",
        "label": "Finish",
        "opts": [
          {
            "id": "matte",
            "l": "Matte White",
            "m": 1
          },
          {
            "id": "gloss",
            "l": "Gloss White",
            "m": 1.05
          },
          {
            "id": "kraft",
            "l": "Kraft Brown",
            "m": 1.08
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 500,
        "p": 83.2
      },
      {
        "q": 1000,
        "p": 121.6
      },
      {
        "q": 2500,
        "p": 224
      },
      {
        "q": 5000,
        "p": 364.8
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "White Semi-Gloss Paper"},
      {"k": "Adhesive", "v": "Permanent"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Core Size", "v": "3″ core (standard label applicator)"},
      {"k": "Shapes", "v": "Circle, oval, rectangle, or custom die-cut"},
      {"k": "Min. Size", "v": "1″ × 1″"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "vinyl-roll-labels",
    "label_configurator": true,
    "lbl_shapes": ["Circle","Oval","Square","Rectangle","Custom"],
    "lbl_sizes": ["1\" × 1\"","1.5\" × 1.5\"","2\" × 2\"","2\" × 1\"","2.5\" × 2.5\"","3\" × 3\"","3.5\" × 3.5\"","4\" × 3\"","4\" × 6\""],
    "lbl_stocks": ["White Gloss BOPP Permanent","White Gloss BOPP Removable","White Matte BOPP Permanent","White Matte BOPP Removable","Clear Gloss BOPP Permanent","Clear Gloss BOPP Removable"],
    "lbl_ink": ["CMYK (Full Colour)","Black Only"],
    "lbl_finishing": ["None","Matte Lamination","Gloss Lamination","Spot UV","Soft Touch Lamination"],
    "cat": "labels-stickers",
    "name": "Vinyl Roll Labels (Waterproof)",
    "badge": null,
    "imgs": [],
    "desc": "Waterproof vinyl roll labels for bottles, jars, and outdoor products — resistant to water, oil, and freezer conditions.", "long_desc": "Vinyl roll labels use a white BOPP (biaxially oriented polypropylene) film that is waterproof, oil-resistant, and suitable for freezer applications. Ideal for beverage bottles, cleaning products, personal care products, and anything that gets wet. The film resists tearing and smearing that would damage a standard paper label.",
    "opts": [
      {
        "key": "size",
        "label": "Label Size",
        "opts": [
          {
            "id": "1x1",
            "l": "1\"×1\"",
            "m": 0.7
          },
          {
            "id": "2x2",
            "l": "2\"×2\"",
            "m": 1
          },
          {
            "id": "2x4",
            "l": "2\"×4\"",
            "m": 1.4
          },
          {
            "id": "3x3",
            "l": "3\"×3\"",
            "m": 1.6
          },
          {
            "id": "4x4",
            "l": "4\"×4\"",
            "m": 1.9
          },
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 2.5
          }
        ]
      },
      {
        "key": "finish",
        "label": "Finish",
        "opts": [
          {
            "id": "gloss",
            "l": "Gloss White",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte White",
            "m": 1.06
          },
          {
            "id": "clear",
            "l": "Clear/Transparent",
            "m": 1.12
          },
          {
            "id": "kraft",
            "l": "Kraft Brown",
            "m": 1.1
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 250,
        "p": 113.92
      },
      {
        "q": 500,
        "p": 172.8
      },
      {
        "q": 1000,
        "p": 249.6
      },
      {
        "q": 2500,
        "p": 441.6
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "White BOPP (Waterproof Vinyl Film)"},
      {"k": "Adhesive", "v": "Permanent, freezer-rated"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Water Resistant", "v": "Yes — waterproof, oil-resistant"},
      {"k": "Freezer Safe", "v": "Yes — down to -20°C"},
      {"k": "Shapes", "v": "Circle, oval, rectangle, or custom die-cut"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "clear-labels",
    "label_configurator": true,
    "lbl_shapes": ["Circle","Oval","Square","Rectangle","Custom"],
    "lbl_sizes": ["1\" × 1\"","1.5\" × 1.5\"","2\" × 2\"","2\" × 1\"","2.5\" × 2.5\"","3\" × 3\"","3.5\" × 3.5\"","4\" × 3\"","4\" × 6\""],
    "lbl_stocks": ["Clear Gloss BOPP Permanent","Clear Gloss BOPP Removable"],
    "lbl_ink": ["CMYK (Full Colour)"],
    "lbl_finishing": ["None","Matte Lamination","Gloss Lamination","Spot UV"],
    "cat": "labels-stickers",
    "name": "Clear / Transparent Labels",
    "badge": null,
    "imgs": [],
    "desc": "Clear transparent labels that appear to be printed directly on the product surface — the no-label look for premium products.", "long_desc": "Clear labels use a transparent BOPP film that becomes almost invisible when applied to a smooth surface like glass or plastic. The result is the appearance of print directly on the container — the ’no-label look’ that premium brands use. Available with white ink underprint for opacity where needed.",
    "opts": [
      {
        "key": "size",
        "label": "Label Size",
        "opts": [
          {
            "id": "1x1",
            "l": "1\"×1\"",
            "m": 0.7
          },
          {
            "id": "2x2",
            "l": "2\"×2\"",
            "m": 1
          },
          {
            "id": "2x4",
            "l": "2\"×4\"",
            "m": 1.4
          },
          {
            "id": "3x3",
            "l": "3\"×3\"",
            "m": 1.6
          },
          {
            "id": "4x4",
            "l": "4\"×4\"",
            "m": 1.9
          },
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 2.5
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 250,
        "p": 121.6
      },
      {
        "q": 500,
        "p": 185.6
      },
      {
        "q": 1000,
        "p": 275.2
      },
      {
        "q": 2500,
        "p": 492.8
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Clear BOPP Transparent Film"},
      {"k": "Adhesive", "v": "Permanent"},
      {"k": "Print", "v": "Full colour CMYK on clear film"},
      {"k": "White Underprint", "v": "Available for opaque areas"},
      {"k": "Best On", "v": "Glass, clear plastic, smooth surfaces"},
      {"k": "Shapes", "v": "Circle, oval, rectangle, or custom die-cut"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "feature-sheets",
    "cat": "real-estate",
    "name": "Feature Sheets",
    "badge": null,
    "imgs": [],
    "desc": "Real estate feature sheets for property listings — professional one-page property summaries that sell your listings faster.", "long_desc": "Feature sheets (property information sheets) are single-page documents that summarize a listing with photos, specs, and key selling points. Distributed at open houses and showings, a well-designed feature sheet helps buyers remember the property and makes a strong brand impression for the realtor. Printed on premium paper stock.",
    "opts": [
      {
        "key": "sides",
        "label": "Printed Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided (4/0)",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided (4/4)",
            "m": 1.22
          }
        ]
      },
      {
        "key": "paper",
        "label": "Paper",
        "opts": [
          {
            "id": "80lb",
            "l": "80lb Gloss",
            "m": 1
          },
          {
            "id": "100lb",
            "l": "100lb Gloss",
            "m": 1.15
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 20,
        "p": 51.19
      },
      {
        "q": 50,
        "p": 76.79
      },
      {
        "q": 100,
        "p": 102.39
      },
      {
        "q": 200,
        "p": 204.79
      }
    ]
  ,
    "specs": [
      {"k": "Size", "v": "8.5×11″ (standard) or 11×17″ folded"},
      {"k": "Stock", "v": "100lb Gloss Text or Matte"},
      {"k": "Print", "v": "Full colour CMYK, both sides"},
      {"k": "Finish", "v": "Aqueous gloss or matte coating"},
      {"k": "Common Content", "v": "Property photos, specs, agent info, price"},
      {"k": "Bleed", "v": "0.125″ all sides"},
      {"k": "Turnaround", "v": "2–3 business days (rush available)"}
    ]
  },
  {
    "id": "for-sale-sold-signs",
    "cat": "real-estate",
    "name": "For Sale / Sold Signs",
    "badge": null,
    "imgs": [],
    "desc": "Real estate for sale and sold signs on coroplast or aluminium — weatherproof outdoor signs for yard, post, or stake mounting.", "long_desc": "For sale and sold signs are the most visible marketing tool in real estate. Our signs are printed on 4mm coroplast for lightweight yard stakes, or on aluminium composite for post-mounted permanent installations. Double-sided printing ensures visibility from both directions on the street.",
    "opts": [
      {
        "key": "sides",
        "label": "Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided",
            "m": 1.45
          }
        ]
      },
      {
        "key": "text",
        "label": "Sign Type",
        "opts": [
          {
            "id": "forsale",
            "l": "For Sale",
            "m": 1
          },
          {
            "id": "sold",
            "l": "SOLD",
            "m": 1
          },
          {
            "id": "custom",
            "l": "Custom Text",
            "m": 1.05
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 28.16
      },
      {
        "q": 5,
        "p": 108.8
      },
      {
        "q": 10,
        "p": 192
      },
      {
        "q": 25,
        "p": 409.6
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "18×24″, 24×32″, or custom"},
      {"k": "Material", "v": "4mm Coroplast or 3mm Aluminium Composite"},
      {"k": "Print", "v": "Full colour CMYK, double sided"},
      {"k": "Weatherproof", "v": "Yes — UV-resistant, waterproof"},
      {"k": "Mounting", "v": "H-stakes (coroplast) or post-mounted (ACM)"},
      {"k": "Turnaround", "v": "2–3 business days (rush available)"}
    ]
  },
  {
    "id": "realtor-riders",
    "cat": "real-estate",
    "name": "Realtor Riders",
    "badge": null,
    "imgs": [],
    "desc": "Realtor rider signs for listing additions — Open House, Sold, Price Reduced, Virtual Tour — attaches above or below main sign.", "long_desc": "Rider signs are narrow supplementary panels that attach above or below the main for-sale sign. Common riders include Open House, Sold, New Price, Virtual Tour, Conditional, and agent team names. Printed on coroplast with grommets for easy attachment to existing sign frames.",
    "opts": [
      {
        "key": "sides",
        "label": "Sides",
        "opts": [
          {
            "id": "ss",
            "l": "Single Sided",
            "m": 1
          },
          {
            "id": "ds",
            "l": "Double Sided",
            "m": 1.45
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 19.2
      },
      {
        "q": 5,
        "p": 70.4
      },
      {
        "q": 10,
        "p": 121.6
      },
      {
        "q": 25,
        "p": 249.6
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "6×24″ or 6×18″"},
      {"k": "Material", "v": "4mm Coroplast"},
      {"k": "Print", "v": "Full colour CMYK, double sided"},
      {"k": "Attachment", "v": "Grommets for zip-tie attachment to sign frame"},
      {"k": "Common Types", "v": "Open House, Sold, New Price, Virtual Tour"},
      {"k": "Weatherproof", "v": "Yes"},
      {"k": "Turnaround", "v": "2–3 business days (rush available)"}
    ]
  },
  {
    "id": "open-house-boards",
    "cat": "real-estate",
    "name": "Open House A-Frame Boards",
    "badge": null,
    "imgs": [],
    "desc": "Open house A-frame sandwich boards — directional sidewalk signs that guide buyers from the street to your listing.", "long_desc": "Open house A-frame boards are portable, double-sided sandwich boards placed on sidewalks and intersections to direct buyers to your open house. Printed inserts slide into a waterproof plastic or aluminium A-frame stand. Available with blank arrows for handwriting the address, or fully custom printed.",
    "opts": [
      {
        "key": "size",
        "label": "Panel Size",
        "opts": [
          {
            "id": "18x24",
            "l": "18\"×24\" panels",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\" panels",
            "m": 1.55
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 83.2
      },
      {
        "q": 3,
        "p": 211.2
      },
      {
        "q": 5,
        "p": 320
      },
      {
        "q": 10,
        "p": 576
      }
    ]
  ,
    "specs": [
      {"k": "Insert Size", "v": "18×24″ (fits standard A-frame stands)"},
      {"k": "Material", "v": "Coroplast insert or foam board (indoor)"},
      {"k": "Print", "v": "Full colour CMYK, double sided"},
      {"k": "Frame", "v": "A-frame stand sold separately or as a package"},
      {"k": "Weatherproof", "v": "Yes (coroplast insert)"},
      {"k": "Turnaround", "v": "2–3 business days (rush available)"}
    ]
  },
  {
    "id": "poster-calendars",
    "cat": "calendars",
    "name": "Poster Calendars",
    "badge": null,
    "imgs": [],
    "desc": "Full-colour wall poster calendars with your brand — a year-round marketing tool that keeps your business top of mind every day.", "long_desc": "Poster calendars are the most effective long-term promotional marketing tool available. Hung on a wall, your brand is seen every single day for an entire year — an average of 365 impressions per calendar. Our poster calendars feature a large photo or graphic at the top and a monthly grid below, printed on heavy gloss paper.",
    "opts": [
      {
        "key": "size",
        "label": "Calendar Size",
        "opts": [
          {
            "id": "ltr",
            "l": "8.5\"×11\"",
            "m": 0.85
          },
          {
            "id": "tbl",
            "l": "11\"×17\" Standard",
            "m": 1
          },
          {
            "id": "lg",
            "l": "12\"×24\" Large",
            "m": 1.55
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 37.54
      },
      {
        "q": 6,
        "p": 38.08
      },
      {
        "q": 11,
        "p": 66.15
      },
      {
        "q": 20,
        "p": 167.94
      },
      {
        "q": 50,
        "p": 234.82
      },
      {
        "q": 100,
        "p": 359.41
      },
      {
        "q": 200,
        "p": 1360
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "11×17″ or 13×19″"},
      {"k": "Stock", "v": "100lb Gloss Text"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Format", "v": "Single-page annual or monthly tear-off"},
      {"k": "Hanging", "v": "Punched hole at top"},
      {"k": "Years", "v": "2025 and 2026 grids available"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "tent-calendar",
    "cat": "calendars",
    "name": "Tent Desk Calendars",
    "badge": null,
    "imgs": [],
    "desc": "Desktop tent calendars for offices and desks — a practical promotional item that keeps your brand visible all year long.", "long_desc": "Tent desk calendars sit on a desk or counter and display the current month at eye level. A freestanding folded format ensures they stay visible without a stand. Popular as corporate gifts, promotional items for banks, insurance companies, and service businesses. Each month is a separate panel, tear-off style.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 1
          },
          {
            "id": "5x7",
            "l": "5\"×7\"",
            "m": 1.35
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 50,
        "p": 241.54
      },
      {
        "q": 75,
        "p": 322.05
      },
      {
        "q": 100,
        "p": 382.44
      },
      {
        "q": 250,
        "p": 448.81
      },
      {
        "q": 500,
        "p": 664.23
      },
      {
        "q": 750,
        "p": 826.34
      },
      {
        "q": 1000,
        "p": 1062.44
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "4×6″ folded (3×4″ standing footprint)"},
      {"k": "Stock", "v": "14pt C2S Coated"},
      {"k": "Finish", "v": "Gloss UV"},
      {"k": "Pages", "v": "12 monthly panels + cover"},
      {"k": "Binding", "v": "Saddle-stitch or wire-o spiral"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "magnetic-calendars",
    "cat": "calendars",
    "name": "Magnetic Calendars",
    "badge": null,
    "imgs": [],
    "desc": "Magnetic calendar cards that stick to fridges and filing cabinets — a year-round reminder of your business on every fridge in town.", "long_desc": "Magnetic calendars combine the branding power of a calendar with the staying power of a fridge magnet. Stuck to a customer’s refrigerator, your brand is seen every single day by the whole household. A staple promotional item for realtors, insurance agents, mechanics, dentists, and any business wanting maximum residential visibility.",
    "opts": [
      {
        "key": "size",
        "label": "Calendar Size",
        "opts": [
          {
            "id": "4x6",
            "l": "4\"×6\"",
            "m": 1
          },
          {
            "id": "5.5x8.5",
            "l": "5.5\"×8.5\"",
            "m": 1.4
          },
          {
            "id": "8x11",
            "l": "8\"×11\"",
            "m": 1.85
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 25,
        "p": 100.65
      },
      {
        "q": 50,
        "p": 130.83
      },
      {
        "q": 100,
        "p": 221.41
      },
      {
        "q": 250,
        "p": 412.9
      },
      {
        "q": 500,
        "p": 649.27
      },
      {
        "q": 1000,
        "p": 1072.77
      },
      {
        "q": 2000,
        "p": 1938.82
      }
    ]
  ,
    "specs": [
      {"k": "Standard Size", "v": "3.5×7″, 4×7″, or 4×8.5″"},
      {"k": "Material", "v": "14pt card stock with flexible magnetic backing"},
      {"k": "Print", "v": "Full colour CMYK, front only"},
      {"k": "Back", "v": "Magnetic"},
      {"k": "Calendar Format", "v": "Annual one-page or 12-month grid"},
      {"k": "Years", "v": "2025 and 2026 available"},
      {"k": "Turnaround", "v": "7–10 business days standard"}
    ]
  },
  {
    "id": "paper-posters",
    "cat": "posters-canvas",
    "name": "Paper Posters (Wide Format)",
    "badge": "Custom Sizes",
    "imgs": [],
    "desc": "Wide-format paper posters up to 60″ wide — vivid colour reproduction for art prints, advertising, and large-format displays.", "long_desc": "Wide-format paper posters use high-resolution inkjet printing on premium satin or gloss photo paper, delivering exceptional colour accuracy and detail. Available in any size up to 60″ wide and any length. Suitable for gallery art prints, retail displays, trade show graphics, and large advertising posters.",
    "opts": [
      {
        "key": "size",
        "label": "Poster Size",
        "opts": [
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1,
            "sqft": 3
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.65,
            "sqft": 6
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 2.8,
            "sqft": 12
          },
          {
            "id": "48x72",
            "l": "48\"×72\"",
            "m": 4.5,
            "sqft": 24
          },
          {
            "id": "custom",
            "l": "Custom Size",
            "m": 0
          }
        ]
      },
      {
        "key": "finish",
        "label": "Paper / Finish",
        "opts": [
          {
            "id": "gloss",
            "l": "Gloss (Vivid Colours)",
            "m": 1
          },
          {
            "id": "matte",
            "l": "Matte (No Glare)",
            "m": 1.08
          },
          {
            "id": "satin",
            "l": "Satin / Semi-Gloss",
            "m": 1.05
          }
        ]
      }
    ],
    "sqft": {
      "enabled": true,
      "rate": 3.5,
      "min": 3
    },
    "pricing": [
      {
        "q": 1,
        "p": 12.25
      },
      {
        "q": 5,
        "p": 48
      },
      {
        "q": 10,
        "p": 84
      },
      {
        "q": 25,
        "p": 180
      },
      {
        "q": 50,
        "p": 315
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Premium satin or gloss photo paper"},
      {"k": "Max Width", "v": "60″ wide — any length"},
      {"k": "Print", "v": "Full colour, high-resolution inkjet"},
      {"k": "Resolution", "v": "Submit files at 150dpi at final size (minimum)"},
      {"k": "Finish", "v": "Satin (standard) or gloss"},
      {"k": "Use", "v": "Indoor only"},
      {"k": "Turnaround", "v": "3–5 business days standard"}
    ]
  },
  {
    "id": "window-clings",
    "cat": "posters-canvas",
    "name": "Window Clings",
    "badge": null,
    "imgs": [],
    "desc": "Static cling window decals that stick without adhesive — removable, reusable, and perfect for seasonal promotions.", "long_desc": "Window clings use a static electric charge to adhere to smooth glass surfaces without any adhesive. They can be removed and repositioned multiple times without leaving residue, making them ideal for seasonal promotions, sale announcements, and event marketing. Applied to the interior surface of a window for protection.",
    "opts": [
      {
        "key": "size",
        "label": "Size",
        "opts": [
          {
            "id": "12x12",
            "l": "12\"×12\"",
            "m": 0.6
          },
          {
            "id": "18x24",
            "l": "18\"×24\"",
            "m": 1
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 1.8
          },
          {
            "id": "36x48",
            "l": "36\"×48\"",
            "m": 3.2
          },
          {
            "id": "48x96",
            "l": "48\"×96\"",
            "m": 5.5
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 28
      },
      {
        "q": 5,
        "p": 110
      },
      {
        "q": 10,
        "p": 195
      },
      {
        "q": 25,
        "p": 420
      },
      {
        "q": 50,
        "p": 750
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Static cling vinyl — no adhesive"},
      {"k": "Print", "v": "Full colour CMYK"},
      {"k": "Application", "v": "Interior glass surface (applied from inside)"},
      {"k": "Reusable", "v": "Yes — remove and reapply multiple times"},
      {"k": "Residue", "v": "None — leaves glass clean"},
      {"k": "Sizes", "v": "Custom — any size"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  },
  {
    "id": "canvas-roll",
    "cat": "posters-canvas",
    "name": "Canvas Prints",
    "badge": null,
    "imgs": [],
    "desc": "Custom canvas prints for home, office, and commercial décor — rich colour and texture on archival-grade canvas.", "long_desc": "Canvas prints are produced using high-resolution dye or pigment inkjet printing on fine art canvas material. The result is a textured, gallery-quality print that adds warmth and character to any space. Available as rolled canvas (unframed) or stretched over wooden frames (gallery wrap). Suitable for photography, art reproduction, and branded décor.",
    "opts": [
      {
        "key": "size",
        "label": "Canvas Size",
        "opts": [
          {
            "id": "12x16",
            "l": "12\"×16\"",
            "m": 1
          },
          {
            "id": "16x20",
            "l": "16\"×20\"",
            "m": 1.45
          },
          {
            "id": "20x24",
            "l": "20\"×24\"",
            "m": 1.9
          },
          {
            "id": "24x36",
            "l": "24\"×36\"",
            "m": 2.8
          }
        ]
      },
      {
        "key": "frame",
        "label": "Frame Style",
        "opts": [
          {
            "id": "rolled",
            "l": "Rolled (No Frame)",
            "m": 1
          },
          {
            "id": "gallery",
            "l": "Gallery Wrap 1.5\"",
            "m": 1.35
          },
          {
            "id": "float",
            "l": "Floating Frame",
            "m": 1.55
          }
        ]
      }
    ],
    "pricing": [
      {
        "q": 1,
        "p": 864
      },
      {
        "q": 3,
        "p": 2809.6
      },
      {
        "q": 4,
        "p": 2011.52
      },
      {
        "q": 5,
        "p": 5580.8
      },
      {
        "q": 8,
        "p": 3417.6
      },
      {
        "q": 13,
        "p": 5657.6
      }
    ]
  ,
    "specs": [
      {"k": "Material", "v": "Archival poly-cotton canvas"},
      {"k": "Print", "v": "High-resolution pigment inkjet, full colour"},
      {"k": "Sizes", "v": "Custom — any size up to 60″ wide"},
      {"k": "Format", "v": "Rolled (unframed) or stretched gallery wrap"},
      {"k": "Finish", "v": "Satin coating standard"},
      {"k": "Archival Life", "v": "100+ years under standard conditions"},
      {"k": "Turnaround", "v": "5–7 business days standard"}
    ]
  }
];

export const DEFAULT_STORE = {
  name: 'NEXA CUSTOMS',
  tagline: 'Print · Signs · Graphics',
  logo_text: 'N',
  logo_img: '',
  hero1: 'Print That Makes',
  hero_accent: 'Your Brand',
  hero2: 'Impossible To Ignore',
  hero_badge: "Mississauga's Print Experts Since 2010",
  hero_sub: 'From business cards to vehicle wraps — full-colour print, signs, and graphics for businesses across Ontario.',
  phone: '(437) 997-9921',
  phone_raw: '14379979921',
  email: 'info@nexacustoms.ca',
  address: '6033 Shawson Dr, Unit 40',
  city: 'Mississauga, ON L5T 1J6',
  hours: 'Mon–Fri: 9:00 AM – 6:00 PM\nSat: By Appointment\nSun: Closed',
  social_ig: 'https://instagram.com/nexacustoms',
  social_fb: 'https://facebook.com/nexacustoms',
  social_wa: '14379979921',
  footer_copy: '© 2025 Nexa Customs Inc. All rights reserved.',
  favicon: '🖨',
};

export const DEFAULT_PRICING = {
  hst: 0.13,
  shipping_post: 18.00,
  shipping_courier: 45.00,
  rush_pct: 0.25,
  express_pct: 0.50,
};
