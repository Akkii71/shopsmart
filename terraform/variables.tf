variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for ShopSmart frontend"
  type        = string
  default     = "shopsmart-frontend-akkii71"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}
