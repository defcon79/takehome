'use strict';

const sendSlackResponse = (req, res, msg, attach = null, isPublic = true) => {
    const slackPayload = req.body;
    
    const response = {
        response_type: isPublic ? 'in_channel' : 'ephemeral',
        text: msg,
        channel: slackPayload.channel_id,
        attachments: attach
    }

    res.json(response);
}

module.exports = sendSlackResponse;