const observer = new MutationObserver(async function(mutations_list) {
	mutations_list.forEach(async function(mutation) {
        if (mutation.attributeName === "is-deleted") {
            mutation.target.style.display = 'none';
        };
		mutation.addedNodes.forEach(async function(added_node) {
			if((added_node.tagName == 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') && (added_node.parentNode.id === 'items')) {
                await removeProfilePicture(added_node);
                await formatMessage(added_node);
			}
		});
	});
});

async function formatMessage(element) { // formats tp words w/ sitelen pona
    element.style.padding = '0px';
    const message = element.querySelector('#message');
    const messageText = 
        Array.from(message.childNodes)
        .filter((segment) => segment.nodeType === Node.TEXT_NODE)
        .map((textNodeObject) => textNodeObject.textContent)
        .join(' ')
        .replace(/\s+/g,' ')
        .trim();
    if (await isTokiPona(messageText)) {
        console.log(message.innerHTML)
        let properNouns = [];
        for (const word of messageText.split(' ')) {
            let newWord;
            if ((word[0] != word[0].toLowerCase()) && (word.substring(1) == word.substring(1).toLowerCase())) {
                if (!properNouns.includes(newWord)) {
                    newWord = `<span class="propernoun">${word}</span>`;
                    properNouns.push(newWord);
                    message.innerHTML = message.innerHTML.replaceAll(word, newWord);
                };
            } else {
                newWord = word.toLowerCase().replace(/(.)\1*/g, '$1');
                message.innerHTML = message.innerHTML.replace(word, newWord);
            };
        }; 
        message.style.fontFamily = 'nasin-nanpa';
    }
}

async function removeProfilePicture(element) { // hides profile picture from message
    const profilePicture = element.querySelector('yt-img-shadow');
    profilePicture.style.display='none'; 
}

async function initialize() {
    document.querySelector('yt-live-chat-viewer-engagement-message-renderer').style.display = 'none';
    initElements = document.getElementsByClassName('style-scope yt-live-chat-item-list-renderer')[5];
    existingMessages = initElements.getElementsByTagName('yt-live-chat-text-message-renderer');
    for (message of existingMessages) {
        removeProfilePicture(message);
        formatMessage(message);
    };
}

const init = initialize();
observer.observe(document.getElementsByClassName('style-scope yt-live-chat-item-list-renderer')[5], { subtree: true, childList: true, attributes: true });


//mi wile e ni: jan ale liiiii utala ala.:elbowcough: utala liii ike lon tenpo ale. mi jan pi ma Mewika.:hydrate: taso jan lawa pi ma Mewika pilin ala e ni: jan ale o utala :face-orange-frowning:ala. ni< liiiiiiii ike tawa mi.