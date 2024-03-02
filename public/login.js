function login() {
    const usernameEl = document.querySelector('#username');
    localStorage.setItem('userName', usernameEl.value);
    window.location.href = './jobs.html';
}