# Security setup — do these steps IN ORDER

Why: until now, the admin password was checked inside the visitor's browser, and the database
accepted changes from anyone holding the public key. This setup adds a real server-side login
(Supabase Authentication) and database rules (Row Level Security).

Files for this are in `supabase/security/`.

## Part 1 — Before deploying (nothing breaks yet)

1. **Create your admin user.** Supabase → *Authentication* → *Users* → *Add user* → *Create new user*.
   - Email: an address you control (this becomes the admin login).
   - Password: long and unique (16+ characters, use a password manager).
   - Tick **Auto Confirm User**.
2. **Turn off public sign-ups.** Supabase → *Authentication* → *Sign In / Providers* (or *Settings*) →
   switch **"Allow new users to sign up"** OFF.
3. **Add the order-tracking function.** Supabase → *SQL Editor* → paste all of `supabase/security/01_track_order.sql` → *Run*.

## Part 2 — Deploy and test

4. Deploy this version (`git add .`, `git commit`, `git push`) and wait for Vercel to turn green.
5. Open `nexacustoms.ca/admin` in a **private/incognito window**.
   - It now asks for **Email + Password**. The old password `nexa2024` must NOT work.
   - Sign in with the email/password from step 1. Check Orders loads.
6. Open `nexacustoms.ca/order-status` and look up a real order (number + email). It must work.

## Part 3 — Lock the database

7. Open `supabase/security/02_lock_down.sql`, replace `YOUR-ADMIN-EMAIL@example.com`
   (it appears twice) with your admin email, paste it into the SQL Editor and *Run*.
8. Run `node scripts/security-check.mjs`. Every line should show ✅.
9. Test the site again:
   - Home and product pages load (private window).
   - Place a test order (Stripe test mode) with an artwork upload.
   - Submit a quote request.
   - In Admin: Orders loads, change an order status, save a product price, upload an image.

## If something breaks

Run `supabase/security/03_emergency_rollback.sql` in the SQL Editor. It puts the database back to
how it was (open). Then tell Claude what failed, and run step 7 again once it is fixed.

## Notes

- Admin password: change it in Supabase → Authentication → Users (*Send password recovery*).
- Scripts `seed-blog-posts*.mjs` and `enable-blog-nav.mjs` can no longer write with the public key
  (that is the point). Manage blog posts in Admin → Pages instead.
- Customer artwork files are still reachable by anyone who has the exact file link. Links are not
  listed anywhere public, but they are not secret. A private bucket is a possible next step.
- Still to do: the Telegram bot token (`VITE_TG_TOKEN`) is built into the public website code. Move
  order notifications to a server-side function so the token is never exposed.

## Proof approval page (added later)

Run `supabase/security/04_proofs.sql` once in the Supabase SQL Editor. It creates the table and the two small
functions behind the customer's "Review and approve your proof" page (`/proof/<private link>`).
Until you run it, the "Proof ready" email still works but links straight to the proof file.
