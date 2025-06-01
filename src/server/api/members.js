const express = require('express');
const router = express.Router();
const control = require('../../../control.json');

// Ensure JSON body parsing middleware is used
router.use(express.json());

module.exports = (client) => {
  router.get('/', async (req, res) => {
   const guild = await client.guilds.fetch(control.guild.id);
   const memberCount = guild.memberCount;
   return res.send(memberCount)
})
 router.post('/auth', async (req, res) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({ status: 'error', message: 'Missing ID in request body' });
  }

  const userId = req.body.id;
  const guild = await client.guilds.fetch(control.guild.id);
  try {
    const member = await guild.members.fetch(userId);
    if (member) {
      const roles = member.roles && member.roles.cache ? member.roles.cache.map(role => role.id) : [];
      return res.status(200).send({ status: 'success', auth: roles, false: false });
    } else {
      return res.status(404).send({ status: 'error', message: 'Member not found' });
    }
  } catch (error) { 
    return res.status(500).send({ status: 'error', message: 'Member not found', false: true });
  }
})
  return router;
}
