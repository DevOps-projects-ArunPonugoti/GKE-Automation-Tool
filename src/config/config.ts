interface Config {
  apiBaseUrl: string;
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  githubWorkflowId: string;
  gcpProjectId: string;
  environment: string;
}

// Default development configuration
const devConfig: Config = {
  apiBaseUrl: 'http://localhost:3000',
  githubToken: 'dummy-github-token',
  githubOwner: 'learning-org-2565',
  githubRepo: 'Terraform_GKE_Project',
  githubWorkflowId: '08-gke_module.yaml',
  gcpProjectId: 'dummy-project-id',
  environment: 'development',
};

// Production configuration (loaded from environment variables)
const prodConfig: Config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || devConfig.apiBaseUrl,
  githubToken: import.meta.env.VITE_GITHUB_TOKEN || devConfig.githubToken,
  githubOwner: import.meta.env.VITE_GITHUB_OWNER || devConfig.githubOwner,
  githubRepo: import.meta.env.VITE_GITHUB_REPO || devConfig.githubRepo,
  githubWorkflowId: import.meta.env.VITE_GITHUB_WORKFLOW_ID || devConfig.githubWorkflowId,
  gcpProjectId: import.meta.env.VITE_GCP_PROJECT_ID || devConfig.gcpProjectId,
  environment: import.meta.env.VITE_ENVIRONMENT || devConfig.environment,
};

export const config: Config = import.meta.env.PROD ? prodConfig : devConfig;