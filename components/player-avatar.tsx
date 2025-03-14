interface PlayerAvatarProps {
  avatar?: string
  name: string
}

export default function PlayerAvatar({ avatar, name }: PlayerAvatarProps) {
  return (
    <div className="relative w-8 h-8">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M12.8333 0.673576C13.5553 0.256766 14.4447 0.256765 15.1667 0.673575L24.9577 6.32642C25.6796 6.74323 26.1244 7.51353 26.1244 8.34715V19.6528C26.1244 20.4865 25.6796 21.2568 24.9577 21.6736L15.1667 27.3264C14.4447 27.7432 13.5553 27.7432 12.8333 27.3264L3.04231 21.6736C2.32038 21.2568 1.87564 20.4865 1.87564 19.6528V8.34715C1.87564 7.51353 2.32038 6.74323 3.04231 6.32642L12.8333 0.673576Z"
          fill="url(#paint0_linear_player)"
        />
        <path
          d="M13.1249 3.5121C13.6664 3.19949 14.3335 3.19949 14.8749 3.5121L22.6452 7.99828C23.1867 8.31089 23.5202 8.88861 23.5202 9.51383V18.4862C23.5202 19.1114 23.1867 19.6891 22.6452 20.0017L14.8749 24.4879C14.3335 24.8005 13.6664 24.8005 13.1249 24.4879L5.35462 20.0017C4.81317 19.6891 4.47962 19.1114 4.47962 18.4862V9.51383C4.47962 8.88861 4.81317 8.31089 5.35462 7.99828L13.1249 3.5121Z"
          stroke="url(#paint1_linear_player)"
          strokeWidth="1.16667"
        />
        <defs>
          <linearGradient id="paint0_linear_player" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9333EA" />
            <stop offset="1" stopColor="#7E22CE" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_player"
            x1="13.9999"
            y1="2.33334"
            x2="13.9999"
            y2="25.6667"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FEE3A2" />
            <stop offset="1" stopColor="#F2A768" />
          </linearGradient>
        </defs>
      </svg>
      {avatar ? (
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="absolute inset-0 w-5 h-5 m-auto rounded-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {name.charAt(0)}
        </span>
      )}
    </div>
  )
}

