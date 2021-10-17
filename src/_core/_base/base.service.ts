import { AppResponse } from './../common/app-response';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryParser } from '../common/query-parser';
import { BaseModel } from './base.model';
import * as _ from 'lodash';
import { Pagination } from '../common/pagination';
import { ResponseOption } from '../interfaces/response-option';

/**
 * The BaseService class
 */
export abstract class BaseService<T extends BaseModel> {
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
  public entity: T;

  public defaultConfig = {
    config: () => {
      return {
        softDelete: true,
        uniques: [],
        returnDuplicates: false,
        fillables: [],
        updateFillables: [],
        hiddenFields: ['deleted'],
      };
    },
  };

  constructor(protected readonly model: T) {
    this.modelName = model.tableName;
    this.entity = model;
    if (!this.entity.config) {
      this.entity.config = this.defaultConfig.config;
    }
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
    const toFill: string[] = this.entity.config().fillables;
    if (toFill && toFill.length > 0) {
      obj = _.pick(obj, ...toFill);
    }
    return await this.entity.repository().save(obj);
  }

  /**
   * @param {Object} id The payload object
   * @param {Object} obj The payload object
   * @return {Object}
   * */
  async updateObject(id, obj): Promise<any | T> {
    const toFill: string[] = this.entity.config().updateFillables;
    if (toFill && toFill.length > 0) {
      obj = _.pick(obj, ...toFill);
    }
    const current = await this.entity.repository().findOne({
      where: { id, deleted: false },
    });
    console.log('current:', current);
    _.extend(current, obj);
    return await this.entity.repository().save(current);
  }

  /**
   *
   * @param {Object} id The payload id object
   * @param {Object} obj The payload object
   * @returns {Promise<any>}
   */
  public async findObject(id: any | string): Promise<unknown> {
    const condition = { where: { id, deleted: false } };
    const object: unknown = await this.entity.repository().findOne(condition);
    return object;
  }

  /**
   * @param {Object} obj The payload object
   * @return {Object}
   */
  public async retrieveExistingResource(obj: any): Promise<any> {
    if (this.entity.config().uniques) {
      const uniquesKeys = this.entity.config().uniques;
      const query: any = {};
      for (const key of uniquesKeys) {
        query[key] = obj[key];
      }
      const found = await this.entity.repository().findOne({
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
    if (
      this.entity.config().hiddenFields &&
      this.entity.config().hiddenFields.length > 0
    ) {
      const isFunction = typeof value.toJSON === 'function';
      if (_.isArray(value)) {
        value = value.map((v) =>
          typeof v === 'string'
            ? v
            : _.omit(isFunction ? v.toJSON() : v, [
                ...this.entity.config().hiddenFields,
              ]),
        );
      } else {
        value = _.omit(isFunction ? value.toJSON() : value, [
          ...this.entity.config().hiddenFields,
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
      value: await this.entity.repository().find({ ...query }),
      count: await this.entity.repository().count({ ...query }),
    };
  }

  /**
   * @param {Object} queryParser The payload object
   * @return {Promise<Object>}
   */
  public async deleteObject(object: any): Promise<any> {
    if (this.entity.config().softDelete) {
      _.extend(object, { deleted: true });
      object = await this.entity.repository().save(object);
    } else {
      object = await this.entity.repository().remove(object);
    }
    return object;
  }

  /**
   * @param {QueryParser} queryParser The payload object
   * @return {Promise<Object>}
   */
  public async searchObject(queryParser: QueryParser = null): Promise<any> {
    return await this.entity
      .repository()
      .findOne({ where: { ...queryParser.query } });
  }
}
