import sqlite3  from "sqlite3";

export default class Database {
    private db: sqlite3.Database = new sqlite3.Database('database');

    newProject() {
        this.db.serialize(() => {
            this.db.run("CREATE TABLE IF NOT EXISTS projects (name TEXT)");
        
            const stmt = this.db.prepare("INSERT INTO projects VALUES (?)");
            for (let i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();
        
            this.db.each("SELECT rowid AS id, info FROM projects", (err, row: any) => {
                console.log(row.id + ": " + row.info);
            });
        });
        
        this.db.close();
    }
}

