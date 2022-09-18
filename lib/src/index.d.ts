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
    result: any[];
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
declare class SurrealDB {
    private url;
    private options;
    constructor(url: string, options: SurrealConfigs);
    private encodeBase64;
    private CreateAuth;
    private CreateHeaders;
    private PurifyQuery;
    Use(namespace: string, database: string): boolean;
    Query(query: string): Promise<SurrealResponse[] | UnauthorizedResponse>;
    QueryF(query: string, params?: AnyObject): Promise<SurrealResponse[] | UnauthorizedResponse>;
    GetRecord(table: string, id: string): Promise<SurrealResponse[] | UnauthorizedResponse>;
    CreateRecord(table: string, id: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[] | UnauthorizedResponse>;
    UpdateRecord(table: string, id: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[] | UnauthorizedResponse>;
    GetTable(table: string): Promise<SurrealResponse[] | UnauthorizedResponse>;
    ClearTable(table: string): Promise<SurrealResponse[] | UnauthorizedResponse>;
}
export default SurrealDB;
//# sourceMappingURL=index.d.ts.map