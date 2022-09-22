import { SurrealQueryBuilder } from './sqb';
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
    DeleteTable: (table: string) => Promise<SurrealResponse[]>;
    constructor(url: string, options: SurrealConfigs);
    private encodeBase64;
    private CreateAuth;
    private CreateHeaders;
    GetConfig(): SurrealConfigs;
    Use(namespace: string, database: string): boolean;
    Query(query: string): Promise<SurrealResponse[]>;
    GetRecord(table: string, id: string): Promise<SurrealResponse[]>;
    DeleteRecord(table: string, id: string): Promise<SurrealResponse[]>;
    CreateRecord(table: string, id: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[]>;
    UpdateRecord(table: string, id: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[]>;
    GetTable(table: string): Promise<SurrealResponse[]>;
    CreateTable(table: string, data: {
        [key: string]: any;
    }): Promise<SurrealResponse[]>;
    ClearTable(table: string): Promise<SurrealResponse[]>;
}
export default SurrealDB;
export { SurrealQueryBuilder };
//# sourceMappingURL=index.d.ts.map