import { useState, useMemo } from "react";
import { PlayCircle, Clapperboard, Filter, Search } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";
import sampleVideos from "../data/sampleVideos";
import VideoCard, { Video } from "./VideoCard";

type Range = [number, number];
function useRange(initial: Range) {
  const [range, setRange] = useState<Range>(initial);
  const reset = () => setRange(initial);
  return { range, setRange, reset };
}

export default function Outliers() {
  // raw JSON paste + parsed videos
  const [rawJson, setRawJson] = useState("");
  const [parsed, setParsed] = useState<Video[]>([]);
  const [publishFilter, setPublishFilter] = useState<
    "all" | "week" | "month" | "3months" | "6months" | "year"
  >("all");

  const loadFromPaste = () => {
    try {
      const obj = JSON.parse(rawJson);
      const vids: Video[] = obj.data.map((v: any) => ({
        id: v.video_id,
        title: v.video_title,
        thumbnail: v.video_thumbnail,
        outlierScore: v.breakout_score,
        vph: v.vph,
        channelName: v.channel_title,
        channelSubs: v.subscriber_count,
        views: v.view_count,
        publishedAt: new Date(v.video_published_at * 1000).toLocaleDateString(),
        publishedTimestamp: v.video_published_at * 1000,
        type: v.video_type === "long" ? "video" : "short",
        length: Math.ceil(v.video_duration / 60),
      }));
      setParsed(vids);
    } catch {
      alert("Invalid JSON – please check your paste.");
    }
  };

  // choose data source
  const allVideos = parsed.length ? parsed : sampleVideos;

  // filters
  const [contentType, setContentType] = useState<"videos" | "shorts">("videos");
  const [searchTerm, setSearchTerm] = useState("");
  const outlier = useRange([0, 100]);
  const views = useRange([0, 10_000_000]);
  const subs = useRange([0, 10_000_000]);
  const vph = useRange([0, 1000]);
  const length = useRange([0, 60]);

  const filtered = useMemo(() => {
    const now = Date.now();
    return allVideos
      .filter((v: { type: string }) =>
        contentType === "videos" ? v.type === "video" : v.type === "short"
      )
      .filter((v: { title: string }) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (v: { outlierScore: number }) =>
          v.outlierScore >= outlier.range[0] &&
          v.outlierScore <= outlier.range[1]
      )
      .filter(
        (v: { views: number }) =>
          v.views >= views.range[0] && v.views <= views.range[1]
      )
      .filter(
        (v: { channelSubs: number }) =>
          v.channelSubs >= subs.range[0] && v.channelSubs <= subs.range[1]
      )
      .filter(
        (v: { vph: number }) => v.vph >= vph.range[0] && v.vph <= vph.range[1]
      )
      .filter(
        (v: string | any[]) =>
          v.length >= length.range[0] && v.length <= length.range[1]
      )
      .filter((v: any) => {
        if (publishFilter === "all") return true;
        const ts = v.publishedTimestamp;
        if (!ts) return true;
        const delta = now - ts;
        switch (publishFilter) {
          case "week":
            return delta <= 7 * 24 * 60 * 60 * 1000;
          case "month":
            return delta <= 30 * 24 * 60 * 60 * 1000;
          case "3months":
            return delta <= 90 * 24 * 60 * 60 * 1000;
          case "6months":
            return delta <= 180 * 24 * 60 * 60 * 1000;
          case "year":
            return delta <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
  }, [
    allVideos,
    contentType,
    searchTerm,
    outlier.range,
    views.range,
    subs.range,
    vph.range,
    length.range,
    publishFilter,
  ]);

  const resetAll = () => {
    outlier.reset();
    views.reset();
    subs.reset();
    vph.reset();
    length.reset();
    setSearchTerm("");
  };

  return (
    <section className="flex flex-col items-center max-w-[1044px] mx-auto gap-8">
      {/* Paste JSON */}
      <div className="w-full mb-6">
        <textarea
          className="w-full h-32 p-2 bg-neutral-800 text-sm text-white rounded"
          placeholder="Paste your outliers JSON here…"
          value={rawJson}
          onChange={(e: { target: { value: any } }) =>
            setRawJson(e.target.value)
          }
        />
        <button
          className="mt-2 px-4 py-2 bg-rose-600 rounded font-bold"
          onClick={loadFromPaste}
        >
          Load Data
        </button>
      </div>

      {/* Header & toggles */}
      <header className="flex flex-wrap gap-4 w-full justify-center items-center">
        <div className="flex flex-col gap-1 flex-1">
          <h1 className="text-3xl font-bold">Outliers</h1>
          <p className="text-base text-neutral-400">
            Discover winning ideas to inspire your next video
          </p>
        </div>
        <div
          role="group"
          className="flex justify-center items-center rounded-full p-1 bg-neutral-800"
        >
          <button
            onClick={() => setContentType("videos")}
            className={clsx(
              "flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm transition",
              contentType === "videos"
                ? "bg-neutral-700 text-white"
                : "text-neutral-300 hover:bg-neutral-700/30"
            )}
          >
            <PlayCircle className="w-4 h-4" /> Videos
          </button>
          <button
            onClick={() => setContentType("shorts")}
            className={clsx(
              "flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm transition",
              contentType === "shorts"
                ? "bg-neutral-700 text-white"
                : "text-neutral-300 hover:bg-neutral-700/30"
            )}
          >
            <Clapperboard className="w-4 h-4" /> Shorts
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="w-full relative">
        <div className="flex items-center rounded-full bg-neutral-800 pl-4 pr-12 py-1.5 gap-2">
          <button
            aria-label="Toggle filters"
            className="flex items-center gap-1 bg-neutral-700 px-2 py-1 rounded-full text-sm"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-500"
            placeholder="Search videos"
            value={searchTerm}
            onChange={(e: { target: { value: any } }) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
        <button
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-600 rounded-full p-1 disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Publish Date Filter */}
      <div className="w-full flex items-center gap-4">
        <label className="text-sm font-bold text-neutral-400">Published:</label>
        <select
          className="bg-neutral-700 text-sm text-white rounded p-2"
          value={publishFilter}
          onChange={(e) =>
            setPublishFilter(e.target.value as typeof publishFilter)
          }
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Sliders */}
      <div className="flex flex-wrap gap-4 w-full justify-center">
        {[
          [
            "Outlier Score",
            "Range (0-100x)",
            outlier,
            100,
            (v: number) => (v === 100 ? "100+" : v),
          ],
          [
            "Views",
            "Range (0-10M+)",
            views,
            10_000_000,
            (v: number) =>
              v === 10_000_000 ? "10M+" : (v / 1000).toFixed(0) + "K",
          ],
          [
            "Subscribers",
            "Range (0-10M+)",
            subs,
            10_000_000,
            (v: number) =>
              v === 10_000_000 ? "10M+" : (v / 1000).toFixed(0) + "K",
          ],
          [
            "Views Per Hour",
            "Range (0-1000+)",
            vph,
            1000,
            (v: number) => (v === 1000 ? "1K+" : v),
          ],
          [
            "Video Length",
            "Range (0-60+ mins)",
            length,
            60,
            (v: number) => (v === 60 ? "60+" : v),
          ],
        ].map(([title, subtitle, hook, max, fmt]) => {
          const { range, setRange } = hook as ReturnType<typeof useRange>;
          return (
            <div
              key={title}
              className="flex-1 min-w-[260px] bg-neutral-800 rounded-md p-6 flex flex-col gap-6"
            >
              <header className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-xs font-bold text-neutral-400">
                    {subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setRange([0, max as number])}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Reset
                </button>
              </header>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                min={0}
                max={max as number}
                step={1}
                value={range}
                onValueChange={(vals: any[]) => setRange([vals[0], vals[1]])}
              >
                <Slider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
                  <Slider.Range className="absolute bg-rose-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  aria-label="Minimum"
                  className="block w-3 h-3 bg-white rounded-full outline-none hover:shadow-md focus:shadow-md"
                />
                <Slider.Thumb
                  aria-label="Maximum"
                  className="block w-3 h-3 bg-white rounded-full outline-none hover:shadow-md focus:shadow-md"
                />
              </Slider.Root>
              <div className="flex justify-between mt-2 text-xs font-bold">
                <span>{(fmt as any)(range[0])}</span>
                <span>{(fmt as any)(range[1])}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="flex gap-2 self-end">
        <button
          disabled={false}
          onClick={resetAll}
          className="rounded-full bg-neutral-700 px-4 py-2 text-base font-bold disabled:opacity-50"
        >
          Reset All
        </button>
      </div>

      {/* Cards */}
      <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v: Video) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}
