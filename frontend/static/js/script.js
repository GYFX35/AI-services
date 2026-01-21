document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();

    // --- Meta Pay and Stripe Integration ---

    let stripe;
    let metaAppId;
    const paymentStatus = document.getElementById('payment-status');

    async function fetchConfig() {
        try {
            const response = await fetch('/api/config');
            if (!response.ok) {
                throw new Error('Failed to fetch config');
            }
            const config = await response.json();
            if (!config.stripePublicKey || !config.metaAppId) {
                throw new Error('Stripe or Meta App ID missing from config.');
            }
            stripe = Stripe(config.stripePublicKey);
            metaAppId = config.metaAppId;
            return true;
        } catch (error) {
            console.error('Error fetching config:', error);
            if (paymentStatus) {
                paymentStatus.textContent = `Error: Could not load payment configuration. ${error.message}`;
            }
            return false;
        }
    }

    async function fetchPaymentIntent() {
        try {
            const apiKey = prompt("Please enter your API key to make a purchase:");
            if (!apiKey) {
                if(paymentStatus) paymentStatus.textContent = 'API key is required to make a purchase.';
                return null;
            }

            const response = await fetch('/api/v1/payment/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey
                },
                body: JSON.stringify({
                    amount: '10.00',
                    currency: 'usd'
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create payment intent.');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            if (paymentStatus) {
                paymentStatus.textContent = `Error: ${error.message}`;
            }
            return null;
        }
    }

    async function initializeMetaPay() {
        const configLoaded = await fetchConfig();
        if (!configLoaded) return;

        try {
            const paymentClient = new MetaPay.PaymentClient(metaAppId, "V1");
            const canPay = await paymentClient.canPay();

            if (canPay.canPay) {
                renderMetaPayButton(paymentClient);
            } else {
                if (paymentStatus) {
                    paymentStatus.textContent = 'Meta Pay is not available on this device/browser.';
                }
            }
        } catch (err) {
            console.error('Meta Pay SDK Error:', err);
            if (paymentStatus) {
                paymentStatus.textContent = 'Could not initialize Meta Pay. Check your App ID.';
            }
        }
    }

    function renderMetaPayButton(paymentClient) {
        const paymentRequest = {
            "countryCode": "US",
            "currencyCode": "USD",
            "paymentDetails": {
                "displayItems": [{
                    "label": "1000 AI Credits",
                    "amount": { "currency": "USD", "value": "10.00" }
                }],
                "total": {
                    "label": "Total",
                    "amount": { "currency": "USD", "value": "10.00" }
                }
            },
            "paymentOptions": {
                "allowDebit": true,
                "allowPrepaid": true,
                "shippingAddressRequired": false,
                "payerEmailRequired": true,
                "payerNameRequired": true,
                "payerPhoneRequired": false
            }
        };

        const button = paymentClient.fbpayBtn(paymentRequest, {
            "button-type": "buy",
            "button-theme": "dark",
            "width": 200,
            "height": 40
        });

        button.onClick(async () => {
            const paymentIntentData = await fetchPaymentIntent();
            if (!paymentIntentData || !paymentIntentData.clientSecret) {
                return;
            }
            const clientSecret = paymentIntentData.clientSecret;

            try {
                const response = await paymentClient.show(paymentRequest);
                if (response.paymentContainer) {
                    if (paymentStatus) {
                        paymentStatus.textContent = 'Processing payment...';
                    }
                    await handleMetaPayContainer(response.paymentContainer, clientSecret);
                } else {
                    if (paymentStatus) {
                        paymentStatus.textContent = 'Payment cancelled or failed.';
                    }
                }
            } catch (err) {
                console.error('Meta Pay Error:', err);
                if (paymentStatus) {
                    paymentStatus.textContent = `Error: ${err.message}`;
                }
            }
        });

        const container = document.getElementById('meta-pay-button-container');
        if (container) {
            container.innerHTML = '';
            container.appendChild(button);
        }
    }

    async function handleMetaPayContainer(paymentContainer, clientSecret) {
        console.log("Received Meta Pay Container:", paymentContainer);
        console.log("Using Payment Intent Client Secret:", clientSecret);

        if (paymentStatus) {
            paymentStatus.textContent = 'Received payment details from Meta. Final integration with Stripe is pending.';
        }

        // ================== CRITICAL: PENDING IMPLEMENTATION ==================
        // The following step requires knowledge of Stripe's specific integration
        // method for Meta Pay, which is not publicly documented. The code
        // below is a speculative example of how it might work. The actual
        // implementation will depend on the contract between Meta and Stripe.
        //
        // A developer with access to the private documentation will need to
        // replace this placeholder.
        // ======================================================================

        alert("Payment details received from Meta Pay. The final step of charging with Stripe is not yet implemented.");
    }

    if (document.getElementById('meta-pay-button-container')) {
        initializeMetaPay();
    }

    async function fetchProjects() {
        try {
            const response = await fetch('/api/v1/portfolio/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const projects = await response.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    function renderProjects(projects) {
        const gallery = document.querySelector('.portfolio-gallery');
        if (!gallery) return;
        gallery.innerHTML = '';
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.innerHTML = `
                <img src="${project.image_url}" alt="${project.title}">
                <div class="portfolio-item-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            gallery.appendChild(item);
        });
    }

    // --- Create Project ---
    const createProjectBtn = document.getElementById('create-project-btn');
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', async () => {
            const titleInput = document.getElementById('project-title-input');
            const descriptionInput = document.getElementById('project-description-input');
            const responseContainer = document.getElementById('create-project-response');
            const apiKey = prompt("Please enter your API key to create a project:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required to create a project.';
                return;
            }

            try {
                const response = await fetch('/api/v1/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': apiKey
                    },
                    body: JSON.stringify({
                        title: titleInput.value,
                        description: descriptionInput.value
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to create project');
                }

                const newProject = await response.json();
                responseContainer.textContent = `Project "${newProject.title}" created successfully!`;
                titleInput.value = '';
                descriptionInput.value = '';
                fetchProjects(); // Refresh the portfolio
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Promote Startup ---
    const promoteStartupBtn = document.getElementById('promote-startup-btn');
    if (promoteStartupBtn) {
        promoteStartupBtn.addEventListener('click', async () => {
            const descriptionInput = document.getElementById('startup-description-input');
            const responseContainer = document.getElementById('promote-startup-response');
            const apiKey = prompt("Please enter your API key to generate a promotion:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required to generate a promotion.';
                return;
            }

            try {
                const response = await fetch('/api/v1/promotions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': apiKey
                    },
                    body: JSON.stringify({
                        description: descriptionInput.value
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to generate promotion');
                }

                const promotion = await response.json();
                responseContainer.textContent = promotion.promotion_text;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Sciences Educator ---
    const sciencesEducatorBtn = document.getElementById('sciences-educator-btn');
    if (sciencesEducatorBtn) {
        sciencesEducatorBtn.addEventListener('click', async () => {
            const input = document.getElementById('sciences-educator-input');
            const responseContainer = document.getElementById('sciences-educator-response');
            const apiKey = prompt("Please enter your API key to use the Sciences Educator:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/sciences/educator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': apiKey
                    },
                    body: JSON.stringify({
                        prompt: input.value
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to get a response from the educator');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }
});
