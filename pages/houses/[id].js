import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import axios from 'axios'
import { useState } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import Head from 'next/head'
import Layout from '../../components/Layout/Layout.component'
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker.component'
import theme from '../../styles/theme'
import mixins from '../../styles/mixins'

const StyledHousesContainer = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-grap: 30px;
`

const StyledHousesAside = styled.aside`
  border: ${theme.border};
  padding: 20px;
  border-top-right-radius: ${theme.borderRadius};
  border-bottom-right-radius: ${theme.borderRadius};
  border-bottom-left-radius: ${theme.borderRadius};
`

const StyledHousesButton = styled.button`
  ${mixins.smallButton};
`

const calcNights = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let dayCount = 0

  while (end > start) {
    dayCount++
    start.setDate(start.getDate() + 1)
  }
  return dayCount
}

const getBookedDates = async id => {
  try {
    const houseId = id
    const response = await axios.post(
      'http://localhost:3000/api/houses/booked',
      { houseId }
    )

    if (response.data.status === 'error') {
      alert(response.data.message)
      return
    }
    return response.data.dates
  } catch (error) {
    console.error(error.message)
    return
  }
}

async function canReserve(id, startDate, endDate) {
  try {
    // const houseId = id
    const res = await axios.post('http://localhost:3000/api/houses/check', {
      houseId: id,
      startDate,
      endDate,
    })
    if (res.data.status === 'error') {
      alert(res.data.message)
      return
    }
    if (res.data.message !== 'ok') {
      return false
    }
    return true
  } catch (error) {
    console.error(error)
    return
  }
}

const House = ({ house, bookedDates }) => {
  const { id, picture, title, type, town, reviewsCount, price, reviews } = house
  const [dateChosen, setDateChosen] = useState(false)
  const [numberOfNights, setNumberOfNights] = useState(0)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )
  const user = useStoreState(state => state.user.user)

  const onSetReserve = async () => {
    if (!canReserve(id, startDate, endDate)) {
      console.log(`cannot reserve dates: ${startDate} - ${endDate}`)
      alert('The dates chosen are not valid')
      return
    }

    try {
      const sessionRes = await axios.post('/api/stripe/session', {
        amount: price * numberOfNights,
      })

      if (sessionRes.data.status === 'error') {
        alert(sessionRes.data.message)
      }

      const { sessionId, stripePublicKey } = sessionRes.data

      const res = await axios.post('/api/houses/reserve', {
        houseId: id,
        startDate,
        endDate,
        sessionId,
      })

      if (res.data.status === 'error') {
        alert(res.data.message)
        return
      }

      console.log(res.data)

      try {
        const stripe = Stripe(stripePublicKey)
        const result = await stripe.redirectToCheckout({ sessionId })
        console.log(result)
      } catch (error) {
        console.log(error.message)
      }
    } catch (error) {
      console.log(error)
      return
    }
  }

  return (
    <Layout>
      <StyledHousesContainer>
        <Head>
          <title>{title}</title>
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
            key='viewport'
          />
        </Head>
        <article>
          <img src={picture} width='100%' alt={title} />
          <p>
            {type} - {town}
          </p>
          <p>{title}</p>
          {reviewsCount > 0 && (
            <div className='reviews'>
              <h3>{reviewsCount} Reviews</h3>
              {reviews.map((review, index) => {
                return (
                  <div key={index}>
                    <p>{new Date(review.createdAt).toDateString()}</p>
                    <p>{review.comment}</p>
                  </div>
                )
              })}
            </div>
          )}
        </article>
        <StyledHousesAside>
          <h2>Add dates for prices</h2>
          <DateRangePicker
            datesChanged={(from, to) => {
              // console.log(from, to)
              setNumberOfNights(calcNights(from, to))
              setDateChosen(true)
              setStartDate(from)
              setEndDate(to)
            }}
            bookedDates={bookedDates}
          />
          {dateChosen && (
            <div>
              <h2>Price per night</h2>
              <p>&#36;{price}</p>
              <h2>Total price for booking</h2>
              <p>&#36;{(numberOfNights * price).toFixed(2)}</p>
              {user ? (
                <StyledHousesButton
                  type='submit'
                  className='reserve'
                  onClick={onSetReserve}
                >
                  Reserve
                </StyledHousesButton>
              ) : (
                <StyledHousesButton
                  type='button'
                  className='reserve'
                  onClick={setShowLoginModal}
                >
                  Login in to Reserve
                </StyledHousesButton>
              )}
            </div>
          )}
        </StyledHousesAside>
      </StyledHousesContainer>
    </Layout>
  )
}

House.getInitialProps = async ({ query }) => {
  const { id } = query
  const res = await fetch(`http://localhost:3000/api/houses/${id}`)
  const house = await res.json()
  const bookedDates = await getBookedDates(id)

  return {
    house,
    bookedDates,
  }
}

export default House
