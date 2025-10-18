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
    for the product found at the URL: {url}.

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
