import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPasswordHash = "$2b$10$8kGgeYgvlsdwHnhf8CbflupRHKJs1FhPguMJmWUi1iihL0zSCyYYy"
    console.log('Admin Email:', adminEmail)
    console.log('Admin Password Hash:', adminPasswordHash)

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!adminPasswordHash) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { email: adminEmail },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )

    const response = NextResponse.json({ message: 'Login successful' })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 86400,
      sameSite: 'strict'
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
