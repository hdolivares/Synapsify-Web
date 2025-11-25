# Async/Await Fix in Client Components

## Problem
Next.js 14.2.33 was throwing an error:
```
Error: async/await is not yet supported in Client Components, only Server Components.
```

This error occurs when React tries to track Promises (Thenables) in Client Components, which isn't supported in React 18.

## Solution
Replaced `async/await` in `useEffect` hooks with `.then()` chains to avoid React's Promise tracking.

## Files Fixed

### 1. `components/WaitlistSection.tsx`
**Before:**
```tsx
const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
}
checkUser()
```

**After:**
```tsx
supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user)
}).catch(() => {
    setUser(null)
})
```

### 2. `app/arcade/page.tsx`
**Before:**
```tsx
const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    // ...
}
checkAuth()
```

**After:**
```tsx
supabase.auth.getSession().then(({ data: { session } }) => {
    // ...
}).catch(() => {
    router.push('/')
})
```

### 3. `components/BugInvaders.tsx`
**Before:**
```tsx
const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
}
checkUser()
```

**After:**
```tsx
supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user)
}).catch(() => {
    setUser(null)
})
```

### 4. `components/Leaderboard.tsx`
**Before:**
```tsx
const fetchScores = async () => {
    const { data, error } = await supabase.from('leaderboard')...
}
fetchScores()
```

**After:**
```tsx
supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(10)
    .then(({ data, error }) => {
        // ...
    })
    .catch((error) => {
        console.error('Error fetching scores:', error)
    })
    .finally(() => {
        setLoading(false)
    })
```

## Note
Async functions in **event handlers** (like `handleSubmit`) are still fine - they're called on user interaction, not during render/useEffect.

## Result
✅ Async/await error resolved
✅ Page loads correctly
✅ All Supabase calls work properly

