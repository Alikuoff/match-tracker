interface TeamLogoProps {
  name: string
}

export default function TeamLogo({ name }: TeamLogoProps) {
  return (
    <div className="w-8 h-8">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.8333 0.673576C13.5553 0.256766 14.4447 0.256765 15.1667 0.673575L24.9577 6.32642C25.6796 6.74323 26.1244 7.51353 26.1244 8.34715V19.6528C26.1244 20.4865 25.6796 21.2568 24.9577 21.6736L15.1667 27.3264C14.4447 27.7432 13.5553 27.7432 12.8333 27.3264L3.04231 21.6736C2.32038 21.2568 1.87564 20.4865 1.87564 19.6528V8.34715C1.87564 7.51353 2.32038 6.74323 3.04231 6.32642L12.8333 0.673576Z"
          fill="url(#paint0_linear_113_335)"
        />
        <path
          d="M13.1249 3.5121C13.6664 3.19949 14.3335 3.19949 14.8749 3.5121L22.6452 7.99828C23.1867 8.31089 23.5202 8.88861 23.5202 9.51383V18.4862C23.5202 19.1114 23.1867 19.6891 22.6452 20.0017L14.8749 24.4879C14.3335 24.8005 13.6664 24.8005 13.1249 24.4879L5.35462 20.0017C4.81317 19.6891 4.47962 19.1114 4.47962 18.4862V9.51383C4.47962 8.88861 4.81317 8.31089 5.35462 7.99828L13.1249 3.5121Z"
          stroke="url(#paint1_linear_113_335)"
          strokeWidth="1.16667"
        />
        <rect x="8.1665" y="17.5" width="11.6667" height="1.16667" rx="0.233333" fill="url(#paint2_linear_113_335)" />
        <path
          d="M19.5998 16.3333H8.39984C8.27097 16.3333 8.1665 16.2289 8.1665 16.1V9.65219C8.1665 9.44226 8.42208 9.33911 8.5678 9.49022L11.4402 12.469C11.5512 12.5841 11.7425 12.556 11.8156 12.4137L13.7923 8.57013C13.8792 8.4013 14.1205 8.4013 14.2073 8.57013L16.184 12.4137C16.2572 12.5559 16.4485 12.5841 16.5595 12.469L19.4319 9.49022C19.5776 9.33911 19.8332 9.44226 19.8332 9.65219V16.1C19.8332 16.2289 19.7287 16.3333 19.5998 16.3333Z"
          fill="url(#paint3_linear_113_335)"
        />
        <defs>
          <linearGradient id="paint0_linear_113_335" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CF1C51" />
            <stop offset="1" stopColor="#AF1947" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_113_335"
            x1="13.9999"
            y1="2.33334"
            x2="13.9999"
            y2="25.6667"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FEE3A2" />
            <stop offset="1" stopColor="#F2A768" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_113_335"
            x1="13.9998"
            y1="17.5"
            x2="13.9998"
            y2="18.6667"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FEE3A2" />
            <stop offset="1" stopColor="#F2A768" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_113_335"
            x1="13.9998"
            y1="8.16666"
            x2="13.9998"
            y2="16.3333"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FEE3A2" />
            <stop offset="1" stopColor="#F2A768" />
          </linearGradient>
        </defs>
      </svg>
      <span className="sr-only">{name}</span>
    </div>
  )
}

