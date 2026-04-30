# Alloe Health - Environment Variables
# Copy this file to .env.local and fill in the values

# ===========================================
# CLIENT-SIDE VARIABLES (NEXT_PUBLIC_*)
# ===========================================
# These are exposed to the browser bundle

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
NEXT_PUBLIC_APP_NAME=Alloe Health
NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro
NEXT_PUBLIC_SITE_URL=https://alloehealth.com
NEXT_PUBLIC_BASE_URL=https://alloehealth.com
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
FF_UNIVERSAL_AUTOSAVE=true

# ===========================================
# SERVER-SIDE VARIABLES (PRIVATE)
# ===========================================
# These are only available on the server

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/alloehealth

# Supabase (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe (server-side only)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRICE_ALL_ACCESS=price_your-price-id
STRIPE_PRICE_GIFT=price_your-gift-price-id

# NextAuth (server-side only)
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=https://alloehealth.com

# Admin (server-side only)
ADMIN_SECRET_KEY=your-admin-secret-key

# External APIs (server-side only)
NEXT_PUBLIC_META_API_TOKEN=your-meta-token
GSH_TOKEN=your-gsh-token
GSH_LOCATION_ID=your-location-id
ASAAS_API_KEY=your-asaas-key
WEBHOOK_ASAAS_URL=https://your-domain.com/api/webhooks/asaas

# Environment
NODE_ENV=development
