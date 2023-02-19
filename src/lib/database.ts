import path from "path";
import { Database, OPEN_READWRITE } from "sqlite3";

import { Url } from "~/types";
import { generateUUID } from "./utils";

/**
 * get sqlite DB file path
 */
const getDBPath = () => {
  const isDev = process.env.NODE_ENV === "development";
  const fileName = isDev ? "dev.sqlite" : "database.sqlite";

  return path.join(process.cwd(), "db", fileName);
};

/**
 * get sqlite DB instance
 */
export const getDB = async () => {
  try {
    const dbPath = getDBPath();

    return new Database(dbPath, OPEN_READWRITE);
  } catch (err) {
    console.log("Failed to connect to DB");
    throw err;
  }
};

/**
 * get all url wrapper sql fn
 */
export const findAllUrl = async () => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM url", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  }).finally(() => db.close()) as Promise<Url[]>;
};

/**
 * get a url wrapper sql fn
 */
export const findSingleUrl = async (uuid: string) => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM url WHERE uuid = ?", [uuid], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  }).finally(() => db.close()) as Promise<Url>;
};

/**
 * add url sql wrapper fn
 */
export const addUrl = async (url: string, uuid = generateUUID()) => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.run("INSERT INTO url (uuid, url) VALUES (?, ?)", [uuid, url], (err) => {
      if (err) {
        console.log("[ERROR - addUrl]: ", err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  }).finally(() => db.close()) as Promise<boolean>;
};

/**
 * delete url sql wrapper fn
 */
export const deleteUrl = async (uuid: string) => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.run("DELETE FROM url WHERE uuid = ?", [uuid], function (err) {
      if (err) {
        reject(false);
      } else {
        if (this.changes === 0) reject(false);
        resolve(true);
      }
    });
  }).finally(() => db.close()) as Promise<boolean>;
};
