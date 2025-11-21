import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')

    if (token_hash && type) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
        })

        if (error) {
            console.error('Error verifying OTP:', error)
            return NextResponse.redirect(requestUrl.origin + '/?error=auth_failed')
        }
    }

    // Redirect to arcade after successful authentication
    return NextResponse.redirect(requestUrl.origin + '/arcade')
}
