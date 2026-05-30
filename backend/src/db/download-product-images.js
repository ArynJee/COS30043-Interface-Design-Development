import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(
  __dirname,
  "../../../frontend/public/product"
);

// Unsplash CDN URL builder
// Long IDs (timestamp-hash format): photo-{id}
// Short IDs (alphanumeric): just the id, no "photo-" prefix
function unsplashUrl(id) {
  const base = /^\d{10,}-/.test(id)
    ? `https://images.unsplash.com/photo-${id}`
    : `https://images.unsplash.com/${id}`;
  return `${base}?w=800&h=600&fit=crop&q=80&fm=jpg`;
}

// 10 photo IDs per tag = 5 product pairs
// Pairing: product n uses IDs at index (n-1)*2 and (n-1)*2+1
const IMAGE_DATA = {
  sofas: {
    prefix: "sofa",
    ids: [
      "1555041469-a586c61ea9bc",
      "1630585308572-f53438fc684f",
      "1567016432779-094069958ea5",
      "1573866926487-a1865558a9cf",
      "1691480152351-4b3f2c89ccff",
      "1512212621149-107ffe572d2f",
      "1493663284031-b7e3aefcae8e",
      "1550581190-9c1c48d21d6c",
      "1698936061086-2bf99c7b9fc5",
      "1684165610413-2401399e0e59",
    ],
  },
  "coffee-table": {
    prefix: "coffee-table",
    ids: [
      "1619911013257-8f1fbc919fc9",
      "1647967527216-adea2f078e07",
      "1461418559055-6f020c5a91e7",
      "1713184367696-507ea9fe27b9",
      "1653242370332-e332a8103763",
      "1585167095899-a33318ea90b0",
      "1510877073473-6d4545e9c2af",
      "1566921895456-1cee64031c33",
      "1531651436064-c441ac97489b",
      "1575435745494-d25c354515c1",
    ],
  },
  armchair: {
    prefix: "armchair",
    ids: [
      "1580480055273-228ff5388ef8",
      "1567538096630-e0c55bd6374c",
      "1586023492125-27b2c045efd7",
      "1601366533287-5ee4c763ae4e",
      "1611967164521-abae8fba4668",
      "1718049719688-764249c6800d",
      "1617364852223-75f57e78dc96",
      "1714872245785-674ae3038d21",
      "1723804685588-b8e95b2044f3",
      "1634148737510-727f137375e0",
    ],
  },
  bookshelf: {
    prefix: "bookshelf",
    ids: [
      "1603058817990-2b9a9abbce86",
      "1593430980369-68efc5a5eb34",
      "1521587760476-6c12a4b040da",
      "1602722053020-af31042989d5",
      "1457369804613-52c61a468e7d",
      "1741851374666-1bc849a293c3",
      "1543248939-4296e1fea89b",
      "1588580000645-4562a6d2c839",
      "1513185041617-8ab03f83d6c5",
      "1545696648-86c761bc5410",
    ],
  },
  "bed-frame": {
    prefix: "bed-frame",
    ids: [
      "1635594202056-9ea3b497e5c0",
      "1690957530220-98bacb3c1163",
      "1560185128-e173042f79dd",
      "1530629013299-6cb10d168419",
      "1617198998846-56e8a4c6e7b7",
      "1724166655256-0ae10f1ab89a",
      "1688382575775-9aaa5025524e",
      "1713365963723-655fa464b681",
      "1631650120985-20791383127e",
      "1425219366480-47fdbbe0e83b",
    ],
  },
  wardrobe: {
    prefix: "wardrobe",
    ids: [
      "1558769132-cb1aea458c5e",
      "1672137233327-37b0c1049e77",
      "1490481651871-ab68de25d43d",
      "1567401893414-76b7b1e5a7a5",
      "1603400521630-9f2de124b33b",
      "1649361811423-a55616f7ab11",
      "1551232864-3f0890e580d9",
      "1517502166878-35c93a0072f0",
      "1614631446501-abcf76949eca",
      "1558997519-83ea9252edf8",
    ],
  },
  nightstand: {
    prefix: "nightstand",
    ids: [
      "1593194632872-3d19dab6e278",
      "1585128719715-46776b56a0d1",
      "1652155205433-52179159a15e",
      "1522771739844-6a9f6d5f14af",
      "1713623633904-a0a8dca6fafc",
      "1625479968313-7ed87d36e11d",
      "1592159714772-b44f85216622",
      "1611665860244-43cc95fa586e",
      "1565374235393-6fe32a07cc86",
      "1704428382616-d8c65fdd76f4",
    ],
  },
  "kitchen-counter": {
    prefix: "kitchen-counter",
    ids: [
      "1556911220-bff31c812dba",
      "1596205250168-c3583813eea0",
      "1722605090433-41d1183a792d",
      "1574739782594-db4ead022697",
      "1556912173-46c336c7fd55",
      "1565538810643-b5bdb714032a",
      "1556037843-347ddff9f4b0",
      "1511189975737-b5939ef6a944",
      "1609210885099-6ba41569c6dc",
      "1609347744403-2306e8a9ae27",
    ],
  },
  "bar-stool": {
    prefix: "bar-stool",
    ids: [
      "1583227061267-8428fb76fbfd",
      "1503602642458-232111445657",
      "1640902106532-47dd3a2e833e",
      "1552324190-9e86fa095c4a",
      "1497644083578-611b798c60f3",
      "1720694924759-2a2daaa98987",
      "1663984579980-5356c083e0ee",
      "1560463230-1d6803589edf",
      "1622986339425-7f92e62dab42",
      "1605906694887-3749751c310b",
    ],
  },
  "dining-table": {
    prefix: "dining-table",
    ids: [
      "1636138388621-258a72ecb07e",
      "1604578762246-41134e37f9cc",
      "1600623050499-84929aad17c9",
      "1657524398377-567034729507",
      "1505409628601-edc9af17fda6",
      "1614597445336-8a67e9314d91",
      "1602872030490-4a484a7b3ba6",
      "1583845112239-97ef1341b271",
      "1615066390971-03e4e1c36ddf",
      "1616486886892-ff366aa67ba4",
    ],
  },
  "kitchen-cabinet": {
    prefix: "kitchen-cabinet",
    ids: [
      "1771287490662-8ea64674ba8a",
      "1617873229215-11589e502703",
      "1684928365167-e91916573122",
      "1772567732993-3c546ee1a52c",
      "1737233463795-34fccdfc67bb",
      "1609210884439-d8bd991cb9b4",
      "1694845480813-2fd2616c998d",
      "1774437290626-34d18c49598a",
      "1771287490574-f5de29048a39",
      "1768578927302-0d85da43f34e",
    ],
  },
  sink: {
    prefix: "sink",
    ids: [
      "1631889993959-41b4e9c6e3c5",
      "1620626011761-996317b8d101",
      "1595514535116-d0401260e7cf",
      "1696987007764-7f8b85dd3033",
      "1631048499052-e6d9f305d2c0",
      "1595514535316-b8c85bf9bbf9",
      "1596180744691-d19a1b90b53c",
      "1595515770330-ceeea7d82cfd",
      "1609208522221-bd6b667fb671",
      "1630699376443-a79cea41ed80",
    ],
  },
  "bathroom-shelf": {
    prefix: "bathroom-shelf",
    ids: [
      "1667550177753-52b318cd4d40",
      "1595428774752-c87f23e7fcee",
      "1556227703-b7668d8cff99",
      "1667550177726-96da7c257853",
      "1630398777076-9b262a08c211",
      "1595515423727-13790b001cb9",
      "1595428773927-7c9c75203a2d",
      "1595515770345-0497f6f13692",
      "1595515770338-e4d3c5d8dd91",
      "1595515422979-5ea88d3954a0",
    ],
  },
  "vanity-cabinet": {
    prefix: "vanity-cabinet",
    ids: [
      "1613849925580-8ef3bc1cf219",
      "1682888818696-906287d759f5",
      "1596180741712-5c44787a3f9e",
      "1596178837012-a4ffb39d6db4",
      "1595156066164-410d89ad9a4f",
      "1696814543768-f8ff4610419a",
      "1712215282898-0284acc325fc",
      "1779078653008-be54f09b2029",
      "1770987685744-630d3c2494bd",
      "1778731660249-cb50d795d4b1",
    ],
  },
  desk: {
    prefix: "desk",
    ids: [
      "1497215728101-856f4ea42174",
      "1535957998253-26ae1ef29506",
      "1606857521015-7f9fcf423740",
      "1497366754035-f200968a6e72",
      "1533090161767-e6ffed986c88",
      "1487017159836-4e23ece2e4cf",
      "1518655048521-f130df041f66",
      "1551434678-e076c223a692",
      "1519219788971-8d9797e0928e",
      "1504384308090-c894fdcc538d",
    ],
  },
  "office-chair": {
    prefix: "office-chair",
    ids: [
      "1579487785973-74d2ca7abdd5",
      "1612372606404-0ab33e7187ee",
      "1598300042247-d088f8ab3a91",
      "1517502884422-41eaead166d4",
      "1572521165329-b197f9ea3da6",
      "1594235048794-fae8583a5af5",
      "1688578735427-994ecdea3ea4",
      "1688578735352-9a6f2ac3b70a",
      "1681418659069-eef28d44aeab",
      "1518455027359-f3f8164ba6bd",
    ],
  },
  "study-shelf": {
    prefix: "study-shelf",
    ids: [
      "1628565696887-2e3f4814a4f3",
      "1723990726152-0257c30d82e4",
      "1589816634282-bf08f4e43ba6",
      "1725783521817-3f37e54390a4",
      "1709159057304-2f4d5c9fb37e",
      "1774215915162-772637a901f0",
      "1589816627974-0b199e9464b7",
      "1587386263376-d2b58fdd86f9",
      "1661700738915-9dac561e21d7",
      "1644117573552-d2f53cf59620",
    ],
  },
  "drawer-cabinet": {
    prefix: "drawer-cabinet",
    ids: [
      "1532588213355-52317771cce6",
      "1544691560-fc2053d97726",
      "1591129841117-3adfd313e34f",
      "1579283111509-855c7eea1c49",
      "1608094409693-246985973278",
      "1593443746658-bfaece08b4f8",
      "1777631895349-a951c9f0b1e9",
      "1603112089080-3ef8f7bb9dcf",
      "1777620817561-3865fc61bcf0",
      "1769092992555-42c231deff34",
    ],
  },
};

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ComfyHome-Seeder/1.0; educational project)",
    },
    timeout: 15000,
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`Output directory: ${PUBLIC_DIR}\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const [folder, config] of Object.entries(IMAGE_DATA)) {
    const dir = path.join(PUBLIC_DIR, folder);
    fs.mkdirSync(dir, { recursive: true });

    for (let p = 0; p < 5; p++) {
      for (let img = 0; img < 2; img++) {
        const photoId = config.ids[p * 2 + img];
        const filename = `${config.prefix}${p + 1}-${img + 1}.jpg`;
        const filepath = path.join(dir, filename);

        if (fs.existsSync(filepath)) {
          process.stdout.write(`  [skip] ${folder}/${filename}\n`);
          skipped++;
          continue;
        }

        const url = unsplashUrl(photoId);
        process.stdout.write(`  [down] ${folder}/${filename} ...`);

        try {
          await downloadImage(url, filepath);
          process.stdout.write(" ok\n");
          downloaded++;
          await sleep(200);
        } catch (err) {
          process.stdout.write(` FAILED (${err.message})\n`);
          failed++;
          failures.push({ file: `${folder}/${filename}`, url, error: err.message });
        }
      }
    }
    console.log(`  ✓ ${folder} done`);
  }

  console.log("\n=== Summary ===");
  console.log(`Downloaded : ${downloaded}`);
  console.log(`Skipped    : ${skipped}`);
  console.log(`Failed     : ${failed}`);

  if (failures.length > 0) {
    console.log("\nFailed downloads:");
    failures.forEach((f) => console.log(`  ${f.file}: ${f.error}`));
    console.log("\nFor failed images, manually save a replacement JPG at the listed path.");
  }
}

main().catch(console.error);
