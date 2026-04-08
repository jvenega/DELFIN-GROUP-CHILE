import useMotionPreference from "@core/hooks/useMotionPreference";

export default function MotionProvider({ children }) {

  const reduceMotion = useMotionPreference();

  return (
    <div data-reduce-motion={reduceMotion}>
      {children}
    </div>
  );
}