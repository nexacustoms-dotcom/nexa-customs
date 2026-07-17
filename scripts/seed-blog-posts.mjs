#!/usr/bin/env node
// Push 8 SEO blog posts into Supabase site_config (id=custom_pages).
// Safe to re-run — skips any slug that already exists, so it never
// overwrites posts you've already edited in Admin.
//   node scripts/seed-blog-posts.mjs

const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

const NEW_POSTS = [
  {
    id: 'cp-' + (Date.now() + 1),
    title: 'Real Estate Sign Regulations in Mississauga & the GTA',
    slug: 'real-estate-sign-regulations-gta',
    nav: false,
    relatedCat: 'real-estate',
    metaDesc: 'Real estate sign rules in Mississauga, Toronto & the GTA — sizes, private-property placement, and when signs must come down.',
    content: `Putting up a "For Sale" or "Open House" sign feels routine — until a bylaw officer tags it, or worse, it gets confiscated the morning of your open house. Every GTA municipality regulates real estate signage a little differently, and the rules change more often than most agents realize.

## The one rule that's the same everywhere

Every municipality we've looked into requires real estate signs to sit completely on private property — never on a boulevard, road allowance, or public right-of-way, even if that strip of grass looks like part of the yard. That single rule causes most of the confiscations we hear about from clients.

- Get the property owner's permission before placing any sign, including directional signs on a neighbour's lawn
- Keep signs clear of sidewalks, sightlines at intersections, and utility boxes
- Remove "For Sale" signs once the property closes — most bylaws give you a short window, not an open-ended one

## Mississauga specifics

Mississauga's Sign By-law 54-2002 sets real size limits by zoning:

- Residential-zoned property: sign face capped at 1 m² (about 10.7 sq ft)
- Agricultural, industrial or commercial-zoned property: sign face capped at 4 m² (about 43 sq ft)

>>> Open house signs are only meant to be out immediately before and after the open house itself — not sitting on a lawn all weekend. Several GTA municipalities have specifically cracked down on this.

Sold-sign practices have shifted too — Mississauga now permits "Sold" and "Coming Soon" riders where it previously didn't, and enforcement varies by ward. Rules like this get revised more often than agents expect, so what was fine two years ago isn't automatically fine today.

## Toronto, Oakville, and neighbouring municipalities

Toronto runs its own temporary sign by-law with separate provisions for open house signs, and boards like TREB have actively lobbied for clearer rules as cities tighten enforcement. Oakville updated its bylaw to cap the number of open house signs a single realtor can place at once — put out too many and the whole batch can be confiscated. The takeaway for any agent working across municipal lines: don't assume Mississauga's rules travel with you into Toronto, Oakville, or Brampton.

## What this means for the sign itself

Getting the bylaw right is only half the job — the sign still needs to hold up outdoors, read clearly from a moving car, and survive a Canadian winter or a July heatwave without fading or curling. That's the print production side, which is where we come in.

>>> Not sure what size or material fits your listing? We print riders, directional signs, feature sheets, and yard sign frames sized to whatever your local bylaw allows — just tell us the municipality.`,
  },
  {
    id: 'cp-' + (Date.now() + 2),
    title: 'Vehicle Wrap Durability in Canadian Winters',
    slug: 'vehicle-wrap-winter-durability',
    nav: false,
    relatedCat: 'vehicle-graphics',
    metaDesc: 'How vehicle wraps hold up in GTA winters — salt, road grime, freeze-thaw cycles, and what actually shortens a wrap\'s lifespan.',
    content: `A vehicle wrap is a rolling billboard for your business — until road salt, ice scrapers, and a February cold snap start peeling the edges. Winter is the toughest season for wraps in this climate, and most of the damage we see is preventable.

## What actually damages a wrap in winter

- **Road salt and brine** — corrosive and abrasive, especially where it pools around wheel wells and lower panels
- **Freeze-thaw cycling** — vinyl contracts in the cold and expands again on a mild day, which stresses adhesive at panel edges and seams over a full season
- **Ice scrapers and brushes used carelessly** — the single most common cause of gouges we see on wrapped vehicles, usually from someone scraping a wrapped window or mirror the same way they would bare glass
- **Automatic car washes with stiff brushes** — fine for paint, harder on lifted vinyl edges

## What actually helps

- Hand wash or touchless car washes through the winter months — brush washes are the main avoidable risk
- Rinse the lower panels and wheel wells after driving on heavily salted roads when you can
- Never scrape ice directly off a wrapped surface — warm the vehicle first, or use a soft brush only
- Check panel edges and seams monthly for lifting — a small lifted corner caught early is a five-minute fix; left through a whole winter, it can pull moisture underneath and spread

## Material makes a real difference

Not all vinyl is built the same for cold-climate durability. Cast vinyl — the type we use for full and partial wraps — conforms better to body curves and holds its adhesive bond through temperature swings than cheaper calendared vinyl, which is more prone to shrinking and edge-lifting in the cold. Lamination matters too: a quality laminate adds a layer of protection against salt and UV without the wrap looking bulky.

>>> A well-installed cast-vinyl wrap with proper lamination should hold up through several GTA winters. If you're seeing edge-lifting or fading in under two years, the install or the material grade is usually the reason — not the climate itself.

## When to consider a repair vs. a full re-wrap

Small lifted edges and corner peels are usually a spot repair — reheating and resealing the affected section. Once you're seeing cracking across large panel areas, colour fade that's noticeably different panel-to-panel, or adhesive failure in multiple spots, a full re-wrap is usually more cost-effective than chasing repairs across an aging wrap.

We wrap fleet vehicles and personal vehicles year-round in Mississauga and across the GTA — if you're not sure whether your current wrap needs a repair or a replacement, send us a few photos and we'll give you a straight answer.`,
  },
  {
    id: 'cp-' + (Date.now() + 3),
    title: 'Banner Material Guide: Which Vinyl Is Right for Your Sign?',
    slug: 'banner-material-guide',
    nav: false,
    relatedCat: 'signs-banners',
    metaDesc: 'A plain-language guide to banner vinyl weights and finishes — indoor vs outdoor, mesh vs solid, and how to pick for your GTA business.',
    content: `"Just print me a banner" is a reasonable thing to say — until you're picking between a dozen vinyl weights and finishes that all look identical on a screen. Here's what actually changes between them, and when each one is the right call.

## Standard vinyl (13oz) — the everyday choice

This is the workhorse banner material for most storefront, event, and promotional signage. It's fully opaque, holds colour well, and is durable enough for weeks or months of outdoor use with grommets for hanging.

- Best for: storefront banners, sales promotions, event signage, sports team banners
- Lifespan outdoors: roughly one season to a year depending on sun exposure and wind

## Heavy-duty vinyl (18oz)

Thicker and more tear-resistant than standard 13oz, worth it for banners that'll be up longer, in a high-wind location, or handled/rolled up and reused repeatedly (trade shows, seasonal signage you store and reuse).

- Best for: long-term outdoor installs, repeat-use trade show banners, larger sizes where sag and tearing become a real risk

## Mesh vinyl

Perforated to let wind pass through instead of catching it like a sail — critical for anything mounted on fencing, scaffolding, or a high, exposed location where a solid banner would tear grommets out or rip in the first strong wind.

- Best for: fence banners, building wrap, construction site signage, anywhere wind load is a real concern
- Trade-off: slightly less vibrant colour than solid vinyl since the image prints across a perforated surface

## Backlit / light-box vinyl

Designed to be evenly lit from behind without hot spots — used for illuminated sign boxes and light-up displays rather than a general-purpose banner.

- Best for: illuminated storefront signage, light boxes at trade shows or in-store displays

## Indoor-only options

If a banner is never going outside, lighter-weight material (like a fabric or a lighter-weight vinyl) can look sharper for the same cost, since it doesn't need to survive rain, UV, or wind. Worth specifying "indoor only" when ordering so we don't default to outdoor-rated material you don't need.

| Material | Best for | Outdoor rated |
| --- | --- | --- |
| 13oz standard vinyl | Everyday signage, promotions | Yes |
| 18oz heavy-duty vinyl | Long-term or high-wind installs | Yes |
| Mesh vinyl | Fencing, scaffolding, wind-exposed sites | Yes |
| Backlit vinyl | Illuminated sign boxes | Depends on housing |
| Indoor fabric/vinyl | Trade shows, in-store displays | No |

>>> Not sure which weight fits your install location? Tell us where the banner is going up — building height, exposure, how long it needs to last — and we'll recommend the material rather than guess.`,
  },
  {
    id: 'cp-' + (Date.now() + 4),
    title: 'Flyer Distribution Rules in Canada: What Businesses Need to Know',
    slug: 'flyer-distribution-rules-canada',
    nav: false,
    relatedCat: 'flyers-postcards',
    metaDesc: 'Flyer distribution rules in Canada — Canada Post opt-outs, municipal "no flyers" bylaws, and how to distribute legally and effectively.',
    content: `Printing a great flyer is only half the job — distributing it without violating a municipal bylaw or getting flagged for ignoring opt-out notices is the part that trips up a lot of small businesses.

## The Canada Post opt-out system

Canada Post runs a Consumers' Choice program: any household can post a note or sticker on their mailbox saying they don't want unaddressed advertising mail, and Canada Post is expected to honour it going forward. If you're distributing through Canada Post's Neighbourhood Mail (unaddressed admail) service, those opted-out addresses are excluded from delivery automatically as part of using that service.

## Municipal "no flyers" bylaws — separate from Canada Post

A number of Canadian cities layer their own bylaw on top of the Canada Post system, specifically covering hand-delivered and door-to-door flyers that don't go through the postal system at all:

- **Ottawa** runs a formal Voluntary Admail Reduction Program (originally the "No Junk Mail Program," in place since 1997) — residents buy or display a sticker on their mailbox or mail slot, and distributors aren't supposed to leave unaddressed material there
- **Calgary** prohibits distributors from delivering flyers anywhere a "No Flyers" sign is posted, under its community standards bylaw
- Several other municipalities have discussed or passed similar rules, some with real fines attached for repeat violations by a distribution company

>>> These bylaws exist because of litter complaints, not content complaints — they're aimed at reducing waste, not regulating what a flyer says. That means compliance is straightforward: respect the sign, and you're fine.

## What this means practically for door-to-door distribution

- Unaddressed flyers (no name on them) generally fall outside Canada Post's legal monopoly on delivering addressed letters, so hand-delivery by a private distributor is legal in most cases
- Respect any visible "No Flyers" / "No Junk Mail" sign or sticker on a mailbox or door — this is the single rule that shows up across every municipality we've checked
- Avoid leaving flyers loose on driveways or lawns where they can blow away and become litter — some municipal proposals specifically target this practice with fines
- If you're distributing through Canada Post rather than a private carrier, opted-out addresses are handled for you automatically as part of their service

## Getting your flyer into the fewest hands that will just toss it

Beyond compliance, targeting matters more than volume. A flyer that lands with someone who's already opted out of admail, or gets left in a spot where it blows into a storm drain, is money spent for nothing. Whether you're going through Canada Post's Neighbourhood Mail or a local hand-delivery crew, tightening your distribution area to where your actual customers are tends to outperform a wider, less targeted drop.

We print flyers and postcards in a range of stocks and finishes for GTA businesses — if you're planning a distribution run and want print-ready sizing that matches Canada Post's Neighbourhood Mail specs, we can set that up before you order.`,
  },
  {
    id: 'cp-' + (Date.now() + 5),
    title: 'Restaurant Menu Redesign: A Practical Guide',
    slug: 'restaurant-menu-redesign-guide',
    nav: false,
    relatedCat: 'restaurant',
    metaDesc: 'A practical guide to redesigning a restaurant menu — layout, pricing psychology, materials, and common mistakes that hurt sales.',
    content: `Menus quietly shape what people order more than most restaurant owners realize. A cluttered layout, prices lined up in a column, or the wrong paper stock can all work against the dishes you actually want to sell.

## Layout: where eyes actually go first

Diners don't read a menu top to bottom — most scan in a loose pattern, often landing first on the upper-right area of a page. That real estate is where your highest-margin or signature dishes belong, not buried in a long list further down.

- Group items logically (starters, mains, desserts) but don't be afraid to break out a small "Chef's Picks" or "Popular" section — it draws the eye and gives people a shortcut when they're overwhelmed by choice
- Limit each section to a reasonable number of items — a shorter, curated list is easier to decide from than an exhaustive one, and easier for kitchen staff to execute consistently

## Pricing psychology, in plain terms

- Dropping the dollar sign (or the whole "$9.00" format) in favour of a plain "9" reads less like a transaction and slightly softens price sensitivity — a small, well-documented effect in menu design
- Avoid lining prices up in a straight column down the right edge — it turns the page into a price-comparison list before people even read the dish descriptions
- Anchor pricing works: placing one clearly higher-priced item near the top of a section makes everything below it look more reasonable by comparison

## Descriptions that actually sell

A short, specific description outperforms a generic one — "hand-pulled noodles, slow-braised short rib, charred scallion oil" tells a story; "beef noodle soup" doesn't. You don't need paragraphs, just enough specific, sensory detail to make someone picture the dish.

## Material and finish matter more than people expect

- **Laminated menus** hold up to spills and heavy handling — the right call for a menu that gets used hundreds of times before replacement
- **Uncoated, heavier stock** feels more premium for a menu you're replacing seasonally, but won't survive spills the way lamination does
- **Table tents and inserts** are the cheapest way to test a seasonal item or promotion without reprinting the whole menu

>>> If you're testing new pricing or seasonal dishes, a small insert or table tent lets you iterate fast without committing to a full menu reprint every time something changes.

## The most common mistake we see

Cramming too much onto one page to avoid printing a second page. It almost always backfires — a tight, cluttered layout is harder to read, slows down ordering, and buries the dishes with the best margins in visual noise. A slightly longer menu with breathing room and smart pricing structure sells better than a dense one, even if it costs a little more to print.

We print menus, table tents, and inserts in laminated and uncoated finishes for restaurants across the GTA — happy to talk through layout before you commit to a final design.`,
  },
  {
    id: 'cp-' + (Date.now() + 6),
    title: 'Business Card Finishes Explained: Which One Fits Your Brand?',
    slug: 'business-card-finishes-guide',
    nav: false,
    relatedCat: 'business-cards',
    metaDesc: 'Business card finishes compared — matte, gloss, soft-touch, spot UV — and which one actually fits your industry and budget.',
    content: `The finish on a business card changes how it feels in someone's hand before they've read a word on it — and that first impression matters more for a business card than almost any other print piece, since it's usually handed over during an actual conversation.

## Matte

A flat, non-reflective finish that reads as clean and modern, and takes ink and pen marks well if someone wants to jot a note on the back.

- Best for: professional services, consultants, anyone wanting a understated, confident look
- Trade-off: shows fingerprints and light wear slightly more than gloss over time

## Gloss

Reflective and vibrant — makes photography and bold colour really pop, at the cost of a bit more glare under bright light and visible fingerprints.

- Best for: creative industries, food/hospitality, anything relying on vivid colour or photography
- Trade-off: least premium-feeling of the common finishes, though also the most affordable

## Soft-touch (soft-touch laminate)

A velvety, slightly rubberized coating that feels distinctly premium — this is usually the finish people comment on when they receive a card.

- Best for: businesses wanting to signal quality or premium positioning — real estate, high-end retail, personal branding
- Trade-off: highest cost of the common finishes, and shows fingerprint oils more visibly than matte

## Spot UV

A raised, glossy accent applied only to specific elements (a logo, a border, key text) over an otherwise matte card — the contrast between flat matte and glossy raised detail is what makes it stand out.

- Best for: brands wanting one standout design element without going full-gloss on the whole card
- Trade-off: requires a design built around the effect — it doesn't work as a blanket "add spot UV" request on any layout without adjusting the design first

## 14pt vs 16pt stock

Beyond the finish, the card stock thickness itself changes how substantial a card feels:

- **14pt** is the standard weight for most business cards — sturdy without feeling excessive
- **16pt** feels noticeably more substantial in hand, often paired with soft-touch or spot UV for a fully premium card

>>> If you're not sure which finish fits, think about where the card gets handed over. A contractor's card that lives in a truck glovebox should probably prioritize durability over delicate finishes; a card handed over at a gallery opening can lean into soft-touch or spot UV without a second thought.

We print all of these finishes in-house and can put together a small sample pack if you want to feel the difference before committing to a full order.`,
  },
  {
    id: 'cp-' + (Date.now() + 7),
    title: 'Custom Labels 101: A Beginner\'s Guide to Ordering Labels',
    slug: 'custom-labels-101',
    nav: false,
    relatedCat: 'labels-stickers',
    metaDesc: 'A beginner\'s guide to ordering custom labels — materials, shapes, waterproofing, and what to check before you submit artwork.',
    content: `Ordering custom labels for the first time comes with more decisions than people expect — material, finish, shape, and waterproofing all affect both how the label looks and how long it survives on the product.

## Roll labels vs. sheet labels

- **Roll labels** are the standard for anything going through an automated or semi-automated applicator, or for larger production runs — dispensed one at a time off a roll
- **Sheet labels** (multiple labels per flat sheet) suit smaller runs or hand-applied labelling where a roll dispenser isn't practical

## Material: paper vs. vinyl (BOPP)

- **Paper labels** are the most affordable option and work well for indoor use, dry products, or short-term applications where waterproofing isn't a concern
- **BOPP (vinyl) labels** are waterproof, oil-resistant, and far more durable — the standard choice for anything that might get wet, refrigerated, or handled roughly: cosmetics, food and beverage, cleaning products, outdoor use

>>> If a label is going on anything that touches condensation, water, or oil — a cold beverage bottle, a bath product, a kitchen container — paper is the wrong call even if it's cheaper upfront. It'll wrinkle or tear.

## Finish options

- **Matte** — no glare, easy to read under most lighting, common for a clean/modern brand look
- **Gloss** — vibrant colour, more shine, common for food and beverage labels wanting shelf presence
- **Clear (transparent)** — gives a "no-label look" where the background shows through — popular for premium cosmetics and craft beverages, but requires higher-contrast artwork since there's no white backing behind it
- **Holographic** — reflective, eye-catching, mostly used for security/anti-counterfeit purposes or a deliberately flashy retail look

## Die-cut shapes vs. standard shapes

Standard shapes (circle, rectangle, oval) are the most cost-effective since they don't require a custom cutting die. A fully custom die-cut shape that follows your logo's exact outline looks distinctive but usually costs more and needs longer lead time, since a cutting die has to be made first.

## Before you submit artwork

- Build your file at the actual label size, not a scaled-down version — text that looks fine shrunk down in a design program can turn illegible at real size
- Include bleed (extra artwork past the cut line) so there's no thin white sliver at the edge if the cut shifts slightly
- Keep any text or logo detail a reasonable distance from the edge — really tight to the cutline is where small registration shifts become visible
- If you want a background removed for a die-cut sticker rather than a rectangular label, flag that up front — it changes both the artwork prep and the cutting process

We handle die-cut and standard-shape labels in paper and BOPP, with matte, gloss, clear, and holographic finishes — happy to recommend a material once you tell us what the label's going on.`,
  },
  {
    id: 'cp-' + (Date.now() + 8),
    title: 'Trade Show Display Guide: Choosing the Right Setup',
    slug: 'trade-show-display-guide',
    nav: false,
    relatedCat: 'foam-boards',
    metaDesc: 'Trade show display options compared — retractable banners, pop-up backdrops, foam board signage — and how to pick for your booth size.',
    content: `A trade show budget disappears fast once travel, booth fees, and staff time are accounted for — which makes the display itself one of the few costs you have full control over, and one of the easiest to get wrong by either overspending or showing up under-prepared.

## Retractable banner stands

The most common and most portable option — a rolled banner inside a base that pulls up and locks into place in under a minute, no tools required.

- Best for: single-person setup, small booth footprints, events where you're moving locations frequently
- Trade-off: limited to one panel's width — not a full backdrop presence on its own

## Pop-up fabric backdrops (tension fabric displays)

A curved or straight frame with a printed fabric skin stretched over it — creates a full-width backdrop presence, still packs down into a manageable case.

- Best for: booths wanting a full backdrop wall without the bulk of a rigid structure
- Trade-off: more setup time than a retractable banner, usually a two-person job the first few times

## Foam board and rigid panel signage

Lightweight but rigid — holds a flat, perfectly smooth print surface without the give of fabric, good for smaller directional signs, table-top signage, or mounted graphics within a larger booth build.

- Best for: table-top signs, directional signage, smaller graphics within a bigger booth setup
- Trade-off: not self-standing on its own the way a banner stand or pop-up frame is — needs an easel, frame, or mounting surface

## Table throws and counter graphics

Often overlooked, but a branded table throw over an otherwise bare folding table instantly looks more intentional — cheap relative to the visual impact, especially for smaller booth budgets.

>>> If your budget only covers one display item, a retractable banner or a table throw both punch well above their cost — a full tension-fabric backdrop is the better investment once you're doing several shows a year and want a consistent, reusable backdrop.

## Matching the display to your booth size

- **10x10 booth**: one retractable banner plus a table throw usually covers it without feeling empty or cluttered
- **10x20 or larger**: a tension-fabric backdrop becomes worth the investment, since a lone banner stand will look sparse against that much open space
- **Shared or rotating locations**: prioritize whatever packs down smallest and sets up fastest — a retractable banner over a modular wall system, most of the time

We print retractable banners, tension-fabric backdrops, and rigid foam board signage for GTA businesses heading to trade shows — tell us your booth size and we can recommend a setup rather than have you guess.`,
  },
];

async function main() {
  console.log('Fetching current custom_pages from Supabase...');
  const res = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.custom_pages&select=data`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  if (!res.ok) {
    console.error('Failed to fetch site_config:', res.status, await res.text());
    process.exit(1);
  }
  const rows = await res.json();
  const existing = Array.isArray(rows?.[0]?.data) ? rows[0].data : [];
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

  const putRes = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.custom_pages`, {
    method: 'PATCH',
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ data: merged, updated_at: new Date().toISOString() }),
  });

  if (!putRes.ok) {
    console.error('Failed to update site_config:', putRes.status, await putRes.text());
    process.exit(1);
  }

  console.log('✅ Done. New posts are live at:');
  toAdd.forEach(p => console.log(`   https://nexacustoms.ca/p/${p.slug}`));
  console.log('\nNext steps:');
  console.log('  1. Open /admin → Pages, add a hero image to each new post with the image button');
  console.log('  2. Double-check title/slug if you want to tweak either');
  console.log('  3. Run: node scripts/generate-sitemap.mjs   (so the new posts get indexed)');
}

main().catch(err => { console.error(err); process.exit(1); });
