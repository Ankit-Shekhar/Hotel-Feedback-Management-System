import Card from '../ui/Card'
import SkeletonBlock from './SkeletonBlock'

function HotelCardSkeleton() {
  return (
    <Card className="space-y-4 p-5">
      <SkeletonBlock className="h-6 w-3/5" />
      <SkeletonBlock className="h-4 w-2/5" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-11/12" />
      <SkeletonBlock className="h-5 w-32" />
    </Card>
  )
}

export default HotelCardSkeleton
