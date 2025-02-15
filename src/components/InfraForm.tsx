import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Cloud, Server, Globe2, Github } from 'lucide-react';
import { InfraFormData } from '../types';
import { apiService, DeploymentStep } from '../services/api';
import { REPO_URLS, GCP_REGIONS, GCP_ZONES, MACHINE_TYPES, ENVIRONMENTS, NETWORK_TIERS } from '../config/constants';
import { DeploymentLogs } from './DeploymentLogs';
import clsx from 'clsx';

export function InfraForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InfraFormData>();

  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const onSubmit = async (data: InfraFormData) => {
    try {
      setShowLogs(true);
      const result = await apiService.deployInfrastructure(data);
      
      // Initialize deployment steps
      setDeploymentSteps([
        {
          id: 'init',
          title: 'Initialize Deployment',
          status: 'completed',
          logs: ['Deployment initialized successfully'],
          startTime: new Date(),
          endTime: new Date(),
        },
        {
          id: 'validate',
          title: 'Validate Configuration',
          status: 'running',
          logs: ['Validating deployment configuration...'],
          startTime: new Date(),
        },
        {
          id: 'terraform',
          title: 'Terraform Plan & Apply',
          status: 'pending',
          logs: [],
        },
        {
          id: 'gcp',
          title: 'GCP Resource Creation',
          status: 'pending',
          logs: [],
        },
        {
          id: 'verify',
          title: 'Verify Deployment',
          status: 'pending',
          logs: [],
        },
      ]);

      // Start streaming logs
      await apiService.streamDeploymentLogs(result.deploymentId, (updatedSteps) => {
        setDeploymentSteps(updatedSteps);
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setDeploymentSteps(prev => [
        ...prev,
        {
          id: 'error',
          title: 'Deployment Error',
          status: 'failed',
          logs: [(error as Error).message],
          startTime: new Date(),
          endTime: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Repository Information</h2>
          <Github className="h-5 w-5 text-gray-600" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub Actions Workflow</label>
            <a 
              href={REPO_URLS.GITHUB_ACTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 break-all"
            >
              {REPO_URLS.GITHUB_ACTIONS}
            </a>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Terraform Configuration</label>
            <a 
              href={REPO_URLS.TERRAFORM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 break-all"
            >
              {REPO_URLS.TERRAFORM}
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              {...register('projectName', { required: 'Project name is required' })}
              className={clsx(
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                'p-2 border',
                errors.projectName && 'border-red-500'
              )}
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project ID</label>
            <input
              type="text"
              {...register('projectId', { required: 'Project ID is required' })}
              className={clsx(
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                'p-2 border',
                errors.projectId && 'border-red-500'
              )}
            />
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <select
                {...register('region', { required: 'Region is required' })}
                className={clsx(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                  'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                  'p-2 border',
                  errors.region && 'border-red-500'
                )}
              >
                <option value="">Select a region</option>
                {GCP_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Zone</label>
              <select
                {...register('zone', { required: 'Zone is required' })}
                className={clsx(
                  'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                  'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                  'p-2 border',
                  errors.zone && 'border-red-500'
                )}
              >
                <option value="">Select a zone</option>
                {GCP_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {errors.zone && (
                <p className="mt-1 text-sm text-red-600">{errors.zone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Environment</label>
            <select
              {...register('environment', { required: 'Environment is required' })}
              className={clsx(
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                'p-2 border',
                errors.environment && 'border-red-500'
              )}
            >
              <option value="">Select an environment</option>
              {ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
            {errors.environment && (
              <p className="mt-1 text-sm text-red-600">{errors.environment.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Machine Type</label>
            <select
              {...register('machineType', { required: 'Machine type is required' })}
              className={clsx(
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                'p-2 border',
                errors.machineType && 'border-red-500'
              )}
            >
              <option value="">Select a machine type</option>
              {MACHINE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.machineType && (
              <p className="mt-1 text-sm text-red-600">{errors.machineType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Network Tier</label>
            <select
              {...register('networkTier', { required: 'Network tier is required' })}
              className={clsx(
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
                'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
                'p-2 border',
                errors.networkTier && 'border-red-500'
              )}
            >
              <option value="">Select a network tier</option>
              {NETWORK_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
            {errors.networkTier && (
              <p className="mt-1 text-sm text-red-600">{errors.networkTier.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            'w-full flex justify-center py-2 px-4 border border-transparent rounded-md',
            'shadow-sm text-sm font-medium text-white bg-blue-600',
            'hover:bg-blue-700 focus:outline-none focus:ring-2',
            'focus:ring-offset-2 focus:ring-blue-500',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Deploying...' : 'Deploy Infrastructure'}
        </button>
      </form>

      <DeploymentLogs steps={deploymentSteps} isVisible={showLogs} />
    </div>
  );
}