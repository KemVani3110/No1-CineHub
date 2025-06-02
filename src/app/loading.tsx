import Loading from '@/components/common/Loading';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1B2A] to-[#1B263B]">
      <Loading message="Loading..." />
    </div>
  );
} 