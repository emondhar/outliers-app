import { MoreHorizontal } from "lucide-react";
import clsx from "clsx";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  outlierScore: number;
  vph: number;
  channelName: string;
  channelSubs: number;
  views: number;
  publishedAt: string;
  publishedTimestamp?: number;
  type: "video" | "short";
  length: number; // minutes
}

export default function VideoCard({ video }: { video: Video }) {
  return (
    <article
      tabIndex={0}
      className="rounded-md border border-neutral-700 bg-neutral-800 flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div
        className="w-full aspect-video bg-cover bg-center"
        style={{ backgroundImage: `url(${video.thumbnail})` }}
      />

      <div className="flex flex-col gap-2 px-4 py-2 flex-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap">
            <span
              className={clsx(
                "rounded-full text-xs font-bold px-2 py-0.5",
                video.outlierScore >= 100
                  ? "bg-[#B6253F] text-white"
                  : "bg-neutral-700 text-neutral-50"
              )}
            >
              {video.outlierScore >= 100 ? ">100x" : `${video.outlierScore}x`}
            </span>
            <span className="bg-neutral-700 rounded-full px-2 py-0.5 text-xs font-bold">
              {video.vph} VPH
            </span>
          </div>
          <button className="p-1 rounded-full bg-neutral-700">
            <MoreHorizontal className="w-4 h-4 text-neutral-300" />
          </button>
        </div>

        <h3 className="font-bold text-lg leading-snug line-clamp-2">
          {video.title}
        </h3>

        <p className="text-xs font-semibold text-neutral-400">
          <span className="inline-block max-w-[155px] overflow-hidden text-ellipsis whitespace-nowrap">
            {video.channelName}
          </span>
          <span>&nbsp;•&nbsp;</span>
          <span>
            {Intl.NumberFormat().format(video.channelSubs)} subscribers
          </span>
        </p>

        <p className="text-xs font-semibold text-neutral-400">
          <span>{Intl.NumberFormat().format(video.views)} views</span>
          <span>&nbsp;•&nbsp;</span>
          <span>{video.publishedAt}</span>
        </p>
      </div>
    </article>
  );
}
