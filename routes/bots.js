const app = require('express')
const router = app.Router();
const BotController = require('../controllers/bot.controller')
const verifyToken = require('../middleware/auth')

router.get('/', BotController.getAllStrategies)
router.post('/delete/', verifyToken, BotController.deleteBot)
router.post('/copy/',  verifyToken, BotController.copyBot)
router.post('/user/robots', verifyToken, BotController.getUserBots)
router.post('/user/check_bot', verifyToken, BotController.checkUserBot)
router.post('/user/bot', verifyToken, BotController.getUserBot)
router.post('/user/bot/edit', verifyToken, BotController.editBot)
router.post('/stop', verifyToken, BotController.stopBot)
router.post('/start', verifyToken, BotController.startBot)

module.exports = router;