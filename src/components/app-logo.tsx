export default function AppLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 bg-clip-text text-transparent bg-primary-gradient"
      >
        <path
          d="M9.50383 6.13175L9.50383 17.8682L6 17.8682L6 6.13175L9.50383 6.13175Z"
          fill="currentColor"
        />
        <path
          d="M10.7937 11.8335L17.2063 6.13175L19 7.4214L13.125 12L19 16.5786L17.2063 17.8682L10.7937 12.1665L10.7937 11.8335Z"
          fill="currentColor"
        />
      </svg>
      <h1 className="font-headline text-xl font-bold bg-clip-text text-transparent bg-primary-gradient">
        KeeRa Innovations
      </h1>
    </div>
  );
}
