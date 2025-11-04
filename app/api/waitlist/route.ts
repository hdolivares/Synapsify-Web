import { NextRequest, NextResponse } from 'next/server'

// For now, we'll store data in memory (in production, use a database)
// TODO: Replace with actual database (Supabase, MongoDB, etc.)
let waitlistData: Array<{
  firstName: string
  lastName: string
  email: string
  timestamp: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email } = body

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    if (waitlistData.some((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { message: 'This email is already on the waitlist' },
        { status: 400 }
      )
    }

    // Add to waitlist
    const entry = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
    }

    waitlistData.push(entry)

    // TODO: In production, save to database here
    // Example with Supabase:
    // const { data, error } = await supabase
    //   .from('waitlist')
    //   .insert([entry])

    // Log the entry (in production, remove console.log)
    console.log('New waitlist entry:', entry)

    return NextResponse.json(
      { message: 'Successfully added to waitlist!', data: entry },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to view waitlist (remove in production or add auth)
export async function GET() {
  return NextResponse.json({ data: waitlistData, count: waitlistData.length })
}

