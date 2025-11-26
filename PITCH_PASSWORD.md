# Password Protection for Pitch Deck

The `/pitch` page is now protected by a password gate.

## Default Password

**Current Password**: `synapsify2025`

## How It Works

- The `PasswordGate` component wraps the pitch deck content
- Password is checked client-side via sessionStorage
- Once authenticated, the session persists until the browser tab is closed
- No server-side authentication required (suitable for simple protection)

## Customizing the Password

### Option 1: Environment Variable (Recommended for Production)

1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PITCH_PASSWORD=your_custom_password
   ```

2. Update `app/pitch/page.tsx`:
   ```tsx
   <PasswordGate correctPassword={process.env.NEXT_PUBLIC_PITCH_PASSWORD}>
     {/* ... */}
   </PasswordGate>
   ```

### Option 2: Direct Override

Update the `PasswordGate` component in `app/pitch/page.tsx`:

```tsx
<PasswordGate correctPassword="your_custom_password">
  {/* ... */}
</PasswordGate>
```

## Security Notes

⚠️ **Important**: This is a **client-side password gate** suitable for:
- Keeping casual visitors out
- Light protection for sharing with specific audiences
- Preventing accidental exposure

**Not suitable for**:
- Highly sensitive information
- Protection against determined attackers
- Compliance requirements

For stronger security, consider implementing server-side authentication with Next.js middleware.

## Testing

To test locally:
1. Navigate to `/pitch`
2. Enter password: `synapsify2025`
3. Access granted for the session
