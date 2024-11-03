import Ring from "@assets/ring-resize.svg";

export default function RingSpin() {
  return (
    <div className="flex flex-row gap-2">
      <img src={Ring} alt="loading" className="w-10 h-10" />
    </div>
  );
}
