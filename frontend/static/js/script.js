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
    const scamTrackerBtn = document.getElementById('scam-tracker-btn');
    const automationBtn = document.getElementById('automation-btn');
    const astronautBtn = document.getElementById('astronaut-btn');
    const medicalBtn = document.getElementById('medical-btn');
    const responseOutput = document.getElementById('response-output');
    const loaderOverlay = document.getElementById('loader-overlay');
    const allButtons = document.querySelectorAll('button');

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

    scamTrackerBtn.addEventListener('click', () => {
        const input = document.getElementById('scam-tracker-input').value;
        sendCommand('scam_tracker', input);
    });

    automationBtn.addEventListener('click', () => {
        const input = document.getElementById('automation-input').value;
        sendCommand('automation', input);
    });

    astronautBtn.addEventListener('click', () => {
        const input = document.getElementById('astronaut-input').value;
        sendCommand('astronaut', input);
    });

    medicalBtn.addEventListener('click', () => {
        const input = document.getElementById('medical-input').value;
        sendCommand('medical_info', input);
    });

    async function sendCommand(role, prompt) {
        loaderOverlay.classList.remove('hidden');
        allButtons.forEach(button => button.disabled = true);
        responseOutput.textContent = '';

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
                const message = data.message;
                if (message.type === 'text') {
                    responseOutput.textContent = message.content;
                } else if (message.type === 'code_single' || message.type === 'code_multiple') {
                    displayCode(message);
                }
            } else {
                responseOutput.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            responseOutput.textContent = `An error occurred: ${error.message}`;
        } finally {
            loaderOverlay.classList.add('hidden');
            allButtons.forEach(button => button.disabled = false);
        }
    }

    function displayCode(message) {
        responseOutput.innerHTML = ''; // Clear previous content
        let codeBlocks = [];

        if (message.type === 'code_single') {
            codeBlocks.push(message.payload);
        } else {
            codeBlocks = message.payload;
        }

        codeBlocks.forEach(block => {
            const container = document.createElement('div');
            container.className = 'code-container';

            if (block.filename) {
                const header = document.createElement('div');
                header.className = 'code-header';
                header.textContent = block.filename;
                container.appendChild(header);
            }

            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${block.language}`;
            code.innerHTML = highlight(block.content, block.language);

            pre.appendChild(code);
            container.appendChild(pre);
            responseOutput.appendChild(container);
        });
    }

    function highlight(code, language) {
        let highlightedCode = code;
        if (language === 'html') {
            highlightedCode = highlightedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            // Highlight tags
            highlightedCode = highlightedCode.replace(/(&lt;\/?[\w\s="/.':;#-/?&]+&gt;)/g, '<span class="hl-tag">$1</span>');
        } else if (language === 'css') {
            // Highlight selectors
            highlightedCode = highlightedCode.replace(/(^|[\s\S]*?})([\s\S]*?)(?={)/g, '$1<span class="hl-selector">$2</span>');
            // Highlight properties
            highlightedCode = highlightedCode.replace(/([a-zA-Z-]+)(?=:)/g, '<span class="hl-property">$1</span>');
        }
        return highlightedCode;
    }
});
