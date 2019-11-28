import { useState } from 'react'
import { useStoreActions } from 'easy-peasy'
import Layout from '../../components/Layout'
import Head from 'next/head'
import DateRangePicker from '../../components/DateRangePicker'
import houses from '../houses.json'

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

const House = ({
  house: { picture, title, type, town, rating, reviewsCount, price },
}) => {
  const [dateChosen, setDateChosen] = useState(false)
  const [numberOfNights, setNumberOfNights] = useState(0)

  const setShowLoginModal = useStoreActions(
    actions => actions.modals.setShowLoginModal
  )

  return (
    <Layout>
      <div className='container'>
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
          <p>
            {rating} ({reviewsCount})
          </p>
        </article>
        <aside>
          <h2>Add dates for prices</h2>
          <DateRangePicker
            datesChanged={(startDate, endDate) => {
              // console.log(startDate, endDate)
              setNumberOfNights(calcNights(startDate, endDate))
              setDateChosen(true)
            }}
          />
          {dateChosen && (
            <div>
              <h2>Price per night</h2>
              <p>&#36;{price}</p>
              <h2>Total price for booking</h2>
              <p>&#36;{(numberOfNights * price).toFixed(2)}</p>
              <button className='reserve' onClick={() => setShowLoginModal()}>
                Reserve
              </button>
            </div>
          )}
        </aside>

        <style jsx>{`
          .container {
            display: grid;
            grid-template-columns: 60% 40%;
            grid-grap: 30px;
          }

          aside {
            border: 1px solid #ccc;
            padding: 20px;
          }
        `}</style>
      </div>
    </Layout>
  )
}

House.getInitialProps = ({ query }) => {
  const { id } = query

  return {
    house: houses.filter(house => house.id === id)[0],
  }
}

export default House
