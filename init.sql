CREATE TABLE IF NOT EXISTS url (
  uuid TEXT PRIMARY KEY UNIQUE,
  url TEXT NOT NULL UNIQUE
);

INSERT INTO url (uuid, url) VALUES ('www.google.com');