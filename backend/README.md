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