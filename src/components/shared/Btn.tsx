function Btn({
  classCSS,
  children,
  onClick,
}: {
  classCSS: string;
  children: any;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`uppercase text-black-400  cursor-pointer ${classCSS}`}
    >
      {children}
    </button>
  );
}

export default Btn;
