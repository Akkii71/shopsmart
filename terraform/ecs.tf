# Use AWS Academy LabRole (avoids IAM permission restrictions)
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

# Default VPC and subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ECR Repository
resource "aws_ecr_repository" "backend" {
  name                 = "shopsmart-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

# CloudWatch log group
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/shopsmart-backend"
  retention_in_days = 7
}

# Security group for ECS Fargate tasks
resource "aws_security_group" "backend" {
  name        = "shopsmart-backend-sg"
  description = "ShopSmart backend ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "shopsmart-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "shopsmart-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name  = "shopsmart-backend"
    image = "${aws_ecr_repository.backend.repository_url}:latest"

    portMappings = [{
      containerPort = 5001
      hostPort      = 5001
      protocol      = "tcp"
    }]

    healthCheck = {
      command     = ["CMD-SHELL", "wget -qO- http://localhost:5001/api/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 15
    }

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/shopsmart-backend"
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }

    environment = [
      { name = "PORT", value = "5001" },
      { name = "NODE_ENV", value = "production" }
    ]
  }])
}

# ECS Fargate Service
resource "aws_ecs_service" "backend" {
  name            = "shopsmart-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.backend.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}
