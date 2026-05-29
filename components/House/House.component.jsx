import Link from 'next/link'
import { StyledHouseImg } from './House.styles'

const House = ({ id, title, picture, type, town, rating, reviewsCount }) => (
  <Link as={`/houses/${id}`} href='houses/[id]' scroll>
    <a>
      <div>
        <StyledHouseImg src={picture} width='100%' alt={title} />
        <p>
          {type} - {town}
        </p>
        <p>{title}</p>
        {rating !== undefined && (
          <p>
            {rating} ({reviewsCount})
          </p>
        )}
      </div>
    </a>
  </Link>
)

export default House
