const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");
const config = require("./config");
(async () => {
    const {CronJob} = require('cron');


    const config = require('./config')
    console.log(config);


    const gitlab = require('./Gitlab');
    const orm = require('./ORM');

    const { Telegraf } = require('telegraf')

    const bot = new Telegraf(config.bot.token)

    bot.command('oldschool', (ctx) => {
        console.log(ctx.message.chat.id);
        ctx.reply('Hello')
    })


    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

    const projects = await gitlab.getAllProjects();
    console.log(projects.length);

    for (const p of projects) {
        console.log(p.name);
        const project = orm.getOrCreateProject(p)

        if (Number(p.only_allow_merge_if_pipeline_succeeds) !== Number(project.only_allow_merge_if_pipeline_succeeds) ) {
           await bot.telegram.sendMessage(config.bot.chat_id, `${p.name} not equal`)
        } else {
            await bot.telegram.sendMessage(config.bot.chat_id, `${p.name} equal`)
        }

        orm.updateProject(p)
    }

    await orm.close()

    // const syncProjectsJob = new CronJob(
    //     '* * * * *', // cronTime
    //     function () {
    //         console.log('You will see this message every minute');
    //     },
    // );

    // syncProjectsJob.start()
    await bot.launch();
})()
