import { config } from '../config/config';
import type { InfraFormData } from '../types';

interface GitHubDispatchPayload {
  ref: string;
  inputs: {
    project_name: string;
    project_id: string;
    region: string;
    zone: string;
    environment: string;
    machine_type: string;
    network_tier: string;
  };
}

export async function triggerGitHubWorkflow(data: InfraFormData): Promise<{ workflow_id: string }> {
  const payload: GitHubDispatchPayload = {
    ref: 'main',
    inputs: {
      project_name: data.projectName,
      project_id: data.projectId,
      region: data.region,
      zone: data.zone,
      environment: data.environment,
      machine_type: data.machineType,
      network_tier: data.networkTier
    }
  };

  const response = await fetch(
    `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/actions/workflows/${config.githubWorkflowId}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${config.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to trigger GitHub workflow');
  }

  // Get the workflow run ID
  const runsResponse = await fetch(
    `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/actions/workflows/${config.githubWorkflowId}/runs?per_page=1`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${config.githubToken}`,
      },
    }
  );

  const runsData = await runsResponse.json();
  return { workflow_id: runsData.workflow_runs[0].id.toString() };
}