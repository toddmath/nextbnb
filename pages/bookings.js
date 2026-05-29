import styled from 'styled-components'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout/Layout.component'
import theme from '../styles/theme'

const StyledBookingsContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 40px;
`

const StyledBookingContainer = styled.div`
  display: grid;
  grid-template-columns: 22% 78%;
  grid-gap: 40px;
  padding: 0;
  border: ${theme.border};
  border-radius: 0.2em;
`

const StyledBookingImg = styled.img`
  height: 100%;
  width: auto;
`

const Bookings = ({ bookings }) => {
  return (
    <Layout>
      <div>
        <Head>
          <title>Your bookings</title>
        </Head>
        <h2>Your bookings</h2>

        <StyledBookingsContainer>
          {bookings.map((book, index) => {
            const { house, booking } = book
            return (
              <StyledBookingContainer key={index}>
                <StyledBookingImg src={house.picture} alt={house.title} />
                <div>
                  <h2>
                    {house.title} in {house.town}
                  </h2>
                  <p>
                    Booked from {new Date(booking.startDate).toDateString()} to{' '}
                    {new Date(booking.endDate).toDateString()}
                  </p>
                  <p>
                    <Link href={`/houses/${house.id}`}>
                      <a>View house page</a>
                    </Link>
                  </p>
                </div>
              </StyledBookingContainer>
            )
          })}
        </StyledBookingsContainer>
      </div>
    </Layout>
  )
}

Bookings.getInitialProps = async ctx => {
  const res = await axios({
    method: 'get',
    url: 'http://localhost:3000/api/bookings/list',
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
  })

  return {
    bookings: res.data,
  }
}

export default Bookings
