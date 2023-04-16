import Head from 'next/head'
import { createContext, useContext, useState, useCallback , useEffect } from 'react';
import produce from "immer";

const initialProducts = [
  {
    name: 'Plant 1',
    src: '/assets/1.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 2',
    src: '/assets/2.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 3',
    src: '/assets/3.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 4',
    src: '/assets/4.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 5',
    src: '/assets/5.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 6',
    src: '/assets/6.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 7',
    src: '/assets/7.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 8',
    src: '/assets/8.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 9',
    src: '/assets/9.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 10',
    src: '/assets/10.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 11',
    src: '/assets/11.png',
    price: 1,
    count: 5,
  },
  {
    name: 'Plant 12',
    src: '/assets/12.png',
    price: 1,
    count: 5,
  },
]

const ShoppingCartContext = createContext({
  products: initialProducts,
  cartProducts: [],
  setCartProducts: () => {}
});

function ShoppingCartProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [cartProducts, setCart] = useState([]);

  const addProduct = useCallback((product) => {
    setProducts(
      produce((draft) => {
        const newProduct = draft.find((p) => p.name === product.name);
        newProduct.count --
        return draft
      })
    );

    setCart(
      produce((draft) => {
        draft.push(product)
        return draft
      })
    );
  }, []);

  return (
    <ShoppingCartContext.Provider value={{products, cartProducts, addProduct}}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
}

const CartProduct = ({product}) => {
  const [position, setPos] = useState(product.target)
  const [count, setCount] = useState(1)
  const { cartProducts } = useShoppingCart()

  useEffect(() => {
    let unique = [...new Set(cartProducts.map((i)=>(i.name)))];
    const addedProductIndex = unique.findIndex((name) => (name === product.name))

    if (addedProductIndex >= 0) {
      setPos({
        transform: 'scale(0.2)',
        width: '20rem',
        height: '25rem',
        bottom: 0,
        left: `${addedProductIndex * 4}rem`
      })
      setTimeout(()=>{
        const newCount =  cartProducts.filter((i) => (i.name === product.name)).length
        setCount(newCount)
      }, 1000)
    } else {
      setPos({
        transform: 'scale(0.2)',
        bottom: 0,
        left: 0,
        height: '25rem'
      })
    }
  }, [])

  return (
    <>
      <div
        className='preview'
        style={{
          position: 'fixed',
          transition: 'all 1000ms',
          transformOrigin: 'left bottom',
          ...position,
        }}
      >
        <img
          src={product.src}
          alt={product.name}
        />
        {count > 1 &&
          <span className='count'>{count}</span>
        }
      </div>
      <style jsx>{`
        .preview {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview img {
          display: block;
        }
        .count {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          font-size: 5rem;
          background-color: #fff;
          border-radius: 3rem;
          height: 6rem;
          min-width: 6rem;
          text-align: center;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        }
      `}</style>
    </>
  )
}

const ProductsGrid = ({children}) => (
  <>
    <div className='grid'>
      {children}
    </div>
    <style jsx>{`
      .grid {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem;
      }
    `}</style>
  </>
)

const ProductCard = ({ product }) => {
  const { addProduct } = useShoppingCart()
  return (
    <>
      <div
        className='product-card'
        onClick={(e) => {
          const {
            left,
            top,
            height,
            width,
            ...rest
          } = e.target.getBoundingClientRect()
          const bottom = window.innerHeight - height - top
          product.count > 0 && addProduct({ ...product, target: { left, bottom, height, width }})
        }}
      >
        <div className='product-card__image'>
          <img src={product.src} />
        </div>
        <div className='product-card__footer'>
          <span className='product-card__name'>{product.name}</span>
          <span className='product-card__price'>${product.price}</span>
        </div>
      </div>
      <style jsx>{`
        .product-card {
          border-radius: 1rem;
          background-color: #eee;
          width: 32%;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
        }
        @media only screen and (max-width: 700px) {.product-card {width: 100%;}}
        @media only screen and (min-width: 701px) and (max-width: 1119px) {.product-card {width: 48%;}}
        @media only screen and (min-width: 1200px) {.product-card {width: 32%;}}
        .product-card:hover {
          cursor: ${product.count > 0 ? 'pointer' : 'default'};
        }
        .product-card__image {
          flex-grow: 1;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transition: all 1000ms linear;
          mix-blend-mode: ${product.count > 0 ? 'none' : 'luminosity'};
          overflow: hidden;
        }
        .product-card__image img:hover {
          mix-blend-mode: ${product.count > 0 ? 'difference' : 'luminosity'};
        }
        .product-card__footer {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          justify-content: space-between;
          padding: 1rem;
        }
        .product-card__name {
          font-family: sans-serif;
          font-size: 2rem;
        }
        .product-card__price {
          font-family: monospace;
          font-size: 2rem;
        }
      `}</style>
    </>
  )
}

const ShoppingCart = () => {
  const { cartProducts } = useShoppingCart()
  return (
    <>
      <div className='shopping-cart'>
        {cartProducts.map((product, idx) => (
          <CartProduct key={idx} product={product} />
        ))}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-shopping-cart"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className='shopping-cart__count'>{cartProducts.length}</span>
        </button>
      </div>
      <style jsx>{`
        .shopping-cart {
          position: fixed;
          bottom: ${cartProducts.length === 0 ? '-5rem' : "0"};
          left: 0;
          right: 0;
          height: 5rem;
          background-color: rgba(255,255,255,0.7);
          padding-right: 7rem;
          transition: all 300ms linear;
        }
        .shopping-cart button {
          color: #000;
          display: block;
          border: none;
          background-color: #fff;
          width: 5rem;
          height: 3rem;
          border-radius: 3rem;
          position: absolute;
          right: 1rem;
          top: 1rem;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }
        .shopping-cart__count {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #000;
          color: #fff;
          min-width: 1rem;
          height: 1rem;
          border-radius: 1rem;
          display: block;
          vertical-align: bottom;
          padding: 0.05rem 0.25rem 0;
          box-shadow: rgba(0,0,0,.3)0px 4px 12px;
        }
      `}</style>
    </>
  )
}

function App() {
  const { products } = useShoppingCart()
  return (
    <>
      <ProductsGrid>
        {products.map((product, idx) => {
          return (
            <ProductCard key={idx} product={product} />
          )
        })}
      </ProductsGrid>
      <ShoppingCart />
      <style jsx global>{`
        html, body, body * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Shopping Cart Animation</title>
      </Head>
      <ShoppingCartProvider>
        <App />
      </ShoppingCartProvider>
    </>
  )
}
