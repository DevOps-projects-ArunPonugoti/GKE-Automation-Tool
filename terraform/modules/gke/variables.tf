variable "project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "zone" {
  description = "The GCP zone"
  type        = string
}

variable "environment" {
  description = "The deployment environment"
  type        = string
}

variable "machine_type" {
  description = "The GCP machine type"
  type        = string
}

variable "network_tier" {
  description = "The network tier to use"
  type        = string
}