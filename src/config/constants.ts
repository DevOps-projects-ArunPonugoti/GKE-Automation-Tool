// Repository URLs
export const REPO_URLS = {
  GITHUB_ACTIONS: 'https://github.com/learning-org-2565/Terraform_GKE_Project/blob/main/.github/workflows/08-gke_module.yaml',
  TERRAFORM: 'https://github.com/learning-org-2565/Terraform_GKE_Project/tree/main/05-Simple_gke_module'
} as const;

// GCP Regions and Zones
export const GCP_REGIONS = ['us-central1', 'us-east1', 'us-west1', 'europe-west1', 'asia-east1'] as const;
export const GCP_ZONES = ['a', 'b', 'c'] as const;

// Machine Types
export const MACHINE_TYPES = ['e2-micro', 'e2-small', 'e2-medium', 'n1-standard-1', 'n1-standard-2'] as const;

// Environment Types
export const ENVIRONMENTS = ['development', 'staging', 'production'] as const;

// Network Tiers
export const NETWORK_TIERS = ['PREMIUM', 'STANDARD'] as const;