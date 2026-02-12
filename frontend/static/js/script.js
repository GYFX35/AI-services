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

    // --- Document Specialist ---
    const documentSpecialistBtn = document.getElementById('document-specialist-btn');
    if (documentSpecialistBtn) {
        documentSpecialistBtn.addEventListener('click', async () => {
            const input = document.getElementById('document-specialist-input');
            const responseContainer = document.getElementById('document-specialist-response');
            const apiKey = prompt("Please enter your API key to use the Document Specialist:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/assistance/document', {
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
                    throw new Error(error.error || 'Failed to get a response from the document specialist');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
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

    // --- Music Instrumentalist ---
    const musicInstrumentalistBtn = document.getElementById('music-instrumentalist-btn');
    if (musicInstrumentalistBtn) {
        musicInstrumentalistBtn.addEventListener('click', async () => {
            const input = document.getElementById('music-instrumentalist-input');
            const responseContainer = document.getElementById('music-instrumentalist-response');
            const apiKey = prompt("Please enter your API key to use the Music Instrumentalist:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/play/music', {
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
                    throw new Error(error.error || 'Failed to get a response from the music instrumentalist');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Geometry Assistant ---
    const geometryAssistantBtn = document.getElementById('geometry-assistant-btn');
    if (geometryAssistantBtn) {
        geometryAssistantBtn.addEventListener('click', async () => {
            const input = document.getElementById('geometry-assistant-input');
            const responseContainer = document.getElementById('geometry-assistant-response');
            const apiKey = prompt("Please enter your API key to use the Geometry Assistant:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/assistance/geometry', {
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
                    throw new Error(error.error || 'Failed to get a response from the geometry assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Cartography Assistant ---
    const cartographyAssistantBtn = document.getElementById('cartography-assistant-btn');
    if (cartographyAssistantBtn) {
        cartographyAssistantBtn.addEventListener('click', async () => {
            const input = document.getElementById('cartography-assistant-input');
            const responseContainer = document.getElementById('cartography-assistant-response');
            const apiKey = prompt("Please enter your API key to use the Cartography Assistant:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/assistance/cartography', {
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
                    throw new Error(error.error || 'Failed to get a response from the cartography assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Business Plan Creator ---
    const businessPlanBtn = document.getElementById('business-plan-btn');
    if (businessPlanBtn) {
        businessPlanBtn.addEventListener('click', async () => {
            const input = document.getElementById('business-plan-input');
            const responseContainer = document.getElementById('business-plan-response');
            const apiKey = prompt("Please enter your API key to use the Business Plan Creator:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/business/plan', {
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
                    throw new Error(error.error || 'Failed to get a response from the business plan creator');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Investigation Role ---
    const investigationRoleBtn = document.getElementById('investigation-role-btn');
    if (investigationRoleBtn) {
        investigationRoleBtn.addEventListener('click', async () => {
            const input = document.getElementById('investigation-role-input');
            const responseContainer = document.getElementById('investigation-role-response');
            const apiKey = prompt("Please enter your API key to use the Investigation Role:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/investigation/security', {
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
                    throw new Error(error.error || 'Failed to get a response from the investigation role');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Military Assistance ---
    const militaryAssistanceBtn = document.getElementById('military-assistance-btn');
    if (militaryAssistanceBtn) {
        militaryAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('military-assistance-input');
            const responseContainer = document.getElementById('military-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Military Services Assistance:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/military/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the military assistance role');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Podcast Assistance ---
    const podcastAssistanceBtn = document.getElementById('podcast-assistance-btn');
    if (podcastAssistanceBtn) {
        podcastAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('podcast-assistance-input');
            const responseContainer = document.getElementById('podcast-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Podcast & Business Podcast Role:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/podcast/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the podcast assistance role');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Supply Chain Assistance ---
    const supplyChainAssistanceBtn = document.getElementById('supply-chain-assistance-btn');
    if (supplyChainAssistanceBtn) {
        supplyChainAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('supply-chain-assistance-input');
            const responseContainer = document.getElementById('supply-chain-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Supply Chain Consultant:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/supply-chain/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the supply chain consultant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Logistics Assistance ---
    const logisticsAssistanceBtn = document.getElementById('logistics-assistance-btn');
    if (logisticsAssistanceBtn) {
        logisticsAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('logistics-assistance-input');
            const responseContainer = document.getElementById('logistics-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Logistics & Transportation Specialist:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/logistics/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the logistics specialist');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Data Engineering Assistance ---
    const dataEngineeringAssistanceBtn = document.getElementById('data-engineering-assistance-btn');
    if (dataEngineeringAssistanceBtn) {
        dataEngineeringAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('data-engineering-assistance-input');
            const responseContainer = document.getElementById('data-engineering-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Data Engineering & Architecture Assistant:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/data-engineering/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the data engineering assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Incoterm Assistance ---
    const incotermAssistanceBtn = document.getElementById('incoterm-assistance-btn');
    if (incotermAssistanceBtn) {
        incotermAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('incoterm-assistance-input');
            const responseContainer = document.getElementById('incoterm-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Incoterms Expert:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/incoterm/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the incoterms expert');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Digital Twin Assistance ---
    const digitalTwinAssistanceBtn = document.getElementById('digital-twin-assistance-btn');
    if (digitalTwinAssistanceBtn) {
        digitalTwinAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('digital-twin-assistance-input');
            const responseContainer = document.getElementById('digital-twin-assistance-response');
            const apiKey = prompt("Please enter your API key to use the Digital Twin Specialist:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/digital-twin/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the digital twin specialist');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }
});

    // --- Helper function for AI Roles ---
    async function setupAIRole(btnId, inputId, responseId, endpoint, roleName) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', async () => {
                const input = document.getElementById(inputId);
                const responseContainer = document.getElementById(responseId);
                const apiKey = prompt(`Please enter your API key to use the ${roleName}:`);

                if (!apiKey) {
                    responseContainer.textContent = 'API key is required.';
                    return;
                }

                try {
                    const response = await fetch(endpoint, {
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
                        throw new Error(error.error || `Failed to get a response from ${roleName}`);
                    }

                    const result = await response.json();
                    responseContainer.textContent = result.message;
                } catch (error) {
                    responseContainer.textContent = `Error: ${error.message}`;
                }
            });
        }
    }

    // --- Development Hub Roles ---
    setupAIRole('develop-website-btn', 'develop-website-input', 'develop-website-response', '/api/v1/develop/website', 'Website Developer');
    setupAIRole('develop-app-btn', 'develop-app-input', 'develop-app-response', '/api/v1/develop/app', 'App Developer');
    setupAIRole('develop-game-btn', 'develop-game-input', 'develop-game-response', '/api/v1/develop/game', 'Game Developer');
    setupAIRole('develop-backend-btn', 'develop-backend-input', 'develop-backend-response', '/api/v1/develop/backend', 'Backend Developer');
    setupAIRole('develop-blockchain-btn', 'develop-blockchain-input', 'develop-blockchain-response', '/api/v1/develop/blockchain', 'Blockchain Developer');

    // New Development Roles
    setupAIRole('develop-supply-chain-btn', 'develop-supply-chain-input', 'develop-supply-chain-response', '/api/v1/develop/supply-chain', 'Supply Chain Developer');
    setupAIRole('develop-logistics-btn', 'develop-logistics-input', 'develop-logistics-response', '/api/v1/develop/logistics', 'Logistics Developer');
    setupAIRole('develop-data-engineering-btn', 'develop-data-engineering-input', 'develop-data-engineering-response', '/api/v1/develop/data-engineering', 'Data Engineering Developer');
    setupAIRole('develop-incoterm-btn', 'develop-incoterm-input', 'develop-incoterm-response', '/api/v1/develop/incoterm', 'Incoterm Developer');
    setupAIRole('develop-digital-twin-btn', 'develop-digital-twin-input', 'develop-digital-twin-response', '/api/v1/develop/digital-twin', 'Digital Twin Developer');

    setupAIRole('develop-blogger-btn', 'develop-blogger-input', 'develop-blogger-response', '/api/v1/develop/blogger', 'Blogger Developer');
    setupAIRole('develop-messenger-btn', 'develop-messenger-input', 'develop-messenger-response', '/api/v1/develop/messenger', 'Messenger Developer');
