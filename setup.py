from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="ai-services-agent",
    version="0.1.0",
    author="Jules",
    author_email="jules@example.com",
    description="A web-based AI agent that can perform several roles to assist with software development and business tasks.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/GYFX35/AI-services",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "Flask[async]",
        "Flask-Babel",
        "Flask-SQLAlchemy",
        "python-dotenv",
        "requests",
        "beautifulsoup4",
        "lxml",
        "httpx",
        "anyio",
        "sniffio",
        "stripe",
        "facebook-business",
        "google-cloud-aiplatform",
        "google-auth",
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
