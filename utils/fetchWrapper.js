import fetch from 'isomorphic-unfetch'

export default async function fetchWrapper(input, init) {
  try {
    const data = await fetch(input, init).then(res => res.json())
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}
