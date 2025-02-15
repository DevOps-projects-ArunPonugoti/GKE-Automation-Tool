import { config } from '../config/config';
import { triggerGitHubWorkflow } from './github';
import type { InfraFormData } from '../types';

export interface DeploymentStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs: string[];
  startTime?: Date;
  endTime?: Date;
}

class ApiService {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.githubToken}`,
    };
  }

  async deployInfrastructure(data: InfraFormData): Promise<{ deploymentId: string }> {
    try {
      // Trigger GitHub workflow
      const { workflow_id } = await triggerGitHubWorkflow(data);
      return { deploymentId: workflow_id };
    } catch (error) {
      console.error('Deployment error:', error);
      throw new Error('Failed to initiate deployment');
    }
  }

  async streamDeploymentLogs(
    deploymentId: string,
    onUpdate: (steps: DeploymentStep[]) => void
  ): Promise<void> {
    const pollInterval = 5000; // 5 seconds
    const steps: DeploymentStep[] = [
      {
        id: 'init',
        title: 'Initialize Terraform',
        status: 'pending',
        logs: [],
      },
      {
        id: 'validate',
        title: 'Validate Configuration',
        status: 'pending',
        logs: [],
      },
      {
        id: 'plan',
        title: 'Terraform Plan',
        status: 'pending',
        logs: [],
      },
      {
        id: 'apply',
        title: 'Terraform Apply',
        status: 'pending',
        logs: [],
      },
      {
        id: 'verify',
        title: 'Verify Infrastructure',
        status: 'pending',
        logs: [],
      }
    ];

    onUpdate(steps);

    const pollWorkflowStatus = async () => {
      const response = await fetch(
        `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/actions/runs/${deploymentId}/logs`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${config.githubToken}`,
          },
        }
      );

      if (response.ok) {
        const logs = await response.text();
        // Parse and update steps based on the logs
        updateStepsFromLogs(steps, logs);
        onUpdate([...steps]);
      }
    };

    // Start polling
    const interval = setInterval(pollWorkflowStatus, pollInterval);

    // Clean up interval when done
    return () => clearInterval(interval);
  }
}

function updateStepsFromLogs(steps: DeploymentStep[], logs: string) {
  // Parse GitHub Actions logs and update steps accordingly
  const logLines = logs.split('\n');
  
  for (const line of logLines) {
    if (line.includes('terraform init')) {
      updateStep(steps, 'init', line);
    } else if (line.includes('terraform validate')) {
      updateStep(steps, 'validate', line);
    } else if (line.includes('terraform plan')) {
      updateStep(steps, 'plan', line);
    } else if (line.includes('terraform apply')) {
      updateStep(steps, 'apply', line);
    } else if (line.includes('Verifying')) {
      updateStep(steps, 'verify', line);
    }
  }
}

function updateStep(steps: DeploymentStep[], stepId: string, log: string) {
  const step = steps.find(s => s.id === stepId);
  if (step) {
    if (!step.startTime) {
      step.startTime = new Date();
      step.status = 'running';
    }
    step.logs.push(log);
    if (log.includes('Successfully completed') || log.includes('done')) {
      step.status = 'completed';
      step.endTime = new Date();
    } else if (log.includes('Error') || log.includes('Failed')) {
      step.status = 'failed';
      step.endTime = new Date();
    }
  }
}

export const apiService = new ApiService();