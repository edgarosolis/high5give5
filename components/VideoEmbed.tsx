export default function VideoEmbed({
  videoId,
  title = "Video",
}: {
  videoId: string;
  title?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
