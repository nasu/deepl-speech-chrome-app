'use strict'
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //console.log(message)
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        fetch(
            'https://texttospeech.googleapis.com/v1beta1/text:synthesize',
            {
                method: 'POST',
                asnyc: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json',
                body: JSON.stringify({
                    input: {
                        text: message.text,
                    },
                    voice: {
                        languageCode: message.lang,
                        ssmlGender: 'NEUTRAL',
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                    },
                })
            }
        )
        .then((res) => res.json())
        .then((data) => {
            sendResponse({data: data.audioContent})
        })
    })
    return true
})