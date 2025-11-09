import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })
  return position ? <Marker position={position} /> : null
}

export default function AddressPage() {
  const navigate = useNavigate()

  const initialAddress = useMemo(() => {
    try {
      const saved = localStorage.getItem('deliveryAddress')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }, [])

  const [position, setPosition] = useState(initialAddress?.position || [26.2285, 50.5860]) // Bahrain default
  const [addressDetails, setAddressDetails] = useState({
    block: initialAddress?.block || '',
    road: initialAddress?.road || '',
    building: initialAddress?.building || '',
    apartment: initialAddress?.apartment || '',
    instructions: initialAddress?.instructions || ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!addressDetails.block) newErrors.block = 'Block is required'
    if (!addressDetails.road) newErrors.road = 'Road is required'
    if (!addressDetails.building) newErrors.building = 'Building is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return
    const payload = { ...addressDetails, position }
    try {
      localStorage.setItem('deliveryAddress', JSON.stringify(payload))
    } catch {}
    navigate(-1)
  }

  return (
    <Page>
      <Header>
        <Title>Select Delivery Address</Title>
      </Header>

      <Body>
        <MapWrapper>
          <MapContainer 
            center={position} 
            zoom={15} 
            style={{ height: '300px', width: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </MapWrapper>

        <Form>
          <FormRow>
            <Label>Block *</Label>
            <Input
              type="text"
              placeholder="e.g., 324"
              value={addressDetails.block}
              onChange={(e) => setAddressDetails({ ...addressDetails, block: e.target.value })}
              $error={errors.block}
            />
            {errors.block && <ErrorText>{errors.block}</ErrorText>}
          </FormRow>

          <FormRow>
            <Label>Road *</Label>
            <Input
              type="text"
              placeholder="e.g., Road 2416"
              value={addressDetails.road}
              onChange={(e) => setAddressDetails({ ...addressDetails, road: e.target.value })}
              $error={errors.road}
            />
            {errors.road && <ErrorText>{errors.road}</ErrorText>}
          </FormRow>

          <FormRow>
            <Label>House/Building/Office *</Label>
            <Input
              type="text"
              placeholder="e.g., Building 123"
              value={addressDetails.building}
              onChange={(e) => setAddressDetails({ ...addressDetails, building: e.target.value })}
              $error={errors.building}
            />
            {errors.building && <ErrorText>{errors.building}</ErrorText>}
          </FormRow>

          <FormRow>
            <Label>Apartment (Optional)</Label>
            <Input
              type="text"
              placeholder="e.g., Flat 4B"
              value={addressDetails.apartment}
              onChange={(e) => setAddressDetails({ ...addressDetails, apartment: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <Label>Extra Instructions</Label>
            <TextArea
              placeholder="Any special instructions for delivery..."
              value={addressDetails.instructions}
              onChange={(e) => setAddressDetails({ ...addressDetails, instructions: e.target.value })}
              rows={3}
            />
          </FormRow>
        </Form>
      </Body>

      <Footer>
        <ButtonSecondary onClick={() => navigate(-1)}>Cancel</ButtonSecondary>
        <ButtonPrimary onClick={handleSave}>Save Address</ButtonPrimary>
      </Footer>
    </Page>
  )
}

const Page = styled.div`
  background: #000;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #111;
  border-bottom: 1px solid #222;
  padding: calc(12px + env(safe-area-inset-top)) 16px 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Title = styled.h1`
  font-size: 20px;
  margin: 0;
`
const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`
const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`
const MapWrapper = styled.div`
  position: relative;
  .leaflet-container { height: 300px; width: 100%; border-radius: 12px; }
`
const MapHint = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: #ff9800;
  font-size: 14px;
  svg { font-size: 20px; }
`
const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`
const Label = styled.label`
  color: white;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
`
const Input = styled.input`
  background: #2a2a2a;
  border: 2px solid ${props => props.$error ? '#ff4444' : '#333'};
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  &:focus { outline: none; border-color: #ff9800; }
  &::placeholder { color: #666; }
`
const TextArea = styled.textarea`
  background: #2a2a2a;
  border: 2px solid #333;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  &:focus { outline: none; border-color: #ff9800; }
  &::placeholder { color: #666; }
`
const ErrorText = styled.span`
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
`
const ButtonSecondary = styled.button`
  background: #222;
  color: #fff;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 14px;
  padding: 10px 16px;
  cursor: pointer;
  &:hover { background: #333; border-color: #ff9800; color: #ff9800; }
`
const ButtonPrimary = styled.button`
  background: linear-gradient(90deg, #ff9800 60%, #ffb74d 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 18px;
  cursor: pointer;
  &:hover { background: linear-gradient(90deg, #ffa726 60%, #ffd54f 100%); }
`
const Footer = styled.div`
  background: #111;
  border-top: 1px solid #222;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom)) 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
`
