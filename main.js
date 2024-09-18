const observer = new MutationObserver(async function(mutations_list) {
	mutations_list.forEach(async function(mutation) {
		mutation.addedNodes.forEach(async function(added_node) {
			if(added_node.tagName == 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
                console.log('added_node',added_node)
                element = document.getElementById(added_node.id);
                console.log('element',element);
                removeProfilePicture(element);
                formatMessage(element);
			}
		});
	});
});

async function formatMessage(element) {
    let message = element.querySelector('#message');
    const messageText = 
        Array.from(message.childNodes)
        .filter((segment) => segment.nodeType === Node.TEXT_NODE)
        .map((textNodeObject) => textNodeObject.textContent)
        .join(' ')
        .replace(/\s+/g,' ')
        .trim();
    if (await isTokiPona(messageText)) {
        for (const word of messageText.split(' ')) {
            let newWord;
            if ((word[0] != word[0].toLowerCase()) && (word.substring(1) == word.substring(1).toLowerCase())) {
                newWord = `<span class="propernoun">${word}</span>`;
            } else {
                newWord = word.toLowerCase().replace(/(.)\1*/g, '$1');
            };
            message.innerHTML = message.innerHTML.replace(word, newWord);
        }; 
        message.style.fontFamily = 'nasin-nanpa';
    }
}

async function removeProfilePicture(element) {
    let profilePicture = element.querySelector('yt-img-shadow');
    profilePicture.remove(); //removes pics from existing messages
}

async function initialize() {
    var itemScroller = document.getElementById('item-scroller');
    itemScroller.style.overflow = 'hidden'; //removes scrollbar

    deletedElement = document.querySelector('yt-live-chat-viewer-engagement-message-renderer');
    deletedElement.remove(); //removes that annoying card that's in chat when you join

    initElements = document.getElementsByClassName('style-scope yt-live-chat-item-list-renderer')[5];
    existingMessages = initElements.getElementsByTagName('yt-live-chat-text-message-renderer');

    for (message of existingMessages) {
        removeProfilePicture(message);
        formatMessage(message);
    };
}


const init = initialize();
observer.observe(document.getElementsByClassName('style-scope yt-live-chat-item-list-renderer')[5], { subtree: false, childList: true });