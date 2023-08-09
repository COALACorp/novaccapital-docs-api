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

async function getCount(): Promise<number> {
    let requirements = await db("requirements").select().count("* as count").first();
    return Number(requirements?.count);
}

async function getCountByApp(guid: string, applicationId: string): Promise<number> {
    let path = `docs/${guid}/${applicationId}/%`;
    let document = await db(TableName).select().where('path', 'LIKE', path).count("* as count").first();
    return Number(document?.count);
}

async function updateProgress(id: string, progress: number) {
    await db(TableName).where({ id: id }).update({ progress: progress });
}

export async function create(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    const createdDocument = await db(TableName).insert({
        application_id: applicationId, name, path: path
    });
    let progress = (await getCountByApp(guid, applicationId))/(await getCount());
    await updateProgress(applicationId, progress);
    return createdDocument;
}

export async function remove(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    return await db(TableName).where('path', path).del();
}

export default { create, remove };