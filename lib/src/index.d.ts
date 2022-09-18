export interface SurrealConfigs {
    user: string;
    pass: string;
    namespace: string;
    database: string;
}
export interface SurrealResponse {
    time: string;
    status: 'ERR' | 'OK';
    detail: string;
    result: any[] | null;
}
export interface UnauthorizedResponse {
    code: number;
    details: string;
    description: string;
    information: string;
}
export interface AnyObject {
    [key: string]: any;
}
export declare type SurrealTypesRaw = string | number | object | any[];
export declare type SurrealTypes = 'string' | 'int' | 'float' | 'object' | 'array' | 'default';
declare class SurrealDB {
    private url;
    private options;
    constructor(url: string, options: SurrealConfigs);
    private encodeBase64;
    private CreateAuth;
    private CreateHeaders;
    Use(namespace: string, database: string): boolean;
    Query(query: string): Promise<SurrealResponse[]>;
    GetRecord(table: string, id: string): Promise<SurrealResponse[]>;
    CreateRecord(table: string, id: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[]>;
    UpdateRecord(table: string, id: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[]>;
    GetTable(table: string): Promise<SurrealResponse[]>;
    ClearTable(table: string): Promise<SurrealResponse[]>;
}
declare class SurrealQueryBuilder {
    query: string;
    constructor();
    private StringifyObject;
    private StringifyValue;
    private StringifyType;
    private TypeToSurreal;
    DefineParam(key: string, value: SurrealTypesRaw): this;
    UseNamespace(namespace: string): this;
    UseDatabase(database: string): this;
    AppendCreate(name: string, keys: {
        key: string;
        type?: SurrealTypes;
        value: object | string | number | SurrealTypes[];
    }[]): this;
    WrapTransaction(type: 'COMMIT' | 'CANCLE'): this;
    Finalize(): string;
}
export default SurrealDB;
export { SurrealQueryBuilder };
//# sourceMappingURL=index.d.ts.map