class JobEventNotifier {
    events = [];
    handlers = [];
    static instance = null;

    constructor(userName) {
        if (JobEventNotifier.instance) {
            return JobEventNotifier.instance;
        }
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws?username=${userName}`);
        console.log('ws connection opened, userName is ' + userName);
        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveEvent(event);
            } catch { }
        };
        JobEventNotifier.instance = this;
    }

    broadcastEvent(job) {
        this.socket.send(JSON.stringify(job));
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    removeHandler(handler) {
        this.handlers.filter((h) => h !== handler);
    }

    receiveEvent(event) {
        this.events.push(event);

        this.events.forEach((e) => {
            this.handlers.forEach((handler) => {
                handler(e);
            });
        });
    }

    static getInstance() {
        return JobEventNotifier.instance;
    }
}

function waitForUsername() {
    return new Promise(resolve => {
        const checkUsername = () => {
            const userName = localStorage.getItem('userName');
            if (userName && userName.trim() !== '') {
                clearInterval(interval);
                resolve(userName);
            }
        };

        const interval = setInterval(checkUsername, 500);
        checkUsername();
    });
}



async function initializeJobNotifier() {
    const userName = await waitForUsername();
    const JobNotifier = new JobEventNotifier(userName);
    return JobNotifier;
}


export { initializeJobNotifier, JobEventNotifier };

