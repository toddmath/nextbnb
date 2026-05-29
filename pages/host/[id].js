import axios from 'axios'
import Head from 'next/head'
import Layout from '../../components/Layout/Layout.component'
import HouseForm from '../../components/HouseForm/HouseForm.component'

const EditHouse = ({ house }) => {
  return (
    <Layout>
      <Head>
        <title>Edit house</title>
      </Head>
      <HouseForm edit={true} house={house} />
    </Layout>
  )
}

EditHouse.getInitialProps = async ({ query }) => {
  const { id } = query
  const res = await axios.get(`http://localhost:3000/api/houses/${id}`)

  return {
    house: res.data,
  }
}

export default EditHouse
