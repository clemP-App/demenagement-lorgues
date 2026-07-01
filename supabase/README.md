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

### Correctif invite_code ambiguë

Si vous voyez `column reference "invite_code" is ambiguous`, exécutez `supabase/fix-invite-code.sql` dans l'éditeur SQL.


```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```
