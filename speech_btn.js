'use strict'
window.onload = async () => {
    DEEPL_CONTENTS.TOOLBAR().appendChild(makeSpeechButton())
}
const DEEPL_CONTENTS = {
    TOOLBAR: () => document.querySelector('.lmt__target_toolbar'),
    TEXTAREA: () => document.querySelector('.lmt__target_textarea'),
    TARGET_LANG_BCP47: () => {
        switch (localStorage.getItem("LMT_selectedTargetLang")) {
            case "ZH":
                return "zh-CN"
            case "EN":
                return "en-US"
            case "JA":
                return "ja-JP"
            default:
                return ""
        }
    }
}

function makeSpeechButton () {
    let speech_btn = document.createElement('button')
    speech_btn.style = 'background-color:transparent; border:none; float:left; position:relative; outline:none;'
    //<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>_
    speech_btn.innerHTML = '\
        <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" preserveAspectRatio="xMinYMin meet" \
            enable-background="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="22">\
            <path d="m416.616 218.033v-37.417c0-8.284-6.716-15-15-15s-15 6.716-15 15v37.417c0 \
                72.022-58.594 130.616-130.616 130.616s-130.616-58.594-130.616-130.616v-37.417c0-8.284-6.716-15-15-15s-15 \
                6.716-15 15v37.417c0 83.506 64.06 152.32 145.616 159.91v42.357h-56.999c-35.675 0-64.7 29.024-64.7 \
                64.7 0 14.888 12.112 27 27 27h219.396c14.888 0 27-12.112 27-27 \
                0-35.676-29.024-64.7-64.7-64.7h-56.997v-42.358c81.556-7.589 145.616-76.404 \
                145.616-159.909zm-54.046 263.967h-213.14c1.525-17.735 16.448-31.7 34.571-31.7h143.997c18.124 \
                0 33.046 13.965 34.572 31.7z"/><path d="m256 318.649c55.48 0 100.616-45.136 \
                100.616-100.616v-117.417c0-55.48-45.136-100.616-100.616-100.616s-100.616 45.136-100.616 \
                100.616v117.416c0 55.481 45.136 100.617 100.616 100.617zm0-288.649c33.79 0 62.099 23.862 \
                68.997 55.616h-34.613c-8.284 0-15 6.716-15 15s6.716 15 15 15h36.232v30h-36.232c-8.284 0-15 \
                6.716-15 15s6.716 15 15 15h36.232v30h-36.232c-8.284 0-15 6.716-15 15s6.716 15 15 \
                15h34.016c-7.835 30.459-35.53 53.033-68.399 53.033s-60.565-22.574-68.399-53.033h32.996c8.284 \
                0 15-6.716 15-15s-6.716-15-15-15h-35.213v-30h35.213c8.284 0 15-6.716 \
                15-15s-6.716-15-15-15h-35.213v-30h35.213c8.284 0 15-6.716 \
                15-15s-6.716-15-15-15h-33.594c6.897-31.754 35.206-55.616 68.996-55.616z"/>\
        </svg></button>'
    speech_btn.addEventListener('click', e => {
        const text = DEEPL_CONTENTS.TEXTAREA().value.trim()
        if (!text) return

        const lang = DEEPL_CONTENTS.TARGET_LANG_BCP47()
        if (!lang) return

        //console.log(text, lang)
        chrome.runtime.sendMessage({text: text, lang: lang}, (res) => {
            //console.log(res)
            const data = atob(res.data)
            const buffer = Uint8Array.from(data.split(''), e => e.charCodeAt(0)).buffer
            const context = new AudioContext()
            context.decodeAudioData(buffer, (buffer) => {
                let source = context.createBufferSource()
                source.buffer = buffer
                source.connect(context.destination)
                source.start(0)
            })
        })
        //console.log('click')
    })

    let speech_div = document.createElement('div')
    speech_div.appendChild(speech_btn)
    return speech_div
}