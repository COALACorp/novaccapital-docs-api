import { Request, Response, NextFunction } from "express";

import admin from "../utils/firebase";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const idToken = req.headers["session-token"] as string;

    if (!idToken) {
        return res.status(403).send("Unauthorized");
    }

    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            next();
        })
        .catch(error => {
            console.error("Error verifying token:", error);
            res.status(403).send("Unauthorized");
        });
};

export default authenticate;
