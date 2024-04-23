const config = require('./config')
const {Gitlab: Api} = require('@gitbeaker/rest');

class Gitlab {
    /**
     * @type {import('@gitbeaker/rest').Gitlab}
     */
    #api;

    #groupId;

    constructor({token, groupId}) {
        this.#api = new Api({token});
        this.#groupId = groupId;
    }

    async getProjectsFromGroupRecursive(groupId) {
        const subgroups = await this.#api.Groups.allSubgroups(groupId)
        const projects = await this.#api.Groups.allProjects(groupId, {with_shared: false})

        const projectsFromSubgroups = await Promise.all(subgroups.map(async s => await this.getProjectsFromGroupRecursive(s.id)))

        return projectsFromSubgroups.length ? [...projectsFromSubgroups.flat(), ...projects] : projects;
    }

    async getAllProjects() {
        return await this.getProjectsFromGroupRecursive(this.#groupId)
    }
}


module.exports = new Gitlab({token: config.gitlab.token, groupId: config.gitlab.group_id})
