import posthog from 'posthog-js'

export function usePostHog() {
    // Check if already initialized to prevent double-init issues in hot-reload
    if (!posthog.__loaded) {
        posthog.init('phc_KFDM7fRh9BRINFynYrRz8WLMgawlZHC7FZ98vAFDwXt', {
            api_host: 'https://us.i.posthog.com',
            defaults: '2025-11-30',
            person_profiles: 'always',
        })
    }

    return { posthog }
}
