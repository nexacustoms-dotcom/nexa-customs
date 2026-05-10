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
    "desc": "Professional 3.5\"×2\" cards at an unbeatable price. Choose paper, coating, and finish.",
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
  },
  {
    "id": "most-popular-business-cards",
    "cat": "business-cards",
    "name": "Most Popular Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Our most-ordered card — crisp, vibrant, professional. 16pt with your choice of coating.",
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
  },
  {
    "id": "matte-business-cards",
    "cat": "business-cards",
    "name": "Matte Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Elegant non-reflective matte finish — a sophisticated, modern choice.",
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
  },
  {
    "id": "glossy-business-cards",
    "cat": "business-cards",
    "name": "Glossy Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "High-gloss UV coating for vivid colours and a standout look.",
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
  },
  {
    "id": "uncoated-business-cards",
    "cat": "business-cards",
    "name": "Uncoated Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Natural writable uncoated stock. Write on them, stamp them.",
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
  },
  {
    "id": "thicker-business-cards-18pt",
    "cat": "business-cards",
    "name": "Thicker Business Cards (18pt)",
    "badge": null,
    "imgs": [],
    "desc": "18pt extra-thick stock — feels substantial, commands attention.",
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
  },
  {
    "id": "folded-business-cards",
    "cat": "business-cards",
    "name": "Folded Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Opens to 3.5\"×4\" — show pricing, services, or a bold design inside.",
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
  },
  {
    "id": "matte-laminated-business-cards",
    "cat": "business-cards",
    "name": "Matte Laminated Business Cards",
    "badge": "Premium",
    "imgs": [],
    "desc": "Silky-smooth matte lamination — luxurious feel, lasting impression.",
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
  },
  {
    "id": "suede-soft-touch-business-cards",
    "cat": "business-cards",
    "name": "Suede Soft Touch Business Cards",
    "badge": "Premium",
    "imgs": [],
    "desc": "Velvety soft-touch coating — the most tactile card you can hand someone.",
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
  },
  {
    "id": "embossed-spot-uv-19pt",
    "cat": "business-cards",
    "name": "Embossed Spot UV (19PT)",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "Raised embossed texture with spot UV highlights — elements literally pop.",
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
  },
  {
    "id": "embossed-spot-uv-27pt",
    "cat": "business-cards",
    "name": "Embossed Spot UV (27PT)",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "Ultra-thick 27pt with embossed texture and spot UV — our most premium card.",
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
  },
  {
    "id": "metallic-foil-business-cards",
    "cat": "business-cards",
    "name": "Metallic Foil Business Cards",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "Gold, silver, or copper foil stamping — maximum visual impact.",
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
  },
  {
    "id": "painted-edge-32pt",
    "cat": "business-cards",
    "name": "Painted Edge Cards (32PT)",
    "badge": "Deluxe",
    "imgs": [],
    "desc": "32pt ultra-thick with hand-painted coloured edges — unforgettable.",
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
  },
  {
    "id": "magnetic-business-cards",
    "cat": "business-cards",
    "name": "Magnetic Business Cards",
    "badge": null,
    "imgs": [],
    "desc": "Full-colour magnets that stay on the fridge for years.",
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
  },
  {
    "id": "coupon-card",
    "cat": "business-cards",
    "name": "Coupon Cards",
    "badge": null,
    "imgs": [],
    "desc": "Perforated coupon cards for promotions, loyalty programs, and special offers.",
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
  },
  {
    "id": "scratch-cards",
    "cat": "business-cards",
    "name": "Scratch Cards",
    "badge": null,
    "imgs": [],
    "desc": "Custom scratch-and-win cards — great for promotions and events.",
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
  },
  {
    "id": "flyers",
    "cat": "flyers-postcards",
    "name": "Flyers",
    "badge": "Best Seller",
    "imgs": [],
    "desc": "Full-colour flyers in 5 sizes for promotions, events, and campaigns.",
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
  },
  {
    "id": "postcards",
    "cat": "flyers-postcards",
    "name": "Postcards",
    "badge": null,
    "imgs": [],
    "desc": "Durable full-colour postcards for mailers and direct marketing.",
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
  },
  {
    "id": "brochures",
    "cat": "flyers-postcards",
    "name": "Brochures",
    "badge": "10% OFF",
    "imgs": [],
    "desc": "Professionally folded brochures — five fold styles available.",
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
  },
  {
    "id": "door-hangers",
    "cat": "flyers-postcards",
    "name": "Door Hangers",
    "badge": "30% OFF",
    "imgs": [],
    "desc": "4.25\"×11\" die-cut door hangers — the most effective local marketing tool.",
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
  },
  {
    "id": "retractable-banners",
    "cat": "signs-banners",
    "name": "Retractable Banners",
    "badge": null,
    "imgs": [],
    "desc": "Professional pull-up banners for trade shows and events. Stand included.",
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
  },
  {
    "id": "x-frame-signs",
    "cat": "signs-banners",
    "name": "X-Frame Banner Stands",
    "badge": null,
    "imgs": [],
    "desc": "Lightweight X-frame stands — easy to set up, transport, and store.",
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
  },
  {
    "id": "hanging-banners",
    "cat": "signs-banners",
    "name": "Hanging Banners",
    "badge": null,
    "imgs": [],
    "desc": "Full-colour hanging banners for trade shows, retail, and indoor displays.",
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
  },
  {
    "id": "feather-flags",
    "cat": "signs-banners",
    "name": "Feather Flags",
    "badge": null,
    "imgs": [],
    "desc": "Eye-catching feather flags for outdoor events and storefronts. Base included.",
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
  },
  {
    "id": "vinyl-banners",
    "cat": "signs-banners",
    "name": "Vinyl Banners",
    "badge": "Most Popular",
    "imgs": [],
    "desc": "Custom vinyl banners for indoor and outdoor use. Choose a standard size or enter custom dimensions. Priced per square foot.",
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
  },
  {
    "id": "lawn-signs",
    "cat": "signs-banners",
    "name": "Lawn Signs (Coroplast)",
    "badge": "25% OFF",
    "imgs": [],
    "desc": "Durable corrugated plastic yard signs — weather-resistant all year.",
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
  },
  {
    "id": "custom-coroplast-sign",
    "cat": "signs-banners",
    "name": "Custom Coroplast Signs",
    "badge": null,
    "imgs": [],
    "desc": "Versatile corrugated plastic signs for any indoor or outdoor application.",
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
  },
  {
    "id": "adhesive-vinyl-sign",
    "cat": "signs-banners",
    "name": "Adhesive Vinyl Signs & Graphics",
    "badge": null,
    "imgs": [],
    "desc": "Durable adhesive vinyl for windows, walls, floors, and equipment. Priced per square foot.",
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
  },
  {
    "id": "vinyl-window-graphics",
    "cat": "signs-banners",
    "name": "Vinyl Window Graphics",
    "badge": null,
    "imgs": [],
    "desc": "High-clarity vinyl graphics for storefronts and windows. Priced per square foot.",
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
  },
  {
    "id": "see-through-perforated-sign",
    "cat": "signs-banners",
    "name": "See-Through Perforated Vinyl",
    "badge": null,
    "imgs": [],
    "desc": "One-way vision perforated vinyl for windows. See-through from inside. Priced per square foot.",
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
  },
  {
    "id": "backlit-translucent-vinyl",
    "cat": "signs-banners",
    "name": "Backlit Translucent Vinyl",
    "badge": null,
    "imgs": [],
    "desc": "Translucent vinyl for illuminated signs and lightboxes. Priced per square foot.",
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
  },
  {
    "id": "full-colour-vinyl-decals",
    "cat": "signs-banners",
    "name": "Full Colour Vinyl Decals",
    "badge": null,
    "imgs": [],
    "desc": "Full colour printed vinyl decals for any surface. Priced per square foot.",
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
  },
  {
    "id": "indoor-wallpaper",
    "cat": "signs-banners",
    "name": "Indoor Wallpaper & Murals",
    "badge": null,
    "imgs": [],
    "desc": "Custom printed wallpaper murals for offices, lobbies, and retail spaces. Priced per square foot.",
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
  },
  {
    "id": "polybag-signs",
    "cat": "signs-banners",
    "name": "Polybag Signs",
    "badge": null,
    "imgs": [],
    "desc": "Coroplast signs with polybag sleeve for real estate and outdoor pole advertising.",
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
  },
  {
    "id": "pole-rigid-sign",
    "cat": "signs-banners",
    "name": "Pole Rigid Signs",
    "badge": null,
    "imgs": [],
    "desc": "Rigid signs for outdoor advertising poles. Durable aluminium or coroplast.",
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
  },
  {
    "id": "pole-vinyl-sticker",
    "cat": "signs-banners",
    "name": "Pole Vinyl Stickers",
    "badge": null,
    "imgs": [],
    "desc": "Outdoor-rated pole vinyl stickers for signposts and traffic equipment.",
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
  },
  {
    "id": "20pt-styrene",
    "cat": "signs-banners",
    "name": "20pt Styrene Signs",
    "badge": null,
    "imgs": [],
    "desc": "Rigid styrene signs for indoor displays, retail, and POP advertising.",
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
  },
  {
    "id": "vehicle-full-wrap",
    "cat": "vehicle-graphics",
    "name": "Vehicle Full Wrap",
    "badge": "Premium",
    "imgs": [],
    "desc": "Full vehicle wrap — car, truck, or van. Cast vinyl, 7-year outdoor rating.",
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
  },
  {
    "id": "vehicle-partial-wrap",
    "cat": "vehicle-graphics",
    "name": "Vehicle Partial Wrap",
    "badge": null,
    "imgs": [],
    "desc": "Cover the rear, doors, or hood. High-impact branding at fraction of full wrap cost.",
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
  },
  {
    "id": "vehicle-lettering",
    "cat": "vehicle-graphics",
    "name": "Vehicle Lettering & Decals",
    "badge": null,
    "imgs": [],
    "desc": "Cut vinyl lettering for vehicles — business name, phone, website.",
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
  },
  {
    "id": "vinyl-window-graphics-vehicle",
    "cat": "vehicle-graphics",
    "name": "Vehicle Window Graphics",
    "badge": null,
    "imgs": [],
    "desc": "Full-colour or see-through perforated vinyl for vehicle windows.",
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
  },
  {
    "id": "magnetic-vehicle-signs",
    "cat": "vehicle-graphics",
    "name": "Magnetic Vehicle Signs",
    "badge": null,
    "imgs": [],
    "desc": "Full-colour magnetic signs for car doors — removable, no damage.",
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
  },
  {
    "id": "fleet-graphics",
    "cat": "vehicle-graphics",
    "name": "Fleet Graphics",
    "badge": "Best Value",
    "imgs": [],
    "desc": "Consistent branding across your entire fleet — volume pricing for 3+ vehicles.",
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
  },
  {
    "id": "booklets",
    "cat": "marketing",
    "name": "Booklets",
    "badge": null,
    "imgs": [],
    "desc": "Saddle-stitched booklets for catalogues, programs, and product guides.",
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
  },
  {
    "id": "presentation-folders",
    "cat": "marketing",
    "name": "Presentation Folders",
    "badge": null,
    "imgs": [],
    "desc": "Professional 9\"×12\" folders with pockets and business card slots.",
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
  },
  {
    "id": "event-posters",
    "cat": "marketing",
    "name": "Event Posters",
    "badge": null,
    "imgs": [],
    "desc": "High-impact event posters printed on premium paper stock. Available in standard sizes or custom dimensions.",
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
  },
  {
    "id": "bookmarks",
    "cat": "marketing",
    "name": "Bookmarks",
    "badge": null,
    "imgs": [],
    "desc": "Custom printed bookmarks — great for events and brand giveaways.",
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
  },
  {
    "id": "thank-you-card",
    "cat": "marketing",
    "name": "Thank You Cards",
    "badge": null,
    "imgs": [],
    "desc": "Branded thank you cards — the finishing touch that keeps clients coming back.",
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
  },
  {
    "id": "plastic-cards",
    "cat": "marketing",
    "name": "Plastic Cards (PVC)",
    "badge": null,
    "imgs": [],
    "desc": "Durable 30mil PVC cards for loyalty programs, gift cards, and memberships.",
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
  },
  {
    "id": "digital-sheets",
    "cat": "marketing",
    "name": "Digital Sheets",
    "badge": null,
    "imgs": [],
    "desc": "Single-sheet digital prints for proofing, samples, and short-run projects.",
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
  },
  {
    "id": "letterheads",
    "cat": "stationery",
    "name": "Letterheads",
    "badge": null,
    "imgs": [],
    "desc": "Professional branded letterheads — makes every letter look polished.",
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
  },
  {
    "id": "envelopes",
    "cat": "stationery",
    "name": "Envelopes",
    "badge": null,
    "imgs": [],
    "desc": "Custom printed envelopes in multiple sizes — window and non-window options.",
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
  },
  {
    "id": "notepads",
    "cat": "stationery",
    "name": "Notepads",
    "badge": "20% OFF",
    "imgs": [],
    "desc": "Custom branded notepads with cardboard backing.",
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
  },
  {
    "id": "ncr-forms",
    "cat": "stationery",
    "name": "NCR Carbonless Forms",
    "badge": null,
    "imgs": [],
    "desc": "Multi-part carbonless forms for invoices, work orders, and delivery slips.",
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
  },
  {
    "id": "tent-cards",
    "cat": "restaurant",
    "name": "Tent Cards",
    "badge": null,
    "imgs": [],
    "desc": "Table tent cards for menus, promotions, and event displays.",
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
  },
  {
    "id": "restaurant-laminated-menu",
    "cat": "restaurant",
    "name": "Laminated Menus",
    "badge": null,
    "imgs": [],
    "desc": "Durable laminated menus that wipe clean — essential for every restaurant.",
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
  },
  {
    "id": "restaurant-table-tent-menu",
    "cat": "restaurant",
    "name": "Table Tent Menus",
    "badge": null,
    "imgs": [],
    "desc": "Compact table tent menus for featuring daily specials and promotions.",
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
  },
  {
    "id": "leather-booklet-menu",
    "cat": "restaurant",
    "name": "Leather Booklet Menus",
    "badge": "Premium",
    "imgs": [],
    "desc": "Premium leather-look booklet menus for upscale restaurants and bars.",
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
  },
  {
    "id": "restaurant-check-holder",
    "cat": "restaurant",
    "name": "Restaurant Check Holders",
    "badge": null,
    "imgs": [],
    "desc": "Branded bill presenters and check holders — professional table presentation.",
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
  },
  {
    "id": "wedding-signs",
    "cat": "foam-boards",
    "name": "Wedding Signs",
    "badge": null,
    "imgs": [],
    "desc": "Foam board signs for weddings — welcome boards, seating charts, menus.",
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
  },
  {
    "id": "baby-shower-signs",
    "cat": "foam-boards",
    "name": "Baby Shower Signs",
    "badge": null,
    "imgs": [],
    "desc": "Adorable foam board signs for baby showers and gender reveals.",
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
  },
  {
    "id": "seating-chart-signs",
    "cat": "foam-boards",
    "name": "Seating Chart Signs",
    "badge": null,
    "imgs": [],
    "desc": "Large foam board seating charts for weddings and events.",
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
  },
  {
    "id": "event-directional-signs",
    "cat": "foam-boards",
    "name": "Event Directional Signs",
    "badge": null,
    "imgs": [],
    "desc": "Foam board directional signs for events — guide your guests effortlessly.",
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
  },
  {
    "id": "custom-foam-board",
    "cat": "foam-boards",
    "name": "Custom Foam Board",
    "badge": null,
    "imgs": [],
    "desc": "Lightweight foam board for events, retail displays, and interior signage.",
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
  },
  {
    "id": "giant-cheques",
    "cat": "foam-boards",
    "name": "Giant Cheques",
    "badge": null,
    "imgs": [],
    "desc": "Oversized ceremonial foam board cheques for donations and prize events.",
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
  },
  {
    "id": "google-review-sticker",
    "cat": "labels-stickers",
    "name": "Google Review Sticker",
    "badge": "Popular",
    "imgs": [],
    "desc": "NFC + QR stickers — tap or scan to leave a 5-star review instantly.",
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
  },
  {
    "id": "sheet-stickers",
    "cat": "labels-stickers",
    "name": "Sheet Stickers",
    "badge": "30% OFF",
    "imgs": [],
    "desc": "Kiss-cut or die-cut stickers on full sheets — gloss, matte, or holographic.",
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
  },
  {
    "id": "roll-labels",
    "cat": "labels-stickers",
    "name": "Roll Labels (Paper)",
    "badge": null,
    "imgs": [],
    "desc": "Cost-effective paper roll labels for products, packaging, and shipping.",
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
  },
  {
    "id": "vinyl-roll-labels",
    "cat": "labels-stickers",
    "name": "Vinyl Roll Labels (Waterproof)",
    "badge": null,
    "imgs": [],
    "desc": "Waterproof vinyl labels for product packaging, food containers, and outdoor use.",
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
  },
  {
    "id": "clear-labels",
    "cat": "labels-stickers",
    "name": "Clear / Transparent Labels",
    "badge": null,
    "imgs": [],
    "desc": "Crystal clear BOPP labels for a seamless no-label look on bottles and jars.",
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
  },
  {
    "id": "feature-sheets",
    "cat": "real-estate",
    "name": "Feature Sheets",
    "badge": null,
    "imgs": [],
    "desc": "Property feature sheets for open houses — full-colour professional quality.",
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
  },
  {
    "id": "for-sale-sold-signs",
    "cat": "real-estate",
    "name": "For Sale / Sold Signs",
    "badge": null,
    "imgs": [],
    "desc": "18×24\" coroplast signs for real estate — single or double sided, full colour.",
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
  },
  {
    "id": "realtor-riders",
    "cat": "real-estate",
    "name": "Realtor Riders",
    "badge": null,
    "imgs": [],
    "desc": "6×24\" rider signs for posts — Open House, Price Reduced, Sold, custom text.",
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
  },
  {
    "id": "open-house-boards",
    "cat": "real-estate",
    "name": "Open House A-Frame Boards",
    "badge": null,
    "imgs": [],
    "desc": "Double-sided A-frame boards for open houses — bright full-colour coroplast.",
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
  },
  {
    "id": "poster-calendars",
    "cat": "calendars",
    "name": "Poster Calendars",
    "badge": null,
    "imgs": [],
    "desc": "Full-colour 12-month wall calendars — the branded giveaway that lasts all year.",
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
  },
  {
    "id": "tent-calendar",
    "cat": "calendars",
    "name": "Tent Desk Calendars",
    "badge": null,
    "imgs": [],
    "desc": "Compact tent-style desk calendars for reception areas and client gifts.",
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
  },
  {
    "id": "magnetic-calendars",
    "cat": "calendars",
    "name": "Magnetic Calendars",
    "badge": null,
    "imgs": [],
    "desc": "12-month magnetic calendars — the giveaway that never gets thrown away.",
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
  },
  {
    "id": "paper-posters",
    "cat": "posters-canvas",
    "name": "Paper Posters (Wide Format)",
    "badge": "Custom Sizes",
    "imgs": [],
    "desc": "Large format paper posters on premium gloss or matte stock. Perfect for events, retail, and promotions. Choose a standard size or enter custom dimensions.",
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
  },
  {
    "id": "window-clings",
    "cat": "posters-canvas",
    "name": "Window Clings",
    "badge": null,
    "imgs": [],
    "desc": "Static cling window graphics — easy to apply and remove, no adhesive needed.",
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
  },
  {
    "id": "canvas-roll",
    "cat": "posters-canvas",
    "name": "Canvas Prints",
    "badge": null,
    "imgs": [],
    "desc": "Premium canvas prints for art, photography, and decorative display.",
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
