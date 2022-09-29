export type Link = {
  text: {
    default: string;
    small: string;
  };
  preview?:{
    isVideo?: boolean;
    url: string;
  }
  url: string;
};

export const links: Link[] = [
  {
    text: { default: "GitHub", small: "GH" },
    preview: {
      url: "/linkPreviewMedia/github.png",
    },
    url: "https://github.com/Tomasroma64",
  },
  {
    text: { default: "Instagram", small: "Ig" },
    preview: {
      url: "/linkPreviewMedia/instagram.mp4",
      isVideo: true,
    },
    url: "https://instagram.com/tomasmaillo",
  },
  {
    text: { default: "Twitch", small: "Tw" },
    preview: {
      url: "/linkPreviewMedia/twitch.mp4",
      isVideo: true,
    },
    url: "https://twitch.tv/tomasmaillo",
  },
  {
    text: { default: "TikTok", small: "TT" },
    preview: {
      url: "/linkPreviewMedia/tiktok.mp4",
      isVideo: true,
    },
    url: "https://www.tiktok.com/@tomascodes",
  },
];
