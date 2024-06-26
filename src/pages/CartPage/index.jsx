import React, { useEffect, useMemo, useState } from 'react'
import ComponentBreadCum from '../../components/Breadcrumb'
import { useDispatch, useSelector } from 'react-redux'
import { getStateItems, getStateStatus, updateItemInCart } from '../../redux/cartSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup, Checkbox } from 'flowbite-react'
import { fetchCart } from '../../redux/cartSlice'
import { useNavigate } from 'react-router-dom'
import manage from '../../service/manage'
import AddressItem from '../../components/AddressItem'
import CartItem from './CartItem'
import NotiCheck from '../../components/NotiCheck'
import { formatCurrencyVND } from '../../api/function'
import bannerGemhub1 from '../../assets/imgs/BannerGemHub1.png'
function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const Dataitems = useSelector(getStateItems)
  const cartStatus = useSelector(getStateStatus)
  const [cartItems, setCartItems] = useState([])
  const [laterItems, setLaterItems] = useState([])
  const [preOrder, setPreOrder] = useState([])
  const [addressDefault, setAddressDefault] = useState()
  const [total, setTotal] = useState(0)
  const [openModal, setOpenModal] = useState(false)


  const address = () => navigate('/address')

  const addItemToOrder = (item) => {
    setPreOrder([...preOrder, item])
  }
  const removeItemToOrder = (item) => {
    const list = preOrder.filter(p => p.id != item.id)
    setPreOrder(list)
  }
  const handleChange = (e, item) => {
    if (e.target.checked) {
      addItemToOrder(item)
    }
    else removeItemToOrder(item)
  }

  const fetchAddressDefault = async () => {
    try {
      const response = await manage.getAddressDefault()
      return response.data
    } catch (error) { /* empty */ }
  }

  

  const checkCart = async () => {
    try {
      const response = await manage.checkQuantity()
      if (!response.data && total != 0) {
        setOpenModal(true)
      }
      else {
        navigate('/checkout')
      }
      console.log(response.data)
    } catch (error) { /* empty */ }

  }

  useEffect(() => {
    dispatch(fetchCart())
  }, [])

  useEffect(() => {
    fetchAddressDefault().then(data => setAddressDefault(data))
  }, [])

  useEffect(() => {
    setCartItems(Dataitems.filter(item => item.status == true))
    setLaterItems(Dataitems.filter(item => item.status == false))
    let t = Dataitems.filter(item => item.status == true).reduce((total, item) => {
      return total + (item.quantity * item.product.productPrice)
    }, 0)
    setTotal(t)

  }, [Dataitems])

  const cartView = cartItems && cartItems.map((item, index) => <CartItem item={item} />)
  const laterView = laterItems && laterItems.map((item, index) => <CartItem item={item} />)


  return (
    <div className='mb-8'>
      {/* <div className='relative w-full max-h-[500px] pt-4 mb-4 overflow-hidden'>
        <img src={bannerGemhub1} alt="" />
      </div> */}
      <div className='max-w-[1280px] mx-auto'>
        <ComponentBreadCum />
        <div>
          <div className='title font-SFUFuturaBold text-start'>
            <a className='text-[15px] pr-2' href="">Thông tin tài khoản</a>
            <p className='text-sm my-4'>Xin chào, user</p>
          </div>
          <div className='flex lg:flex-row md:flex-col flex-col-reverse gap-4'>
            <div className={`${cartItems.length > 0 ? 'lg:w-9/12' : ' w-full'} w-full  mr-4`}>
              <h1 className=' text-start text-xl font-SFUFuturaBold py-4'>Shopping Cart</h1>
              <div className=' w-full py-4'>
                {cartStatus === 'succeeded' && cartItems.length > 0 ? (
                  cartView
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Không có mặt hàng nào.</td>
                  </tr>
                )}
              </div>
              <h1 className=' text-start text-xl font-SFUFuturaBold py-4'>Later</h1>
              <div className=' w-full py-4'>
                {cartStatus === 'succeeded' && laterItems.length > 0 ? (
                  laterView
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Không có mặt hàng nào.</td>
                  </tr>
                )}
              </div>
            </div>
            {cartItems.length > 0 &&
              <div className=' w-full flex lg:flex-col flex-col-reverse lg:w-3/12 ml-4 animate-transheader'>
                <div className=' w-full p-4 flex flex-col gap-y-2 items-start'>
                  <h3 className=' font-semibold text-lg text-brown uppercase '>Tổng số tiền</h3>
                  <p className=' text-2xl font-semibold'>{formatCurrencyVND(total)}</p>
                  <button className=' w-full px-2 py-4 bg-red-400 text-white  cursor-pointer hover:opacity-85 hover:-translate-y-2 hover:-translate-x-2 hover:drop-shadow-2xl transition-all ease-in-out text-nowrap' onClick={checkCart}>
                    Tiến hành thanh toán
                  </button>
                </div>
                <div className=' w-full p-4 border-t-[1px]  flex flex-col gap-y-4 items-start font-SFUFuturaBook '>
                  <h5 className=' font-bold text-lg uppercase tracking-wide'>Tài Khoản của tôi</h5>
                  <p className=' text-sm'>Họ Tên: {addressDefault && addressDefault.name}  </p>
                  <p className=' text-sm'>Địa chỉ: {addressDefault && addressDefault.address}</p>
                  <p className=' text-sm'>Điện thoại: {addressDefault && addressDefault.phone}</p>
                  <p className=' text-sm'>Thành phố: </p>
                  <p className=' text-sm'>Quốc gia:</p>
                  <button className=' w-full p-4 bg-brown text-white  cursor-pointer hover:opacity-85 hover:-translate-y-2 hover:-translate-x-2 hover:drop-shadow-2xl transition-all ease-in-out' onClick={address}>
                    Sổ địa chỉ
                  </button>
                </div>
              </div>
            }
          </div>

          {/* <h1 className=' text-start text-xl font-SFUFuturaBold py-4'>Later</h1>
          <div className='flex lg:flex-row md:flex-col flex-col-reverse gap-4'>
            <div className='w-full lg:w-9/12 mr-4'>
              <div className=' w-full py-4'>
                {cartStatus === 'succeeded' && Dataitems ? (
                  laterView
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Không có mặt hàng nào.</td>
                  </tr>
                )}
              </div>
            </div>
            <div className='w-full flex lg:flex-col flex-col-reverse lg:w-3/12 ml-4'>
              <div className=' w-full p-4 flex flex-col gap-y-2 items-start'>
                <h3 className=' font-semibold text-lg text-brown uppercase '>Total</h3>
                <p className=' text-2xl font-bold'>đ{total}</p>
                <button className=' w-full p-2 bg-red-400 text-white rounded-lg cursor-pointer hover:opacity-85 hover:-translate-y-2 hover:-translate-x-2 hover:drop-shadow-2xl transition-all ease-in-out text-nowrap' onClick={submitOrder}>
                      Thanh Toán
                </button>
              </div>
              <div className=' w-full p-4 border-t-[1px]  flex flex-col gap-y-4 items-start font-SFUFuturaBook '>
                <h5 className=' font-bold text-lg uppercase tracking-wide'>Tài Khoản của tôi</h5>
                <p className=' text-sm'>Họ Tên: {addressDefault && addressDefault.name}  </p>
                <p className=' text-sm'>Địa chỉ: { addressDefault && addressDefault.address}</p>
                <p className=' text-sm'>Điện thoại: { addressDefault && addressDefault.phone}</p>
                <p className=' text-sm'>Thành phố: </p>
                <p className=' text-sm'>Quốc gia:</p>
                <button className=' w-full p-4 bg-brown text-white rounded-lg cursor-pointer hover:opacity-85 hover:-translate-y-2 hover:-translate-x-2 hover:drop-shadow-2xl transition-all ease-in-out' onClick={address}>
                      Sổ địa chỉ
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <NotiCheck openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  )
}

export default CartPage
