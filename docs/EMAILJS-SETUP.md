# EmailJS: switching your order status template to the new emails

1. In Vercel, open the project -> Settings -> Environment Variables and copy the VALUE of `VITE_EJS_STATUS_TPL`
   (it looks like `template_abc123`). That value is the ID of one of your EmailJS templates.
2. In EmailJS, open Email Templates and find the template with that ID. Make a copy of it first.
3. Replace the ENTIRE content of the template with exactly this one line, and nothing else:

       {{{email_html}}}

   (Do not add comments or any other text: anything you leave in the template is sent to customers.)
4. On the template's Settings tab set:
   - Subject:      {{subject}}
   - To Email:     {{to_email}}
   - From Name:    {{from_name}}
   - Reply To:     {{reply_to}}
5. Save, then use Admin -> Notifications -> "Send test email" to check it.

Leave your "contact us" template alone.
