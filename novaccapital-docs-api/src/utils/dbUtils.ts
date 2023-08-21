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

async function getApplication(applicationId: string) {
    let application = await db("application").select("application.entity_type").where("id", applicationId);
    return application[0];
}

async function getCount(): Promise<number> {
    const requirements = await db("requirement").select().count("* as count").first();
    return Number(requirements?.count);
}

async function getCountByApp(guid: string, applicationId: string): Promise<number> {
    const path = `docs/${guid}/${applicationId}/%`;
    const document = await db("document").select().where('path', 'LIKE', path).count("* as count").first();
    return Number(document?.count);
}

async function getCountByEntityType(): Promise<number> {
    let requirements = await db("requirement")
        .select()
        .count("* as count")
        .where("entity_type", "=", "fisica")
        .first();
    return Number(requirements?.count);
}

async function calculateProgress(guid: string, applicationId: string) {
    const application = await getApplication(applicationId);
    const requirements =
        application.entity_type == "fisica"
            ? await getCountByEntityType()
            : await getCount();
    return (await getCountByApp(guid, applicationId)) / requirements;
}

async function updateProgress(id: string, progress: number) {
    await db("application").where({ id }).update({ progress });
}

export async function create(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    const createdDocument = await db("document").insert({
        application_id: applicationId, name, path: path
    });
    const progress = await calculateProgress(guid, applicationId);
    console.log(progress);
    await updateProgress(applicationId, progress);
    return createdDocument;
}

export async function remove(guid: string, applicationId: string, name: string) {
    const path = `docs/${guid}/${applicationId}/${name}`;
    const removedDocument = await db("document").where('path', path).del()
    const progress = await calculateProgress(guid, applicationId);
    console.log(progress);
    await updateProgress(applicationId, progress);
    return removedDocument;
}

export default { create, remove };