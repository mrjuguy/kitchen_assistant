import PostHog from "posthog-react-native";

const posthogApiKey =
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY || "dummy_key_for_tests";
const posthogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

export const posthog = new PostHog(posthogApiKey, {
  host: posthogHost,
});

/*
 * Note: For React components, use the usePostHog hook for better lifecycle management.
 * For non-component logic (like mutations or services), you can import this shared instance.
 */

export const Analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    posthog.capture(event, properties);
  },
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
  },
  reset: () => {
    posthog.reset();
  },
};
