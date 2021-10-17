import { AppResponse } from './../common/app-response';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryParser } from '../common/query-parser';
import { BaseAppEntity } from './base-app.entity';
import * as _ from 'lodash';
import { Pagination } from '../common/pagination';
import { ResponseOption } from '../interfaces/response-option';
import { Repository } from 'typeorm';

/**
 * The BaseService class
 */
export abstract class BaseService<T extends BaseAppEntity> {
  public routes = {
    create: true,
    findOne: true,
    find: true,
    update: true,
    remove: true,
  };
  public readonly modelName: string;
  public baseUrl = `${process.env.BASE_URL || 'localhost'}:${
    process.env.PORT || 4003
  }`;
  public itemPerPage = 10;
  public entity: Repository<T>;

  public config() {
    return {
      softDelete: true,
      uniques: [],
      returnDuplicates: false,
      fillables: [],
      updateFillables: [],
      hiddenFields: ['deleted'],
    };
  }

  constructor(protected readonly model: Repository<T>) {
    this.entity = model;
  }

  public get Model() {
    return this.model;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   * */
  async validateCreate(obj: any): Promise<any | T> {
    return null;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   * */
  async validateDelete(obj: any): Promise<any | T> {
    return null;
  }

  /**
   * @param {Object} current required for response
   * @param {Object} obj required for response
   * @return {Object}
   * */
  async validateUpdate(current, obj: any): Promise<any | T> {
    return null;
  }

  /**
   * @params {Object} obj The payload object
   * @return {Object}
   */
  public async createNewObject(obj: any): Promise<any | T> {
    const toFill: string[] = this.config().fillables;
    if (toFill && toFill.length > 0) {
      obj = _.pick(obj, ...toFill);
    }
    return await this.entity.save(obj);
  }

  /**
   * @param {Object} id The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   * */
  async updateObject(id, obj): Promise<any | T> {
    const toFill: string[] = this.config().updateFillables;
    if (toFill && toFill.length > 0) {
      obj = _.pick(obj, ...toFill);
    }
    const current = await this.entity.findOne({
      where: { id, deleted: false },
    });
    console.log('current:', current);
    _.extend(current, obj);
    return await current.save();
  }

  /**
   *
   * @param {Object} id The payload id object
   * @param {Object} obj The payload object
   * @returns {Promise<any>}
   */
  public async findObject(id: any | string): Promise<unknown | T> {
    const condition = { where: { id, deleted: false } };
    return this.entity.findOne(condition);
  }

  /**
   * @param {Object} obj The payload object
   * @return {Object}
   */
  public async retrieveExistingResource(obj: any): Promise<unknown | T> {
    if (this.config().uniques) {
      const uniquesKeys = this.config().uniques;
      const query: any = {};
      for (const key of uniquesKeys) {
        query[key] = obj[key];
      }
      const found = await this.entity.findOne({
        where: {
          ...query,
          deleted: false,
        },
      });
      return found ? found : null;
    }
    return null;
  }

  /**
     /**
     * @param {Object} obj required for response
     * @param {Object} model
     * @param {Object} value
     * @param {Object} code
     * @param {Object} message
     * @param {QueryParser} queryParser
     * @param {Pagination} pagination
     * @param {Number} count
     * @param {Object} token
     * @param {Object} email
     * @return {Promise<Object>}
     **/
  async getResponse({
    value,
    code,
    message,
    queryParser,
    pagination,
    count,
    token,
  }: ResponseOption): Promise<any> {
    const meta: any = AppResponse.getSuccessMeta();
    if (token) {
      meta.token = token;
    }
    _.extend(meta, { status_code: code });
    if (message) {
      meta.message = message;
    }
    if (pagination && !queryParser.getAll) {
      pagination.totalCount = count;
      if (pagination.morePages(count)) {
        pagination.next = pagination.current + 1;
      }
      meta.pagination = pagination.done();
    }
    if (this.config().hiddenFields && this.config().hiddenFields.length > 0) {
      const isFunction = typeof value.toJSON === 'function';
      if (_.isArray(value)) {
        value = value.map((v) =>
          typeof v === 'string'
            ? v
            : _.omit(isFunction ? v.toJSON() : v, [
                ...this.config().hiddenFields,
              ]),
        );
      } else {
        value = _.omit(isFunction ? value.toJSON() : value, [
          ...this.config().hiddenFields,
        ]);
      }
    }
    return AppResponse.format(meta, value);
  }

  /***
   * @param {Pagination} pagination The pagination object
   * @param {QueryParser} queryParser The query parser
   * @return {Object}
   */
  async buildModelQueryObject(
    pagination: Pagination,
    queryParser: QueryParser,
  ): Promise<any> {
    console.log('queryParser:', queryParser);
    const query: any = { where: { ...queryParser.query } };
    if (!_.isEmpty(queryParser.selection) && queryParser.selection.length > 0) {
      _.extend(query, { select: queryParser.selection });
    }
    if (queryParser.include && queryParser.include.length > 0) {
      _.extend(query, { relations: queryParser.include });
    }
    if (!_.isEmpty(queryParser.sort)) {
      _.extend(query, {
        order:
          queryParser && queryParser.sort
            ? _.assign(queryParser.sort, { created_at: 'DESC' })
            : queryParser.sort,
      });
    }
    if (!queryParser.getAll) {
      _.extend(query, { skip: pagination.skip, take: pagination.perPage });
    }
    console.log('custom-query:', query);
    return {
      value: await this.entity.find({ ...query }),
      count: await this.entity.count({ ...query }),
    };
  }

  /**
   * @param {Object} queryParser The payload object
   * @return {Promise<Object>}
   */
  public async deleteObject(object: any): Promise<any> {
    if (this.config().softDelete) {
      _.extend(object, { deleted: true });
      object = await this.entity.save(object);
    } else {
      object = await this.entity.remove(object);
    }
    return object;
  }

  /**
   * @param {QueryParser} queryParser The payload object
   * @return {Promise<Object>}
   */
  public async searchObject(queryParser: QueryParser = null): Promise<any> {
    return await this.entity.findOne({ where: { ...queryParser.query } });
  }
}
