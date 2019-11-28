import Layout from '../components/Layout'
import House from '../components/House'
import houses from './houses.json'

// const content = (

// )

const Index = () => (
  <Layout>
    <div className='index'>
      <h2>Places to stay</h2>

      <div className='houses'>
        {houses.map((house, index) => (
          <House key={index} {...house} />
        ))}
      </div>

      <style jsx>{`
        .index {
          width: 100%;
          height: auto;
          padding: 0;
          margin: 0;
          overflow-x: hidden;
        }

        .houses {
          display: grid;
          grid-template-columns: 50% 50%;
          grid-template-rows: 300px 300px;
          grid-gap: 40px;
        }
      `}</style>
    </div>
  </Layout>
)

export default Index
