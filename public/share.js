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

loadShareMessage();