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

export async function get(guid, applicationId, name) {
    let path = `docs/${guid}/${applicationId}/${name}`;
    let document = await db.select().where('path', path).table(TableName);
    return document[0];
}

export async function getByUser(guid) {
    let path = `docs/${guid}/%`;
    let document = await db.select().where('path', 'LIKE', path).table(TableName);
    return document;
}

export async function getByApp(guid, applicationId) {
    let path = `docs/${guid}/${applicationId}/%`;
    let document = await db.select().where('path', 'LIKE', path).table(TableName);
    return document;
}

export async function create(guid, applicationId, name) {
    let path = `docs/${guid}/${applicationId}/${name}`;
    let createdDocument = await db(TableName).insert({
        application_id: applicationId, name, path: path
    });
    return createdDocument;
}

export async function remove(guid, applicationId, name) {
    let path = `docs/${guid}/${applicationId}/${name}`;
    return await db(TableName).where('path', path).del();
}