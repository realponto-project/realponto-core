web: node ./bin/www
release: npx sequelize-cli db:migrate
worker: node ./services/queue/consumerQueue.js