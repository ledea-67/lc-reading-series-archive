#!/usr/bin/env node
/**
 * Update photo URLs to direct image links
 * Run: node scripts/update-photo-urls.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const writersFile = path.join(__dirname, '..', 'initial-data', 'writers-sample.json');

// Map of writer IDs to their direct image URLs
const directImageUrls = {
  // Batch 1 (originally audited)
  'ondaatje-michael': 'https://images2.penguinrandomhouse.com/author/22801',
  'diaz-natalie': 'https://www.macfound.org/media/fellows/profile_photos/diaz_2018_profile-240.png',
  'finney-nikky': 'https://i0.wp.com/www.nationalbook.org/wp-content/uploads/2023/08/finney-forrest1-Vaughan-Fielder.jpeg?fit=1485%2C1650&ssl=1',
  'ahmad-aamina': 'https://images.squarespace-cdn.com/content/v1/61d134ccd321f568c9289a2d/873fa02f-0b49-4cb3-b564-738d97b9033a/Aamina_1526_r.jpg',
  'bradley-adam': 'https://english.ucla.edu/wp-content/uploads/Adam-Bradley-Portrait-e1603147045312.jpg',
  'limon-ada': 'https://www.loc.gov/static/managed-content/uploads/sites/7/2022/07/AdaLimon_creditShawnMiller_500x500.jpg',
  'shapiro-alan': 'https://www.poets.org/sites/default/files/images/biographies/AlanShapiro_NewBioImage-AlgonquinPress.png',
  'arthurs-alexia': 'https://images.squarespace-cdn.com/content/v1/5c2bcaf2f793923866d2cebc/1549839303533-NRMPSPI2HVSM1ZJ6CTIS/photo+of+me+by+rose+marie+cromwell+2.jpg',
  'smith-alexis': 'https://literary-arts.org/wp-content/uploads/2016/08/web_photo_Smith_Alexis-credit-Annie-Beedy-scaled.jpg',
  'ohlin-alix': 'https://crwr.cms.arts.ubc.ca/wp-content/uploads/sites/4/2018/11/alix_ohlin.jpg',
  'codjoe-ama': 'https://www.guggenheim.org/wp-content/uploads/2023/01/people-ama-codjoe.jpg',
  'mojgani-anis': 'https://images.squarespace-cdn.com/content/v1/5d3946e72a72b00001af2683/1577991740933-9HUAP9K7UUEXVHRZN2DX/Hilde+little.jpg',

  // Batch 2
  'keesey-anna': 'https://m.media-amazon.com/images/I/613rtiPQ66L._SX450_CR0%2C0%2C450%2C450_.jpg',
  'bradford-arthur': 'https://literary-arts.org/wp-content/uploads/2016/09/03_Arthur-Bradford_Literary-Arts-Writers-in-the-Schools-800x1024.jpg',
  'amster-betsy': 'https://avatars.sched.co/2/34/7491083/avatar.jpg.320x320px.jpg?90b',
  'hillman-brenda': 'https://blueflowerarts.com/wp-content/uploads/2014/07/Hillman-pls-credit-Robert-Hass.jpeg',
  'barnett-catherine': 'https://www.poets.org/sites/default/files/images/biographies/Catherine%20Barnett_NewBioImage_1.png',
  'ellis-catherine': 'https://thenewpress.org/wp-content/uploads/2025/03/ellis_catherine.jpg',
  'shanahan-charif': 'https://english.northwestern.edu/images/people/faculty/charif-shanahan.jpg',
  'baxter-charles': 'https://cla.umn.edu/sites/cla.umn.edu/files/styles/feature_image/public/unsorted/images/d4a10f-20110105-charles-baxter.jpg',
  'deavel-christine': 'https://media.artisttrust.org/assets/artists/combined_headshot-1024x606.png',
  'watkins-claire-vaye': 'https://communityofwriters.org/wp-content/uploads/2021/12/Watkins-Author-photo-BW.jpg',
  'wise-consuelo': 'https://college.lclark.edu/live/image/gid/4/width/600/height/600/crop/1/src_region/0,204,1545,1748/105515_2025.04.01_ENG_Consuelo_Wise_Visiting_Writers_Series.jpg',
  'van-landingham-corey': 'https://www.poets.org/sites/default/files/cdsn9odz_400x400.png',

  // Batch 3
  'powell-d-a': 'https://writersworkshop.uiowa.edu/sites/writersworkshop.uiowa.edu/files/styles/large/public/2024-03/d-a-powell.jpeg?itok=-KcEhGic',
  'baker-david': 'https://denison.edu/sites/default/files/contacts/baker_david_rs.jpg',
  'austin-derrick': 'https://creativewriting.stanford.edu/sites/creativewriting/files/styles/hs_small_square_200x200/public/media/people/derrickaustin_0.jpg.webp?itok=3q2J3uX-',
  'waters-don': 'https://college.lclark.edu/live/image/gid/4/width/268/height/340/crop/1/src_region/0,0,2133,3200/85762_Waters_Don.rev.1602785044.jpg',
  'passarello-elena': 'https://images.squarespace-cdn.com/content/v1/58cdd2c58419c2ea93236b2b/1490048667382-V60ZXQ91QBQ7K1ASR7BJ/elena1.jpg',
  'chenoweth-emily': 'https://literary-arts.org/wp-content/uploads/2014/04/CHENOWETH-1536x1024.jpg',
  'wilson-emily': 'https://www.english.upenn.edu/sites/default/files/people/photo/2016-12-05%2017.44.32.jpg',
  'hartigan-endi-bogue': 'https://images.squarespace-cdn.com/content/v1/629506316df6af2046ce03c4/7e23aee4-8839-4665-bfb6-911a96dc114c/hartigan3dcrop.jpg',
  'ergenbright-erin': 'https://www.lclark.edu/live/image/gid/271/width/192/height/173/crop/1/14575_13547_erin_ergenbright_2_20a42fa370ebf178b092ca8c41dadaf5.rev.1373935911.webp',
  'lundgren-eric': 'https://www.stlmag.com/wp-content/uploads/slm_mp/slm_208620__lungren.jpg',
  'schlosser-eric': 'https://images3.penguinrandomhouse.com/author/27189',

  // Batch 4
  'joudah-fady': 'https://www.poets.org/sites/default/files/images/biographies/fadyjoudah_newbioimage2018_photocredit_cybeleknowles_0.png',
  'hudson-genevieve': 'https://images.squarespace-cdn.com/content/v1/66707d3fe6276a4d15f51f86/bc0c1c5a-db43-4153-bb12-d2cc6f24cea9/IMG_4468.jpg',
  'obrien-geoffrey-g': 'https://english.berkeley.edu/sites/default/files/styles/openberkeley_brand_widgets_rectangle/public/people/wheeler.jpg?itok=DF9_axFr&timestamp=1692510459',
  'conoley-gillian': 'https://english.sonoma.edu/sites/english/files/styles/square_800_x_800/public/gilliancon-thumb.jpg?h=653d7163&itok=sJPGl9YV',
  'ismailov-hamid': 'https://images.squarespace-cdn.com/content/v1/565a42a7e4b0f06765f7b528/1568038070665-JJ5ANGMTT8FTOTIYE45Y/Hamid+drawing.jpg',
  'carlisle-henry': 'https://www.historicnavalfiction.com/images/stories/images/Henry_Carlisle.jpg',
  'schwartz-hillel': 'https://www.americanacademy.de/wp-content/uploads/2016/12/hillelschwarz.jpg',
  'prcic-ismet': 'https://communityofwriters.org/wp-content/uploads/2015/09/Prcic_Ismet.jpg',
  'miller-j-hillis': 'https://www.humanities.uci.edu/sites/default/files/styles/article_image_891x504/public/article/HillisStory_0.png',
  'rancourt-jacques': 'https://images.squarespace-cdn.com/content/v1/5fe8db577b743f626b43be66/130a688c-2413-4361-b470-5ef4de3876d5/Jacques+Headshots-0013.jpg',
  'anderson-james': 'https://jamesandersonauthor.com/wp-content/uploads/James_Anderson_Painted_Hills.jpg',

  // Batch 5
  'galvin-james': 'https://writersworkshop.uiowa.edu/sites/writersworkshop.uiowa.edu/files/styles/large/public/2024-02/James_Galvin.jpg?itok=qTG9vUHp',
  'wong-jane': 'https://images.squarespace-cdn.com/content/v1/5b3ebef39f87702e755d679e/4f9ee229-91d6-4ef0-b9fb-f952bf737be5/JaneW+headshot.jpg',
  'grotz-jennifer': 'https://www.middlebury.edu/writers-conferences/sites/default/files/styles/432x576/public/2020-06/JenniferGrotz.jpg?fv=1-NYR7ca&itok=Pw0ybyJx',
  'wilkins-joe': 'https://linfield.edu/assets/images/bio_images/jwilkins.jpg',
  'beer-john': 'https://www.wavepoetry.com/cdn/shop/products/web-beer.jpg?v=1663705255',
  'casteen-john': 'https://as.virginia.edu/sites/uva-as-d10-english/files/styles/large/public/2024-07/John%20Casteen_0.png?itok=4VuchuEz',
  'farrell-john': 'https://www.cmc.edu/sites/default/files/styles/crop_3_4/public/pictures/2025-03/john-farrell.jpg',
  'gill-john-freeman': 'https://johnfreemangill.com/images/John_Freeman_Gill.jpg',
  'marshall-john': 'https://lectures.org/wp-content/uploads/Screen-Shot-2019-07-01-at-11.29.28-AM-480x267-1.jpg', // Combined photo with Christine Deavel
  'raymond-jon': 'https://i0.wp.com/www.orartswatch.org/wp-content/uploads/2022/07/Jon-Raymond-PC-K.B.-Dixon-1.jpg',
};

async function main() {
  console.log('Reading writers-sample.json...');
  const data = JSON.parse(await fs.readFile(writersFile, 'utf-8'));

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const writer of data.writers) {
    if (directImageUrls.hasOwnProperty(writer.id)) {
      const newUrl = directImageUrls[writer.id];

      if (newUrl === null) {
        console.log(`⚠ ${writer.id}: No direct URL found (needs manual lookup)`);
        skipped++;
        continue;
      }

      if (writer.photo && writer.photo.url !== newUrl) {
        const oldUrl = writer.photo.url;
        writer.photo.imageUrl = newUrl;
        console.log(`✓ ${writer.id}: Added imageUrl`);
        updated++;
      } else if (!writer.photo) {
        console.log(`⚠ ${writer.id}: No photo object`);
        notFound++;
      }
    }
  }

  console.log(`\nWriting updated file...`);
  await fs.writeFile(writersFile, JSON.stringify(data, null, 2) + '\n');

  console.log(`\n========================================`);
  console.log(`Summary`);
  console.log(`========================================`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (needs manual): ${skipped}`);
  console.log(`No photo object: ${notFound}`);
  console.log(`\nNOTE: The new field 'imageUrl' contains the direct image URL.`);
  console.log(`The original 'url' field (source page) is preserved for attribution.`);
}

main().catch(console.error);
