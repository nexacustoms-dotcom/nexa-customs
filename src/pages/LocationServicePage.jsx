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

      <button className="btn btn-primary" onClick={() => navigate(prod ? `/products/${prod.cat}` : '/quote')} style={{ marginBottom: 44 }}>
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
        <div className="D" style={{ fontSize: 20, marginBottom: 8 }}>Serving {page.city} from Mississauga</div>
        <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 18, lineHeight: 1.7 }}>Free digital proof before anything prints. Pickup at our Mississauga shop or delivery across the GTA.</p>
        <button className="btn btn-primary" onClick={() => navigate('/quote')}>Get a Free Quote →</button>
      </div>
    </div>
  );
}
