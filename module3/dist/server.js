import { Server } from "http";
import app from "./app.js";
import { MongoClient, ServerApiVersion } from "mongodb";
// import dns from "dns";
// // Fix for Bangladesh ISP / Network DNS issues with MongoDB SRV records
// dns.setServers(["8.8.8.8", "8.8.4.4"]);
const port = 5000;
let server;
const uri = "mongodb+srv://alifhossinsajjad123456_db_user:7QxnDZtzGw8NW6zr@todo2.9xys51m.mongodb.net/?appName=ToDo2";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function bootstrap() {
    try {
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        server = app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
}
bootstrap();
