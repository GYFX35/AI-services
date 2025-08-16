document.addEventListener('DOMContentLoaded', () => {
    const developerBtn = document.getElementById('developer-btn');
    const gameDeveloperBtn = document.getElementById('game-developer-btn');
    const appDeveloperBtn = document.getElementById('app-developer-btn');
    const debuggerBtn = document.getElementById('debugger-btn');
    const marketerBtn = document.getElementById('marketer-btn');
    const analyzerBtn = document.getElementById('analyzer-btn');
    const meteorologistBtn = document.getElementById('meteorologist-btn');
    const responseOutput = document.getElementById('response-output');

    developerBtn.addEventListener('click', () => {
        const input = document.getElementById('developer-input').value;
        sendCommand('develop', input);
    });

    gameDeveloperBtn.addEventListener('click', () => {
        const input = document.getElementById('game-developer-input').value;
        sendCommand('develop_game', input);
    });

    appDeveloperBtn.addEventListener('click', () => {
        const input = document.getElementById('app-developer-input').value;
        sendCommand('develop_app', input);
    });

    debuggerBtn.addEventListener('click', () => {
        const urlInput = document.getElementById('debugger-url-input').value;
        const textInput = document.getElementById('debugger-input').value;
        const prompt = urlInput.trim() || textInput;
        sendCommand('debug', prompt);
    });

    marketerBtn.addEventListener('click', () => {
        const input = document.getElementById('marketer-input').value;
        sendCommand('market', input);
    });

    analyzerBtn.addEventListener('click', () => {
        const urlInput = document.getElementById('analyzer-url-input').value;
        const textInput = document.getElementById('analyzer-input').value;
        const prompt = urlInput.trim() || textInput;
        sendCommand('analyze', prompt);
    });

    meteorologistBtn.addEventListener('click', () => {
        const input = document.getElementById('meteorologist-input').value;
        sendCommand('meteorology', input);
    });

    async function sendCommand(role, prompt) {
        responseOutput.textContent = 'Thinking...';
        try {
            const response = await fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: {
                        role: role,
                        prompt: prompt
                    }
                }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                responseOutput.textContent = data.message;
            } else {
                responseOutput.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            responseOutput.textContent = `An error occurred: ${error.message}`;
        }
    }
});
