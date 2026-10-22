import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Each entry is fully custom copy — not a template with the city name
// swapped in. That distinction is what keeps these out of "doorway page"
// territory with Google.
const PAGES = {
  'window-graphics-toronto': {
    service: 'Vinyl Window Graphics',
    city: 'Toronto',
    productId: 'vinyl-window-graphics',
    metaTitle: 'Window Graphics Toronto — Storefront Vinyl Decals | Nexa Customs',
    metaDesc: 'Custom vinyl window graphics for Toronto storefronts. Perforated, opaque & clear vinyl. GTA-wide delivery from our Mississauga shop. Free proof.',
    h1: 'Window Graphics for Toronto Storefronts',
    intro: "Toronto's retail strips and office towers run on storefront visibility — a blank window is wasted marketing space on some of the highest foot-traffic streets in the country. We print and ship vinyl window graphics to businesses across Toronto from our shop in Mississauga, usually a 30–45 minute drive depending on where you're located in the city.",
    whyH2: 'What Toronto Businesses Order Most',
    whyBody: "Retail storefronts along dense commercial strips lean toward perforated vinyl — full-colour branding visible from the sidewalk while staff inside can still see out. Office towers and professional buildings in the downtown core more often go opaque or frosted, for privacy on ground-floor meeting rooms and reception windows facing hallways or the street.",
    faqs: [
      ['Should the graphic go on the inside or outside of the glass?', "Outside mounting is simpler and reads most vividly, but it's exposed to weather, scratches, and vandalism. Inside mounting (reading through the glass from outside) protects the graphic and typically lasts longer — but the file has to be printed mirror-reversed with a white ink backing, or it'll read backward. We handle that automatically once you tell us which side it's going on."],
      ["What's the difference between perforated and opaque vinyl?", "Perforated vinyl has thousands of tiny holes — from outside it shows a full, solid graphic; from inside, staff can still see through it like a screen door. Opaque vinyl fully blocks the view both directions, better for privacy than branding visibility."],
      ['How long do window graphics actually last?', "Exterior-mounted graphics on quality vinyl typically run 3–5 years before fading becomes noticeable. Interior-mounted graphics, protected from direct weather, often last longer."],
    ],
    ctaText: 'Get a Window Graphics Quote',
  },

  'window-graphics-brampton': {
    service: 'Vinyl Window Graphics',
    city: 'Brampton',
    productId: 'vinyl-window-graphics',
    metaTitle: 'Window Graphics Brampton — Storefront & Office Vinyl | Nexa Customs',
    metaDesc: 'Custom window graphics for Brampton storefronts & offices. Perforated, opaque or clear vinyl, professionally sized to your windows. Free proof.',
    h1: 'Window Graphics for Brampton Businesses',
    intro: "Brampton's mix of plaza retail, industrial-park showrooms, and strip-mall storefronts each call for a different window graphic approach — a warehouse showroom window isn't the same job as a salon front on a busy plaza. We measure and size every job to your actual windows rather than shipping a generic stock size, and we're a short drive away in Mississauga for same-day pickup if needed.",
    whyH2: 'Built for How Brampton Storefronts Actually Sit',
    whyBody: "A lot of Brampton retail sits in strip plazas with deep window setbacks and afternoon sun exposure — that combination fades cheap vinyl fast. We spec UV-resistant vinyl by default for anything west- or south-facing, not just as an upsell.",
    faqs: [
      ['Do you size graphics to my specific windows, or is it a stock size?', "We measure to your actual window dimensions — sending a stock-size decal that doesn't fit your storefront properly is one of the most common complaints about window graphics ordered sight-unseen online."],
      ["Can I get business hours or promo graphics that I'll want to swap out later?", 'Yes — for anything you plan to change seasonally (hours, promotions, sales), we can do it as a static cling instead of a permanent adhesive decal. Clings remove cleanly and reposition without residue.'],
      ['How much lead time do you need?', 'Standard turnaround is the same as our other signage products — a proof goes out for approval before anything prints, so the real lead time depends on how fast you approve the design.'],
    ],
    ctaText: 'Get a Window Graphics Quote',
  },

  'wallpaper-murals-toronto': {
    service: 'Custom Wallpaper & Wall Murals',
    city: 'Toronto',
    productId: 'indoor-wallpaper',
    metaTitle: 'Custom Wall Murals & Wallpaper Toronto | Nexa Customs',
    metaDesc: 'Custom printed wallpaper & wall murals for Toronto offices, restaurants & retail. Removable peel-and-stick or traditional paste. Free proof.',
    h1: 'Custom Wall Murals & Wallpaper for Toronto Spaces',
    intro: "A branded feature wall does more for a Toronto office reception or restaurant dining room than another framed print ever will. We print custom wall murals and wallpaper for spaces across Toronto — from a single accent wall to a full room — and ship or deliver from our Mississauga shop.",
    whyH2: 'Removable vs. Permanent — Which Toronto Businesses Actually Need',
    whyBody: "Most commercial tenants in Toronto are leasing, not owning, their space — which makes removable peel-and-stick wallpaper the practical default for offices and retail fit-outs, since it comes down clean at lease-end without damaging the wall underneath. Restaurants and spaces planning to stay put longer sometimes prefer traditional paste wallpaper for a slightly more premium, seamless finish.",
    faqs: [
      ['Will removable wallpaper actually come off clean when my lease ends?', "Peel-and-stick removable wallpaper is designed to lift off without pulling paint or leaving adhesive residue, provided the wall was properly prepped and primed before install — that prep step is what most DIY jobs skip, and skipping it is the #1 cause of a bad removal later."],
      ['How much does a custom mural actually cost?', 'Pricing scales with square footage and material — expect a noticeably wider range than a standard print job since a small accent wall and a full room are very different jobs. We quote based on your actual wall dimensions rather than a flat per-room rate.'],
      ['Can you match our brand colours exactly?', "We print to your supplied files, so if you provide exact brand colour codes (CMYK or Pantone), we print to that spec rather than guessing from a screen preview."],
    ],
    ctaText: 'Get a Custom Mural Quote',
  },

  'wallpaper-murals-oakville': {
    service: 'Custom Wallpaper & Wall Murals',
    city: 'Oakville',
    productId: 'indoor-wallpaper',
    metaTitle: 'Custom Wall Murals & Wallpaper Oakville | Nexa Customs',
    metaDesc: 'Custom printed wall murals & wallpaper for Oakville offices, restaurants & hospitality spaces. Removable or traditional. Free proof before printing.',
    h1: 'Custom Wall Murals & Wallpaper for Oakville Businesses',
    intro: "Oakville's boutique retail, hospitality, and professional-office spaces tend to invest in interior finishes that match the neighbourhood — a plain painted wall often undersells an otherwise well-designed space. We print custom murals and wallpaper for Oakville businesses and deliver from our shop in Mississauga.",
    whyH2: 'A Feature Wall That Matches a Higher-End Space',
    whyBody: "For hospitality and boutique retail specifically, print quality matters more than it does for a back-office wall — visible seams or banding in a mural behind a host stand or a fitting room read as cheap. We print on materials chosen for that level of finish, not just the lowest-cost option.",
    faqs: [
      ['Do you offer a sample before committing to a full mural?', "For larger installations, we can provide a small printed sample section so you can check colour and material in your actual lighting before we commit to the full print run."],
      ['What wall conditions cause problems with installation?', 'Textured walls, fresh paint that hasn\u2019t fully cured, and uneven plaster all affect how well wallpaper adheres and how visible seams are. We\u2019ll ask about wall condition before recommending peel-and-stick vs. traditional paste.'],
      ['Can this go in a space with high humidity, like near a kitchen or bathroom?', 'Standard wallpaper isn\u2019t ideal for consistently humid areas — tell us if that\u2019s the location and we\u2019ll spec accordingly rather than after the fact.'],
    ],
    ctaText: 'Get a Custom Mural Quote',
  },
  // ── Same-day / next-day printing: product pages (Mississauga pickup) ──
  'same-day-business-cards-mississauga': {
    service: 'Same-Day Business Cards',
    city: 'Mississauga',
    productId: 'most-popular-business-cards',
    metaTitle: 'Same-Day Business Cards Mississauga | Nexa Customs',
    metaDesc: 'Same-day business card printing in Mississauga. 50 to 1,000 cards, free proof, pickup at our shop. Serving Brampton, Oakville, Vaughan, Etobicoke & Toronto.',
    h1: 'Same-Day Business Cards in Mississauga',
    intro: "A meeting tomorrow, a trade show this weekend, a new hire starting Monday — sometimes business cards can't wait a week. We print business cards the same day for runs of 50 to 1,000, ready for pickup at our Mississauga shop. Customers come to us from Brampton, Oakville, Vaughan, Etobicoke and Toronto when the deadline is tight.",
    whyH2: 'How Same-Day Business Cards Work',
    whyBody: "Pick your card, upload your artwork and choose the same-day turnaround when you order — the added cost shows before you pay. We send a free digital proof, and once you approve it the cards go to print. Order by 12 PM (noon) for same-day pickup, and call (437) 997-9921 if you're close to the cutoff. Specialty options such as foil, soft-touch or magnetic cards may need extra time, so call first if you need one of those today.",
    faqs: [
      ['How many business cards can you print the same day?', "Same-day business cards are available for runs of 50 to 1,000. Need more than that? Request a quote and we'll tell you the fastest realistic turnaround for the larger run."],
      ['Is same-day delivery available, or is it pickup only?', "Same-day orders are pickup only at our Mississauga shop, 6033 Shawson Dr, Unit 40. We'll let you know when your cards are ready so you don't make a trip for nothing."],
      ['What if I only have a rough idea of my design?', "Send what you have. A clean, simple layout is the fastest to approve, and the free proof lets you catch any typo or spacing problem before anything prints — the one thing that costs you the same-day window is a proof that needs several rounds of changes."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'Order Same-Day Business Cards',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-flyers-mississauga': {
    service: 'Same-Day Flyers',
    city: 'Mississauga',
    productId: 'flyers',
    metaTitle: 'Same-Day Flyer Printing Mississauga | Nexa Customs',
    metaDesc: 'Same-day flyer printing in Mississauga. 50 to 1,000 flyers, gloss or matte, free proof, shop pickup. Serving Brampton, Oakville, Vaughan, Etobicoke & Toronto.',
    h1: 'Same-Day Flyer Printing in Mississauga',
    intro: "A grand opening on Saturday, a sale that starts tomorrow, an event you only just confirmed — flyers are the job that most often arrives with a deadline attached. We print flyers the same day for runs of 50 to 1,000, on gloss or matte stock, single or double sided, ready for pickup at our Mississauga shop.",
    whyH2: "What You Can Get Printed Same Day",
    whyBody: "Choose your size, stock and sides, upload your artwork and pick the same-day turnaround when you order. The added cost shows before you pay, and a free digital proof goes out before anything prints. Order by 12 PM (noon) for same-day pickup, and call (437) 997-9921 if time is tight. Businesses from Brampton, Oakville, Vaughan, Etobicoke and Toronto use us for last-minute promotions, open houses and event handouts.",
    faqs: [
      ['What is the largest same-day flyer order you can do?', "Same-day flyers are available for 50 to 1,000 pieces. For bigger quantities, request a quote and we'll tell you the fastest turnaround we can realistically offer."],
      ['Gloss or matte for a flyer that gets handed out?', "Gloss makes photos and bright colours pop and suits promotions and event handouts. Matte reads more upscale and is easier to write on, which suits real estate and professional services. Both are available for same-day orders."],
      ['Can I pick up my flyers the same day if I live outside Mississauga?', "Yes — same-day orders are pickup at our Mississauga shop, 6033 Shawson Dr, Unit 40, and customers regularly collect from Brampton, Oakville, Vaughan, Etobicoke and Toronto. We'll confirm when your order is ready."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'Order Same-Day Flyers',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-postcards-mississauga': {
    service: 'Same-Day Postcards',
    city: 'Mississauga',
    productId: 'postcards',
    metaTitle: 'Same-Day Postcard Printing Mississauga | Nexa Customs',
    metaDesc: 'Same-day postcard printing in Mississauga. 50 to 1,000 postcards on 14pt stock, free proof, shop pickup. Serving Brampton, Oakville, Vaughan & Toronto.',
    h1: 'Same-Day Postcard Printing in Mississauga',
    intro: "Postcards are the quickest way to put a professional, stiff-stock message in someone's hand — an announcement, a thank-you, a promo that mailed out too late the first time. We print postcards the same day for runs of 50 to 1,000, ready for pickup at our Mississauga shop.",
    whyH2: 'Why Postcards for a Tight Deadline',
    whyBody: "Postcards print on sturdier 14pt card stock, so they feel premium without needing an envelope, and they work for handing out, leaving behind or mailing. Pick your size and finish, upload your artwork and choose the same-day turnaround at checkout — the added cost shows before you pay. A free digital proof goes out before printing. Order by 12 PM (noon) for same-day pickup, and call (437) 997-9921 if you're close to the wire.",
    faqs: [
      ['How many postcards can be printed same day?', "Same-day postcards are available for 50 to 1,000 pieces. For larger mailings, request a quote and we'll confirm the timing."],
      ['Can you mail the postcards for me?', "We print them and have them ready for pickup at our Mississauga shop, 6033 Shawson Dr, Unit 40. Same-day orders are pickup only, so plan your own drop-off or mailing."],
      ['Should I choose a coating on my postcards?', "A coating makes the card feel more finished and resists fingerprints and handling. If your postcard will be written on or stamped, a matte finish is easier to work with than high-gloss."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'Order Same-Day Postcards',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-door-hangers-mississauga': {
    service: 'Same-Day Door Hangers',
    city: 'Mississauga',
    productId: 'door-hangers',
    metaTitle: 'Same-Day Door Hanger Printing Mississauga | Nexa Customs',
    metaDesc: 'Same-day door hanger printing in Mississauga. 50 to 1,000 door hangers, free proof, shop pickup. Serving Brampton, Oakville, Vaughan, Etobicoke & Toronto.',
    h1: 'Same-Day Door Hangers in Mississauga',
    intro: "Door hangers go straight to the door — no mailbox, no envelope, nobody to throw them out before reading. When a neighbourhood campaign, open house or service promotion has to start tomorrow, we print door hangers the same day for runs of 50 to 1,000, ready for pickup at our Mississauga shop.",
    whyH2: 'Who Orders Same-Day Door Hangers',
    whyBody: "Real estate agents promoting an open house, home service companies, restaurants and delivery businesses targeting a specific street, and political or community campaigns all lean on door hangers for local reach. Upload your design, choose your coating, and select the same-day turnaround at checkout — the added cost shows before you pay. A free digital proof goes out before printing. Order by 12 PM (noon) for same-day pickup, and call (437) 997-9921 if you need to confirm.",
    faqs: [
      ['How many door hangers can you print the same day?', "Same-day door hangers are available for 50 to 1,000. For a larger neighbourhood campaign, request a quote and we'll tell you the quickest realistic turnaround."],
      ['Are same-day door hangers pickup only?', "Yes — same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40. We'll let you know as soon as they're ready."],
      ['What should a door hanger include to get results?', "One clear offer, one call to action and a phone number or web address people can act on right away. Door hangers are read in a few seconds at the door, so less copy and a bold headline works better than a crowded layout."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'Order Same-Day Door Hangers',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'next-day-brochures-mississauga': {
    service: 'Next-Day Brochures',
    city: 'Mississauga',
    productId: 'brochures',
    metaTitle: 'Next-Day Brochure Printing Mississauga | Nexa Customs',
    metaDesc: 'Next-day brochure printing in Mississauga. Tri-fold, bi-fold & more, gloss or matte, free proof, shop pickup. Serving Brampton, Oakville, Vaughan & Toronto.',
    h1: 'Next-Day Brochure Printing in Mississauga',
    intro: "Brochures take a little longer than flat prints because they have to be folded cleanly, so we print them for next-day pickup instead of same day. When you need a tri-fold or bi-fold brochure for a meeting, presentation or event this week, that one day is usually all it takes.",
    whyH2: 'Choosing Your Fold',
    whyBody: "Tri-fold brochures give you six panels for a service list, pricing or a company overview, and bi-fold gives four panels for a simpler pitch. Z-fold, gate fold and double parallel are also available. Pick your fold, paper and finish, upload your artwork and choose the fastest turnaround when you order — any added cost shows before you pay. A free digital proof goes out before printing, and approving it quickly keeps your pickup date on track. Call (437) 997-9921 if your deadline is tight.",
    faqs: [
      ['Can brochures be printed the same day?', "Brochures are next-day because of the folding. If you need something in hand today, a same-day flyer or postcard may do the job — see our same-day pages."],
      ['Which fold should I pick?', "Tri-fold is the standard for service menus and company profiles. Bi-fold works well for a simpler message or a larger layout. If you aren't sure, tell us what the brochure has to say and we'll point you to the fold that fits."],
      ['Where do I pick up my brochures?', "At our Mississauga shop, 6033 Shawson Dr, Unit 40. Customers pick up from Brampton, Oakville, Vaughan, Etobicoke and Toronto, and we'll confirm when your order is ready."],
    ],
    ctaText: 'Order Next-Day Brochures',
    ctaTitle: 'Next-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  // ── Same-day printing: city pages (pickup in Mississauga) ──
  'same-day-printing-brampton': {
    service: 'Same-Day Printing',
    city: 'Brampton',
    productId: null,
    ctaTo: '/products',
    metaTitle: 'Same-Day Printing Brampton — Cards, Flyers | Nexa Customs',
    metaDesc: 'Same-day printing for Brampton businesses: business cards, flyers, postcards & door hangers, 50 to 1,000 pieces. Pickup at our Mississauga shop. Free proof.',
    h1: 'Same-Day Printing for Brampton Businesses',
    intro: "Brampton businesses work to tight schedules — a contractor quoting a job tomorrow, a plaza restaurant launching a promotion, a new hire who needs cards before their first client visit. We print business cards, flyers, postcards and door hangers the same day for runs of 50 to 1,000, and brochures for next-day pickup, at our Mississauga shop.",
    whyH2: 'What Brampton Customers Order Most',
    whyBody: "Trades and contractors lean on business cards and door hangers to win work street by street, while plaza retail and restaurants order flyers and postcards for openings and seasonal offers. Brampton's large new-build neighbourhoods make door hangers especially useful for targeting a specific community. Pick the product, choose the same-day turnaround when you order, and the added cost shows before you pay. We send a free digital proof, and approving it early keeps your pickup on schedule. Order by 12 PM (noon) for same-day pickup.",
    faqs: [
      ['Can I get my order the same day if I am in Brampton?', "Yes. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40. Order online, approve your proof, and we'll tell you when it's ready to collect."],
      ['What can be printed the same day?', "Business cards, flyers, postcards and door hangers in quantities from 50 to 1,000. Brochures are next-day because of the folding."],
      ['Do you deliver to Brampton?', "Same-day orders are pickup only. For orders that are not rushed, ask us about delivery options when you check out or request a quote."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'See Same-Day Products',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Brampton customers pick up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-printing-oakville': {
    service: 'Same-Day Printing',
    city: 'Oakville',
    productId: null,
    ctaTo: '/products',
    metaTitle: 'Same-Day Printing Oakville — Cards, Flyers | Nexa Customs',
    metaDesc: 'Same-day printing for Oakville businesses & agents: business cards, flyers, postcards & door hangers, 50 to 1,000 pieces. Mississauga pickup. Free proof.',
    h1: 'Same-Day Printing for Oakville Businesses',
    intro: "Oakville's professional offices, real estate agents and boutique retailers care how their printed pieces look and feel — and they still run into last-minute deadlines. We print business cards, flyers, postcards and door hangers the same day for runs of 50 to 1,000, and brochures for next-day pickup, at our Mississauga shop.",
    whyH2: 'What Oakville Customers Order Most',
    whyBody: "Agents and advisors order business cards and postcards, often with a premium finish, for open houses and client meetings. Boutiques and event organizers order flyers and door hangers for launches and seasonal events. Pick your product, choose the same-day turnaround when you order, and the added cost shows before you pay. A free digital proof goes out before printing; specialty finishes may need extra time, so call (437) 997-9921 first if you need one today. Order by 12 PM (noon) for same-day pickup.",
    faqs: [
      ['Is same-day printing available for Oakville customers?', "Yes. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40. We'll confirm when your order is ready."],
      ['Which products can be done the same day?', "Business cards, flyers, postcards and door hangers, in quantities from 50 to 1,000. Brochures are next-day because of the folding."],
      ['I need cards with a special finish — can that be same day?', "Standard orders can be. Finishes such as foil, soft-touch or magnetic may need more time, so call us before ordering to confirm what is possible for your deadline."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'See Same-Day Products',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Oakville customers pick up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-printing-vaughan': {
    service: 'Same-Day Printing',
    city: 'Vaughan',
    productId: null,
    ctaTo: '/products',
    metaTitle: 'Same-Day Printing Vaughan — Cards, Flyers | Nexa Customs',
    metaDesc: 'Same-day printing for Vaughan businesses: business cards, flyers, postcards & door hangers, 50 to 1,000 pieces. Pickup at our Mississauga shop. Free proof.',
    h1: 'Same-Day Printing for Vaughan Businesses',
    intro: "Vaughan mixes industrial parks, builders, trades and busy retail, and every one of them eventually needs printing yesterday. We print business cards, flyers, postcards and door hangers the same day for runs of 50 to 1,000, and brochures for next-day pickup, at our Mississauga shop.",
    whyH2: 'What Vaughan Customers Order Most',
    whyBody: "Builders and trades order business cards and door hangers for the neighbourhoods they work in, while retailers and restaurants order flyers and postcards for promotions and openings. Pick your product, choose the same-day turnaround when you order, and the added cost shows before you pay. We send a free digital proof, and quick approval is what keeps a same-day order on track. Order by 12 PM (noon) for same-day pickup.",
    faqs: [
      ['Can Vaughan customers get same-day printing?', "Yes. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40. Order online and we'll tell you when it's ready."],
      ['What is the maximum same-day quantity?', "Same-day is available for 50 to 1,000 pieces. For bigger runs, request a quote and we'll tell you the fastest turnaround we can offer."],
      ['What if my deadline is later in the week?', "Then you don't need the same-day option, and standard turnaround will cost less. Choose the turnaround that fits your date when you order."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'See Same-Day Products',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Vaughan customers pick up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-printing-etobicoke': {
    service: 'Same-Day Printing',
    city: 'Etobicoke',
    productId: null,
    ctaTo: '/products',
    metaTitle: 'Same-Day Printing Etobicoke — Cards, Flyers | Nexa Customs',
    metaDesc: 'Same-day printing for Etobicoke businesses: business cards, flyers, postcards & door hangers, 50 to 1,000 pieces. Mississauga pickup. Free digital proof.',
    h1: 'Same-Day Printing for Etobicoke Businesses',
    intro: "Etobicoke sits right next to Mississauga, which makes same-day pickup easy for the shops, restaurants, auto businesses and offices along its main streets. We print business cards, flyers, postcards and door hangers the same day for runs of 50 to 1,000, and brochures for next-day pickup, at our Mississauga shop.",
    whyH2: 'What Etobicoke Customers Order Most',
    whyBody: "Small local businesses order flyers and door hangers to promote a sale or a new service to the streets around them, and professionals order business cards when a client meeting or event comes up fast. Pick your product, choose the same-day turnaround when you order, and the added cost shows before you pay. A free digital proof goes out before printing. Order by 12 PM (noon) for same-day pickup.",
    faqs: [
      ['Is it practical to pick up same-day orders from Etobicoke?', "Yes. Our shop at 6033 Shawson Dr, Unit 40 is in Mississauga, and same-day orders are pickup only. We'll let you know when your order is ready so you can time your trip."],
      ['What can I get the same day?', "Business cards, flyers, postcards and door hangers in quantities from 50 to 1,000. Brochures are next-day because of the folding."],
      ['Can I call to check before I order?', "Of course. Call (437) 997-9921 if you are close to your deadline and want to confirm what is possible before placing the order."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'See Same-Day Products',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Etobicoke customers pick up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

  'same-day-printing-toronto': {
    service: 'Same-Day Printing',
    city: 'Toronto',
    productId: null,
    ctaTo: '/products',
    metaTitle: 'Same-Day Printing Toronto — Cards, Flyers | Nexa Customs',
    metaDesc: 'Same-day printing for Toronto businesses: business cards, flyers, postcards & door hangers, 50 to 1,000 pieces. Pickup at our Mississauga shop. Free proof.',
    h1: 'Same-Day Printing for Toronto Businesses',
    intro: "Toronto's startups, agents, restaurants and event teams run on short notice. When a meeting, launch or conference is tomorrow, we print business cards, flyers, postcards and door hangers the same day for runs of 50 to 1,000, and brochures for next-day pickup, at our Mississauga shop.",
    whyH2: 'What Toronto Customers Order Most',
    whyBody: "Agents and consultants order business cards and postcards ahead of meetings and open houses, while restaurants, shops and event organizers order flyers and door hangers to get a promotion out fast. Pick your product, choose the same-day turnaround when you order, and the added cost shows before you pay. We send a free digital proof, and approving it early keeps your pickup on schedule. Order by 12 PM (noon) for same-day pickup.",
    faqs: [
      ['Can I get same-day printing if I am in Toronto?', "Yes. Same-day orders are picked up at our Mississauga shop, 6033 Shawson Dr, Unit 40. Order online, approve your proof and we'll tell you when it's ready."],
      ['Do you offer same-day delivery in Toronto?', "Same-day orders are pickup only. If your order is not urgent, ask us about delivery options when you check out or request a quote."],
      ['What is the minimum and maximum for same-day?', "Same-day printing covers 50 to 1,000 pieces. For larger runs, request a quote and we will tell you the fastest turnaround we can offer."],
      ['What is the cutoff time for same-day printing?', "Place your order by 12 PM (noon) for same-day pickup. Orders placed after noon are normally ready the next business day. Our shop at 6033 Shawson Dr, Unit 40 is open Monday to Friday, 10 AM to 8 PM."],
    ],
    ctaText: 'See Same-Day Products',
    ctaTitle: 'Same-Day Pickup in Mississauga',
    ctaBody: 'Free digital proof before anything prints. Toronto customers pick up at our Mississauga shop, 6033 Shawson Dr, Unit 40.',
  },

};

export function getLocationPageSlugs() { return Object.keys(PAGES); }
export function getLocationPageMeta(slug) { return PAGES[slug] || null; }

export default function LocationServicePage({ slug }) {
  const navigate = useNavigate();
  const { prods, store } = useApp();
  const page = PAGES[slug];
  if (!page) return null;

  const prod = prods?.find(p => p.id === page.productId);

  return (
    <div className="W" style={{ padding: '48px 28px 80px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--mu)', marginBottom: 24 }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Products</span>
        <span>/</span>
        <span style={{ color: 'var(--tx)' }}>{page.service} — {page.city}</span>
      </div>

      <div className="badge-orange" style={{ marginBottom: 14 }}>{page.city}, Ontario</div>
      <h1 className="D" style={{ fontSize: 'clamp(30px,4.2vw,48px)', marginBottom: 18, lineHeight: 1.1 }}>{page.h1}</h1>
      <p style={{ fontSize: 15, color: 'var(--mu)', lineHeight: 1.8, marginBottom: 32, maxWidth: 700 }}>{page.intro}</p>

      <button className="btn btn-primary" onClick={() => navigate(page.ctaTo ? page.ctaTo : prod ? `/products/${prod.cat}` : '/quote')} style={{ marginBottom: 44 }}>
        {page.ctaText} →
      </button>

      <h2 className="D" style={{ fontSize: 'clamp(22px,3vw,30px)', marginBottom: 14 }}>{page.whyH2}</h2>
      <p style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.8, marginBottom: 40, maxWidth: 700 }}>{page.whyBody}</p>

      <h2 className="D" style={{ fontSize: 'clamp(22px,3vw,30px)', marginBottom: 20 }}>Common Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 44 }}>
        {page.faqs.map(([q, a]) => (
          <div key={q}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{q}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--mu)', lineHeight: 1.75 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 24, textAlign: 'center' }}>
        <div className="D" style={{ fontSize: 20, marginBottom: 8 }}>{page.ctaTitle || `Serving ${page.city} from Mississauga`}</div>
        <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 18, lineHeight: 1.7 }}>{page.ctaBody || 'Free digital proof before anything prints. Pickup at our Mississauga shop or delivery across the GTA.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/quote')}>Get a Free Quote →</button>
      </div>
    </div>
  );
}
