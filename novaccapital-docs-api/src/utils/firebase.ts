import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

// const serviceAccount = require("../files/serviceAccount.json");

admin.initializeApp({
    credential: applicationDefault(),
});

export default admin