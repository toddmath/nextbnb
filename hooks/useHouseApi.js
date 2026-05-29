import { useState, useEffect } from 'react'
import axios from 'axios'
import Router from 'next/router'

const useHouseApi = (house, edit) => {
  const [newHouse, setNewHouse] = useState({})

  useEffect(() => {
    if (edit === true) {
      setNewHouse({ ...house })
    } else {
      setNewHouse({
        title: '',
        town: '',
        price: 0,
        picture: '',
        description: '',
        guests: 0,
        bedrooms: 0,
        beds: 0,
        baths: 0,
        wifi: false,
        kitchen: false,
        heating: false,
        freeParking: false,
        entirePlace: false,
        type: 'Entire house',
      })
    }
  }, [edit])

  const onSubmit = async event => {
    if (event) event.preventDefault()
    try {
      const data = { house: { ...newHouse } }

      // data.house.type = data.house.housetype
      if (edit === true) data.house.id = newHouse.id
      else data.house.id = null

      const res = await axios.post(
        `/api/host/${edit === true ? 'edit' : 'new'}`,
        { ...data }
      )

      if (res.data.status === 'error') {
        alert(res.data.message)
        return
      }
      console.log(res)
      Router.push('/host')
    } catch (error) {
      alert(error.response.data.message)
      return
    }
  }

  const onInputChange = event => {
    event.persist()
    setNewHouse({ ...newHouse, [event.target.name]: event.target.value })
  }

  return {
    onSubmit,
    onInputChange,
    newHouse,
  }
}

export default useHouseApi
