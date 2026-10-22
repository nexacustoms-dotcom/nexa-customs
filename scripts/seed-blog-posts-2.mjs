#!/usr/bin/env node
// Push 8 more SEO blog posts (set 2) into Supabase site_config (id=custom_pages).
// Safe to re-run — skips any slug that already exists, so it never
// overwrites posts you've already edited in Admin.
//   node scripts/seed-blog-posts.mjs

const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

const NEW_POSTS = [
  {
    id: 'cp-' + (Date.now() + 101),
    title: 'How Many Flyers or Door Hangers Do I Need?',
    slug: 'how-many-flyers-or-door-hangers-do-i-need',
    nav: false,
    relatedCat: 'flyers-postcards',
    metaDesc: 'How many flyers or door hangers should you print? A simple way to work out your quantity, with examples for neighbourhood drops, events and openings.',
    content: `![How many flyers or door hangers do I need?](/blog-images/how-many-flyers-or-door-hangers-do-i-need.jpg)

Most people guess the quantity when they order flyers, then either run out halfway through the route or end up with a box in the garage. A better way is to work backwards from who you actually want to reach.

## Start with a count, not a feeling

Decide how you will hand the flyers out, then count the people or doors on that route.

- Door-to-door drop: count the homes or units on your route. One door hanger or flyer per door is the baseline.
- Event or trade show: estimate how many people will walk past your table, then plan for a portion of them to take one.
- Counter or in-store handout: think about how many customers come in per week and how long a batch should last.
- Mailed postcards: you need one per address on your list, plus a few spares.

## Add a small buffer

Always order a little more than your count. Some pieces get damaged, some doors get skipped and then revisited, and you will want a few to keep for samples. A modest buffer is usually enough. If you are dropping 400 doors, ordering a few dozen over is cheaper than a second run.

## Think in rounds, not one big drop

A single drop is easy to ignore. Dropping the same neighbourhood two or three times, a couple of weeks apart, builds recognition. If your budget is limited, it is often better to cover a smaller area twice than a larger area once. Check the rules for where and how you can distribute in your area before you start: see [flyer distribution rules in Canada](/blog/flyer-distribution-rules-canada).

## Match the format to the job

Door hangers are made to stay on the door handle, so they are hard to miss on a residential street. Flyers are better for handouts, bulletin boards and counters. Postcards feel more substantial and work well for mailing or leaving behind. Not sure which fits? Read [door hangers vs flyers vs postcards](/blog/door-hangers-vs-flyers-vs-postcards).

## Need them fast?

We print flyers and door hangers the same day for runs of 50 to 1,000 pieces, with pickup at our Mississauga shop. Order by 12 PM for same-day pickup. See [same-day flyers](/same-day-flyers-mississauga) and [same-day door hangers](/same-day-door-hangers-mississauga), or call (437) 997-9921 and we will help you work out a quantity.

>>> Not sure of your number? Tell us the area and how you plan to distribute, and we will suggest a quantity before you order.`,
  },
  {
    id: 'cp-' + (Date.now() + 102),
    title: 'Door Hangers vs Flyers vs Postcards: Which One Should You Print?',
    slug: 'door-hangers-vs-flyers-vs-postcards',
    nav: false,
    relatedCat: 'flyers-postcards',
    metaDesc: 'Door hangers, flyers or postcards? How each one works, where each performs best, and how to choose for local marketing in Mississauga and the GTA.',
    content: `![Door hangers vs flyers vs postcards](/blog-images/door-hangers-vs-flyers-vs-postcards.jpg)

All three get a printed message into someone's hands, but they work differently. Choosing the right one depends on where the piece will be seen and what you want the reader to do.

## Door hangers

A door hanger is a die-cut card that hangs on a door handle. It is delivered straight to the entrance of a home, so it is difficult to overlook, and it does not get lost in a pile of mail.

- Best for: neighbourhood promotions, home services, open houses, new-opening offers
- Strengths: direct and local, easy to target by street
- Watch out for: limited space, so keep one offer and one action

See [same-day door hangers in Mississauga](/same-day-door-hangers-mississauga).

## Flyers

Flyers are the most flexible option. They suit handouts, counters, bulletin boards and events, and the larger sheet gives you room for more information.

- Best for: events, sales, openings, menus, handouts
- Strengths: low cost per piece, room for detail, many size and stock options
- Watch out for: thin paper can feel disposable, so choose a stock that fits the message

See [same-day flyer printing](/same-day-flyers-mississauga).

## Postcards

Postcards are printed on sturdier stock than most flyers. They feel more premium and can be mailed, handed out or left behind after a meeting.

- Best for: announcements, follow-ups, mailed offers, thank-you cards
- Strengths: durable, feels more considered, works without an envelope
- Watch out for: if you plan to mail, check the postal size and weight limits first

See [same-day postcards](/same-day-postcards-mississauga).

## A quick way to choose

Ask yourself where the piece will be when someone reads it. On a doorstep, choose a door hanger. In someone's hand at an event or on a counter, a flyer. In a mailbox or tucked into a client folder, a postcard.

>>> Still deciding? Tell us your goal and area and we will recommend a format. Call (437) 997-9921 or [request a quote](/quote).`,
  },
  {
    id: 'cp-' + (Date.now() + 103),
    title: 'Brochure Fold Types Explained: Tri-Fold, Bi-Fold, Z-Fold and More',
    slug: 'brochure-fold-types-explained',
    nav: false,
    relatedCat: 'marketing',
    metaDesc: 'Tri-fold, bi-fold, Z-fold, gate fold or double parallel? A plain-English guide to brochure folds and how to pick the one that suits your content.',
    content: `![Brochure fold types explained](/blog-images/brochure-fold-types-explained.jpg)

The fold you choose decides how your brochure is read, so it is worth picking it before you start the design. Here is how the common folds work.

## Bi-fold (four panels)

One fold down the middle. You get a front cover, two inside pages side by side, and a back. It is simple and works well for a short pitch, a menu or a program, and it gives you a large inside spread for photos or a big message.

## Tri-fold (six panels)

Two folds, three panels on each side. This is the classic brochure. It suits service lists, company profiles and pricing, because each panel can hold one idea and the reader moves through them in order.

## Z-fold (six panels)

Also six panels, but it opens like a zigzag instead of folding inward. Because it unfolds flat, it works well for a timeline, a process or a step-by-step message that you want read in sequence.

## Gate fold

Two outer panels fold in to meet in the middle, like a pair of doors. Opening it reveals a wide centre panel, which is useful when you want one strong visual or message.

## Double parallel fold

The sheet is folded in half and then in half again in the same direction, giving a compact piece with several panels. It suits content that is easy to scan in small pieces.

## How to pick

Start with your content. If you have three or four separate points, a tri-fold fits. If you have one main message, try a bi-fold or gate fold. If order matters, choose a Z-fold. Whatever you pick, check that important text stays clear of the folds.

## Timing

Because brochures have to be folded cleanly, we print them for next-day pickup instead of same day. See [next-day brochure printing in Mississauga](/next-day-brochures-mississauga) or call (437) 997-9921.

>>> Send us your content and we will tell you which fold fits before you design.`,
  },
  {
    id: 'cp-' + (Date.now() + 104),
    title: 'Print File Setup Guide: Bleed, Resolution and CMYK',
    slug: 'print-file-setup-guide-bleed-cmyk',
    nav: false,
    relatedCat: 'marketing',
    metaDesc: 'How to set up artwork for print: bleed, safe margins, 300 dpi, CMYK colour and fonts. A simple checklist to avoid delays and get your proof approved faster.',
    content: `![Print file setup: bleed, resolution, CMYK](/blog-images/print-file-setup-guide-bleed-cmyk.jpg)

Most delays in printing come from artwork that is not ready, not from the printing itself. Get these basics right and your proof is usually approved on the first try.

## Bleed

Bleed is extra artwork that extends past the edge of the finished size. Because paper is trimmed after printing, any colour or image that touches the edge needs to run past it. A common bleed is 0.125 in (3 mm) on every side. Without it, you can end up with thin white lines along the edge.

## Safe margin

Keep important text and logos inside the trim edge by a small margin, often 0.125 to 0.25 in. Anything too close to the edge can be cut off or look cramped.

## Resolution

Photos and images should be about 300 dpi at the size they will print. A small web image stretched to a large size will look blurry, and an image saved from a website is almost never high enough.

## Colour: CMYK, not RGB

Screens use RGB, but printers use CMYK. Colours can shift when converted, and very bright screen colours may look duller in print. If you can, build your design in CMYK from the start.

## Fonts and text

Embed your fonts or convert text to outlines so nothing changes on our end. Avoid very thin lines and very small text, especially light text on a dark background.

## File type

A press-ready PDF is the safest format. Save it at the final size, with bleed included.

## Quick checklist

- Final size set correctly
- 0.125 in bleed on every side
- Text inside the safe margin
- Images about 300 dpi
- CMYK colour
- Fonts embedded or outlined
- Saved as a PDF

## In a hurry?

Clean, print-ready files are the fastest way to get a same-day order approved. Read our [same-day printing checklist](/blog/same-day-printing-checklist-mississauga). Questions about your file? Call (437) 997-9921.

>>> Not sure your file is ready? Upload it with your order and we will check it and send a free digital proof before anything prints.`,
  },
  {
    id: 'cp-' + (Date.now() + 105),
    title: 'How to Get Your Print Order Done the Same Day: A Checklist',
    slug: 'same-day-printing-checklist-mississauga',
    nav: false,
    relatedCat: 'business-cards',
    metaDesc: 'A short checklist for same-day printing in Mississauga: cutoff time, file readiness, quantities and pickup, so your order is ready when you need it.',
    content: `![Same-day printing checklist](/blog-images/same-day-printing-checklist-mississauga.jpg)

Same-day printing is possible, but it only works when a few things line up. Here is the checklist we would follow if we were ordering.

## 1. Order by 12 PM (noon)

For same-day pickup, place your order by 12 PM. Orders placed after noon are normally ready the next business day.

## 2. Check your quantity

Same-day printing covers 50 to 1,000 pieces. If you need more, request a quote and we will tell you the fastest turnaround we can offer.

## 3. Pick a product that supports it

Business cards, flyers, postcards and door hangers can be done the same day. Brochures are next-day because of the folding. Specialty finishes such as foil, soft-touch or magnetic may need more time, so call first if you need one today.

## 4. Have print-ready artwork

The biggest cause of missed deadlines is a file that needs fixing. Include bleed, use CMYK, and embed or outline fonts. Our [print file setup guide](/blog/print-file-setup-guide-bleed-cmyk) covers the basics.

## 5. Approve your proof quickly

We send a free digital proof before anything prints. Your turnaround starts when you approve it, so check it carefully and reply promptly.

## 6. Choose the same-day option

Select the same-day turnaround when you order. The added cost is shown before you pay.

## 7. Plan your pickup

Same-day orders are pickup only at our Mississauga shop, 6033 Shawson Dr, Unit 40. We are open Monday to Friday, 10 AM to 8 PM, and Saturday by appointment. We will let you know when your order is ready.

## Start here

- [Same-day business cards](/same-day-business-cards-mississauga)
- [Same-day flyers](/same-day-flyers-mississauga)
- [Same-day postcards](/same-day-postcards-mississauga)
- [Same-day door hangers](/same-day-door-hangers-mississauga)

>>> Close to the cutoff? Call (437) 997-9921 and we will tell you what is realistic before you order.`,
  },
  {
    id: 'cp-' + (Date.now() + 106),
    title: 'Open House Printing Checklist for Real Estate Agents',
    slug: 'open-house-printing-checklist-real-estate-agents',
    nav: false,
    relatedCat: 'real-estate',
    metaDesc: 'Everything a real estate agent should print for an open house: signs, feature sheets, business cards, door hangers and more, with timing tips.',
    content: `![Open house printing checklist](/blog-images/open-house-printing-checklist-real-estate-agents.jpg)

An open house has a lot of small printed pieces, and each one has a job. Use this checklist to make sure nothing is missing, and to give yourself enough time to order.

## Signs

You need to be seen from the street. That usually means an open house sign and directional signs. Rules for size and placement vary by municipality, so read [real estate sign regulations in the GTA](/blog/real-estate-sign-regulations-gta) and confirm with your city before you put anything up.

## Feature sheets

A one-page sheet for each visitor with photos, price, key details and your contact information. Print a few more than you expect visitors, since some people take one for a friend.

## Business cards

Keep a stack on the table and in your pocket. Cards are the piece most likely to be kept, so make sure your phone, email and brokerage details are correct. See [same-day business cards in Mississauga](/same-day-business-cards-mississauga) if you are short on time.

## Door hangers

Hang them on the surrounding streets a day or two before the open house to bring in neighbours. They are inexpensive and reach people who might not see an online listing. See [same-day door hangers](/same-day-door-hangers-mississauga).

## Flyers and postcards

Useful for handing out at nearby events or mailing to past clients and neighbours. See [same-day flyers](/same-day-flyers-mississauga) and [same-day postcards](/same-day-postcards-mississauga).

## Timing

Work backwards from the open house date. Signs and anything with a specialty finish need extra lead time. Flyers, cards, postcards and door hangers can be done the same day in quantities from 50 to 1,000 if you order by 12 PM.

>>> Planning a bundle for a listing? Call (437) 997-9921 or [request a quote](/quote) and we will price the whole set.`,
  },
  {
    id: 'cp-' + (Date.now() + 107),
    title: 'Can Vehicle Decals Be Removed Without Damaging the Paint?',
    slug: 'remove-vehicle-decals-without-damaging-paint',
    nav: false,
    relatedCat: 'vehicle-graphics',
    metaDesc: 'Can you remove vinyl decals and lettering from a vehicle without damaging the paint? How heat, adhesive and old paint affect the result, and when to call a pro.',
    content: `![Removing vehicle decals safely](/blog-images/remove-vehicle-decals-without-damaging-paint.jpg)

Often, yes, but it depends on the vehicle and the vinyl. Removing decals is not complicated, but doing it wrong can leave marks or lift paint.

## What decides the result

- Age of the vinyl: older vinyl becomes brittle and breaks into small pieces as it comes off, and the adhesive can bake onto the surface.
- Condition of the paint: factory paint with an intact clear coat usually handles removal better than repainted or damaged paint.
- Sun exposure: paint under a decal is protected from sun, so the surrounding paint may fade slightly and leave a faint outline when the decal is gone.

## The usual method

1. Warm the vinyl. Gentle, even heat softens the adhesive so the vinyl lifts instead of tearing.
2. Peel slowly at a low angle. Pulling straight up or fast is what lifts paint and snaps the vinyl.
3. Remove the leftover adhesive. A suitable adhesive remover and a soft cloth will take it off. Test a small area first.
4. Clean and protect. Wash the area and wax or protect it, since the paint underneath has not been exposed for a long time.

## Mistakes to avoid

- Using a metal blade or a sharp scraper, which scratches paint
- Overheating, which can damage paint or soften the clear coat
- Using harsh solvents without testing them first
- Rushing, which tears the vinyl into small pieces

## A faint outline is common

If a decal has been on for years, you may see a slightly different shade where it was. Polishing sometimes reduces it, but it is normal and not a sign that anything went wrong.

## When to call a professional

Large fleet graphics, full wraps, very old or cracked vinyl, and repainted vehicles are best left to someone with experience. We also remove vinyl graphics, so if you are not sure, call (437) 997-9921 or [request a quote](/quote). Planning a replacement? See our [vehicle wrap durability guide](/blog/vehicle-wrap-winter-durability).

>>> Tell us the vehicle, the age of the graphics and what you want to do afterwards, and we will advise before you start.`,
  },
  {
    id: 'cp-' + (Date.now() + 108),
    title: 'Business Cards for Contractors and Trades: What to Include',
    slug: 'business-cards-for-contractors-and-trades',
    nav: false,
    relatedCat: 'business-cards',
    metaDesc: 'What to put on a contractor or trades business card, which finish lasts on a job site, and how to get cards fast in Mississauga and the GTA.',
    content: `![Business cards for contractors and trades](/blog-images/business-cards-for-contractors-and-trades.jpg)

A trades business card works differently from an office card. It gets handed over on a driveway, stuck in a truck door or left on a counter, so it has to be readable at a glance and tough enough to survive a pocket.

## What to include

- Your name and business name, large and easy to read
- What you do, in a few words, such as plumbing, roofing or renovations
- A phone number people can call or text, as the main contact
- Your service area, so people know you cover them
- Licence or certification numbers, if your trade requires them to be shown
- A website or email, kept short

Leave off anything that is not helping someone decide to call you. A crowded card is harder to read than a clean one.

## Choose a finish that holds up

For cards that spend time in pockets and trucks, a sturdier stock is worth it. Matte and uncoated finishes show fewer fingerprints, and uncoated is easy to write on, which is useful for adding a quote or a date on the back. A glossy finish makes photos and bright colours stand out. Ask us if you are unsure which suits your trade.

## Use the back

The back is free space. Put your service list, a short guarantee or a space for notes. Some trades add a small checklist or a seasonal offer.

## Make them easy to read

Use a large, plain font for your phone number and avoid light text on busy backgrounds. People often look at cards in poor light or in a hurry.

## Need cards fast?

If you have a new truck, a new hire or a job starting tomorrow, we print business cards the same day for runs of 50 to 1,000. Order by 12 PM for same-day pickup at our Mississauga shop. See [same-day business cards](/same-day-business-cards-mississauga), or call (437) 997-9921. If you want to promote a neighbourhood too, [door hangers](/same-day-door-hangers-mississauga) are a common trades choice.

>>> Send your details and we will lay out a clean card for you to approve with a free digital proof.`,
  },
];

async function main() {
  console.log('Fetching current custom_pages from Supabase...');
  const getRes = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.custom_pages&select=data`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  if (!getRes.ok) {
    console.error('❌ Failed to fetch site_config:', getRes.status, await getRes.text());
    process.exit(1);
  }
  const rows = await getRes.json();
  const existing = Array.isArray(rows?.[0]?.data) ? rows[0].data : [];
  console.log(`Found ${rows.length ? 'existing' : 'no'} custom_pages row — ${existing.length} page(s) currently there.`);
  const existingSlugs = new Set(existing.map(p => p.slug));

  const toAdd = NEW_POSTS.filter(p => !existingSlugs.has(p.slug));
  const skipped = NEW_POSTS.filter(p => existingSlugs.has(p.slug));

  if (skipped.length) {
    console.log(`Skipping ${skipped.length} post(s) that already exist (slug match):`);
    skipped.forEach(p => console.log(`  - ${p.slug}`));
  }
  if (!toAdd.length) {
    console.log('Nothing new to add — all 8 posts already exist by slug.');
    return;
  }

  const merged = [...existing, ...toAdd];

  console.log(`Adding ${toAdd.length} new post(s):`);
  toAdd.forEach(p => console.log(`  + ${p.slug}`));

  // Upsert — POST + merge-duplicates, same method the app itself uses to save
  // pages from Admin. This CREATES the row if id=custom_pages doesn't exist
  // yet, unlike a plain PATCH which only updates an existing row.
  const upsertRes = await fetch(`${SUPA_URL}/rest/v1/site_config`, {
    method: 'POST',
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({ id: 'custom_pages', data: merged, updated_at: new Date().toISOString() }),
  });

  const responseText = await upsertRes.text();
  if (!upsertRes.ok) {
    console.error('❌ Failed to write to Supabase:', upsertRes.status, responseText);
    console.error('\nIf this says something about RLS or permission denied, the anon key does not have write access to site_config — that needs a Supabase policy check, not a script fix.');
    process.exit(1);
  }

  // Verify by reading it back — don't just trust a 200
  const verifyRes = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.custom_pages&select=data`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  const verifyRows = await verifyRes.json();
  const verifyData = Array.isArray(verifyRows?.[0]?.data) ? verifyRows[0].data : [];
  const nowPresent = toAdd.filter(p => verifyData.some(v => v.slug === p.slug));

  if (nowPresent.length !== toAdd.length) {
    console.error(`❌ Wrote to Supabase but verification shows only ${nowPresent.length}/${toAdd.length} posts actually saved. Something is still wrong — check the site_config table directly in the Supabase dashboard.`);
    process.exit(1);
  }

  console.log('✅ Verified — new posts are confirmed live at:');
  toAdd.forEach(p => console.log(`   https://nexacustoms.ca/p/${p.slug}`));
  console.log('\nNext steps:');
  console.log('  1. Open /admin → Pages — hard refresh (Ctrl+Shift+R) if you don\'t see them right away, Admin caches pages locally');
  console.log('  2. Add a hero image to each new post with the image button');
  console.log('  3. Double-check title/slug if you want to tweak either');
  console.log('  4. Run: node scripts/generate-sitemap.mjs   (so the new posts get indexed)');
}

main().catch(err => { console.error(err); process.exit(1); });
