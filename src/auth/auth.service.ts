import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

    constructor(

        private userService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService

    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)


        if (user && await bcrypt.compare(password, user.password)) {

            const result = user.toObject()

            return {
                _id: result._id,
                name: result.name,
                email: result.email,
                is_verify: result.is_verify,
                image: result.image
            }
        }

        return null
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async googleLogin(req) {
        if (!req.user) {
            throw new Error('Google login failed.')
        }

        const { email, name, image, google_id } = req.user

        let user = await this.userService.findByEmail(email)

        if (!user) {

            user = await this.userService.createByGoogleLogin({
                email,
                name,
                google_id,
                image
            })

        }

        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async sendVerificationEmail(userId: string, email: string) {
        const token = this.jwtService.sign({ userId }, { secret: "mail_verify", expiresIn: "1h" })
        await this.mailService.sendVerificationEmail(email, token)
    }

    async verifyEmail(token: string) {
        try {
            const payload = this.jwtService.verify(token, { secret: "mail_verify" })
            const userId = payload.userId
            const user = await this.userService.findById(userId)

            if (!user) {
                throw new NotFoundException("User not found.")
            }

            user.is_verify = true
            await user.save()
            return true

        } catch (error) {
            throw new Error("Invalid or expired token")
        }
    }

}
