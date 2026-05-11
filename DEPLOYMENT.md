# Nexa Customs — Netlify Deployment Guide
## Complete Step-by-Step Instructions

---

## WHAT YOU NEED BEFORE STARTING
- The `nexa-customs-react.zip` file (already downloaded)
- A free Netlify account → netlify.com
- A free GitHub account → github.com
- Node.js installed on your computer → nodejs.org (download LTS version)
- Git installed → git-scm.com

---

## PART 1 — SET UP ON YOUR COMPUTER

### Step 1 — Unzip the project

**Windows:**
Right-click `nexa-customs-react.zip` → Extract All → choose a folder like `C:\Projects\nexa-react`

**Mac:**
Double-click the zip file. It extracts to a folder called `nexa-react`.

---

### Step 2 — Open terminal in the project folder

**Windows:**
Open the `nexa-react` folder → click the address bar at the top → type `cmd` → press Enter

**Mac:**
Open Terminal → type `cd ` (with a space) → drag the `nexa-react` folder into Terminal → press Enter

---

### Step 3 — Install dependencies

In the terminal, type exactly:

```
npm install
```

Wait for it to finish (1–2 minutes). You'll see a `node_modules` folder appear.

---

### Step 4 — Test it locally (optional but recommended)

```
npm run dev
```

Open your browser and go to: **http://localhost:5173**

You should see your full Nexa Customs website. Press Ctrl+C in terminal to stop it when done.

---

### Step 5 — Build for production

```
npm run build
```

This creates a `dist` folder. That's what gets deployed. You should see:
```
✓ built in 2.xx s
```

If you see any errors, contact support before continuing.

---

## PART 2 — PUSH TO GITHUB

### Step 6 — Create a GitHub repository

1. Go to **github.com** and sign in
2. Click the **+** button top right → **New repository**
3. Name it: `nexa-customs`
4. Set to **Private**
5. Do NOT check "Add README" or anything else
6. Click **Create repository**

---

### Step 7 — Connect your project to GitHub

Back in your terminal (inside the `nexa-react` folder), run these commands one by one:

```
git init
git add .
git commit -m "Initial commit — Nexa Customs React"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/nexa-customs.git
git push -u origin main
```

⚠️ Replace `YOUR-USERNAME` with your actual GitHub username.

GitHub will ask for your username and password. For the password, you need a **Personal Access Token** (GitHub no longer accepts regular passwords):
1. Go to **github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Check the **repo** checkbox
4. Click **Generate token**
5. Copy the token and use it as your password in the terminal

---

## PART 3 — DEPLOY ON NETLIFY

### Step 8 — Create Netlify account

1. Go to **netlify.com**
2. Click **Sign up** → choose **Sign up with GitHub**
3. Authorize Netlify to access your GitHub

---

### Step 9 — Create new site from GitHub

1. In Netlify dashboard, click **Add new site** → **Import an existing project**
2. Click **Deploy with GitHub**
3. Find and click on your `nexa-customs` repository
4. Netlify will show build settings — fill them in exactly like this:

| Setting | Value |
|---|---|
| Branch to deploy | `main` |
| Base directory | *(leave blank)* |
| Build command | `npm run build` |
| Publish directory | `dist` |

5. Click **Deploy site**

Netlify will build and deploy in about 2 minutes. You'll get a random URL like `https://amazing-tesla-abc123.netlify.app`

---

### Step 10 — Add the Netlify redirect file (IMPORTANT)

Because this is a React single-page app, you need to tell Netlify how to handle routing. Without this, refreshing any page will give a 404 error.

In your project folder, create a new file called `netlify.toml` in the root (same level as `package.json`):

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**How to create it:**

Windows: Open Notepad → paste the above → Save As → filename: `netlify.toml` → Save as type: All Files → save in the `nexa-react` folder

Mac: Open TextEdit → Format → Make Plain Text → paste the above → Save as `netlify.toml` in the `nexa-react` folder

Then push it to GitHub:

```
git add netlify.toml
git commit -m "Add Netlify redirect config"
git push
```

Netlify will automatically redeploy (takes ~1 minute).

---

### Step 11 — Connect your custom domain (nexacustoms.ca)

1. In Netlify dashboard → click your site → **Domain settings**
2. Click **Add a domain** → type `nexacustoms.ca` → click **Verify**
3. Click **Add domain**
4. Netlify will show you DNS records to add

**Log in to your domain registrar** (wherever you bought nexacustoms.ca — GoDaddy, Namecheap, etc.):

Add these DNS records:

| Type | Name | Value |
|---|---|---|
| A | @ | 75.2.60.5 |
| CNAME | www | your-site-name.netlify.app |

⚠️ Replace `your-site-name` with your actual Netlify site name.

DNS changes take 15 minutes to 48 hours to propagate.

---

### Step 12 — Enable HTTPS (free SSL)

Once your domain is connected:
1. Netlify → Domain settings → HTTPS section
2. Click **Verify DNS configuration**
3. Click **Provision certificate**

This is automatic and free via Let's Encrypt. Takes about 5 minutes.

---

## PART 4 — CONFIGURE YOUR ADMIN PANEL

### Step 13 — Open your admin panel

Go to: **https://nexacustoms.ca/admin**

Default password: **`nexa2024`**

**Change your password immediately:**
Admin → Settings tab → scroll to "Admin Password" → enter new password → Save

---

### Step 14 — Connect Supabase (saves orders)

1. Go to **supabase.com** → Sign up free → New project
2. Name it `nexa-customs` → set a database password → choose region closest to you (US East)
3. Wait for project to be ready (~2 minutes)
4. Go to **Settings → API** → copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ`)

**Create the orders table:**
In Supabase → click **SQL Editor** → paste this → click **Run**:

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  company TEXT,
  items TEXT,
  total NUMERIC,
  delivery TEXT,
  turnaround TEXT,
  status TEXT DEFAULT 'New',
  source TEXT DEFAULT 'Website',
  payment_method TEXT,
  stripe_pm_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

5. In your Admin panel → **Settings tab**:
   - Paste your Supabase URL
   - Paste your anon key
   - Click **Save Settings**

Now every order from your website is saved automatically.

---

### Step 15 — Set up Telegram alerts (instant phone notifications)

Get an alert on your phone within seconds of every new order.

**Get your Bot Token:**
1. Open Telegram on your phone
2. Search for `@BotFather`
3. Send the message: `/newbot`
4. Follow the prompts, give your bot a name
5. Copy the **Bot Token** it gives you (looks like `123456789:ABCdef...`)

**Get your Chat ID:**
1. Search for `@userinfobot` in Telegram
2. Send any message
3. It replies with your **Chat ID** (a number like `123456789`)

**Activate it:**
Admin → **Emails tab** → paste Bot Token and Chat ID → click **Save** → click **Send Test**

You should get a test message on Telegram within seconds.

---

### Step 16 — Set up Stripe (take card payments)

1. Go to **stripe.com** → create an account
2. Complete business verification
3. Go to **Developers → API keys**
4. Copy your **Publishable key** (starts with `pk_live_`)

Admin → **Settings tab** → paste the Publishable Key → Save

⚠️ For test mode first, use `pk_test_` key. Switch to `pk_live_` when ready for real payments.

---

### Step 17 — Set up EmailJS (send confirmation emails)

Free up to 200 emails/month.

1. Go to **emailjs.com** → Sign up free
2. **Add Email Service:** Email Services → Add Service → choose Gmail/Outlook → connect your account → copy **Service ID**
3. **Create Template:** Email Templates → Create New Template
   - Use these variables in your template:
   ```
   Order: {{order_id}}
   Customer: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}
   Items: {{order_items}}
   Total: {{total}}
   Payment: {{payment_method}}
   ```
   - Copy **Template ID**
4. **Get Public Key:** Account → General → Public Key → copy it

Admin → **Emails tab** → fill in Service ID, Template ID, Public Key, your email → Save

---

## PART 5 — ONGOING UPDATES

### How to update your site after making changes

Every time you change code on your computer, just run:

```
git add .
git commit -m "Describe what you changed"
git push
```

Netlify automatically detects the push and redeploys in ~1 minute. Zero downtime.

---

### How to update products and prices

**From Admin panel (no code needed):**
- Admin → **Products tab** → click Edit on any product → change name, description, badge, prices → Save
- Admin → **Pricing tab** → scroll to any product → change the prices directly → Save All Prices

Changes save to your browser's localStorage immediately and appear on the store.

---

### How to update appearance

Admin → **Appearance tab:**
- Change store name, tagline, hero text
- Update phone, email, address, hours
- Add logo image URL
- Update social media links

---

## QUICK REFERENCE

| What | Where |
|---|---|
| Admin panel | yourdomain.ca/admin |
| Default password | `nexa2024` |
| Artwork email | info@nexacustoms.ca |
| Supabase dashboard | app.supabase.com |
| Stripe dashboard | dashboard.stripe.com |
| Netlify dashboard | app.netlify.com |

---

## TROUBLESHOOTING

**Page shows 404 on refresh:**
Make sure `netlify.toml` file is in the root folder and was pushed to GitHub.

**Build fails on Netlify:**
Check that Build command is `npm run build` and Publish directory is `dist`.

**Admin password not working:**
Default is `nexa2024` — all lowercase, no spaces.

**Supabase orders not saving:**
Double-check the URL (must start with `https://`) and the anon key. Make sure you created the orders table using the SQL above.

**Stripe card not showing:**
Make sure you pasted the Publishable key (starts with `pk_`) not the Secret key. Check browser console for errors.

**Domain not connecting:**
DNS changes can take up to 48 hours. Check you added the A record pointing to `75.2.60.5`.

---

## SUPPORT

📞 For Nexa Customs technical issues: info@nexacustoms.ca
📖 Netlify docs: docs.netlify.com
📖 Supabase docs: supabase.com/docs
