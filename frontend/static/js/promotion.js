document.addEventListener('DOMContentLoaded', () => {
    const promotionForm = document.getElementById('promotion-form');
    const urlInput = document.getElementById('url-input');
    const apiKeyInput = document.getElementById('api-key-input');
    const resultDiv = document.getElementById('promotion-result');

    promotionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        if (!url || !apiKey) {
            alert('Please enter a URL and your API Key.');
            return;
        }

        try {
            const response = await fetch('/api/v1/promote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Failed to start promotion.');
            }

            const data = await response.json();
            resultDiv.innerHTML = `<h3>Promotion Campaign Started!</h3><p>${data.promotion_text}</p>`;
        } catch (error) {
            resultDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    });
});