import {environment} from "../env/environment";
import {User} from "../models/user.model";


const fs = require('fs');
const nodemailer = require("nodemailer");

export class EmailService {
  constructor() {
  }

  private readdirAsync(path: string): Promise<string> {
    return new Promise(function (resolve, reject) {
      fs.readFile(path, 'utf8', function (err: any, data: any) {
        if (err) throw err;
        resolve(data);
      });
    });
  }

  private async sendMail(to: string, subject: string, body: string): Promise<any> {
    const transporter = nodemailer.createTransport(environment.MAILER);

    const mailOptions = {
      to,
      subject,
      html: body
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log('passo1');
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  }

  public async sendPassword(user: User): Promise<any> {
    const subject = 'Tesi Alessandro Serafini: Password recovery';
    const url: string = environment.BASE_APP_URL + '://recovery-password/' + user.pswRecToken;
    let template: string = await this.readdirAsync('./src/mails-templates/password-recovery.html');

    const mapObj:any = {
      "{{email}}": user.email,
      "{{url}}": url
    };
    template = template.replace(/{{email}}|{{url}}/gi, (matched) => {
      return mapObj[matched];
    });

    await this.sendMail(user.email, subject, template);
  }
}
