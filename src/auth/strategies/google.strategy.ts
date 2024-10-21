import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: 'http://localhost:8080/api/auth/google/callback',
            scope: ['email', 'profile']
        })
    }

    async validate(
        accessToken: string,
        refreshtoken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { id, emails, photos } = profile
        const { givenName, familyName } = profile.name || {}
        const user = {
            google_id: id,
            email: emails[0].value,
            name: `${givenName} ${familyName}`,
            image: photos[0].value,
            accessToken
        }

        done(null, user)
    }
}