import { Pagination, QueryParser } from '../common';
import { SmsOption } from './sms-option';
import { MailOption } from './mail-option';

export interface ResponseOption {
  value: any;
  code: number;
  cache?: boolean;
  queryParser?: QueryParser;
  pagination?: Pagination;
  hiddenFields?: string[];
  message?: string;
  count?: number;
  token?: string;
  sms?: SmsOption;
  email?: MailOption;
}
