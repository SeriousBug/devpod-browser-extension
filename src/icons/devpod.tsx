import LogoImage from "@public/icon/devpod.svg";
import { DetailedHTMLProps, forwardRef } from "react";

export const DevPodLogoImage = forwardRef<
  HTMLImageElement,
  DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
>((props, ref) => {
  return <img ref={ref} src={LogoImage} {...props} />;
});
DevPodLogoImage.displayName = "DevPodLogoImage";

export const DevPodLogoIcon = forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => {
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      {...props}
      stroke="currentColor"
      fill="currentColor"
    >
      <polygon
        key="1"
        points="70.7,144.2 142.2,10 116.8,10 57.2,121.7 44.8,99.2 69.6,54.5 44.8,54.5 20,99.2 44.8,143.9 45.4,143.9 45.3,144.2"
      />
      <polygon
        key="2"
        points="154.2,55.1 153.6,55.1 153.7,54.8 128.3,54.8 56.8,189 82.2,189 141.8,77.3 154.2,99.8 129.4,144.5 154.2,144.5 179,99.8"
      />
    </svg>
  );
});
DevPodLogoIcon.displayName = "DevPodLogoIcon";
