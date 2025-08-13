document.addEventListener('DOMContentLoaded', () => {
    const developerBtn = document.getElementById('developer-btn');
    const debuggerBtn = document.getElementById('debugger-btn');
    const marketerBtn = document.getElementById('marketer-btn');
    const analyzerBtn = document.getElementById('analyzer-btn');
    const responseOutput = document.getElementById('response-output');

    developerBtn.addEventListener('click', () => {
        const input = document.getElementById('developer-input').value;
        sendCommand('develop', input);
    });

    debuggerBtn.addEventListener('click', () => {
        const input = document.getElementById('debugger-input').value;
        sendCommand('debug', input);
    });

    marketerBtn.addEventListener('click', () => {
        const input = document.getElementById('marketer-input').value;
        sendCommand('market', input);
    });

    analyzerBtn.addEventListener('click', () => {
        const input = document.getElementById('analyzer-input').value;
        sendCommand('analyze', input);
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
