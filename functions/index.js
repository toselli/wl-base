const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

exports.sendSlackNotificationOnNewDocument = functions.firestore
    .document('issues/{docId}')
    .onCreate((snap, context) => {
        const nuevoDocumento = snap.data();
        const slackWebhookUrl = 'https://hooks.slack.com/services/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';
        const mensaje = `Se ha reportado un nuevo error: ${JSON.stringify(nuevoDocumento)}`;

        return fetch(slackWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: mensaje,
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el mensaje a Slack');
            }
            return response.json();
        }).catch(error => {
            console.error('Error enviando notificación a Slack:', error);
        });
    });