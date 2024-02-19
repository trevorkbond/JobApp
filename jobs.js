function getUsername() {
    return localStorage.getItem('userName') ?? 'Mystery Player';
}