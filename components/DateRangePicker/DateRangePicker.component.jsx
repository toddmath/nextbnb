import { useState } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'
import 'react-day-picker/lib/style.css'
import {
  StyledDateRangeContainer,
  StyledDateRangeLabel,
  StyledDateRangeSpan,
  StyledDateRangeInput,
} from './DateRangePicker.styles'

const format = 'MMMM dd, yyyy'
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

// eslint-disable-next-line no-shadow
const parseDate = (str, format, locale) => {
  const parsed = dateFnsParse(str, format, new Date(), { locale })
  return DateUtils.isDate(parsed) ? parsed : null
}

// eslint-disable-next-line no-shadow
const formatDate = (date, format, locale) => {
  return dateFnsFormat(date, format, { locale })
}

const nightsBetween = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let dayCount = 0

  while (end > start) {
    dayCount++
    start.setDate(start.getDate() + 1)
  }
  return dayCount
}

const formatLocale = str => str.toLocaleDateString()

export default ({ datesChanged, bookedDates }) => {
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(tomorrow)

  const onSetStartDate = day => {
    setStartDate(day)
    const newEndDate = new Date(day)
    if (nightsBetween(day, endDate) < 1) {
      newEndDate.setDate(newEndDate.getDate() + 1)
      setEndDate(newEndDate)
    }
    datesChanged(day, newEndDate)
  }

  const bookedArray = () => {
    if (bookedDates.length > 0) {
      return bookedDates.map(date => new Date(date))
    }
    return [...bookedDates]
  }

  const alreadyBooked = bookedArray()

  return (
    <StyledDateRangeContainer>
      <StyledDateRangeInput>
        <StyledDateRangeLabel>From:</StyledDateRangeLabel>
        <StyledDateRangeSpan>
          <DayPickerInput
            formatDate={formatDate}
            format={format}
            value={startDate}
            parseDate={parseDate}
            placeHolder={`${dateFnsFormat(new Date(), format)}`}
            dayPickerProps={{
              todayButton: 'Today',
              modifiers: {
                disabled: [
                  ...alreadyBooked,
                  {
                    before: new Date(),
                  },
                ],
              },
            }}
            onDayChange={day => onSetStartDate(day)}
          />
        </StyledDateRangeSpan>
      </StyledDateRangeInput>

      <StyledDateRangeInput>
        <StyledDateRangeLabel>To:</StyledDateRangeLabel>
        <StyledDateRangeSpan>
          <DayPickerInput
            formatDate={formatDate}
            format={format}
            value={endDate}
            parseDate={parseDate}
            placeHolder={`${dateFnsFormat(new Date(), format)}`}
            dayPickerProps={{
              modifiers: {
                disabled: [
                  startDate,
                  ...alreadyBooked,
                  {
                    before: startDate,
                  },
                ],
              },
            }}
            onDayChange={day => {
              setEndDate(day)
              datesChanged(startDate, day)
            }}
          />
        </StyledDateRangeSpan>
      </StyledDateRangeInput>
      <p>
        {startDate && endDate
          ? `From ${formatLocale(startDate)} to ${formatLocale(endDate)}`
          : 'Please enter both a start and end day.'}
      </p>
    </StyledDateRangeContainer>
  )
}
