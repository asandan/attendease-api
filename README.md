# AttendEase Application Setup

This guide will help you set up and run the AttendEase application along with its database using Docker.

## Prerequisites
- Docker installed on your machine: [Get Docker](https://docs.docker.com/get-docker/)

## Instructions

### 1. Database Setup

Run the following command to start the database in detached mode:

```bash
docker-compose -f docker-compose.db.yml up -d
```

This command launches the PostgreSQL database for AttendEase.

### 2. Application Setup

Run the following command to start the database in detached mode:

```bash
docker-compose -f docker-compose.db.yml up -d
```

This command starts the AttendEase API in development mode.

