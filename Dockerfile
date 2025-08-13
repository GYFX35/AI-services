# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend and frontend code into the container
COPY backend/ ./backend
COPY frontend/ ./frontend

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variables
ENV PYTHONUNBUFFERED 1

# Run the app. The Gunicorn server will bind to 0.0.0.0:8000
# The module is backend.main and the Flask app instance is named 'app'
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.main:app"]
