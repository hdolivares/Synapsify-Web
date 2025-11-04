# Waitlist API Setup

## Current Implementation

The waitlist API (`/api/waitlist`) currently stores data in memory. This is fine for development and testing, but for production, you should integrate with a database.

## Database Options

### Option 1: Supabase (Recommended - Free Tier Available)

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Create a table:
   ```sql
   CREATE TABLE waitlist (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
4. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
5. Update `app/api/waitlist/route.ts` to use Supabase

### Option 2: MongoDB Atlas (Free Tier Available)

1. Create a MongoDB Atlas account
2. Create a cluster
3. Install MongoDB driver:
   ```bash
   npm install mongodb
   ```
4. Update `app/api/waitlist/route.ts` to use MongoDB

### Option 3: PlanetScale (MySQL - Free Tier Available)

1. Create a PlanetScale account
2. Create a database
3. Install Prisma:
   ```bash
   npm install @prisma/client prisma
   ```
4. Update `app/api/waitlist/route.ts` to use Prisma

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# For Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Or for MongoDB
MONGODB_URI=your_mongodb_connection_string

# Or for PlanetScale
DATABASE_URL=your_database_url
```

## Example Supabase Integration

Replace the POST handler in `app/api/waitlist/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email } = body

    // Validation...
    
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
      }])

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully added to waitlist!', data },
      { status: 200 }
    )
  } catch (error) {
    // Error handling...
  }
}
```

## Security Notes

- The current implementation uses in-memory storage (data is lost on server restart)
- In production, always validate and sanitize user input
- Consider adding rate limiting to prevent abuse
- Add CAPTCHA or similar to prevent bots
- Consider adding email verification

