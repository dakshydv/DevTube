"use client";

import { useState } from "react";
import { frameThumb, thumb } from "@/lib/meta";
import { useUserState } from "@/lib/store";

/**
 * Video thumbnail. By default shows a frame from inside the video (no clickbait); falls back to the uploaded
 * thumbnail if that frame is missing, or always shows the uploaded one if the viewer turned frames off.
 */
export default function ThumbImg({
  id,
  frame,
  className = "",
  lazy = true,
}: {
  id: string;
  frame?: number;
  className?: string;
  lazy?: boolean;
}) {
  const { originalThumbs } = useUserState();
  const [failed, setFailed] = useState(false);
  const src = originalThumbs || failed ? thumb(id) : frameThumb(id, frame);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading={lazy ? "lazy" : undefined}
      onError={() => !failed && setFailed(true)}
      className={className}
    />
  );
}
