import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Simple admin check - in production, you'd want proper role-based access
function isAdmin(email: string): boolean {
  return email === 'admin@example.com' || email.includes('admin')
}

// Mock email sending function - replace with actual email service
async function sendEmail(to: string, subject: string, message: string) {
  // In a real application, you would use a service like:
  // - SendGrid
  // - Nodemailer with SMTP
  // - AWS SES
  // - Resend
  // - etc.

  console.log('📧 Email would be sent:', {
    to,
    subject,
    message,
    timestamp: new Date().toISOString()
  })

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Return success for demo purposes
  return { success: true, messageId: crypto.randomUUID() }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { to, subject, message } = body

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      )
    }

    // Send email
    const result = await sendEmail(to, subject, message)

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      })
    } else {
      throw new Error('Failed to send email')
    }

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}