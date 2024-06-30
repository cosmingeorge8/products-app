# Products App

## Overview
`products-app` is a CRUD application built with Node.js and TypeScript to manage a list of products. Each product has a name, price, image, and stock. The application uses MongoDB for the database and leverages Docker Compose to manage the services. It includes socket.io support for real-time product updates and horizontally scales services with multiple instances of the web server behind an NGINX load balancer. Images are stored in AWS S3.

## Prerequisites
- Docker
- Docker Compose
- AWS account with an S3 bucket
- MongoDB
- Redis

## Project Structure
- `app1`: First instance of the Node.js application.
- `app2`: Second instance of the Node.js application.
- `nginx`: NGINX load balancer.
- `mongo`: MongoDB database.
- `redis`: Redis server for socket.io scaling.

## Environment Variables
Copy the `.env.example` file to `.env` for `app1` and to `.env.dev` for `app2` and fill in the necessary AWS and MongoDB configurations.

```bash
cp .env.example .env
cp .env.example .env.dev
```

Update the following variables in the `.env` and `.env.dev` files:

```dotenv
MONGO_URI=mongodb://mongo:27017/products
PORT=5001 or 5002
S3_BUCKET_NAME=your-s3-bucket-name
S3_BUCKET_REGION=your-s3-bucket-region
REDIS_HOST=redis
REDIS_PORT=6379
ORIGIN=http://localhost:3000
IO_PORT=4000 or 4001
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

## Docker Compose Configuration
The `docker-compose.yml` file configures the services:

```yaml
services:
  app1:
    build:
      context: .
      dockerfile: Dockerfile
    env_file:
      - .env
    ports:
      - "5001:5001"
      - "4000:4000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/products
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - app-network
    depends_on:
      - mongo
      - redis

  app2:
    build:
      context: .
      dockerfile: Dockerfile
    env_file:
      - .env.dev
    ports:
      - "5002:5002"
      - "4001:4001"
    environment:
      - MONGO_URI=mongodb://mongo:27017/products
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - app-network
    depends_on:
      - mongo
      - redis

  nginx:
    build:
      context: .
      dockerfile: Dockerfile.nginx
    ports:
      - "80:80"
    depends_on:
      - app1
      - app2
    networks:
      - app-network
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    networks:
      - app-network

  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## NGINX Configuration
Ensure you have an `nginx.conf` file in your project root:

```nginx
events { worker_connections 1024; }

http {
    upstream app {
        server app1:5001;
        server app2:5002;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /socket.io/ {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

## Running the Application
1. Build and start the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The application should now be accessible at `http://localhost`.

## API Endpoints
- `GET /products`: Retrieve all products.
- `POST /products`: Create a new product.
- `PUT /products/:id`: Update an existing product by ID.
- `DELETE /products/:id`: Delete a product by ID.

## Socket.io
Real-time updates are available on the following events:
- `productUpdates`: Broadcasts when a product is created, updated, or deleted.

## Scaling with NGINX
The setup uses NGINX to load balance between multiple instances of the application (`app1` and `app2`) to ensure high availability and scalability.

## License
This project is licensed under the MIT License.