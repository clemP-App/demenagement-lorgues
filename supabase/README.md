# Configuration Supabase — checklist

## Auth anonyme (obligatoire)

Dashboard → **Authentication** → **Providers** → **Anonymous Sign-Ins** → **Enable**

Sans cela, la création/rejoindre d'espace échouera.

## Scripts SQL

Exécuter dans l'ordre :

1. `schema.sql`
2. `policies.sql`
3. `functions.sql`

## Realtime

**Database** → **Replication** → activer pour `items`, `comments`, `activity_log`

## Variables d'environnement

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```
