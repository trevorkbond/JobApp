function loadShareMessage() {
    const headerEl = document.getElementById('shareMessage');
    headerEl.textContent = localStorage.getItem('shareMessage');
}

function shareJob() {
    localStorage.removeItem('shareJob');
    localStorage.removeItem('shareMessage');

    // NOTE - THIS IS NOT IMPLEMENTED, WILL BE IMPLEMENTED LATER WITH WEBSOCKETS AND SERVICES
}

function cancelShareJob() {
    localStorage.removeItem('shareJob');
    localStorage.removeItem('shareMessage');
}

async function loadQuote() {
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
        console.log(data);
        const quoteIndex = getRandomInt(15);
        const quote = data[quoteIndex].text;
        const author = data[quoteIndex].author;
        const editedAuthor = author.match(/^(.*?),/);
        const finalAuthor = editedAuthor[1];

        const quoteEl = document.getElementById('quote');
        quoteEl.innerHTML = `
            <p style="margin-top: 1em;"><i>${quote}</i></p>
            <p style="margin-bottom: 1em;"> - ${finalAuthor}</p>
        `
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

loadShareMessage();
loadQuote();