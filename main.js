const observer = new MutationObserver(async function(mutations_list) {
	mutations_list.forEach(async function(mutation) {
		mutation.addedNodes.forEach(async function(added_node) {
			if(added_node.tagName == 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
                element = document.getElementById(added_node.id);
                removeProfilePicture(element);
                formatMessage(element);
			}
		});
	});
});

async function formatMessage(element) {
    var message = element.querySelector('#message');
    var textObjectSegments = Array.from(message.childNodes).filter((segment) => segment.nodeType === Node.TEXT_NODE);
    var textSegments = [];
    for (var segment of textObjectSegments) {
        textSegments.push(segment.textContent);
    }
    var messageText = textSegments.join(' ').replace(/\s+/g,' ').trim();
    var isTokiPonaMessage = await isTokiPona(messageText);
    if (isTokiPonaMessage[0]) {
        for (var word of messageText.split(' ')) {
            var newWord;
            if ((word[0] != word[0].toLowerCase()) && (word.substring(1) == word.substring(1).toLowerCase())) {
                newWord = `<span class="propernoun">${word}</span>`;
            } else {
                newWord = word.toLowerCase().replace(/(.)\1*/g, '$1');
            };
            message.innerHTML = message.innerHTML.replace(word, newWord);
        }; 
        message.style.fontFamily = 'nasin-nanpa';
    }
    return logs;

}

async function removeProfilePicture(element) {
    var profilePicture = element.querySelector('yt-img-shadow');
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
        logs = await formatMessage(message);
        console.log(logs);
    };
}

const init = initialize();

observer.observe(document.getElementsByClassName('style-scope yt-live-chat-item-list-renderer')[5], { subtree: false, childList: true });