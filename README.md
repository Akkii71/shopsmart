# Instructions

1. Use SQLITE3 for database storage implementation
1. Use Prisma for ORM
1. Implement at least one full CRUD RESTful API
1. Deploy it on Render for backend and vercel for frontend
1. Resolve CORS issue if needed after deployment
# Full-Stack Application CI/CD Pipeline

![CI Pipeline](https://img.shields.io/github/actions/workflow/status/your-username/your-repo/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)
![CD Pipeline](https://img.shields.io/github/actions/workflow/status/your-username/your-repo/deploy.yml?branch=main&label=Deployment&style=for-the-badge)

This repository contains a full end-to-end CI/CD setup utilizing GitHub Actions for a Full-Stack application (Frontend with React/Next.js, Backend with Node.js/Express) deployed to AWS.

## Architecture & Workflows

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggered on PRs to `main` and `develop`.
   - Runs parallel jobs to install dependencies, lint, and execute Jest test suites with coverage.
   - Uploads coverage reports as GitHub Actions artifacts.

2. **Continuous Deployment (`.github/workflows/deploy.yml`)**:
   - Triggered on push to `main` and manually via `workflow_dispatch`.
   - **Backend Job**: Containerizes the application, pushes the image to AWS ECR, and deploys a new task definition to AWS ECS.
   - **Frontend Job**: Builds the Node application, syncs output to an AWS S3 bucket, and creates a CloudFront invalidation for caching.

## GitHub Secrets Required

Below is the list of secrets required by the CD pipeline to successfully deploy your application to AWS. You can set them in your repository settings: `Settings > Secrets and variables > Actions > New repository secret`.

| Secret Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | Your AWS IAM Access Key ID with permissions for ECR, ECS, S3, and CloudFront. |
| `AWS_SECRET_ACCESS_KEY` | Your AWS IAM Secret Access Key. |
| `AWS_REGION` | The AWS region where your resources are located (e.g., `us-east-1`). |
| `ECR_REPOSITORY` | The name of your Amazon Elastic Container Registry (ECR) repository for the backend image (e.g., `my-app-backend`). |
| `ECS_CLUSTER` | The name of your Amazon Elastic Container Service (ECS) cluster. |
| `ECS_SERVICE` | The name of your ECS Service running in the cluster. |
| `ECS_TASK_DEFINITION` | The family name or ARN of your ECS task definition (e.g., `backend-task`). |
| `S3_BUCKET` | The exact name of your frontend AWS S3 Bucket used for web hosting. |
| `CLOUDFRONT_DISTRIBUTION_ID` | The ID of your AWS CloudFront distribution to invalidate caches (e.g., `E2QUR7...`). |
| `FRONTEND_API_URL` | The production API URL needed for the React frontend build step. |
| `SLACK_BOT_TOKEN` | A Slack bot token that is used to post deployment status to the defined Slack channel. |

> **Environments**: To gate deployments, we utilize an environment named `production` in the CD workflow. You can setup environments in GitHub and enforce approval workflows before these deployments begin.

## Setup Instructions

### 1. Project Initialization
Navigate to both `frontend/` and `backend/` directories and run dependency installations:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` templates to `.env` in each service folder:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Fill out these local values properly for your own development environment.

### 3. Run Testing Locally
You can manually run testing and generate coverages locally per service:
```bash
# In backend
npm test -- --coverage

# In frontend
npm test -- --coverage
```

### 4. Push and Deploy
- Create a PR against `main` or `develop` to verify tests pass via CI checks.
- Merge your PR to `main` to kick off the complete deployment pipeline.
