import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'bulletins.json')
    
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8')
      return NextResponse.json(JSON.parse(data))
    } else {
      return NextResponse.json({})
    }
  } catch (error) {
    console.error('Error reading bulletins:', error)
    return NextResponse.json({ error: 'Failed to read bulletins' }, { status: 500 })
  }
}
