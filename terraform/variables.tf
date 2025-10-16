variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for Jenkins"
  default     = "t3.medium"
}

variable "key_name" {
  type        = string
  description = "EC2 key pair name"
}

variable "public_key_path" {
  type        = string
  description = "Path to your public key file"
}




