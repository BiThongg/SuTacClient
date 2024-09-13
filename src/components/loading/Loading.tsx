import Spin from "@assets/spin.svg"

export default function Loading() {

  return (
    <div className="flex flex-row gap-2">
      <h3 className="text-2xl">Loading</h3>
      <img src={Spin} alt="loading" className="w-10 h-10" />
    </div>
  )
}
