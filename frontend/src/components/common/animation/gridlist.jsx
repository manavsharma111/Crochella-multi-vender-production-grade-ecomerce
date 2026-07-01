import { useState } from "react"
import { gsap } from "gsap"
import { Flip } from "gsap/Flip"

gsap.registerPlugin(Flip)

const GridList = () => {
  const [isGrid, setIsGrid] = useState(false)

  const changeLayout = () => {
    const state = Flip.getState(".product-card")

    setIsGrid((prev) => !prev)

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.7,
        absolute: true,
        stagger: 0.08,
        ease: "power2.inOut",
      })
    })
  }

  const products = [1, 2, 3, 4, 5, 6]

  return (
    <div className="p-5">
      <button
        onClick={changeLayout}
        className="mb-5 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Layout
      </button>

      <div
        className={`gap-4 ${
          isGrid ? "grid grid-cols-2 md:grid-cols-3" : "flex flex-col"
        }`}
      >
        {products.map((item) => (
          <div
            key={item}
            className="product-card bg-white shadow rounded-lg p-4"
          >
            Product {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridList
