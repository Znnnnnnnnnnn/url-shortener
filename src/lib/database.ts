import { Database } from "sqlite3";
import { generateUUID } from "./utils";

/**
 * get sqlite DB instance
 */
export const getDB = async () => {
  try {
    return new Database("./database.sqlite");
  } catch (error) {
    console.log("Failed to connect to DB");
    throw error;
  }
};

/**
 * get all url wrapper sql fn
 */
export const findAllUrl = async () => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM url", function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }

      // close db conn
      db.close();
    });
  });
};

/**
 * add url sql wrapper fn
 */
export const addUrl = async (url: string, uuid = generateUUID()) => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO url (uuid, url) VALUES (?, ?)",
      [uuid, url],
      function (error) {
        if (error) {
          reject(false);
        } else {
          resolve(true);
        }

        // close db conn
        db.close();
      }
    );
  });
};

/**
 * delete url sql wrapper fn
 */
export const deleteUrl = async (uuid: string) => {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    db.run("DELETE FROM url WHERE uuid = ?", [uuid], function (error) {
      if (error) {
        reject(false);
      } else {
        if (this.changes === 0) reject(false);
        resolve(true);
      }

      // close db conn
      db.close();
    });
  });
};
