import db from "./db.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

// password = password seed
const PASSWORD = "password";
const HASHED_PASSWORD = bcrypt.hashSync(PASSWORD, 10);

// maps each tag to its local image folder and filename prefix
const TAG_IMAGE_CONFIG = {
  "Sofa":            { folder: "sofas",            prefix: "sofa" },
  "Coffee Table":    { folder: "coffee-table",     prefix: "coffee-table" },
  "Armchair":        { folder: "armchair",         prefix: "armchair" },
  "Bookshelf":       { folder: "bookshelf",        prefix: "bookshelf" },
  "Bed Frame":       { folder: "bed-frame",        prefix: "bed-frame" },
  "Wardrobe":        { folder: "wardrobe",         prefix: "wardrobe" },
  "Nightstand":      { folder: "nightstand",       prefix: "nightstand" },
  "Kitchen Counter": { folder: "kitchen-counter",  prefix: "kitchen-counter" },
  "Bar Stool":       { folder: "bar-stool",        prefix: "bar-stool" },
  "Dining Table":    { folder: "dining-table",     prefix: "dining-table" },
  "Kitchen Cabinet": { folder: "kitchen-cabinet",  prefix: "kitchen-cabinet" },
  "Sink":            { folder: "sink",             prefix: "sink" },
  "Bathroom Shelf":  { folder: "bathroom-shelf",   prefix: "bathroom-shelf" },
  "Vanity Cabinet":  { folder: "vanity-cabinet",   prefix: "vanity-cabinet" },
  "Desk":            { folder: "desk",             prefix: "desk" },
  "Office Chair":    { folder: "office-chair",     prefix: "office-chair" },
  "Study Shelf":     { folder: "study-shelf",      prefix: "study-shelf" },
  "Drawer Cabinet":  { folder: "drawer-cabinet",   prefix: "drawer-cabinet" },
};

// define categories and tags for each categories
const CATEGORIES = [
  {
    name: "Living Room",
    tags: ["Sofa", "Coffee Table", "Armchair", "Bookshelf"],
  },
  {
    name: "Bedroom",
    tags: ["Bed Frame", "Wardrobe", "Nightstand"],
  },
  {
    name: "Kitchen",
    tags: ["Kitchen Counter", "Bar Stool", "Dining Table", "Kitchen Cabinet"],
  },
  {
    name: "Bathroom",
    tags: ["Sink", "Bathroom Shelf", "Vanity Cabinet"],
  },
  {
    name: "Study Room",
    tags: ["Desk", "Office Chair", "Study Shelf", "Drawer Cabinet"],
  },
];

// HELPERS
// seed phone number
const malaysiaPhone = () => {
  return "01" + faker.string.numeric(8);
};

// seed product name
const productName = (tag) => {
  const adjectives = [
    "Walnut",
    "Nordic",
    "Ivory",
    "Limestone",
    "Oak",
    "Modern",
    "Rustic",
    "Matte",
    "Elegant",
    "Minimal",
  ];

  const styles = [
    "Haven",
    "Prime",
    "Aura",
    "Series",
    "Edition",
    "Line",
    "Studio",
    "Classic",
  ];

  const colors = ["Grey", "White", "Black", "Oak", "Beige", "Walnut"];

  return `${faker.helpers.arrayElement(adjectives)} ${
    faker.helpers.arrayElement(colors)
  } ${faker.helpers.arrayElement(styles)} ${tag}`;
};

// seed product description
const productDescription = (name) => {
  return `The ${name} is crafted with premium materials, designed for modern living spaces. It blends durability with aesthetic elegance, making it a perfect fit for contemporary interiors.`;
};

// MAIN
// the seed function
const seedDb = async () => {
  try {
    console.log("Seeding database...");

    // start transaction
    await db.query ("BEGIN");

    // clean reset everytime we run seeding
    console.log("Clearing existing data...");

    await db.query(`
      TRUNCATE TABLE
        cart_items,
        contribution_reviews,
        design_contributions,
        feedback,
        product_images,
        products,
        product_tags,
        categories,
        otp_requests,
        users
      RESTART IDENTITY CASCADE;
    `);

    console.log("Database reset completed");

    // map tags to categories
    const categoryMap = {};
    const tagMap = {};

    for (const cat of CATEGORIES) {
      const catRes = await db.query(
        `INSERT INTO categories (name) VALUES ($1) RETURNING id`,
        [cat.name]
      );

      const categoryId = catRes.rows[0].id;
      categoryMap[cat.name] = categoryId;

      for (const tag of cat.tags) {
        const tagRes = await db.query(
          `INSERT INTO product_tags (category_id, name) VALUES ($1, $2) RETURNING id`,
          [categoryId, tag]
        );

        tagMap[`${cat.name}-${tag}`] = tagRes.rows[0].id;
      }
    }

    console.log("Categories & tags seeded");

    // seed users
    const userIds = [];

    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });

      const res = await db.query(
        `INSERT INTO users 
        (first_name, last_name, email, phone_number, address, password_hash)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id`,
        [
          firstName,
          lastName,
          email,
          malaysiaPhone(),
          faker.location.streetAddress(),
          HASHED_PASSWORD,
        ]
      );

      userIds.push(res.rows[0].id);
    }

    console.log("Users seeded");

    // seed products and their images (2 per product, local paths)
    const productIds = [];

    for (const cat of CATEGORIES) {
      for (const tag of cat.tags) {
        const tagId = tagMap[`${cat.name}-${tag}`];
        const imgCfg = TAG_IMAGE_CONFIG[tag];

        for (let i = 0; i < 5; i++) {
          const name = productName(tag);

          const res = await db.query(
            `INSERT INTO products
            (name, description, category_id, tag_id, base_price, sold_count, width_cm, height_cm, depth_cm, featured)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING id`,
            [
              name,
              productDescription(name),
              categoryMap[cat.name],
              tagId,
              faker.number.float({ min: 100, max: 5000, precision: 0.01 }),
              faker.number.int({ min: 0, max: 800 }),
              faker.number.float({ min: 30, max: 300 }),
              faker.number.float({ min: 30, max: 250 }),
              faker.number.float({ min: 30, max: 200 }),
              faker.datatype.boolean(0.2),
            ]
          );

          const productId = res.rows[0].id;
          productIds.push(productId);

          const n = i + 1;
          await db.query(
            `INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1,$2,$3)`,
            [productId, `/product/${imgCfg.folder}/${imgCfg.prefix}${n}-1.jpg`, 1]
          );
          await db.query(
            `INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1,$2,$3)`,
            [productId, `/product/${imgCfg.folder}/${imgCfg.prefix}${n}-2.jpg`, 2]
          );
        }
      }
    }

    console.log("Products and product images seeded");

    // seed feedbacks
    const feedbackComments = [
      "Excellent craftsmanship and quality, wide range of choices provided as well.",
      "Very comfortable and stylish, 10/10 for me.",
      "Fits perfectly with my home interior, warm tone lover satisfied.",
      "Worth the price everytime. I enjoyed the customisable furniture service.",
      "Amazing modern design, spectacular choice of materials used.",
      "Solid materials and easy to assemble, love the idea of designing my own furniture!",
      "Beautiful furniture with premium finishing, I love ComfyHome.",
      "Exceeded my expectations, and within a reasonable price range!",
      "Elegant and functional pieces of daily everyday needs.",
      "Would definitely recommend to others, especially the sofas on sale.",
    ];

    for (let i = 0; i < 50; i++) {
      const userId = faker.helpers.arrayElement(userIds);

      await db.query(
        `INSERT INTO feedback (user_id, rating, comment)
         VALUES ($1,$2,$3)`,
        [
          userId,
          faker.number.int({ min: 1, max: 5 }),
          faker.helpers.arrayElement(feedbackComments),
        ]
      );
    }

    console.log("Feedback seeded");

    // seed design contributions (showcase page)
    const SHOWCASE_CONTRIBUTIONS = [
      {
        user: {
          first_name: "Isabelle",
          last_name: "Chen",
          email: "isabelle.chen@comfyhome.my",
          phone_number: "0123456789",
          address: "15 Jalan Bukit Kecil, Petaling Jaya, Selangor",
        },
        contribution: {
          area: "Kitchen",
          furniture_type: "Kitchen Counter",
          description:
            "A minimalist kitchen counter featuring Calacatta marble surface and handleless sage-green cabinets. Round-edge detailing softens the overall silhouette while ceramic tile cladding keeps the look timeless and easy to maintain.",
          preview_image_url: "/product/kitchen-counter/kitchen-counter1-1.jpg",
          configuration: {
            shape: { name: "Round Edges", price: 1000 },
            color: { name: "Sage White", price: 50 },
            texture: { name: "Calacatta Ceramic", price: 1000 },
          },
          total_cost: 2050.0,
        },
      },
      {
        user: {
          first_name: "Marcus",
          last_name: "Tan",
          email: "marcus.tan@comfyhome.my",
          phone_number: "0187654321",
          address: "42 Lorong Maju 3, Bangsar, Kuala Lumpur",
        },
        contribution: {
          area: "Living Room",
          furniture_type: "Sofa",
          description:
            "Inspired by mid-century modern design, this tufted sofa is wrapped in deep forest-green velvet over a solid oak L-shaped frame. Paired with brushed brass accent legs, it makes a warm and sophisticated living room statement.",
          preview_image_url: "/product/sofas/sofa1-1.jpg",
          configuration: {
            shape: { name: "L-Shape Frame", price: 1500 },
            color: { name: "Forest Green", price: 100 },
            fabric: { name: "Premium Velvet", price: 2000 },
            accent: { name: "Brass Legs", price: 250 },
          },
          total_cost: 3850.0,
        },
      },
    ];

    for (const { user, contribution } of SHOWCASE_CONTRIBUTIONS) {
      const userRes = await db.query(
        `INSERT INTO users (first_name, last_name, email, phone_number, address, password_hash)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id`,
        [
          user.first_name,
          user.last_name,
          user.email,
          user.phone_number,
          user.address,
          HASHED_PASSWORD,
        ]
      );

      await db.query(
        `INSERT INTO design_contributions
           (user_id, area, furniture_type, description, preview_image_url, configuration, total_cost)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          userRes.rows[0].id,
          contribution.area,
          contribution.furniture_type,
          contribution.description,
          contribution.preview_image_url,
          JSON.stringify(contribution.configuration),
          contribution.total_cost,
        ]
      );
    }

    console.log("Showcase contributions seeded");

    // seed contribution reviews (fetch the seeded contribution ids)
    const contribRes = await db.query(`SELECT id FROM design_contributions`);
    const contribIds = contribRes.rows.map((r) => r.id);

    const contribReviewComments = [
      "Love this design concept — would definitely order it!",
      "Very creative configuration, the colour palette is stunning.",
      "This inspired me to customize my own furniture. Great work!",
      "Elegant and practical. I added this to my wishlist.",
      "Beautiful design, the material choices complement each other well.",
    ];

    for (const contribId of contribIds) {
      const reviewCount = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < reviewCount; i++) {
        await db.query(
          `INSERT INTO contribution_reviews (contribution_id, user_id, rating, comment)
           VALUES ($1, $2, $3, $4)`,
          [
            contribId,
            faker.helpers.arrayElement(userIds),
            faker.number.int({ min: 4, max: 5 }),
            faker.helpers.arrayElement(contribReviewComments),
          ]
        );
      }
    }

    console.log("Contribution reviews seeded");

    // commit transaction
    await db.query("COMMIT");

    console.log("Database seeding has been completed!");
    process.exit(0);
  } catch (err) {
    // rollback on error
    await db.query("ROLLBACK");
    console.error("Seeding failed. Transaction rolled back.");
    console.error(err);
    process.exit(1);
  }
};

seedDb();