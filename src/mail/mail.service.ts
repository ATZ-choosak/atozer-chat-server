import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemainer from 'nodemailer'

@Injectable()
export class MailService {

    private transporter;

    constructor(configService : ConfigService){

        this.transporter = nodemainer.createTransport({
            host: configService.get("MAIL_HOST"),
            port: configService.get("MAIL_PORT"),
            secure: false,
            auth: {
                user: configService.get("MAIL_USER"),
                pass: configService.get("MAIL_PASSWORD")
            }
        })
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `http://localhost:8080/api/auth/verify-email?token=${token}`

        await this.transporter.sendMail({
            form: "Atozer Comunity",
            to: email,
            subject: "Email Verification",
            html: `<p>Click the link below to verify your email:</p>
             <a href="${url}">Verify Email</a>`
        })
    }

}
