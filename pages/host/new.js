import Head from 'next/head'
import Layout from '../../components/Layout/Layout.component'
import HouseForm from '../../components/HouseForm/HouseForm.component'

const NewHouse = () => (
  <Layout>
    <div>
      <Head>
        <title>Add a new house</title>
      </Head>
      <HouseForm edit={false} />
    </div>
  </Layout>
)

export default NewHouse
