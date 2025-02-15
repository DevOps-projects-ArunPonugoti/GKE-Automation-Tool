terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

module "gke" {
  source = "./modules/gke"

  project_id    = var.project_id
  project_name  = var.project_name
  region        = var.region
  zone          = var.zone
  environment   = var.environment
  machine_type  = var.machine_type
  network_tier  = var.network_tier
}