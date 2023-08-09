import knex from "knex";

const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }
});

async function getCount(): Promise<number> {
    const requirements = await db("requirement").select().count("* as count").first();
    return Number(requirements?.count);
}

async function getCountByApp(guid: string, applicationId: string): Promise<number> {
    const path = `docs/${guid}/${applicationId}/%`;
    const document = await db("document").select().where('path', 'LIKE', path).count("* as count").first();
    return Number(document?.count);
}

async function updateProgress(id: string, progress: number) {
    await db("application").where({ id }).update({ progress });
}

export async function create(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    const createdDocument = await db("document").insert({
        application_id: applicationId, name, path: path
    });
    const progress = (await getCountByApp(guid, applicationId))/(await getCount());
    await updateProgress(applicationId, progress);
    return createdDocument;
}

export async function remove(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    return await db("document").where('path', path).del();
}

export default { create, remove };