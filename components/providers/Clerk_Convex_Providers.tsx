import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}
const convex = new ConvexReactClient(
	process.env.EXPO_PUBLIC_CONVEX_URL as string,
);
export default function ClerkConvexProviders({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<ClerkLoaded>{children}</ClerkLoaded>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}
