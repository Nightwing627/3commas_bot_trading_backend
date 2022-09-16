const API = require("../utils/3commas");
const db = require("../models")
const UserBot = db.userBot

const BotController = {
    getAllStrategies: async (req, res) => {
        let data = await API.getBots({
            limit: 50
        })
        
        let newData = [];
        
        for (const item of data) {
            if (!await UserBot.findOne({ where: { bot_id: item.id } })) {
                newData.push(item)
            }
        }        
        
        res.status(200).send(newData); 
    },

    copyBot: async (req, res) => {
        const { name, amount, bot_id, secret, user } = req.body

        const result = await API.botCopyAndCreate({
            name, amount, bot_id, secret
        });

        if (!!result.bot_id) {
            const bot = await API.botShow(result.bot_id)
            await UserBot.create({
                user_id: user.user_id,
                bot_name: name,
                bot_id: result.bot_id,
                secret,
                amount,
                bot_required_amount: result.bot_required_amount,
                copied_bot_id: bot_id,
                max_active_deals: bot.max_active_deals,
                base_order_volume: bot.base_order_volume,
                strategy: bot.strategy,
                profit_currency: bot.profit_currency,
                start_order_type: bot.start_order_type
            })

            res.status(200).json('success')
        } else {
            res.status(400).json(result.error_attributes)
        }
    },
    
    deleteBot: async (req, res) => {
        const { bot_id, user } = req.body

        const bot = await UserBot.findOne({
            where: { 
                user_id: user.user_id,
                bot_id
        }})

        if (bot) {
            const result = await API.botDelete(bot_id);
            if (result === true) {
                await UserBot.destroy({
                    where: { id: bot.id }
                })
                res.status(200).json('success')
            } else {
                res.status(400).json(result.error_description)
            }
        } else {
            res.status(400).json('You can\'t delete this bot because this\'s creator is not you')
        }
        console.log('------ no operation -----')
    },

    stopBot: async (req, res) => {
        const { bot_id, user } = req.body

        const bot = await UserBot.findOne({
            where: { 
                user_id: user.user_id,
                bot_id
        }})

        if (bot) {
            const result = await API.botDisable(bot_id);
            if (result !== null && result.id === bot_id) {
                res.status(200).json('success')
            } else {
                res.status(400).json(result.error_description)
            }
        } else {
            res.status(400).json('You can\'t stop this bot because this\'s owner is not you')
        }
        console.log('------ no operation -----')
    },

    startBot: async (req, res) => {
        const { bot_id, user } = req.body

        const bot = await UserBot.findOne({
            where: { 
                user_id: user.user_id,
                bot_id
        }})

        if (bot) {
            const result = await API.botEnable(bot_id);
            if (result !== null && result.id === bot_id) {
                res.status(200).json('success')
            } else {
                res.status(400).json(result.error_description)
            }
        } else {
            res.status(400).json('You can\'t start this bot because this\'s owner is not you')
        }
        console.log('------ no operation -----')
    },

    getUserBots: async (req, res) => {
        const { user } = req.body        
        const userBots = await UserBot.findAll({ where: { user_id: user.user_id }})

        const data = []
        if (userBots) {
            for (const item of userBots) {
                let bot = await API.botShow(item.bot_id)
                data.push(bot)
            }
        }
        
        res.status(200).send(data); 
    },

    getUserBot: async (req, res) => {
        const { bot_id, user } = req.body        
        const userBot = await UserBot.findOne({ 
            where: { 
                user_id: user.user_id,
                bot_id
            }})

        if (userBot) {
            res.status(200).send(userBot);
        } else {
            res.status(400).send('this is not yours')
        }
    },

    checkUserBot: async (req, res) => {
        const { user, bot_id } = req.body

        let bot = await UserBot.findOne({
            where: {
                user_id: user.user_id,
                bot_id
            }
        })

        if (bot === null) {
            return res.status(200).json(false)
        }

        res.status(200).json(true)
    },

    editBot: async (req, res) => {
        const { 
            bot_id, botName, maxActiveDeals, baseOrderVolume,
            strategy, profitCurrency, startOrderType, user } = req.body

        const userBot = await UserBot.findOne({
            where: { 
                user_id: user.user_id,
                bot_id
        }})

        if (userBot) {
            const curBot = await API.botShow(bot_id)
            const result = await API.botUpdate({
                bot_id,
                name: botName,
                max_active_deals: parseInt(maxActiveDeals),
                base_order_volume: baseOrderVolume,
                strategy: strategy,
                profit_currency: profitCurrency,
                start_order_type: startOrderType,
                pairs: JSON.stringify(curBot.pairs),
                take_profit: curBot.take_profit,
                safety_order_volume: curBot.safety_order_volume,
                martingale_volume_coefficient: curBot.martingale_volume_coefficient,
                martingale_step_coefficient: curBot.martingale_step_coefficient,
                max_safety_orders: curBot.max_safety_orders,
                active_safety_orders_count: curBot.active_safety_orders_count,
                safety_order_step_percentage: curBot.safety_order_step_percentage,
                take_profit_type: curBot.take_profit_type,
                strategy_list: JSON.stringify(curBot.strategy_list)
            });

            console.log(result)

            if (result.id) {
                await UserBot.update({
                    bot_name: botName,
                    max_active_deals: parseInt(maxActiveDeals),
                    base_order_volume: parseFloat(baseOrderVolume),
                    strategy: strategy,
                    profit_currency: profitCurrency,
                    start_order_type: startOrderType,
                }, {
                    where: { id: userBot.id },
                  })

                res.status(200).json('success')
            } else {
                res.status(400).json({
                    error: result.error_attributes
                })
            }

        } else {
            res.status(400).json('You can\'t edit this bot because this\'s owner is not you')
        }
        console.log('------ no operation -----')
    }
}

module.exports = BotController;