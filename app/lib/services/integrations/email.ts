import nodemailer from 'nodemailer'
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

    const html = this.renderEmailTemplate({
      type,
      projectTitle: project.title,
      projectDescription: project.description || '',
      projectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${project.id}`
    })

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
  }

  async sendExportNotification(to: string, project: Project, format: string, downloadUrl: string) {
    const html = this.renderEmailTemplate({
      type: 'export',
      projectTitle: project.title,
      format,
      downloadUrl
    })

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Export Ready: ${project.title}`,
      html,
    })
  }

  async sendCollaborationInvite(to: string, project: Project, invitedBy: string) {
    const html = this.renderEmailTemplate({
      type: 'invite',
      projectTitle: project.title,
      invitedBy,
      acceptUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${project.id}/accept-invite`
    })

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Invitation to Collaborate: ${project.title}`,
      html,
    })
  }
  private renderEmailTemplate(props: EmailTemplateProps): string {
    const {
      type,
      projectTitle,
      projectDescription,
      projectUrl,
      format,
      downloadUrl,
      invitedBy,
      acceptUrl,
    } = props;

    let title = '';
    if (type === 'created') title = 'New Project Created';
    if (type === 'updated') title = 'Project Updated';
    if (type === 'shared') title = 'Project Shared with You';
    if (type === 'export') title = 'Export Ready';
    if (type === 'invite') title = 'Invitation to Collaborate';

    let content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">${title}</h1>

        <div style="margin-top: 20px;">
          <h2>${projectTitle}</h2>
          ${projectDescription ? `<p>${projectDescription}</p>` : ''}
        </div>
    `;

    if (type === 'export' && format && downloadUrl) {
      content += `
        <div style="margin-top: 20px;">
          <p>Your ${format} export is ready. Click the button below to download:</p>
          <a
            href="${downloadUrl}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            "
          >
            Download ${format.toUpperCase()}
          </a>
        </div>
      `;
    }

    if (type === 'invite' && invitedBy && acceptUrl) {
      content += `
        <div style="margin-top: 20px;">
          <p>${invitedBy} has invited you to collaborate on this project.</p>
          <a
            href="${acceptUrl}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            "
          >
            Accept Invitation
          </a>
        </div>
      `;
    }

    if (projectUrl) {
      content += `
        <div style="margin-top: 20px;">
          <a
            href="${projectUrl}"
            style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            "
          >
            View Project
          </a>
        </div>
      `;
    }

    content += `
      <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="color: #666; font-size: 14px;">
          This email was sent from WriteFlow. If you did not expect this email, please ignore it.
        </p>
      </div>
    </div>
    `;

    return content;
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