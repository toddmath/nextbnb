import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import Layout from '../components/Layout/Layout.component'
import House from '../components/House/House.component'
// import houses from './houses.json'

const StyledIndex = styled.div`
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
`

const StyledHousesContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 300px 300px;
  grid-gap: 40px;
`

const Index = ({ houses }) => (
  <Layout>
    <StyledIndex>
      <h2>Places to stay</h2>

      <StyledHousesContainer>
        {houses.map((house, index) => (
          <House key={index} {...house} />
        ))}
      </StyledHousesContainer>
    </StyledIndex>
  </Layout>
)

Index.getInitialProps = async () => {
  const res = await fetch(`http://localhost:3000/api/houses`)
  const houses = await res.json()
  return {
    houses,
  }
}

export default Index
