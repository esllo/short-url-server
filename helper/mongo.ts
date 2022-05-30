import { connect, Connection, connection } from "mongoose";
import { Nullable } from "../types";

async function mongo() {
  let db: Nullable<Connection> = null;

  connect(process.env.MONGO_DB_URL || '');
  db = connection;
  db.on('error', console.error);
  db.once('open', () => {
    console.log('mongodb connected');
  });
}

export default mongo;