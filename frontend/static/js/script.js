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
        const responseOutput = document.getElementById('response-output');
        responseOutput.innerHTML = '<p>Thinking...</p>';
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
                if (role === 'analyze' && typeof data.message === 'object') {
                    displayAnalysisResults(data.message);
                } else {
                    responseOutput.textContent = data.message;
                }
            } else {
                responseOutput.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            responseOutput.textContent = `An error occurred: ${error.message}`;
        }
    }

    function displayAnalysisResults(results) {
        const responseOutput = document.getElementById('response-output');
        responseOutput.innerHTML = ''; // Clear previous results

        if (results.error) {
            responseOutput.textContent = `Error: ${results.error}`;
            return;
        }

        const totalLinks = (results.ok?.length || 0) + (results.broken?.length || 0) + (results.slow?.length || 0);

        if (totalLinks === 0) {
            responseOutput.innerHTML = '<p>No links found to analyze.</p>';
            return;
        }

        responseOutput.innerHTML += `<p>Scanned ${totalLinks} links.</p>`;

        if (results.broken && results.broken.length > 0) {
            responseOutput.innerHTML += '<h3>Broken Links</h3>';
            responseOutput.appendChild(createResultsTable(results.broken));
        }

        if (results.slow && results.slow.length > 0) {
            responseOutput.innerHTML += '<h3>Slow Links</h3>';
            responseOutput.appendChild(createResultsTable(results.slow));
        }

        if (results.ok && results.ok.length > 0) {
            responseOutput.innerHTML += '<h3>OK Links</h3>';
            responseOutput.appendChild(createResultsTable(results.ok));
        }
    }

    function createResultsTable(links) {
        const table = document.createElement('table');
        table.className = 'results-table';
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const headers = ['URL', 'Anchor Text', 'Status', 'Response Time (ms)', 'Error'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        links.forEach(link => {
            const row = tbody.insertRow();
            row.insertCell().textContent = link.url;
            row.insertCell().textContent = link.text;
            row.insertCell().textContent = link.status;
            row.insertCell().textContent = link.time_ms !== undefined ? link.time_ms : 'N/A';
            row.insertCell().textContent = link.error || 'N/A';
        });

        return table;
    }
});
