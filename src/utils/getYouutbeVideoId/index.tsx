export function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// utils/formatDuration.ts
export function formatYoutubeDuration(duration: string): string {
  if (!duration) return "";

  // PT16M8S formatından regex ilə saat, dəqiqə və saniyəni çıxarırıq
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "";

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  // Əgər saat varsa: "1:02:03"
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Əgər sadəcə dəqiqə və saniyə varsa: "16:08"
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
