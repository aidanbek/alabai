const config = require('./config');
const Db = require('better-sqlite3');

class ORM {
    /**
     * @type {import('better-sqlite3')}
     */
    #sql

    /**
     * @param {string} file
     */
    constructor({file}) {
        this.#sql = new Db(file);
    }

    initialize() {
        this.#sql.run(`
            CREATE TABLE projects
            (
                id                                    integer primary key,
                name                                  text    not null,
                web_url                               text    not null,
                only_allow_merge_if_pipeline_succeeds integer not null
            )
        `);
    }

    getProjectByID(id) {
        return this.#sql.prepare(`select id, name, web_url, only_allow_merge_if_pipeline_succeeds
                                  from projects
                                  where id = $id`).get({id: id});
    }

    createProject({id, name, web_url, only_allow_merge_if_pipeline_succeeds}) {
        const params = {
            id,
            name,
            web_url,
            only_allow_merge_if_pipeline_succeeds: Number(only_allow_merge_if_pipeline_succeeds)
        }

        const sql = ` insert into projects (id, name, web_url, only_allow_merge_if_pipeline_succeeds)
                      values ($id, $name, $web_url, $only_allow_merge_if_pipeline_succeeds)`

        this.#sql.prepare(sql).run(params)
    }

    getOrCreateProject({id, name, web_url, only_allow_merge_if_pipeline_succeeds}) {
        const project = this.getProjectByID(id)

        if (!project) {
            this.createProject({id, name, web_url, only_allow_merge_if_pipeline_succeeds})
            console.log(`${name} created`);

            return this.getProjectByID(id)
        } else {
            console.log(`${name} exists`);
            return project;
        }
    }

    updateProject({id, name, web_url, only_allow_merge_if_pipeline_succeeds}) {
        const params = {
            id,
            name,
            web_url,
            only_allow_merge_if_pipeline_succeeds: Number(only_allow_merge_if_pipeline_succeeds)
        }

        const sql = `update projects
                     set name                                  = $name,
                         web_url                               = $web_url,
                         only_allow_merge_if_pipeline_succeeds = $only_allow_merge_if_pipeline_succeeds
                     where id = $id`

        this.#sql.prepare(sql).run(params)
        console.log(`${name} updated`);
    }

    close() {
        this.#sql.close();
    }
}


module.exports = new ORM({file: config.db.file})
