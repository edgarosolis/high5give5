import Image from "next/image";

const LOGO_URLS = {
  white:
    "https://high5give5-uploads.s3.us-east-1.amazonaws.com/legacy/webflow/62b354145f3ab2a2d94bf429__62b354145f3ab2a2d94bf429_High5_Logo_white_1.svg",
  green:
    "https://high5give5-uploads.s3.us-east-1.amazonaws.com/legacy/webflow/63bef5dc6604723f800f5675__63bef5dc6604723f800f5675_High5_Logo_green_2.png",
  blue: "https://high5give5-uploads.s3.us-east-1.amazonaws.com/legacy/webflow/62e01a5c12b74497cf077575__62e01a5c12b74497cf077575_High5_Logo_blue.png",
} as const;

type Variant = keyof typeof LOGO_URLS;

interface LogoProps {
  variant?: Variant;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = "green",
  className = "h-10 w-auto",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src={LOGO_URLS[variant]}
      alt="High5Give5"
      width={200}
      height={80}
      priority={priority}
      className={className}
    />
  );
}
