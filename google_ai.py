import os
import re
import vertexai
from vertexai.generative_models import GenerativeModel
from langchain_google_vertexai import ChatVertexAI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.agents import initialize_agent, AgentType, load_tools

def init_vertexai():
    """Initializes the Vertex AI SDK."""
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION")

    if not all([project_id, location]):
        print("Google Cloud project ID and location not found in environment variables. Skipping Vertex AI initialization.")
        return

    vertexai.init(project=project_id, location=location)
    print("Vertex AI SDK initialized successfully.")

def get_model(model_name="gemini-1.5-flash", provider="google"):
    if provider == "openai":
        return ChatOpenAI(model_name=model_name if model_name != "gemini-1.5-flash" else "gpt-4o")
    return ChatVertexAI(model_name=model_name)

def provide_chatgpt_assistance(prompt: str) -> str:
    """
    Provides assistance using ChatGPT (OpenAI).
    """
    model = get_model(provider="openai")
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful and versatile AI assistant powered by ChatGPT."),
        ("user", "{prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error with ChatGPT: {e}"

def provide_autogpt_assistance(prompt: str) -> str:
    """
    Simulates an AutoGPT-like autonomous agent using LangChain agents.
    """
    try:
        model = get_model(provider="openai")
        # For simulation, we'll use a standard agent with some tools
        # In a real environment, you'd need keys for these tools (e.g. SERPAPI_API_KEY)
        tools = load_tools(["llm-math"], llm=model)
        agent = initialize_agent(
            tools,
            model,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True
        )

        system_msg = "You are an autonomous agent similar to AutoGPT. Your goal is to solve the user's request by breaking it down into steps and using tools if necessary."
        full_prompt = f"{system_msg}\n\nUser Goal: {prompt}"

        response = agent.run(full_prompt)
        return response.strip()
    except Exception as e:
        return f"Error with AutoGPT Agent: {e}"

def generate_website(prompt: str) -> tuple[str, str]:
    """
    Generates HTML and CSS code from a natural language prompt using LangChain and Vertex AI.
    """
    model = get_model()

    system_prompt = "You are a skilled web developer. Your task is to generate the HTML and CSS for a single-page website based on the user prompt."
    user_prompt_template = """
    User Prompt:
    ---
    {prompt}
    ---

    Your response must be in the following format, with no other text or explanations:

    [HTML]
    <!DOCTYPE html>
    ...
    </html>
    [/HTML]

    [CSS]
    body {{
        ...
    }}
    [/CSS]
    """

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", user_prompt_template)
    ])

    chain = prompt_template | model | StrOutputParser()

    try:
        text_response = chain.invoke({"prompt": prompt})

        html_match = re.search(r'\[HTML\](.*?)\[/HTML\]', text_response, re.DOTALL)
        css_match = re.search(r'\[CSS\](.*?)\[/CSS\]', text_response, re.DOTALL)

        html_code = html_match.group(1).strip() if html_match else "<!-- Error: Could not generate HTML. -->"
        css_code = css_match.group(1).strip() if css_match else "/* Error: Could not generate CSS. */"

        return html_code, css_code

    except Exception as e:
        print(f"Error generating website with LangChain: {e}")
        return f"<!-- Error: {e} -->", f"/* Error: {e} */"

def debug_code(code: str, language: str) -> list[str]:
    """
    Analyzes code and finds potential issues using LangChain and Vertex AI.
    """
    model = get_model()

    system_prompt = "You are an expert code reviewer."
    user_prompt_template = """
    Your task is to analyze the following {language} code and identify any potential bugs, errors, or style issues.

    Code:
    ---
    {code}
    ---

    Please list the issues you find, one per line. If you find no issues, return an empty response.
    """

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", user_prompt_template)
    ])

    chain = prompt_template | model | StrOutputParser()

    try:
        response_text = chain.invoke({"language": language, "code": code})
        errors = response_text.strip().split('\n')
        return [error for error in errors if error]

    except Exception as e:
        print(f"Error debugging code with LangChain: {e}")
        return [f"Error: {e}"]

def generate_social_media_post(description: str) -> str:
    """
    Generates a social media post using LangChain.
    """
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a creative marketing assistant."),
        ("user", "Your task is to write an engaging social media post based on the following description: {description}. The post should be short, catchy, and include relevant hashtags.")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"description": description}).strip()
    except Exception as e:
        print(f"Error generating social media post: {e}")
        return f"Error: {e}"

def generate_promotion_from_content(url: str, content: str) -> str:
    """
    Generates a promotion campaign using LangChain.
    """
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert marketing strategist."),
        ("user", "Your task is to create a compelling promotion campaign for the product at the URL: {url}. Based on this content: {content}, generate a short, catchy, and engaging promotional text for social media with hashtags.")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"url": url, "content": content}).strip()
    except Exception as e:
        print(f"Error generating promotion: {e}")
        return f"Error: {e}"

def generate_business_strategy(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert business strategist."),
        ("user", "Develop a comprehensive business strategy with actionable steps based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_it_support(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a knowledgeable IT support specialist."),
        ("user", "Provide a clear, step-by-step solution to this technical issue: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def analyze_data(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a skilled data scientist."),
        ("user", "Analyze the following data and provide insights, trends, and conclusions: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_financial_advice(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert financial advisor."),
        ("user", "Provide comprehensive financial advice with actionable steps based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def generate_blockchain_code(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert blockchain developer."),
        ("user", "Generate well-structured blockchain code with comments based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def generate_blogger_bots_page(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert blogger and bot developer."),
        ("user", "Generate an engaging blogger page with functional bots based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def generate_messenger_code(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Messenger developer and manager."),
        ("user", "Generate code for a Messenger bot or integration following best practices based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def learn_language(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a friendly and patient language tutor."),
        ("user", "Help the user learn a new language based on their request: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_telecommunication_support(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a knowledgeable telecommunication support specialist."),
        ("user", "Provide a clear, step-by-step solution to this telecommunication issue: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def generate_telecommunication_assistant_response(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful telecommunication assistant."),
        ("user", "Provide a clear and concise response to this query: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_science_education(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a knowledgeable and patient sciences educator."),
        ("user", "Provide clear explanations or solve exercises for this request: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_transaction_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant for mobile operators, banks, and transactions."),
        ("user", "Provide assistance on fraud prevention and transaction facilities for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def play_music_instrumental(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a virtuoso music instrumentalist."),
        ("user", "Provide musical suggestions, help with learning, tabs, or compose short pieces for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_geometry_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert mathematician specializing in geometry."),
        ("user", "Provide assistance with geometry problems, theorems, and concepts for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_cartography_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert cartographer and GIS specialist."),
        ("user", "Provide assistance with map making, geographical data analysis, and coordinate systems for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_document_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert document specialist."),
        ("user", "Assist with writing, scanning, and building documents based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_business_plan_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert business consultant and strategist."),
        ("user", "Help create, perfect, and develop a comprehensive business plan based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_investigation_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert investigator specializing in cybersecurity and global security."),
        ("user", "Provide deep insights and investigative strategies for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_military_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert military and security strategist."),
        ("user", "Provide assistance and guidance for armies and security services based on: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_podcast_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert podcast producer, creator, and designer."),
        ("user", "Provide assistance with creating, perfecting, and designing high-quality podcasts for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_supply_chain_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert supply chain consultant."),
        ("user", "Provide assistance with optimizing and managing supply chain operations for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_logistics_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert logistics and transportation specialist."),
        ("user", "Provide assistance with managing the movement of goods and materials for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_data_engineering_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert data engineer and architect."),
        ("user", "Provide assistance with designing, building, and maintaining data pipelines and architectures for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_incoterms_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert in Incoterms and international trade."),
        ("user", "Provide assistance and clarification on the use and interpretation of Incoterms for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_ecommerce_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert e-commerce assistant and website manager."),
        ("user", "Provide assistance with managing e-commerce platforms and websites for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_government_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert government public administrator assistant."),
        ("user", "Provide assistance with government services and document providing for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_biotech_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert biotech development specialist and researcher."),
        ("user", "Provide assistance with biotechnology projects, research, and development for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_legal_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert legal consultant, human rights advocate, and legal educator."),
        ("user", "Provide assistance to lawyers, courts, parliaments, and legal students for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_fintech_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert fintech consultant and data engineer."),
        ("user", "Provide high-level assistance and guidance for banks, fintechs, and VC firms for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_music_production_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert music producer and talent manager."),
        ("user", "Provide assistance with music beats, songs, rhythms, and singer promotion for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def translate_text(text: str, target_language: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are a professional translation service."),
        ("user", "Translate the following text accurately into {target_language}. Provide ONLY the translation. Text: {text}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"text": text, "target_language": target_language}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_aerospace_automotive_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert specialist in the automotive, aeronautics, and astronomy sectors."),
        ("user", "Provide high-level assistance, technical guidance, and strategic advice for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_data_science_stewardship_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Data Scientist, Data Steward, and Data Protection Officer Assistant."),
        ("user", "Provide high-level assistance, technical guidance, and strategic advice for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_logo_thumbnail_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert graphic designer and branding specialist."),
        ("user", "Provide assistance with creating and designing logos and thumbnails for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_fake_content_verification_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert in digital forensics, AI content detection, and fact-checking."),
        ("user", "Analyze the following content and provide a detailed assessment of its authenticity: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_automatic_learning_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert in Automatic Learning, Machine Learning, and AI development."),
        ("user", "Provide high-level technical guidance, strategy, and problem-solving assistance for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_ia_data_engineering_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI Data Engineer and Architect."),
        ("user", "Provide assistance with designing, building, and maintaining data pipelines and architectures for AI for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_data_lab_center_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Data Lab and Data Center Specialist."),
        ("user", "Provide assistance with designing, building, and managing data laboratories and data center infrastructure for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_computer_vision_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Computer Vision Specialist."),
        ("user", "Provide high-level technical guidance, strategy, and problem-solving assistance in computer vision for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_ia_researcher_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI Researcher."),
        ("user", "Provide high-level scientific and technical guidance on artificial intelligence research and development for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_esports_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert eSports Development and Assistance Specialist."),
        ("user", "Provide high-level technical guidance, strategic advice, and problem-solving assistance in eSports for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_dermatology_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI Dermatology Specialist and Assistant. DISCLAIMER: You are an AI, not a doctor."),
        ("user", "Provide professional, accurate, and detailed information related to dermatology for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_microsoft_ignite_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert in Microsoft Ignite tools, specifically Azure AI Foundry and Agentic AI."),
        ("user", "Provide high-level technical guidance and strategic advice regarding Microsoft Ignite tools for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_diagnostic_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert AI Diagnostic Specialist. DISCLAIMER: You are an AI, not a doctor."),
        ("user", "Provide professional, accurate, and detailed information related to medical diagnostics for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_eshop_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert E-shop and E-commerce Creation Specialist."),
        ("user", "Provide high-level technical guidance and strategic advice for building and managing online stores for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_it_operations_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert IT Operations Specialist and System Administrator."),
        ("user", "Provide high-level technical guidance and problem-solving assistance in IT operations for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_maintenance_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Software, Computer, and Phones Maintenance Specialist."),
        ("user", "Provide high-level technical guidance and troubleshooting steps for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_google_sites_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Google Sites and DNS Specialist."),
        ("user", "Provide high-level technical guidance for Google Sites, DNS, and custom subdomains for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_marketing_bot_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Digital Marketing and Bot Management Specialist."),
        ("user", "Provide high-level strategic guidance and technical assistance for marketing bots and campaigns for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def provide_digital_repair_assistance(prompt: str) -> str:
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Digital Repair and Troubleshooting Specialist."),
        ("user", "Provide high-level technical guidance and troubleshooting steps for digital assets for: {prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": prompt}).strip()
    except Exception as e:
        return f"Error: {e}"

def generic_ai_service(system_message: str, user_prompt: str) -> str:
    """
    A generic AI service using LangChain to allow flexible role creation.
    """
    model = get_model()
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("user", "{prompt}")
    ])
    chain = prompt_template | model | StrOutputParser()
    try:
        return chain.invoke({"prompt": user_prompt}).strip()
    except Exception as e:
        return f"Error: {e}"
