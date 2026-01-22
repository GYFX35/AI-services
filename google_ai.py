import os
import re
import vertexai
from vertexai.generative_models import GenerativeModel

def init_vertexai():
    """Initializes the Vertex AI SDK."""
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_LOCATION")

    if not all([project_id, location]):
        print("Google Cloud project ID and location not found in environment variables. Skipping Vertex AI initialization.")
        return

    vertexai.init(project=project_id, location=location)
    print("Vertex AI SDK initialized successfully.")

def generate_website(prompt: str) -> tuple[str, str]:
    """
    Generates HTML and CSS code from a natural language prompt using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a skilled web developer. Your task is to generate the HTML and CSS for a single-page website based on the following user prompt.

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

    try:
        response = model.generate_content(generation_prompt)
        text_response = response.text

        html_match = re.search(r'\[HTML\](.*?)\[/HTML\]', text_response, re.DOTALL)
        css_match = re.search(r'\[CSS\](.*?)\[/CSS\]', text_response, re.DOTALL)

        html_code = html_match.group(1).strip() if html_match else "<!-- Error: Could not generate HTML. -->"
        css_code = css_match.group(1).strip() if css_match else "/* Error: Could not generate CSS. */"

        return html_code, css_code

    except Exception as e:
        print(f"Error generating website with Vertex AI: {e}")
        return f"<!-- Error: {e} -->", f"/* Error: {e} */"

def debug_code(code: str, language: str) -> list[str]:
    """
    Analyzes code and finds potential issues using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert code reviewer. Your task is to analyze the following {language} code and identify any potential bugs, errors, or style issues.

    Code:
    ---
    {code}
    ---

    Please list the issues you find, one per line. If you find no issues, return an empty response.
    """

    try:
        response = model.generate_content(generation_prompt)
        errors = response.text.strip().split('\n')
        # Filter out empty strings that may result from the split
        return [error for error in errors if error]

    except Exception as e:
        print(f"Error debugging code with Vertex AI: {e}")
        return [f"Error: {e}"]

def generate_social_media_post(description: str) -> str:
    """
    Generates a social media post from a description using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a creative marketing assistant. Your task is to write an engaging social media post based on the following description.

    Description:
    ---
    {description}
    ---

    The post should be short, catchy, and include relevant hashtags.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating social media post with Vertex AI: {e}")
        return f"Error: {e}"


def generate_promotion_from_content(url: str, content: str) -> str:
    """
    Generates a promotion campaign from a URL and its content using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert marketing strategist. Your task is to create a compelling promotion campaign
    for the product, startup, business, art, or talent described at the URL: {url}.

    I have extracted the following text content from the page:
    ---
    {content}
    ---

    Based on this content, generate a short, catchy, and engaging promotional text.
    The text should be suitable for social media and include relevant hashtags.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating promotion from content with Vertex AI: {e}")
        return f"Error: {e}"

def generate_business_strategy(prompt: str) -> str:
    """
    Generates a business strategy from a prompt using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert business strategist. Your task is to develop a business strategy based on the following user prompt.

    User Prompt:
    ---
    {prompt}
    ---

    The strategy should be comprehensive and include actionable steps.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating business strategy with Vertex AI: {e}")
        return f"Error: {e}"

def provide_it_support(prompt: str) -> str:
    """
    Provides IT support for a given issue using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a knowledgeable IT support specialist. Your task is to provide a solution to the following technical issue.

    User Issue:
    ---
    {prompt}
    ---

    Provide a clear, step-by-step solution.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error providing IT support with Vertex AI: {e}")
        return f"Error: {e}"

def analyze_data(prompt: str) -> str:
    """
    Analyzes data and provides insights using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a skilled data scientist. Your task is to analyze the following data and provide insights.

    Data and Request:
    ---
    {prompt}
    ---

    Provide key insights, trends, and conclusions from the data.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error analyzing data with Vertex AI: {e}")
        return f"Error: {e}"


def provide_financial_advice(prompt: str) -> str:
    """
    Provides financial advice for a given issue using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert financial advisor. Your task is to provide financial advice based on the following user prompt.

    User Prompt:
    ---
    {prompt}
    ---

    The advice should be comprehensive and include actionable steps.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error providing financial advice with Vertex AI: {e}")
        return f"Error: {e}"


def generate_blockchain_code(prompt: str) -> str:
    """
    Generates blockchain-related code using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert blockchain developer. Your task is to generate code based on the following user prompt.

    User Prompt:
    ---
    {prompt}
    ---

    The code should be well-structured and include comments where necessary.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating blockchain code with Vertex AI: {e}")
        return f"Error: {e}"


def generate_blogger_bots_page(prompt: str) -> str:
    """
    Generates a blogger bots page using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert blogger and bot developer. Your task is to generate a blogger page with bots based on the following user prompt.

    User Prompt:
    ---
    {prompt}
    ---

    The generated page should be engaging and the bots should be functional.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating blogger bots page with Vertex AI: {e}")
        return f"Error: {e}"


def generate_messenger_code(prompt: str) -> str:
    """
    Generates Messenger-related code using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are an expert Messenger developer and manager. Your task is to generate code for a Messenger bot or integration based on the following user prompt.

    User Prompt:
    ---
    {prompt}
    ---

    The code should be well-structured and follow best practices for the Messenger Platform.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating Messenger code with Vertex AI: {e}")
        return f"Error: {e}"


def learn_language(prompt: str) -> str:
    """
    Provides language learning assistance using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a friendly and patient language tutor. Your task is to help a user learn a new language based on their request.

    User Request:
    ---
    {prompt}
    ---

    Provide a clear, concise, and helpful response. You can provide translations, explanations of grammar, cultural context, or practice exercises.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error providing language learning assistance with Vertex AI: {e}")
        return f"Error: {e}"


def provide_telecommunication_support(prompt: str) -> str:
    """
    Provides telecommunication support for a given issue using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a knowledgeable telecommunication support specialist. Your task is to provide a solution to the following technical issue.

    User Issue:
    ---
    {prompt}
    ---

    Provide a clear, step-by-step solution.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error providing telecommunication support with Vertex AI: {e}")
        return f"Error: {e}"


def generate_telecommunication_assistant_response(prompt: str) -> str:
    """
    Generates a telecommunication assistant response for a given issue using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a helpful telecommunication assistant. Your task is to provide a response to the following user query.

    User Query:
    ---
    {prompt}
    ---

    Provide a clear and concise response.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating telecommunication assistant response with Vertex AI: {e}")
        return f"Error: {e}"


def provide_science_education(prompt: str) -> str:
    """
    Provides science education and resolves exercises using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a knowledgeable and patient sciences educator. Your expertise spans mathematics, physics-chemistry, biology, geography, and astronomy.
    Your task is to provide clear and concise explanations to the user's questions or to solve the exercises they provide.

    User Request:
    ---
    {prompt}
    ---

    Provide a helpful and accurate response.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error providing science education with Vertex AI: {e}")
        return f"Error: {e}"


def provide_transaction_assistance(prompt: str) -> str:
    """
    Provides mobile operator, banks, and transactions assistance using Vertex AI.
    """
    model = GenerativeModel("gemini-1.5-flash")

    generation_prompt = f"""
    You are a helpful assistant for mobile operators, banks, and transactions.
    Your task is to provide information and assistance on fraud prevention and transaction facilities.

    User Request:
    ---
    {prompt}
    ---

    Provide a clear, concise, and helpful response.
    """

    try:
        response = model.generate_content(generation_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error providing transaction assistance with Vertex AI: {e}")
        return f"Error: {e}"
