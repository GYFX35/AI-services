document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();

    // Global API Key storage for the session
    let globalApiKey = null;

    function getApiKey(message) {
        if (globalApiKey) return globalApiKey;
        const apiKey = prompt(message || "Please enter your API key:");
        if (apiKey) {
            globalApiKey = apiKey;
        }
        return apiKey;
    }

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
            const apiKey = getApiKey("Please enter your API key to make a purchase:");
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
            const apiKey = getApiKey("Please enter your API key to create a project:");

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

    // --- Data Science & Stewardship Assistance ---
    const dataScienceStewardshipBtn = document.getElementById('data-science-stewardship-btn');
    if (dataScienceStewardshipBtn) {
        dataScienceStewardshipBtn.addEventListener('click', async () => {
            const input = document.getElementById('data-science-stewardship-input');
            const responseContainer = document.getElementById('data-science-stewardship-response');
            const apiKey = getApiKey("Please enter your API key to use the Data Science, Steward & DPO Assistant:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/data-science-stewardship/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the data science & stewardship assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
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
            const apiKey = getApiKey("Please enter your API key to use the Document Specialist:");

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
            const apiKey = getApiKey("Please enter your API key to generate a promotion:");

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
            const apiKey = getApiKey("Please enter your API key to use the Sciences Educator:");

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
            const apiKey = getApiKey("Please enter your API key to use the Music Instrumentalist:");

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
            const apiKey = getApiKey("Please enter your API key to use the Geometry Assistant:");

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
            const apiKey = getApiKey("Please enter your API key to use the Cartography Assistant:");

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
            const apiKey = getApiKey("Please enter your API key to use the Business Plan Creator:");

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
            const apiKey = getApiKey("Please enter your API key to use the Investigation Role:");

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
            const apiKey = getApiKey("Please enter your API key to use the Military Services Assistance:");

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
            const apiKey = getApiKey("Please enter your API key to use the Podcast & Business Podcast Role:");

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
            const apiKey = getApiKey("Please enter your API key to use the Supply Chain Consultant:");

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
            const apiKey = getApiKey("Please enter your API key to use the Logistics & Transportation Specialist:");

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
            const apiKey = getApiKey("Please enter your API key to use the Data Engineering Expert:");

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
                    throw new Error(error.error || 'Failed to get a response from the data engineering expert');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Incoterms Assistance ---
    const incotermsAssistanceBtn = document.getElementById('incoterms-assistance-btn');
    if (incotermsAssistanceBtn) {
        incotermsAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('incoterms-assistance-input');
            const responseContainer = document.getElementById('incoterms-assistance-response');
            const apiKey = getApiKey("Please enter your API key to use the Incoterms Expert:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/incoterms/assistance', {
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

    // --- E-commerce Assistance ---
    const ecommerceAssistanceBtn = document.getElementById('ecommerce-assistance-btn');
    if (ecommerceAssistanceBtn) {
        ecommerceAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('ecommerce-assistance-input');
            const responseContainer = document.getElementById('ecommerce-assistance-response');
            const apiKey = getApiKey("Please enter your API key to use the E-commerce & Website Manager:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/ecommerce/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the e-commerce assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Government Assistance ---
    const governmentAssistanceBtn = document.getElementById('government-assistance-btn');
    if (governmentAssistanceBtn) {
        governmentAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('government-assistance-input');
            const responseContainer = document.getElementById('government-assistance-response');
            const apiKey = getApiKey("Please enter your API key to use the Government Public Administrator:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/government/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the government assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Biotech Assistance ---
    const biotechAssistanceBtn = document.getElementById('biotech-assistance-btn');
    if (biotechAssistanceBtn) {
        biotechAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('biotech-assistance-input');
            const responseContainer = document.getElementById('biotech-assistance-response');
            const apiKey = getApiKey("Please enter your API key to use the Biotech Development Role:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/biotech/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the biotech development role');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Legal Assistance ---
    const legalAssistanceBtn = document.getElementById('legal-assistance-btn');
    if (legalAssistanceBtn) {
        legalAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('legal-assistance-input');
            const responseContainer = document.getElementById('legal-assistance-response');
            const apiKey = getApiKey("Please enter your API key to use the Legal & Human Rights Assistant:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/legal/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the legal assistant');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Fintech Assistance ---
    const fintechAssistanceBtn = document.getElementById('fintech-assistance-btn');
    if (fintechAssistanceBtn) {
        fintechAssistanceBtn.addEventListener('click', async () => {
            const input = document.getElementById('fintech-assistance-input');
            const responseContainer = document.getElementById('fintech-assistance-response');
            const apiKey = getApiKey("Please enter your API key to use the Fintech & Banking Strategist:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/fintech/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the fintech strategist');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Music Production ---
    const musicProductionBtn = document.getElementById('music-production-btn');
    if (musicProductionBtn) {
        musicProductionBtn.addEventListener('click', async () => {
            const input = document.getElementById('music-production-input');
            const responseContainer = document.getElementById('music-production-response');
            const apiKey = getApiKey("Please enter your API key to use the Music Production & Promotion role:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/music/production', {
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
                    throw new Error(error.error || 'Failed to get a response from the music production role');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Aerospace & Automotive Assistance ---
    const aerospaceAutomotiveBtn = document.getElementById('aerospace-automotive-btn');
    if (aerospaceAutomotiveBtn) {
        aerospaceAutomotiveBtn.addEventListener('click', async () => {
            const input = document.getElementById('aerospace-automotive-input');
            const responseContainer = document.getElementById('aerospace-automotive-response');
            const apiKey = getApiKey("Please enter your API key to use the Aerospace & Automotive Specialist:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/aerospace-automotive/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the aerospace & automotive specialist');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Logo & Thumbnail Creator ---
    const logoThumbnailBtn = document.getElementById('logo-thumbnail-btn');
    if (logoThumbnailBtn) {
        logoThumbnailBtn.addEventListener('click', async () => {
            const input = document.getElementById('logo-thumbnail-input');
            const responseContainer = document.getElementById('logo-thumbnail-response');
            const apiKey = getApiKey("Please enter your API key to use the Logo & Thumbnail Creator:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/logo-thumbnail/assistance', {
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
                    throw new Error(error.error || 'Failed to get a response from the logo & thumbnail creator');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }

    // --- Global Translator ---
    const translatorBtn = document.getElementById('translator-btn');
    if (translatorBtn) {
        translatorBtn.addEventListener('click', async () => {
            const textInput = document.getElementById('translator-text-input');
            const languageInput = document.getElementById('translator-language-input');
            const responseContainer = document.getElementById('translator-response');
            const apiKey = getApiKey("Please enter your API key to use the Global Translator:");

            if (!apiKey) {
                responseContainer.textContent = 'API key is required.';
                return;
            }

            try {
                const response = await fetch('/api/v1/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': apiKey
                    },
                    body: JSON.stringify({
                        text: textInput.value,
                        target_language: languageInput.value
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to get a response from the translator');
                }

                const result = await response.json();
                responseContainer.textContent = result.message;
            } catch (error) {
                responseContainer.textContent = `Error: ${error.message}`;
            }
        });
    }
});
