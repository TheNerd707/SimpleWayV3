const express = require('express');
const router = express.Router();

const ticketDB = require('../../schemas/ticket.js');
router.get('/', async (req, res) => {
  res.status(200).send({
    status: 'ok',
    message: 'API is running',
  });
}
);

router.post('/tickets', async (req, res) => {
    try {
        const ticketID = req.body.channelID;
    } catch (error) {
        return res.status(400).send({
          status: 'error',
          message: 'No channel ID provided',
        });
    }
    const ticket = await ticketDB.findOne({ channelId: ticketID });
    if (!ticket) {
      return res.status(404).send({
        status: 'error',
        message: 'Ticket not found',
      });
    }
    res.status(200).send({
      status: 'ok',
      message: 'Ticket found',
      data: ticket,
    });
})



module.exports = (client) => {
  const membersRouter = require('./members.js')(client);
  router.use('/members', membersRouter);
  return router;
}