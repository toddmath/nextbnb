import useHouseApi from '../../hooks/useHouseApi'
import {
  StyledImgContainer,
  StyledImg,
  StyledInput,
  StyledTextArea,
  StyledSelect,
  StyledForm,
  StyledGrid,
} from './HouseForm.styles'

const HouseForm = ({ house, edit }) => {
  const { newHouse, onInputChange, onFormSubmit } = useHouseApi(house, edit)
  const houseTypesEnum = ['Entire house', 'Room']

  return (
    <div>
      {edit && (
        <StyledImgContainer>
          <StyledImg src={house.picture} alt={house.title} />
        </StyledImgContainer>
      )}
      <StyledForm onSubmit={onFormSubmit}>
        <p>
          <label>House title</label>
          <input
            required
            onChange={onInputChange}
            type='text'
            placeholder='House title'
            name='title'
            value={newHouse.title}
          />
        </p>
        <p>
          <label>Town</label>
          <input
            required
            onChange={onInputChange}
            type='text'
            placeholder='Town'
            name='town'
            value={newHouse.town}
          />
        </p>
        <p>
          <label>Price per night</label>
          <input
            required
            onChange={onInputChange}
            type='number'
            placeholder='Price per night'
            name='price'
            value={newHouse.price}
          />
        </p>
        <p>
          <label>House picture URL</label>
          <input
            required
            onChange={onInputChange}
            type='text'
            placeholder='House picture URL'
            name='picture'
            value={newHouse.picture}
          />
        </p>
        <p>
          <label>House description</label>
          <StyledTextArea
            required
            onChange={onInputChange}
            name='description'
            value={newHouse.description}
          />
        </p>

        <StyledGrid>
          <div>
            <p>
              <label>Number of guests</label>
              <StyledInput
                required
                onChange={onInputChange}
                type='number'
                placeholder='Number of guests'
                name='guests'
                value={newHouse.guests}
              />
            </p>
            <p>
              <label>Number of bedrooms</label>
              <StyledInput
                required
                onChange={onInputChange}
                type='number'
                placeholder='Number of bedrooms'
                name='bedrooms'
                value={newHouse.bedrooms}
              />
            </p>
            <p>
              <label>Number of beds</label>
              <StyledInput
                required
                onChange={onInputChange}
                type='number'
                placeholder='Number of beds'
                name='beds'
                value={newHouse.beds}
              />
            </p>
            <p>
              <label>Number of baths</label>
              <StyledInput
                required
                onChange={onInputChange}
                type='number'
                placeholder='Number of baths'
                name='baths'
                value={newHouse.baths}
              />
            </p>
            <p>
              <label>Type of house</label>
              <StyledInput
                onChange={onInputChange}
                name='type'
                value={newHouse.type}
              >
                {houseTypesEnum.map((item, key) => (
                  <option value={item} key={key}>
                    {item}
                  </option>
                ))}
              </StyledInput>
            </p>
          </div>

          <div>
            <p>
              <label>Does it have Wifi?</label>
              <StyledSelect
                onChange={onInputChange}
                name='wifi'
                value={newHouse.wifi}
              >
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </StyledSelect>
            </p>
            <p>
              <label>Does it have a kitchen?</label>
              <StyledSelect
                onChange={onInputChange}
                name='kitchen'
                value={newHouse.kitchen}
              >
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </StyledSelect>
            </p>
            <p>
              <label>Does it have heating?</label>
              <StyledSelect
                onChange={onInputChange}
                name='heating'
                value={newHouse.heating}
              >
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </StyledSelect>
            </p>
            <p>
              <label>Does it have free parking?</label>
              <StyledSelect
                onChange={onInputChange}
                name='freeParking'
                value={newHouse.freeParking}
              >
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </StyledSelect>
            </p>
            <p>
              <label>Is it the entire place?</label>
              <StyledSelect
                onChange={onInputChange}
                name='entirePlace'
                value={newHouse.entirePlace}
              >
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </StyledSelect>
            </p>
          </div>
        </StyledGrid>

        {edit === true ? (
          <button type='submit'>Edit house</button>
        ) : (
          <button type='submit'>Add house</button>
        )}
      </StyledForm>
    </div>
  )
}

export default HouseForm
