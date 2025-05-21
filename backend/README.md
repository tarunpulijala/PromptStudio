seed data 
node seed-redis-prompts.js

curl http://localhost:3000/prompts
curl http://localhost:3000/prompts/<promptId>
curl -X PUT http://localhost:3000/prompts/<promptId> \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Write a haiku about the sea."
  }'
curl -X DELETE http://localhost:3000/prompts/<promptId>
curl -X POST http://localhost:3000/prompts/<promptId>/test \
  -H "Content-Type: application/json" \
  -d '{
    "context": "Make it suitable for children.",
    "testData": "N/A"
  }'
docker run -d --name redis-redisjson -p 6379:6379 \
  redis/redis-stack-server:latest

  This image includes RedisJSON and a web UI at http://localhost:8001.

# Create a virtual environment
python -m venv venv

# Activate it (on macOS/Linux)
source venv/bin/activate

# Activate it (on Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell
CREATE DATABASE prompthub;
\q

python -m app.db.init_db

# Method 1: Using the run script
python run.py

# Method 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Your application will be available at:
API: http://localhost:8000
API Documentation: http://localhost:8000/docs
Alternative API Documentation: http://localhost:8000/redoc
To test if everything is working:
Open your browser and go to http://localhost:8000/docs
You should see the Swagger UI documentation
Try the /api/prompts/public endpoint (it should work without authentication)
For authenticated endpoints, you'll need to:
First create a user (if you haven't implemented this yet)
Get a JWT token
Use the token in the Authorization header
Common issues and solutions:
Database connection error:
Check if PostgreSQL is running
Verify DATABASE_URL in .env
Make sure the database exists
Module not found errors:
Make sure you're in the correct directory
Check if virtual environment is activated
Verify all dependencies are installed
Port already in use:
Change the port in run.py or uvicorn command
Kill the process using the port
CORS issues:
Check CORS_ORIGINS in .env
Make sure your frontend URL is included



  