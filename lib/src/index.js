import fetch from 'node-fetch';
class SurrealDB {
    constructor(url, options) {
        this.encodeBase64 = (string) => {
            return Buffer.from(string).toString('base64');
        };
        this.decodeBase64 = (string) => {
            return Buffer.from(string, 'base64').toString('ascii');
        };
        this.url = url;
        this.options = options;
    }
    CreateAuth() {
        return `Basic ${this.encodeBase64(`${this.options.user}:${this.options.pass}`)}`;
    }
    CreateHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: this.CreateAuth(),
            Db: this.options.database,
            Ns: this.options.namespace,
        };
    }
    Query(query) {
        return new Promise((res, rej) => {
            fetch(`${this.url}/sql`, {
                body: query,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${btoa(`${this.options.user}:${this.options.pass}`)}`,
                    Db: this.options.database,
                    Ns: this.options.namespace,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
    GetTable(table) {
        return new Promise((res, rej) => {
            fetch(`${this.url}/key/${table}`, {
                method: 'GET',
                headers: this.CreateHeaders(),
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
}
export default SurrealDB;
//# sourceMappingURL=index.js.map