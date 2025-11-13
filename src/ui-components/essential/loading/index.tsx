// components/loading/GradientLoader.tsx
export default function GradientLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex gap-2">
        <div className="w-4 h-4 bg-ui-4 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-ui-4 rounded-full animate-bounce [animation-delay:0.1s]"></div>
        <div className="w-4 h-4 bg-ui-4 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      </div>
    </div>
  );
}
