module.exports = {
    db: {
        file: process.env.DATABASE_FILE
    },
    gitlab: {
        token: process.env.GITLAB_TOKEN,
        group_id: process.env.GITLAB_GROUP_ID
    },
    bot: {
        token: process.env.TELEGRAM_BOT_TOKEN,
        chat_id: process.env.TELEGRAM_CHAT_ID
    }
}
