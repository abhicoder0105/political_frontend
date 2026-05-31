import { CardSkeleton } from '../../components/Skeleton'

export default function Settings() {
  return (
    <div className="p-5">
      <h1 className="mb-5 text-xl font-black text-slate-900">सेटिंग्स</h1>
      <CardSkeleton count={2} />
      <p className="mt-4 text-slate-600">सेटिंग्स मॉड्यूल तैयार किया जा रहा है।</p>
    </div>
  )
}
