import Icons from "@/public/icons";

export const renderSocialIcon = (iconName: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons];

  if (!IconComponent || typeof IconComponent !== "function") {
    return null;
  }

  return IconComponent({ fill: "currentColor" });
};
