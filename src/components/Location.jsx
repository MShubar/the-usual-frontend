import styled from "styled-components"
import LocationOnIcon from '@mui/icons-material/LocationOn'

function Location() {
  return (
    <div style={{ gap: '10px' }}>
            <Title>The Usual</Title>
            <LocationDiv>
              <LocationOnIcon />
              Bahrain, Manama
            </LocationDiv>
          </div>
  )
}

const Title = styled.div`
  font-size: 32px;
  font-family: 'Rubik', sans-serif;
  margin: 0px 16px;
`

const LocationDiv = styled.p`
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  margin: 0px 16px;
`

export default Location