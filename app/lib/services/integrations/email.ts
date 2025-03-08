import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { Project } from '@prisma/client'

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config)
  }

  async sendProjectNotification(to: string, project: Project, type: 'created' | 'updated' | 'shared') {
    const subject = {
      created: `New Project Created: ${project.title}`,
      updated: `Project Updated: ${project.title}`,
      shared: `Project Shared with You: ${project.title}`,
    }[type]

    const html = render(
      <EmailTemplate
        type={type}
        projectTitle={project.title}
        projectDescription={project.description || ''}
        projectUrl={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${project.id}`}
      />
    )

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
  }

  async sendExportNotification(to: string, project: Project, format: string, downloadUrl: string) {
    const html = render(
      <EmailTemplate
        type="export"
        projectTitle={project.title}
        format={format}
        downloadUrl={downloadUrl}
      />
    )

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Export Ready: ${project.title}`,
      html,
    })
  }

  async sendCollaborationInvite(to: string, project: Project, invitedBy: string) {
    const html = render(
      <EmailTemplate
        type="invite"
        projectTitle={project.title}
        invitedBy={invitedBy}
        acceptUrl={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${project.id}/accept-invite`}
      />
    )

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Invitation to Collaborate: ${project.title}`,
      html,
    })
  }
}

interface EmailTemplateProps {
  type: 'created' | 'updated' | 'shared' | 'export' | 'invite'
  projectTitle: string
  projectDescription?: string
  projectUrl?: string
  format?: string
  downloadUrl?: string
  invitedBy?: string
  acceptUrl?: string
}

function EmailTemplate({
  type,
  projectTitle,
  projectDescription,
  projectUrl,
  format,
  downloadUrl,
  invitedBy,
  acceptUrl,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#4F46E5' }}>
        {type === 'created' && 'New Project Created'}
        {type === 'updated' && 'Project Updated'}
        {type === 'shared' && 'Project Shared with You'}
        {type === 'export' && 'Export Ready'}
        {type === 'invite' && 'Invitation to Collaborate'}
      </h1>

      <div style={{ marginTop: '20px' }}>
        <h2>{projectTitle}</h2>
        {projectDescription && <p>{projectDescription}</p>}
      </div>

      {type === 'export' && (
        <div style={{ marginTop: '20px' }}>
          <p>Your {format} export is ready. Click the button below to download:</p>
          <a
            href={downloadUrl}
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4F46E5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Download {format?.toUpperCase()}
          </a>
        </div>
      )}

      {type === 'invite' && (
        <div style={{ marginTop: '20px' }}>
          <p>{invitedBy} has invited you to collaborate on this project.</p>
          <a
            href={acceptUrl}
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4F46E5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Accept Invitation
          </a>
        </div>
      )}

      {projectUrl && (
        <div style={{ marginTop: '20px' }}>
          <a
            href={projectUrl}
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4F46E5',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            View Project
          </a>
        </div>
      )}

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          This email was sent from WriteFlow. If you did not expect this email, please ignore it.
        </p>
      </div>
    </div>
  )
} 