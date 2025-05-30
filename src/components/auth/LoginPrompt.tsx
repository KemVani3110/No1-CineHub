import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface LoginPromptProps {
  title?: string;
  description?: string;
}

export function LoginPrompt({
  title = "Sign in required",
  description = "Please sign in to access this feature",
}: LoginPromptProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You need to be signed in to access this feature. Please sign in or create an account to continue.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button asChild className="w-full">
          <Link href="/login">Sign in</Link>
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline"
          >
            Create one
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 