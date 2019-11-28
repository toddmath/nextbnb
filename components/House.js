import Link from 'next/link'

const House = ({ id, title, picture, type, town, rating, reviewsCount }) => {
  // console.log(props)
  return (
    <Link href='houses/[id]' as={`/houses/${id}`}>
      <a>
        <div>
          <img className='house-img' src={picture} with='100%' alt={title} />
          <p>
            {type} - {town}
          </p>
          <p>{title}</p>
          <p>
            {rating} ({reviewsCount})
          </p>

          <style jsx>{`
            .house-img {
              max-width: 100%;
              height: auto;
            }
          `}</style>
        </div>
      </a>
    </Link>
  )
}

export default House
