document.addEventListener('DOMContentLoaded', () => {
    const developerBtn = document.getElementById('developer-btn');
    const debuggerBtn = document.getElementById('debugger-btn');
    const marketerBtn = document.getElementById('marketer-btn');
    const analyzerBtn = document.getElementById('analyzer-btn');
    const designerBtn = document.getElementById('designer-btn');
    const educatorBtn = document.getElementById('educator-btn');
    const cyberBtn = document.getElementById('cyber-btn');
    const businessBtn = document.getElementById('business-btn');
    const publicServicesBtn = document.getElementById('public-services-btn');
    const gitHelperBtn = document.getElementById('git-helper-btn');
    const responseOutput = document.getElementById('response-output');

    developerBtn.addEventListener('click', () => {
        const input = document.getElementById('developer-input').value;
        sendCommand('develop', input);
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

    designerBtn.addEventListener('click', () => {
        const input = document.getElementById('designer-input').value;
        sendCommand('design', input);
    });

    educatorBtn.addEventListener('click', () => {
        const input = document.getElementById('educator-input').value;
        sendCommand('educate', input);
    });

    cyberBtn.addEventListener('click', () => {
        const input = document.getElementById('cyber-url-input').value;
        sendCommand('cybersecurity', input);
    });

    businessBtn.addEventListener('click', () => {
        const input = document.getElementById('business-input').value;
        sendCommand('business', input);
    });

    publicServicesBtn.addEventListener('click', () => {
        const input = document.getElementById('public-services-input').value;
        sendCommand('public_services', input);
    });

    gitHelperBtn.addEventListener('click', () => {
        const branch = document.getElementById('git-branch-input').value;
        const commitMessage = document.getElementById('git-commit-input').value;
        const prompt = {
            branch: branch,
            commitMessage: commitMessage
        };
        sendCommand('git_helper', prompt);
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
