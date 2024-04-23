const config = require('./config')
const { Telegraf } = require('telegraf')

const api = new Telegraf()

class Bot {
    /**
     * @type {import('telegraf').Telegraf}
     */
    #api;

    constructor({token}) {
        this.#api = new Telegraf(token)
    }

    async command(){

    }

    async start() {
        await this.#api.launch();
    }

    async stop() {
        await this.#api.stop();
    }
}
