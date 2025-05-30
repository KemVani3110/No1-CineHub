import { useAuth } from "@/hooks/useAuth";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { FacebookAuthButton } from "@/components/auth/FacebookAuthButton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SocialLogin() {
  const router = useRouter();
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Đăng nhập Google thành công!");
      router.push("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      toast.success("Đăng nhập Facebook thành công!");
      router.push("/");
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Đăng nhập Facebook thất bại!");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <GoogleAuthButton onClick={handleGoogleLogin} />
      <FacebookAuthButton onClick={handleFacebookLogin} />
    </div>
  );
} 