import knex from "knex";

const db = knex({
    client: 'mysql',
    connection: {
        host: 'db-novac-capital.cluster-cvm3glkrsy9b.us-east-1.rds.amazonaws.com',
        port: 3306,
        user: 'admin',
        password: 'wiwrU0-wawzub-beqcac',
        database: 'novac_capital'
    }
});

const TableName = "document";

export async function create(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    const createdDocument = await db(TableName).insert({
        application_id: applicationId, name, path: path
    });
    return createdDocument;
}

export async function remove(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    return await db(TableName).where('path', path).del();
}

export default { create, remove };