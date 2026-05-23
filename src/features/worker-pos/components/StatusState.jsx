import { Loader2, WifiOff } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-brew-line bg-white">
      <div className="flex items-center gap-3 text-brew-muted">
        <Loader2 className="animate-spin" aria-hidden="true" />
        <span className="font-semibold">Loading menu categories</span>
      </div>
    </div>
  )
}

export function ErrorState({ message }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <WifiOff aria-hidden="true" size={20} />
        Could not load Supabase menu data
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}
