import styled, { css } from 'styled-components'

const dateRangeStyles = css`
  .DayPickerInput input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 0.2em;
    border: 1px solid rgba(158, 158, 158, 1);
  }

  .DayPicker-Day,
  .DayPicker-Day--start,
  .DayPicker-Day--end {
    border-radius: 0.35em !important;
  }

  .DayPicker-Day {
    border-radius: 0.35em !important;
  }

  .DayPickerInput-Overlay {
    width: 280px;
  }

  div.DayPickerInput .DayPicker-Day--disabled {
    color: rgba(158, 158, 158, 0.7) !important;
    background-color: rgba(245, 245, 245, 1) !important;
    border-radius: 0 !important;
  }
`

export const StyledDateRangeContainer = styled.div`
  ${dateRangeStyles};
`

export const StyledDateRangeInput = styled.div`
  display: grid;
  border: 1px solid #ddd;
  grid-template-columns: 20% 80%;
  padding: 10px;
`

export const StyledDateRangeLabel = styled.label`
  padding-top: 10px;
`

export const StyledDateRangeSpan = styled.span`
  width: 100%;
  margin: 0;
`
