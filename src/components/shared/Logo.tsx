import IconO from "@assets/icon-o.svg";
import IconX from "@assets/icon-x.svg";
import Cheems from "@assets/ch2ems.svg";

function Logo({ width, height }: { width: number; height: number }) {
  return (
    <article className="flex gap-2 items-center">
      <img src={Cheems} alt="icon-x" className= "w-16" />
      <img src={IconX} alt="icon-o" className={`w-${width} h-${height}`} />
      <img src={IconO} alt="icon-x" className={`w-${width} h-${height}`} />
    </article>
  );
}

export default Logo;
