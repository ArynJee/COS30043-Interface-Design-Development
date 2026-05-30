// ─────────────────────────────────────────────────────────────────────────────
// 10 skeleton types  →  18 furniture types
// ─────────────────────────────────────────────────────────────────────────────
export const SKELETON = {
  SHELF_UNIT:          'shelf_unit',          // Bookshelf, Study Shelf, Bathroom Shelf
  UPHOLSTERED_SEATING: 'upholstered_seating', // Sofa, Armchair
  TABLE:               'table',               // Coffee Table, Dining Table, Desk
  CABINET:             'cabinet',             // Kitchen Cabinet, Vanity Cabinet, Drawer Cabinet, Nightstand
  BED_FRAME:           'bed_frame',           // Bed Frame
  WARDROBE:            'wardrobe',            // Wardrobe
  COUNTER:             'counter',             // Kitchen Counter
  STOOL:               'stool',               // Bar Stool
  OFFICE_CHAIR:        'office_chair',        // Office Chair
  SINK:                'sink',                // Sink
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared option lists
// ─────────────────────────────────────────────────────────────────────────────
const WOOD_COLORS = [
  { id: 'natural_oak',   name: 'Natural Oak',   hex: '#C8A87A', price: 0   },
  { id: 'walnut',        name: 'Walnut Brown',  hex: '#6B4226', price: 50  },
  { id: 'white',         name: 'White',         hex: '#F5F0E8', price: 0   },
  { id: 'black',         name: 'Matte Black',   hex: '#1C1C1C', price: 30  },
  { id: 'light_grey',    name: 'Light Grey',    hex: '#C5C5C5', price: 0   },
  { id: 'dark_grey',     name: 'Slate Grey',    hex: '#5E6B77', price: 0   },
  { id: 'forest_green',  name: 'Forest Green',  hex: '#3A5C45', price: 50  },
  { id: 'navy',          name: 'Navy Blue',     hex: '#2C3E6B', price: 50  },
  { id: 'terracotta',    name: 'Terracotta',    hex: '#C07050', price: 50  },
]

const UPHOLSTERY_COLORS = [
  { id: 'warm_beige',    name: 'Warm Beige',    hex: '#D4B896', price: 0   },
  { id: 'cream',         name: 'Cream White',   hex: '#F5F0E8', price: 0   },
  { id: 'slate_grey',    name: 'Slate Grey',    hex: '#8B9CAF', price: 0   },
  { id: 'charcoal',      name: 'Charcoal',      hex: '#3D3D3D', price: 0   },
  { id: 'navy',          name: 'Navy Blue',     hex: '#2C3E6B', price: 50  },
  { id: 'forest_green',  name: 'Forest Green',  hex: '#3A5C45', price: 50  },
  { id: 'terracotta',    name: 'Terracotta',    hex: '#C07050', price: 50  },
  { id: 'blush_pink',    name: 'Blush Pink',    hex: '#E8C4B4', price: 30  },
  { id: 'mustard',       name: 'Mustard Yellow',hex: '#C4993A', price: 50  },
]

const STANDARD_FABRICS = [
  { id: 'cotton_linen',  name: 'Cotton Linen',  price: 0   },
  { id: 'velvet',        name: 'Velvet',        price: 200 },
  { id: 'leather',       name: 'Full Leather',  price: 500 },
  { id: 'faux_leather',  name: 'Faux Leather',  price: 150 },
  { id: 'chenille',      name: 'Chenille',      price: 180 },
]

const WOOD_MATERIALS = [
  { id: 'laminate',    name: 'Laminate Board', price: 0   },
  { id: 'mdf',         name: 'MDF',            price: 50  },
  { id: 'plywood',     name: 'Plywood',        price: 100 },
  { id: 'solid_wood',  name: 'Solid Wood',     price: 300 },
  { id: 'metal',       name: 'Metal Frame',    price: 200 },
]

const METAL_WOOD_COLORS = [
  { id: 'natural_oak', name: 'Natural Oak',  hex: '#C8A87A', price: 0  },
  { id: 'walnut',      name: 'Walnut',       hex: '#6B4226', price: 50 },
  { id: 'white',       name: 'White',        hex: '#F5F0E8', price: 0  },
  { id: 'black',       name: 'Matte Black',  hex: '#1C1C1C', price: 30 },
  { id: 'silver',      name: 'Silver',       hex: '#A8A8A8', price: 30 },
  { id: 'gold',        name: 'Gold Brushed', hex: '#C9A84C', price: 80 },
  { id: 'light_grey',  name: 'Light Grey',   hex: '#C5C5C5', price: 0  },
]

const LEG_STYLES = [
  { id: 'tapered_wood',   name: 'Tapered Wood',  price: 0  },
  { id: 'hairpin_metal',  name: 'Hairpin Metal', price: 50 },
  { id: 'pedestal',       name: 'Pedestal Base', price: 80 },
  { id: 'x_cross',        name: 'X-Cross Frame', price: 60 },
]

// ─────────────────────────────────────────────────────────────────────────────
// 18 furniture type definitions
// ─────────────────────────────────────────────────────────────────────────────
export const FURNITURE_TYPES = [

  // ── LIVING ROOM ─────────────────────────────────────────────────────────────
  {
    id: 'sofa',
    name: 'Sofa',
    area: 'Living Room',
    skeletonType: SKELETON.UPHOLSTERED_SEATING,
    basePrice: 1200,
    configs: {
      shape: [
        { id: '2_seater',  name: '2-Seater Straight', price: 0   },
        { id: '3_seater',  name: '3-Seater Straight', price: 200 },
        { id: 'l_shaped',  name: 'L-Shaped Sectional',price: 500 },
        { id: 'curved',    name: 'Curved Arc',         price: 350 },
      ],
      fabric: STANDARD_FABRICS,
      color:  UPHOLSTERY_COLORS,
      legs: [
        { id: 'tapered_wood',  name: 'Tapered Wood',   price: 0  },
        { id: 'low_metal',     name: 'Low Metal Block', price: 50 },
        { id: 'turned_wood',   name: 'Turned Wood',     price: 30 },
        { id: 'sled_metal',    name: 'Sled Metal',      price: 80 },
      ],
    },
  },

  {
    id: 'coffee_table',
    name: 'Coffee Table',
    area: 'Living Room',
    skeletonType: SKELETON.TABLE,
    basePrice: 450,
    configs: {
      shape: [
        { id: 'rect',       name: 'Rectangular',    price: 0  },
        { id: 'round',      name: 'Round',          price: 30 },
        { id: 'oval',       name: 'Oval',           price: 50 },
        { id: 'asymmetric', name: 'Asymmetric Live Edge', price: 150 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
      legs:     LEG_STYLES,
    },
  },

  {
    id: 'armchair',
    name: 'Armchair',
    area: 'Living Room',
    skeletonType: SKELETON.UPHOLSTERED_SEATING,
    basePrice: 700,
    configs: {
      shape: [
        { id: 'standard',   name: 'Standard',        price: 0   },
        { id: 'wing_back',  name: 'Wing Back',        price: 100 },
        { id: 'barrel',     name: 'Barrel Chair',     price: 80  },
        { id: 'accent',     name: 'Accent Chair',     price: 50  },
      ],
      fabric: STANDARD_FABRICS,
      color:  UPHOLSTERY_COLORS,
      legs: [
        { id: 'tapered_wood', name: 'Tapered Wood',   price: 0  },
        { id: 'turned_wood',  name: 'Turned Wood',    price: 30 },
        { id: 'metal_gold',   name: 'Gold Metal',     price: 80 },
        { id: 'metal_black',  name: 'Black Metal',    price: 50 },
      ],
    },
  },

  {
    id: 'bookshelf',
    name: 'Bookshelf',
    area: 'Living Room',
    skeletonType: SKELETON.SHELF_UNIT,
    basePrice: 380,
    configs: {
      shape: [
        { id: 'standard',   name: '4-Shelf Standard', price: 0   },
        { id: 'wide',       name: '6-Shelf Wide',      price: 150 },
        { id: 'narrow',     name: '3-Shelf Narrow',    price: -50 },
        { id: 'with_doors', name: 'With Cabinet Doors',price: 200 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
    },
  },

  // ── BEDROOM ─────────────────────────────────────────────────────────────────
  {
    id: 'bed_frame',
    name: 'Bed Frame',
    area: 'Bedroom',
    skeletonType: SKELETON.BED_FRAME,
    basePrice: 950,
    configs: {
      shape: [
        { id: 'single',  name: 'Single (100×200cm)',  price: 0   },
        { id: 'double',  name: 'Double (140×200cm)',  price: 200 },
        { id: 'queen',   name: 'Queen (160×200cm)',   price: 350 },
        { id: 'king',    name: 'King (180×200cm)',    price: 500 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
      headboard: [
        { id: 'panel',       name: 'Flat Panel',        price: 0   },
        { id: 'upholstered', name: 'Upholstered Padded',price: 300 },
        { id: 'slatted',     name: 'Slatted Wood',      price: 100 },
        { id: 'arched',      name: 'Arched Panel',      price: 150 },
      ],
    },
  },

  {
    id: 'wardrobe',
    name: 'Wardrobe',
    area: 'Bedroom',
    skeletonType: SKELETON.WARDROBE,
    basePrice: 1400,
    configs: {
      shape: [
        { id: '2_door_hinged',  name: '2-Door Hinged',   price: 0   },
        { id: '3_door_sliding', name: '3-Door Sliding',  price: 200 },
        { id: '4_door_hinged',  name: '4-Door Hinged',   price: 300 },
        { id: 'mirrored',       name: '3-Door Mirrored', price: 400 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
    },
  },

  {
    id: 'nightstand',
    name: 'Nightstand',
    area: 'Bedroom',
    skeletonType: SKELETON.CABINET,
    basePrice: 280,
    configs: {
      shape: [
        { id: '1_drawer',   name: '1 Drawer + Open Shelf', price: 0  },
        { id: '2_drawers',  name: '2 Drawers',             price: 50 },
        { id: 'open_shelf', name: 'Open Shelf Only',        price: -30},
        { id: 'floating',   name: 'Floating (Wall Mount)',  price: 80 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
    },
  },

  // ── KITCHEN ─────────────────────────────────────────────────────────────────
  {
    id: 'kitchen_counter',
    name: 'Kitchen Counter',
    area: 'Kitchen',
    skeletonType: SKELETON.COUNTER,
    basePrice: 1800,
    configs: {
      shape: [
        { id: 'straight',  name: 'Straight (1.8m)',   price: 0   },
        { id: 'l_shape',   name: 'L-Shape (2.4m)',    price: 500 },
        { id: 'u_shape',   name: 'U-Shape (3.6m)',    price: 900 },
        { id: 'island',    name: 'Kitchen Island',    price: 700 },
      ],
      countertop: [
        { id: 'laminate',  name: 'Laminate',          price: 0   },
        { id: 'ceramic',   name: 'Ceramic Tile',      price: 300 },
        { id: 'granite',   name: 'Granite',           price: 700 },
        { id: 'marble',    name: 'Marble',            price: 900 },
        { id: 'solid_wood',name: 'Solid Timber',      price: 500 },
      ],
      color: [
        { id: 'white',         name: 'White',         hex: '#F5F0E8', price: 0  },
        { id: 'light_grey',    name: 'Light Grey',    hex: '#C5C5C5', price: 0  },
        { id: 'natural_oak',   name: 'Natural Oak',   hex: '#C8A87A', price: 30 },
        { id: 'dark_grey',     name: 'Charcoal',      hex: '#3D3D3D', price: 0  },
        { id: 'navy',          name: 'Navy Blue',     hex: '#2C3E6B', price: 50 },
        { id: 'sage_green',    name: 'Sage Green',    hex: '#7A9E7E', price: 50 },
      ],
    },
  },

  {
    id: 'bar_stool',
    name: 'Bar Stool',
    area: 'Kitchen',
    skeletonType: SKELETON.STOOL,
    basePrice: 280,
    configs: {
      shape: [
        { id: 'round_backless',  name: 'Round Backless',    price: 0   },
        { id: 'round_backed',    name: 'Round With Back',   price: 50  },
        { id: 'square_backless', name: 'Square Backless',   price: 0   },
        { id: 'saddle',          name: 'Saddle Seat',       price: 80  },
      ],
      material: [
        { id: 'metal',      name: 'Metal Frame',    price: 0   },
        { id: 'solid_wood', name: 'Solid Wood',     price: 100 },
        { id: 'mdf',        name: 'MDF',            price: 30  },
      ],
      color: METAL_WOOD_COLORS,
      fabric: [
        { id: 'none',        name: 'No Cushion',    price: 0   },
        { id: 'cotton_linen',name: 'Cotton Linen',  price: 60  },
        { id: 'velvet',      name: 'Velvet',        price: 100 },
        { id: 'faux_leather',name: 'Faux Leather',  price: 80  },
      ],
    },
  },

  {
    id: 'dining_table',
    name: 'Dining Table',
    area: 'Kitchen',
    skeletonType: SKELETON.TABLE,
    basePrice: 950,
    configs: {
      shape: [
        { id: 'rect_4',  name: 'Rectangle 4-Seater',  price: 0   },
        { id: 'rect_6',  name: 'Rectangle 6-Seater',  price: 200 },
        { id: 'round_4', name: 'Round 4-Seater',       price: 50  },
        { id: 'oval_6',  name: 'Oval 6-Seater',        price: 250 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
      legs:     LEG_STYLES,
    },
  },

  {
    id: 'kitchen_cabinet',
    name: 'Kitchen Cabinet',
    area: 'Kitchen',
    skeletonType: SKELETON.CABINET,
    basePrice: 680,
    configs: {
      shape: [
        { id: 'base_2door',    name: 'Base 2-Door',       price: 0   },
        { id: 'base_4door',    name: 'Base 4-Door',       price: 200 },
        { id: 'wall_2door',    name: 'Wall-Mount 2-Door', price: 50  },
        { id: 'tall_pantry',   name: 'Tall Pantry',       price: 300 },
      ],
      material: WOOD_MATERIALS,
      color: [
        { id: 'white',       name: 'White',       hex: '#F5F0E8', price: 0  },
        { id: 'light_grey',  name: 'Light Grey',  hex: '#C5C5C5', price: 0  },
        { id: 'natural_oak', name: 'Natural Oak', hex: '#C8A87A', price: 30 },
        { id: 'walnut',      name: 'Walnut',      hex: '#6B4226', price: 50 },
        { id: 'black',       name: 'Matte Black', hex: '#1C1C1C', price: 30 },
        { id: 'sage',        name: 'Sage Green',  hex: '#7A9E7E', price: 50 },
      ],
    },
  },

  // ── BATHROOM ─────────────────────────────────────────────────────────────────
  {
    id: 'sink',
    name: 'Sink',
    area: 'Bathroom',
    skeletonType: SKELETON.SINK,
    basePrice: 480,
    configs: {
      shape: [
        { id: 'undermount_rect', name: 'Undermount Rectangle', price: 0   },
        { id: 'vessel_round',    name: 'Vessel Round',         price: 100 },
        { id: 'vessel_square',   name: 'Vessel Square',        price: 80  },
        { id: 'pedestal',        name: 'Pedestal / Freestand', price: 50  },
      ],
      material: [
        { id: 'ceramic',    name: 'Ceramic',        price: 0   },
        { id: 'stone',      name: 'Natural Stone',  price: 300 },
        { id: 'steel',      name: 'Stainless Steel',price: 150 },
        { id: 'glass',      name: 'Tempered Glass', price: 250 },
      ],
      color: [
        { id: 'white',      name: 'Pure White',     hex: '#FFFFFF', price: 0   },
        { id: 'off_white',  name: 'Off-White',      hex: '#F5F0E8', price: 0   },
        { id: 'light_grey', name: 'Light Grey',     hex: '#C5C5C5', price: 30  },
        { id: 'black',      name: 'Matte Black',    hex: '#1C1C1C', price: 80  },
        { id: 'terracotta', name: 'Terracotta',     hex: '#C07050', price: 100 },
      ],
    },
  },

  {
    id: 'bathroom_shelf',
    name: 'Bathroom Shelf',
    area: 'Bathroom',
    skeletonType: SKELETON.SHELF_UNIT,
    basePrice: 220,
    configs: {
      shape: [
        { id: 'standard',    name: '3-Shelf Standard',   price: 0  },
        { id: 'wide',        name: '4-Shelf Wide',        price: 80 },
        { id: 'narrow',      name: '2-Shelf Narrow',      price: -30},
        { id: 'with_doors',  name: '2-Shelf + Door',     price: 100},
      ],
      material: [
        { id: 'laminate',    name: 'Moisture-Res. Board', price: 0   },
        { id: 'solid_wood',  name: 'Teak Wood',           price: 200 },
        { id: 'metal',       name: 'Stainless Steel',     price: 150 },
        { id: 'mdf',         name: 'MDF',                 price: 30  },
      ],
      color: [
        { id: 'white',       name: 'White',       hex: '#F5F0E8', price: 0  },
        { id: 'light_grey',  name: 'Light Grey',  hex: '#C5C5C5', price: 0  },
        { id: 'natural_oak', name: 'Natural Oak', hex: '#C8A87A', price: 30 },
        { id: 'black',       name: 'Matte Black', hex: '#1C1C1C', price: 30 },
        { id: 'silver',      name: 'Silver',      hex: '#A8A8A8', price: 30 },
      ],
    },
  },

  {
    id: 'vanity_cabinet',
    name: 'Vanity Cabinet',
    area: 'Bathroom',
    skeletonType: SKELETON.CABINET,
    basePrice: 620,
    configs: {
      shape: [
        { id: 'single_door',  name: 'Single Door',        price: 0   },
        { id: 'double_door',  name: 'Double Door',        price: 100 },
        { id: 'with_mirror',  name: 'With Mirror Cabinet',price: 200 },
        { id: 'floating',     name: 'Floating Wall-Mount',price: 150 },
      ],
      material: [
        { id: 'laminate',   name: 'Moisture-Res. Board', price: 0   },
        { id: 'solid_wood', name: 'Teak Wood',           price: 250 },
        { id: 'mdf',        name: 'MDF',                 price: 30  },
      ],
      color: [
        { id: 'white',       name: 'White',       hex: '#F5F0E8', price: 0  },
        { id: 'light_grey',  name: 'Light Grey',  hex: '#C5C5C5', price: 0  },
        { id: 'natural_oak', name: 'Natural Oak', hex: '#C8A87A', price: 30 },
        { id: 'walnut',      name: 'Walnut',      hex: '#6B4226', price: 50 },
        { id: 'black',       name: 'Matte Black', hex: '#1C1C1C', price: 30 },
      ],
    },
  },

  // ── STUDY ROOM ─────────────────────────────────────────────────────────────
  {
    id: 'desk',
    name: 'Desk',
    area: 'Study Room',
    skeletonType: SKELETON.TABLE,
    basePrice: 580,
    configs: {
      shape: [
        { id: 'standard',   name: 'Standard Straight',    price: 0   },
        { id: 'l_shape',    name: 'L-Shape Corner Desk',  price: 300 },
        { id: 'standing',   name: 'Standing Desk Frame',  price: 400 },
        { id: 'with_hutch', name: 'With Hutch Storage',  price: 250 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
      legs:     LEG_STYLES,
    },
  },

  {
    id: 'office_chair',
    name: 'Office Chair',
    area: 'Study Room',
    skeletonType: SKELETON.OFFICE_CHAIR,
    basePrice: 480,
    configs: {
      shape: [
        { id: 'task',        name: 'Task Chair',          price: 0   },
        { id: 'executive',   name: 'Executive High-Back', price: 200 },
        { id: 'ergonomic',   name: 'Ergonomic Mesh',      price: 300 },
        { id: 'gaming',      name: 'Gaming Chair',        price: 150 },
      ],
      material: [
        { id: 'mesh',        name: 'Mesh Back',           price: 0   },
        { id: 'faux_leather',name: 'Faux Leather',        price: 100 },
        { id: 'leather',     name: 'Full Leather',        price: 350 },
        { id: 'fabric',      name: 'Woven Fabric',        price: 50  },
      ],
      color: [
        { id: 'black',      name: 'Black',      hex: '#1C1C1C', price: 0  },
        { id: 'grey',       name: 'Grey',       hex: '#6B6B6B', price: 0  },
        { id: 'white',      name: 'White',      hex: '#F5F0E8', price: 0  },
        { id: 'navy',       name: 'Navy Blue',  hex: '#2C3E6B', price: 30 },
        { id: 'red',        name: 'Racing Red', hex: '#8B1A1A', price: 50 },
      ],
    },
  },

  {
    id: 'study_shelf',
    name: 'Study Shelf',
    area: 'Study Room',
    skeletonType: SKELETON.SHELF_UNIT,
    basePrice: 320,
    configs: {
      shape: [
        { id: 'standard',    name: '4-Shelf Standard',   price: 0   },
        { id: 'wide',        name: '6-Shelf Wide',        price: 150 },
        { id: 'narrow',      name: '3-Shelf Narrow',      price: -50 },
        { id: 'with_doors',  name: 'With Cabinet Doors', price: 200 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
    },
  },

  {
    id: 'drawer_cabinet',
    name: 'Drawer Cabinet',
    area: 'Study Room',
    skeletonType: SKELETON.CABINET,
    basePrice: 420,
    configs: {
      shape: [
        { id: '3_drawers',   name: '3-Drawer Chest',     price: 0   },
        { id: '5_drawers',   name: '5-Drawer Chest',     price: 150 },
        { id: '7_drawers',   name: '7-Drawer Narrow',    price: 250 },
        { id: 'with_door',   name: '3-Drawer + Cabinet', price: 200 },
      ],
      material: WOOD_MATERIALS,
      color:    WOOD_COLORS,
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────
export const FURNITURE_BY_ID = Object.fromEntries(
  FURNITURE_TYPES.map(f => [f.id, f])
)

export const AREAS = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Study Room',
]

export const FURNITURE_BY_AREA = AREAS.reduce((acc, area) => {
  acc[area] = FURNITURE_TYPES.filter(f => f.area === area)
  return acc
}, {})

export const formatPrice = (price) =>
  'RM ' + parseFloat(price).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

// Maps furniture type display name → { id, skeletonType }
// Used by ContributionDetail to drive the 3D viewer
export const FURNITURE_TYPE_MAP = Object.fromEntries(
  FURNITURE_TYPES.map(f => [f.name, { id: f.id, skeletonType: f.skeletonType }])
)
