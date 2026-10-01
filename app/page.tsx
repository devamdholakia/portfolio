import { AwardsWall } from '@/components/AwardsWall'
import { Barista } from '@/components/Barista'
import { Hero } from '@/components/Hero'
import { IngredientShelf } from '@/components/IngredientShelf'
import { Journal } from '@/components/Journal'
import { Kitchen } from '@/components/kitchen/Kitchen'
import { MenuBoard } from '@/components/MenuBoard'
import { OrderTicket } from '@/components/OrderTicket'
import { RecruiterMode } from '@/components/RecruiterMode'
import { Specials } from '@/components/Specials'

// both views are in the HTML, CSS shows one based on <html data-mode>
export default function Home() {
  return (
    <>
      <div className="cafe-only">
        <Hero />
        <MenuBoard />
        <Kitchen />
        <Specials />
        <Journal />
        <IngredientShelf />
        <AwardsWall />
        <Barista />
        <OrderTicket />
      </div>
      <RecruiterMode />
    </>
  )
}
