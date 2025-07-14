"use client";

import { ShareIcon } from "lucide-react";

import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
}

const ShareButton = ({ title, text, url }: ShareButtonProps) => {
  const handleShare = async () => {
    try {
      const shareData = {
        title,
        text,
        url: new URL(url, window.location.origin).href,
      };

      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.info("Link copied to clipboard!");
      }
    } catch (err) {
      toast.error("Sharing failed. Please try again later.");
      console.error("Sharing failed", err);
    }
  };

  return (
    <Button onClick={handleShare} variant="ghost" size="icon">
      <ShareIcon className="h-4 w-4" />
    </Button>
  );
};

export default ShareButton;
