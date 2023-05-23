/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserLoginDto {
  /**
   * User email
   * @example "i@powerfulyang.com"
   */
  email: string;
  /**
   * User password
   * @example "123456"
   */
  password: string;
}

export interface CosBucket {
  /**
   * bucket 在系统中的名称
   * @default "test"
   */
  name: string;
  id: number;
  Bucket: string;
  Region: string;
  ACL: object;
  CORSRules: object[];
  RefererConfiguration: object;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  tencentCloudAccount: object;
  assets: Asset[];
  public: boolean;
}

export interface Menu {
  id: number;
  name: string;
  path: string;
  children: Menu[];
  parent: Menu;
  parentId: number | null;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** 菜单列表 */
  menus: Menu[];
  /** 权限列表 */
  permissions: string[];
}

export interface Family {
  id: number;
  name: string;
  description: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  members: User[];
}

export interface OauthApplication {
  id: number;
  platformName: OauthApplicationPlatformName;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface OauthOpenid {
  id: number;
  application: OauthApplication;
  openid: string;
  user: User;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface User {
  /**
   * User id
   * @example 1
   */
  id: number;
  /**
   * User email
   * @example "i@powerfulyang.com"
   */
  email: string;
  nickname: string;
  bio: string;
  avatar?: string;
  lastIp: string;
  lastAddress: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  timelineBackground: Asset;
  /** User roles */
  roles: Role[];
  families: Family[];
  oauthOpenidArr: OauthOpenid[];
  saltedPassword: string;
  salt: string;
}

export interface Asset {
  id: number;
  bucket: CosBucket;
  objectUrl: {
    webp: string;
    original: string;
    thumbnail_300_: string;
    thumbnail_700_: string;
    thumbnail_blur_: string;
  };
  originUrl: string;
  sn: string;
  tags: string[];
  comment: string;
  /** 需要注意，这里的值是不带 `.` 的 */
  fileSuffix: string;
  sha1: string;
  pHash: string;
  exif: object;
  metadata: object;
  size: {
    width: number;
    height: number;
  };
  uploadBy: User;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface CreateRoleDto {
  /** 角色名称 */
  name: string;
  /** 权限列表 */
  permissions: string[];
  /** 角色拥有的菜单 */
  menus?: number[];
}

export interface EditUserDto {
  /**
   * User email
   * @example "i@powerfulyang.com"
   */
  email: string;
  nickname: string;
  bio: string;
  avatar?: string;
}

export interface UploadAssetsDto {
  assets: File[];
}

export interface CreateTencentCloudAccountDto {
  name: string;
  SecretId: string;
  SecretKey: string;
  AppId: string;
  id?: number;
  buckets?: CosBucket[];
}

export interface CreateBucketDto {
  /**
   * bucket 在系统中的名称
   * @default "test"
   */
  name?: string;
  Region: string;
  tencentCloudAccount: object;
  id?: number;
  Bucket?: string;
  ACL?: object;
  CORSRules?: object[];
  RefererConfiguration?: object;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  assets?: Asset[];
  public?: boolean;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  public: boolean;
  publishYear: number;
  createBy: User;
  updateBy: User;
  poster: Asset;
  logs: PostLog[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface PostLog {
  id: number;
  post: Post;
  title: string;
  content: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  posterId?: number;
  summary?: string;
  tags?: string[];
  public?: boolean;
  publishYear?: number;
  createBy?: User;
  updateBy?: User;
  poster?: Asset;
  logs?: PostLog[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface PatchPostDto {
  title: string;
  content: string;
  posterId?: number;
  summary?: string;
  tags?: string[];
  public?: boolean;
  publishYear?: number;
  createBy?: User;
  updateBy?: User;
  poster?: Asset;
  logs?: PostLog[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface QueryPostsDto {
  /** 每页条数 */
  pageSize: number;
  /** 当前页码 */
  current: number;
  id: number;
  /** 创建时间 */
  createdAt: string[];
  /** 更新时间 */
  updatedAt: string[];
  title: string;
  content: string;
  public: boolean;
  summary: string;
  poster: Asset;
  createBy: User;
}

export interface Feed {
  /** timeline item id */
  id: number;
  /** timeline item content */
  content: string;
  /** timeline item assets */
  assets: Asset[];
  public: boolean;
  createBy: User;
  updateBy: User;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface InfiniteQueryResponse {
  prevCursor?: number;
  nextCursor?: number;
}

export interface ChatGPTPayload {
  message: string;
  parentMessageId?: string;
  conversationId?: string;
}

export interface ViewCountDto {
  createdAt: string;
  requestCount: number;
  distinctIpCount: number;
}

export interface CreateFeedDto {
  /** timeline item content */
  content: string;
  assets: File[];
  public?: boolean;
  createBy: User;
}

export interface UpdateFeedDto {
  /** timeline item content */
  content: string;
  assets: File[];
  id: number;
  public: boolean;
  updateBy: User;
}

export interface PushSubscriptionJSON {
  endpoint?: string;
  expirationTime?: number | null;
  keys?: object;
}

export interface PushSubscriptionLog {
  id: number;
  pushSubscriptionJSON: object;
  endpoint: string;
  user: User;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export enum OauthApplicationPlatformName {
  Google = 'google',
  Github = 'github',
  Test = 'test',
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  protected contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Backend API
 * @version 1.0
 * @contact
 *
 * The API is used for powerfulyang.com
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags user
     * @name LoginWithEmail
     * @summary 使用用户名密码登录
     * @request POST:/api/user/login
     */
    loginWithEmail: (data: UserLoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name QueryCurrentUser
     * @summary 获取当前登录用户信息
     * @request GET:/api/user/current
     * @secure
     */
    queryCurrentUser: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/current`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name Logout
     * @summary 登出
     * @request POST:/api/user/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/logout`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name QueryCurrentUserMenus
     * @summary 获取当前用户的菜单
     * @request GET:/api/user/menus
     * @secure
     */
    queryCurrentUserMenus: (params: RequestParams = {}) =>
      this.request<Menu[], any>({
        path: `/api/user/menus`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu-manage
     * @name QueryMenus
     * @summary 分页获取菜单
     * @request GET:/api/menu-manage/query-menus
     * @secure
     */
    queryMenus: (
      query: {
        /** 每页条数 */
        pageSize: number;
        /** 当前页码 */
        current: number;
        id: number;
        name: string;
        path: string;
        /** @format date-time */
        createdAt?: string[];
        /** @format date-time */
        updatedAt?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/menu-manage/query-menus`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu-manage
     * @name QueryAllMenus
     * @summary 获取所有菜单
     * @request GET:/api/menu-manage/query-all-menus
     * @secure
     */
    queryAllMenus: (params: RequestParams = {}) =>
      this.request<Menu[], any>({
        path: `/api/menu-manage/query-all-menus`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu-manage
     * @name QueryMenuById
     * @summary 根据id获取菜单
     * @request GET:/api/menu-manage/{id}
     * @secure
     */
    queryMenuById: (id: string, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/menu-manage/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu-manage
     * @name DeleteMenuById
     * @summary 根据id删除菜单
     * @request DELETE:/api/menu-manage/{id}
     * @secure
     */
    deleteMenuById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/menu-manage/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu-manage
     * @name CreateMenu
     * @summary 创建菜单
     * @request POST:/api/menu-manage
     * @secure
     */
    createMenu: (data: Menu, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/menu-manage`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menu-manage
     * @name EditMenu
     * @summary 编辑菜单
     * @request PATCH:/api/menu-manage
     * @secure
     */
    editMenu: (data: Menu, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/menu-manage`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-manage
     * @name QueryRoles
     * @summary 分页查询角色
     * @request GET:/api/role-manage/query-roles
     * @secure
     */
    queryRoles: (
      query: {
        /** 每页条数 */
        pageSize: number;
        /** 当前页码 */
        current: number;
        id: number;
        name: string;
        /** @format date-time */
        createdAt?: string[];
        /** @format date-time */
        updatedAt?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/role-manage/query-roles`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-manage
     * @name QueryRoleById
     * @summary 查询角色详情
     * @request GET:/api/role-manage/{id}
     * @secure
     */
    queryRoleById: (id: string, params: RequestParams = {}) =>
      this.request<Role, any>({
        path: `/api/role-manage/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-manage
     * @name DeleteRoleById
     * @summary 删除角色
     * @request DELETE:/api/role-manage/{id}
     * @secure
     */
    deleteRoleById: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/role-manage/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-manage
     * @name CreateRole
     * @summary 创建角色
     * @request POST:/api/role-manage
     * @secure
     */
    createRole: (data: CreateRoleDto, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/role-manage`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-manage
     * @name UpdateRole
     * @summary 更新角色
     * @request PATCH:/api/role-manage
     * @secure
     */
    updateRole: (data: CreateRoleDto, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/role-manage`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags role-manage
     * @name ListPermissions
     * @summary 获取用户权限
     * @request GET:/api/role-manage/permissions
     * @secure
     */
    listPermissions: (params: RequestParams = {}) =>
      this.request<object[], any>({
        path: `/api/role-manage/permissions`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-manage
     * @name QueryUsers
     * @summary 分页查询用户
     * @request GET:/api/user-manage/query-users
     * @secure
     */
    queryUsers: (
      query: {
        /** 每页条数 */
        pageSize: number;
        /** 当前页码 */
        current: number;
        /**
         * User id
         * @example 1
         */
        id: number;
        /**
         * User email
         * @example "i@powerfulyang.com"
         */
        email: string;
        nickname: string;
        bio: string;
        /**
         * 创建时间
         * @format date-time
         */
        createdAt?: string[];
        /**
         * 更新时间
         * @format date-time
         */
        updatedAt?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user-manage/query-users`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-manage
     * @name QueryUserById
     * @summary 根据用户id获取用户信息
     * @request GET:/api/user-manage/{id}
     * @secure
     */
    queryUserById: (id: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user-manage/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-manage
     * @name EditUserById
     * @summary 根据用户id编辑用户信息
     * @request POST:/api/user-manage/{id}
     * @secure
     */
    editUserById: (id: string, data: EditUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user-manage/${id}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name QueryAssets
     * @summary 分页查询资源
     * @request GET:/api/asset/query-assets
     * @secure
     */
    queryAssets: (
      query: {
        /** 每页条数 */
        pageSize: number;
        /** 当前页码 */
        current: number;
        /** @format date-time */
        createdAt?: string[];
        /** @format date-time */
        updatedAt?: string[];
        id: number;
        sha1: string;
        originUrl: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/asset/query-assets`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name AssetControllerSyncAllFromCos
     * @request GET:/api/asset/sync
     * @secure
     */
    assetControllerSyncAllFromCos: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/asset/sync`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name AssetControllerPHashMap
     * @request GET:/api/asset/pHash/distance
     * @secure
     */
    assetControllerPHashMap: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/asset/pHash/distance`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name SaveAssetToBucket
     * @summary 上传资源
     * @request POST:/api/asset/{bucketName}
     * @secure
     */
    saveAssetToBucket: (bucketName: string, data: UploadAssetsDto, params: RequestParams = {}) =>
      this.request<Asset[], any>({
        path: `/api/asset/${bucketName}`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags asset
     * @name DeleteAsset
     * @summary 删除资源
     * @request DELETE:/api/asset
     * @secure
     */
    deleteAsset: (
      data: {
        id?: number | null;
        ids?: number[] | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/asset`,
        method: 'DELETE',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags tencent-cloud-account
     * @name AddTencentCloudAccount
     * @summary 新增腾讯云账号
     * @request POST:/api/tencent-cloud-account
     * @secure
     */
    addTencentCloudAccount: (data: CreateTencentCloudAccountDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/tencent-cloud-account`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bucket
     * @name BucketControllerListAllBuckets
     * @request GET:/api/bucket
     * @secure
     */
    bucketControllerListAllBuckets: (params: RequestParams = {}) =>
      this.request<CosBucket[], any>({
        path: `/api/bucket`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags bucket
     * @name BucketControllerCreateNewBucket
     * @request POST:/api/bucket
     * @secure
     */
    bucketControllerCreateNewBucket: (data: CreateBucketDto, params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/bucket`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags github
     * @name GithubControllerGetUserInfo
     * @request GET:/api/github/user_info/{login}
     */
    githubControllerGetUserInfo: (login: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/github/user_info/${login}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name CreatePost
     * @summary 创建文章
     * @request POST:/api/post
     * @secure
     */
    createPost: (data: CreatePostDto, params: RequestParams = {}) =>
      this.request<Post, any>({
        path: `/api/post`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name UpdatePost
     * @summary 更新文章
     * @request PATCH:/api/post/{id}
     * @secure
     */
    updatePost: (id: number, data: PatchPostDto, params: RequestParams = {}) =>
      this.request<Post, any>({
        path: `/api/post/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags post
     * @name DeletePost
     * @summary 删除文章
     * @request DELETE:/api/post/{id}
     * @secure
     */
    deletePost: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/post/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-manage
     * @name QueryPosts
     * @summary 分页查询日志
     * @request POST:/api/post-manage/query-posts
     * @secure
     */
    queryPosts: (data: QueryPostsDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/post-manage/query-posts`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name Hello
     * @summary hello ping
     * @request GET:/api/public/hello
     * @secure
     */
    hello: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/public/hello`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name QueryPublicPosts
     * @summary 获取所有的公开文章列表
     * @request GET:/api/public/post
     * @secure
     */
    queryPublicPosts: (
      query?: {
        publishYear?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Post[], any>({
        path: `/api/public/post`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name QueryPublicPostYears
     * @summary 获取所有的公开文章的年份列表
     * @request GET:/api/public/post/years
     * @secure
     */
    queryPublicPostYears: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/public/post/years`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name QueryPublicPostTags
     * @summary 获取所有的公开文章的标签列表
     * @request GET:/api/public/post/tags
     * @secure
     */
    queryPublicPostTags: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/public/post/tags`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name QueryPublicPostById
     * @summary 获取单个文章详细信息
     * @request GET:/api/public/post/{id}
     * @secure
     */
    queryPublicPostById: (
      id: number,
      query: {
        versions: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Post, any>({
        path: `/api/public/post/${id}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name InfiniteQueryPublicTimeline
     * @summary 获取所有的公开时间线
     * @request GET:/api/public/feed
     * @secure
     */
    infiniteQueryPublicTimeline: (
      query?: {
        prevCursor?: string;
        nextCursor?: string;
        take?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        InfiniteQueryResponse & {
          resources: Feed[];
        },
        any
      >({
        path: `/api/public/feed`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name InfiniteQueryPublicAsset
     * @summary 获取公开的图片资源
     * @request GET:/api/public/asset
     * @secure
     */
    infiniteQueryPublicAsset: (
      query?: {
        prevCursor?: string;
        nextCursor?: string;
        take?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        InfiniteQueryResponse & {
          resources: Asset[];
        },
        any
      >({
        path: `/api/public/asset`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name QueryPublicAssetById
     * @summary 获取单个公开的图片资源
     * @request GET:/api/public/asset/{id}
     * @secure
     */
    queryPublicAssetById: (id: string, params: RequestParams = {}) =>
      this.request<Asset, any>({
        path: `/api/public/asset/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name ChatWithChatGpt
     * @summary 与chat gpt聊天
     * @request POST:/api/public/chat-gpt/chat
     * @secure
     */
    chatWithChatGpt: (data: ChatGPTPayload, params: RequestParams = {}) =>
      this.request<ChatGPTPayload, any>({
        path: `/api/public/chat-gpt/chat`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags public-api
     * @name PublicControllerViewCount
     * @request GET:/api/public/view-count
     * @secure
     */
    publicControllerViewCount: (params: RequestParams = {}) =>
      this.request<ViewCountDto[], any>({
        path: `/api/public/view-count`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags random
     * @name RandomControllerGetAvatar
     * @request GET:/api/random/avatar
     */
    randomControllerGetAvatar: (
      query: {
        uuid: string;
        size: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/random/avatar`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags feed
     * @name CreateFeed
     * @summary Create a feed
     * @request POST:/api/feed
     * @secure
     */
    createFeed: (data: CreateFeedDto, params: RequestParams = {}) =>
      this.request<Feed, any>({
        path: `/api/feed`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags feed
     * @name UpdateFeed
     * @summary Update a feed
     * @request PUT:/api/feed
     * @secure
     */
    updateFeed: (data: UpdateFeedDto, params: RequestParams = {}) =>
      this.request<Feed, any>({
        path: `/api/feed`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags feed
     * @name FeedControllerRemove
     * @request DELETE:/api/feed/{id}
     * @secure
     */
    feedControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/feed/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags feed-manage
     * @name QueryFeeds
     * @summary 分页查询说说
     * @request GET:/api/feed-manage/query-feeds
     * @secure
     */
    queryFeeds: (
      query: {
        /** 每页条数 */
        pageSize: number;
        /** 当前页码 */
        current: number;
        /** timeline item id */
        id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/feed-manage/query-feeds`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags feed-manage
     * @name DeleteFeedById
     * @summary 删除说说
     * @request DELETE:/api/feed-manage/{id}
     * @secure
     */
    deleteFeedById: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/feed-manage/${id}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags schedule
     * @name TriggerSchedule
     * @summary 手动触发定时任务
     * @request GET:/api/schedule/{scheduleType}
     * @secure
     */
    triggerSchedule: (scheduleType: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/schedule/${scheduleType}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags logs-viewer
     * @name LogsViewerControllerListContainers
     * @request GET:/api/logs-viewer/containers
     */
    logsViewerControllerListContainers: (params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/api/logs-viewer/containers`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags logs-viewer
     * @name LogsViewerControllerListLogs
     * @request GET:/api/logs-viewer/{container}
     */
    logsViewerControllerListLogs: (container: string, params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/api/logs-viewer/${container}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags mini-program
     * @name MiniProgramControllerCode2Session
     * @request GET:/api/mini-program/login
     */
    miniProgramControllerCode2Session: (
      query: {
        code: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, any>({
        path: `/api/mini-program/login`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags mini-program
     * @name MiniProgramControllerGetUnlimitedQrCode
     * @request GET:/api/mini-program/qrcode
     */
    miniProgramControllerGetUnlimitedQrCode: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/mini-program/qrcode`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name FcmControllerSubscribe
     * @request POST:/api/fcm/subscribe
     */
    fcmControllerSubscribe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/fcm/subscribe`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags web-push
     * @name WebPushSubscribe
     * @summary 订阅推送
     * @request POST:/api/web-push/subscribe
     * @secure
     */
    webPushSubscribe: (data: PushSubscriptionJSON, params: RequestParams = {}) =>
      this.request<PushSubscriptionLog, any>({
        path: `/api/web-push/subscribe`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
}
