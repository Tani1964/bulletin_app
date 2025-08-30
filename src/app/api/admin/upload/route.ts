import fs from 'fs'
import { writeFile } from 'fs/promises'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    jwt.verify(token, process.env.JWT_SECRET!)

    const formData = await request.formData()
    const file = formData.get('image') as File
    const page = formData.get('page') as string

    if (!file || !page) {
      return NextResponse.json({ error: 'Missing file or page parameter' }, { status: 400 })
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${page}-${Date.now()}${path.extname(file.name)}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)

    // Update bulletins data
    const dataDir = path.join(process.cwd(), 'data')
    const dataPath = path.join(dataDir, 'bulletins.json')
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    let bulletinsData: any = {}
    if (fs.existsSync(dataPath)) {
      bulletinsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }

    const imagePath = `/uploads/${fileName}`
    bulletinsData[page] = imagePath

    fs.writeFileSync(dataPath, JSON.stringify(bulletinsData, null, 2))

    return NextResponse.json({ message: 'Upload successful', imagePath })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}