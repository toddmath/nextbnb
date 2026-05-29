import axios from 'axios'
import styled from 'styled-components'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout.component'

const StyledHostContainer = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-gap: 50px;
`

const StyledHostList = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 40px;
  margin-top: 60px;
`

const StyledHouse = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  grid-gap: 20px;
`

const StyledHouseImg = styled.img`
  width: 100%;
`

const StyledTitle = styled.h2`
  margin-top: 0;
  line-height: 1.2;
`

const StyledSubtitle = styled.h2`
  font-size: 1.75em;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-align: center;
`

const StyledHostLink = styled.p`
  display: inline-block;
  margin-right: 1rem;
`

const Host = ({ houses, bookings }) => {
  return (
    <Layout>
      <div>
        <Head>
          <title>Your houses</title>
        </Head>
        <StyledHostContainer>
          <div className='houses'>
            <StyledSubtitle>Your houses</StyledSubtitle>
            <StyledHostList>
              {houses.length > 0 &&
                houses.map((house, index) => (
                  <StyledHouse key={index}>
                    <StyledHouseImg src={house.picture} alt={house.title} />
                    <div>
                      <StyledTitle className='house-title'>
                        {house.title} in {house.town}
                      </StyledTitle>
                      <StyledHostLink>
                        <Link href={`/houses/${house.id}`}>
                          <a>View house page</a>
                        </Link>
                      </StyledHostLink>
                      <StyledHostLink>
                        <Link href={`/host/${house.id}`}>
                          <a>Edit house details</a>
                        </Link>
                      </StyledHostLink>
                    </div>
                  </StyledHouse>
                ))}
            </StyledHostList>
          </div>

          <div className='bookings'>
            <StyledSubtitle>Your bookings</StyledSubtitle>
            <StyledHostList>
              {bookings.map((book, index) => {
                return (
                  <div className='booking' key={index}>
                    <StyledTitle>
                      {book.house.title} in {book.house.town}
                    </StyledTitle>
                    <p>
                      Booked from{' '}
                      {new Date(book.booking.startDate).toDateString()} to{' '}
                      {new Date(book.booking.endDate).toDateString()}
                    </p>
                  </div>
                )
              })}
            </StyledHostList>
          </div>
        </StyledHostContainer>
      </div>
    </Layout>
  )
}

Host.getInitialProps = async ctx => {
  const res = await axios({
    method: 'get',
    url: 'http://localhost:3000/api/host/list',
    headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
  })

  return {
    houses: res.data.houses,
    bookings: res.data.bookings,
  }
}

export default Host
