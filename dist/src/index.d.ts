import { SurrealResponse, SurrealConfigs, UnauthorizedResponse } from '../index';
declare class SurrealDB {
    url: string;
    options: SurrealConfigs;
    constructor(url: string, options: SurrealConfigs);
    private encodeBase64;
    private decodeBase64;
    private CreateAuth;
    private CreateHeaders;
    Query(query: string): Promise<SurrealResponse[] | UnauthorizedResponse>;
    GetTable(table: string): Promise<SurrealResponse[] | UnauthorizedResponse>;
}
export default SurrealDB;
//# sourceMappingURL=index.d.ts.map