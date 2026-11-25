import { channelAvatar } from "@/lib/meta";

export default function ChannelAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const { bg, initials } = channelAvatar(name || "?");
  return (
    <span
      aria-hidden
      className="flex shrink-0 select-none items-center justify-center rounded-full font-medium text-white"
      style={{ background: bg, width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
