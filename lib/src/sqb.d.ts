import { SurrealTypes, SurrealTypesRaw } from './index';
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
export { SurrealQueryBuilder };
//# sourceMappingURL=sqb.d.ts.map