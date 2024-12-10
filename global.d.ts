interface Window {
  umami: {
    track: (props: { app: string; event: string }) => void;
  };
}
