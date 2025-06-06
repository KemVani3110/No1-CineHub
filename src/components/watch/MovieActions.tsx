import { Button } from "@/components/ui/button";
import { Share2, BookmarkPlus } from "lucide-react";

interface MovieActionsProps {
  title: string;
  onShare: () => void;
}

export function MovieActions({ title, onShare }: MovieActionsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="outline"
        className="border-[#2e3c51] text-[#e0e6ed] hover:bg-[#1b263b] hover:border-[#4fd1c5] hover:text-[#4fd1c5]"
        onClick={onShare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        className="border-[#2e3c51] text-[#e0e6ed] hover:bg-[#1b263b] hover:border-[#4fd1c5] hover:text-[#4fd1c5]"
      >
        <BookmarkPlus className="w-4 h-4 mr-2" />
        Add to Watchlist
      </Button>
    </div>
  );
} 