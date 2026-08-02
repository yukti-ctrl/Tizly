# 1. Use an official Python image
FROM python:3.11-slim

# 2. Set the directory inside the container
WORKDIR /app

# 3. Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# 4. Copy the rest of your backend code
COPY . .

# 5. Create an 'instance' folder for the SQLite DB (if using SQLite)
RUN mkdir -p instance

# 6. Expose the port Flask runs on
EXPOSE 5000

# 7. Start the server using 'gunicorn' (Production-grade server)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"]