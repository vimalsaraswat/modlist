"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@acme/ui/button";

interface BackButtonProps {
  fallbackUrl?: string;
}

export default function BackButton({ fallbackUrl = "/" }: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined" && document.referrer) {
      try {
        const referrerOrigin = new URL(document.referrer).origin;
        const currentOrigin = window.location.origin;

        const isInternal = referrerOrigin === currentOrigin;
        setCanGoBack(isInternal);
      } catch {
        setCanGoBack(false);
      }
    } else {
      setCanGoBack(false);
    }
  }, []);

  const handleClick = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleClick}
      className="p-2 hover:bg-secondary hover:text-secondary-foreground"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
