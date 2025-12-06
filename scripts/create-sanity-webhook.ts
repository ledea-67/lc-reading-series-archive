/**
 * Create a Sanity webhook to trigger Vercel deployments on content changes.
 *
 * Prerequisites:
 *   - SANITY_AUTH_TOKEN in .env.local (with deploy permission)
 *   - VERCEL_DEPLOY_HOOK_URL in .env.local (from Vercel project settings)
 *
 * Usage:
 *   npx tsx scripts/create-sanity-webhook.ts
 *
 * This script creates a webhook in the Sanity project that fires when
 * writer, siteSettings, or aboutPage documents are published/updated/deleted
 * in the production dataset.
 */

import 'dotenv/config';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'o7465upq';
const SANITY_AUTH_TOKEN = process.env.SANITY_AUTH_TOKEN;
const VERCEL_DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL;

if (!SANITY_AUTH_TOKEN) {
  console.error('Error: SANITY_AUTH_TOKEN is required in .env.local');
  console.error('Get a token from: https://www.sanity.io/manage/project/o7465upq/api#tokens');
  process.exit(1);
}

if (!VERCEL_DEPLOY_HOOK_URL) {
  console.error('Error: VERCEL_DEPLOY_HOOK_URL is required in .env.local');
  console.error('Create a deploy hook in Vercel: Project Settings → Git → Deploy Hooks');
  process.exit(1);
}

interface WebhookConfig {
  name: string;
  url: string;
  dataset: string;
  httpMethod: string;
  apiVersion: string;
  includeDrafts: boolean;
  filter: string;
  description: string;
  isDisabled: boolean;
}

async function createWebhook(): Promise<void> {
  const webhookConfig: WebhookConfig = {
    name: 'vercel-deploy-trigger',
    url: VERCEL_DEPLOY_HOOK_URL!,
    dataset: 'production',
    httpMethod: 'POST',
    apiVersion: '2021-03-25',
    includeDrafts: false, // Only trigger on published documents
    filter: '_type in ["writer", "siteSettings", "aboutPage"]',
    description: 'Triggers Vercel rebuild when content is published',
    isDisabled: false,
  };

  console.log('Creating Sanity webhook with configuration:');
  console.log(JSON.stringify({ ...webhookConfig, url: '[REDACTED]' }, null, 2));

  const response = await fetch(
    `https://api.sanity.io/v2021-10-04/hooks/projects/${SANITY_PROJECT_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_AUTH_TOKEN}`,
      },
      body: JSON.stringify(webhookConfig),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error creating webhook: ${response.status} ${response.statusText}`);
    console.error(errorText);
    process.exit(1);
  }

  const result = await response.json();
  console.log('\n✓ Webhook created successfully!');
  console.log('Webhook ID:', result.id);
  console.log('Name:', result.name);
  console.log('Dataset:', result.dataset);
  console.log('Filter:', result.filter);
  console.log('\nThe site will now rebuild automatically when you publish changes to:');
  console.log('  - Writer documents');
  console.log('  - Site Settings');
  console.log('  - About Page');
}

async function listWebhooks(): Promise<void> {
  console.log('\nExisting webhooks:');

  const response = await fetch(
    `https://api.sanity.io/v2021-10-04/hooks/projects/${SANITY_PROJECT_ID}`,
    {
      headers: {
        Authorization: `Bearer ${SANITY_AUTH_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    console.error('Failed to list webhooks');
    return;
  }

  const webhooks = await response.json();
  if (webhooks.length === 0) {
    console.log('  (none)');
  } else {
    for (const hook of webhooks) {
      console.log(`  - ${hook.name} (${hook.id})`);
      console.log(`    Dataset: ${hook.dataset}`);
      console.log(`    Filter: ${hook.filter || '(none)'}`);
      console.log(`    Enabled: ${!hook.isDisabled}`);
    }
  }
}

async function main(): Promise<void> {
  // First, list existing webhooks
  await listWebhooks();

  // Then create the new webhook
  console.log('\n---\n');
  await createWebhook();
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
