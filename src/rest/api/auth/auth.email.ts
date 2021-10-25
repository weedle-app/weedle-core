import * as crypto from 'crypto';
import { IEmailName, MailOption } from '../../../_core';
import { AuthEntity } from './entity/auth.entity';
import configuration from '../../../../config/configuration';
import * as _ from 'lodash';
import lang from 'src/lang';

export default class AuthEmail {
  public static verifyEmail(
    { first_name, email, last_name }: AuthEntity,
    token: string,
    verify_redirect_url?: string,
  ): MailOption {
    const emailName: IEmailName = {
      email,
      name: `${first_name} ${last_name}`,
    };
    const verifyToken = crypto.createHash('md5').update(token).digest('hex');
    const link = _.isEmpty(verify_redirect_url)
      ? `${verify_redirect_url}/${email}/${verifyToken}`
      : `${
          configuration().service.verify_redirect_url
        }/${email}/${verifyToken}`;
    const content = {
      subject: `${configuration().service.name} - Verify Account`,
      first_name,
      last_name,
      verify_code: token,
      verify_link: link,
    };
    return {
      emailName,
      content,
      fromEmail: configuration().service.no_reply,
      subject: lang.get('email').verify_account,
      template: configuration().service.email_templates.verify_account,
    };
  }

  public static resetPasswordEmail(
    { first_name, email, last_name }: AuthEntity,
    token: string,
    redirect_url?: string,
  ): MailOption {
    const emailName: IEmailName = {
      email,
      name: `${first_name} ${last_name}`,
    };
    const resetToken = crypto.createHash('md5').update(token).digest('hex');
    const link = _.isEmpty(redirect_url)
      ? `${redirect_url}/${email}/${resetToken}`
      : `${configuration().service.reset_redirect_url}/${email}/${resetToken}`;
    const content = {
      subject: `${configuration().service.name} - Reset Password`,
      first_name,
      last_name,
      password_reset_code: token,
      reset_link: link,
    };
    return {
      emailName,
      content,
      fromEmail: configuration().service.no_reply,
      subject: lang.get('email').reset_password,
      template: configuration().service.email_templates.verify_account,
    };
  }
}
