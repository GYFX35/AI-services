import os
from flask import Flask, jsonify, render_template, request

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/execute', methods=['POST'])
def execute():
    data = request.get_json()
    command = data.get('command')

    role = command.get('role')
    prompt = command.get('prompt')

    if role == 'develop':
        message = generate_website(prompt)
    elif role == 'debug':
        message = debug_code(prompt)
    elif role == 'market':
        message = generate_social_media_post(prompt)
    else:
        message = "Unknown role."

    response = {
        "status": "success",
        "message": message
    }
    return jsonify(response)

def generate_website(prompt):
    import datetime

    # Create a unique directory for the generated code
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    site_dir = os.path.join('generated_code', timestamp)
    os.makedirs(site_dir)

    # Simple logic to generate HTML and CSS from the prompt
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>My Awesome Website</h1>
    </header>
    <main>
        <p>{prompt}</p>
    </main>
    <footer>
        <p>&copy; 2024 AI Agent</p>
    </footer>
</body>
</html>
    """

    css_content = """
body {
    font-family: sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background: #f4f4f4;
    color: #333;
}
header {
    background: #333;
    color: #fff;
    padding: 1rem 0;
    text-align: center;
}
main {
    padding: 1rem;
    margin: 1rem auto;
    max-width: 800px;
    background: #fff;
}
footer {
    text-align: center;
    padding: 1rem 0;
    background: #333;
    color: #fff;
    position: absolute;
    bottom: 0;
    width: 100%;
}
    """

    with open(os.path.join(site_dir, 'index.html'), 'w') as f:
        f.write(html_content)

    with open(os.path.join(site_dir, 'style.css'), 'w') as f:
        f.write(css_content)

    return f"Website generated successfully! Files are located in: {site_dir}"

def debug_code(code):
    # This is a very basic, custom linter.
    errors = []

    # More robust language detection
    if code.strip().startswith('<'):
        lang = 'HTML'
        # HTML checks
        if not code.lower().strip().startswith('<!doctype html>'):
            errors.append("Missing <!DOCTYPE html> declaration at the beginning.")

        if code.lower().count('<html') != code.lower().count('</html>'):
            errors.append("Mismatched <html> tags.")

        if code.lower().count('<head') != code.lower().count('</head>'):
            errors.append("Mismatched <head> tags.")

        if code.lower().count('<body') != code.lower().count('</body>'):
            errors.append("Mismatched <body> tags.")
    else:
        lang = 'CSS'
        # CSS checks
        if code.count('{') != code.count('}'):
            errors.append("Mismatched curly braces {}.")

        lines = code.split('\n')
        in_block = False
        for i, line in enumerate(lines):
            line = line.strip()
            if '{' in line:
                in_block = True
            if '}' in line:
                in_block = False

            if in_block and line and not line.endswith('{') and not line.endswith('}') and not line.endswith(';'):
                 errors.append(f"Line {i+1}: Missing semicolon ';'.")

    if not errors:
        return f"No obvious issues found in your {lang} code."
    else:
        return f"Found potential issues in your {lang} code:\n" + "\n".join(f"- {error}" for error in errors)

def generate_social_media_post(prompt):
    # Simple template for a social media post
    post = f"""
🚀 Big News! 🚀

We're excited to announce {prompt}!

Come and check us out! You won't be disappointed.

#NewBusiness #GrandOpening #{prompt.replace(" ", "").split(',')[0]} #SupportLocal
    """
    return post.strip()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
