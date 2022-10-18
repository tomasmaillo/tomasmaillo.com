import React from "react";
import { ImGithub } from "react-icons/im";
import { GrInstagram } from "react-icons/gr";
import { BsTwitter } from "react-icons/bs";
import { SiTiktok } from "react-icons/si";

export type Link = {
  text: {
    default: string;
    small: string;
    icon?: React.ReactNode;
  };
  preview?: {
    isVideo?: boolean;
    url: string;
  };
  url: string;
};

export const links: Link[] = [
  {
    text: { default: "GitHub", small: "GH", icon: <ImGithub /> },
    preview: {
      url: "/linkPreviewMedia/github.png",
    },
    url: "https://github.com/Tomasroma64",
  },
  {
    text: { default: "Instagram", small: "Ig", icon: <GrInstagram /> },
    preview: {
      url: "/linkPreviewMedia/instagram.mp4",
      isVideo: true,
    },
    url: "https://instagram.com/tomasmaillo",
  },
  {
    text: { default: "Twitch", small: "Tw", icon: <BsTwitter /> },
    preview: {
      url: "/linkPreviewMedia/twitch.mp4",
      isVideo: true,
    },
    url: "https://twitch.tv/tomasmaillo",
  },
  {
    text: { default: "TikTok", small: "TT", icon: <SiTiktok /> },
    preview: {
      url: "/linkPreviewMedia/tiktok.mp4",
      isVideo: true,
    },
    url: "https://www.tiktok.com/@tomascodes",
  },
  {
    text: { default: "", small: "CV", icon: <span>{"CV"}</span> },
    preview: {
      url: "/linkPreviewMedia/CV.jpg",
    },
    url: "/TomasMailloCV.pdf",
  },
];
