import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Modal } from 'antd'
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

function AddressModal({ isOpen, onClose, onSave, initialAddress }) {
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
    if (validateForm()) {
      onSave({
        ...addressDetails,
        position
      })
      onClose()
    }
  }

  return (
    <StyledModal
      title="Select Delivery Address"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <CancelButton key="cancel" onClick={onClose}>
          Cancel
        </CancelButton>,
        <SaveButton key="save" onClick={handleSave}>
          Save Address
        </SaveButton>
      ]}
      width={600}
      centered
    >
      <MapWrapper>
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: '300px', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
        <MapHint>
          <LocationOnIcon />
          Click on the map to set your delivery location
        </MapHint>
      </MapWrapper>

      <FormContainer>
        <FormGroup>
          <Label>Block *</Label>
          <Input
            type="text"
            placeholder="e.g., 324"
            value={addressDetails.block}
            onChange={(e) => setAddressDetails({ ...addressDetails, block: e.target.value })}
            $error={errors.block}
          />
          {errors.block && <ErrorText>{errors.block}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Road *</Label>
          <Input
            type="text"
            placeholder="e.g., Road 2416"
            value={addressDetails.road}
            onChange={(e) => setAddressDetails({ ...addressDetails, road: e.target.value })}
            $error={errors.road}
          />
          {errors.road && <ErrorText>{errors.road}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>House/Building/Office *</Label>
          <Input
            type="text"
            placeholder="e.g., Building 123"
            value={addressDetails.building}
            onChange={(e) => setAddressDetails({ ...addressDetails, building: e.target.value })}
            $error={errors.building}
          />
          {errors.building && <ErrorText>{errors.building}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Apartment (Optional)</Label>
          <Input
            type="text"
            placeholder="e.g., Flat 4B"
            value={addressDetails.apartment}
            onChange={(e) => setAddressDetails({ ...addressDetails, apartment: e.target.value })}
          />
        </FormGroup>

        <FormGroup>
          <Label>Extra Instructions</Label>
          <TextArea
            placeholder="Any special instructions for delivery..."
            value={addressDetails.instructions}
            onChange={(e) => setAddressDetails({ ...addressDetails, instructions: e.target.value })}
            rows={3}
          />
        </FormGroup>
      </FormContainer>
    </StyledModal>
  )
}

export default AddressModal

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: #181818;
    color: white;
    border-radius: 18px;
    box-shadow: 0 8px 32px #0008;
  }
  .ant-modal-header {
    background-color: #181818;
    color: white;
    border-bottom: 2px solid #222;
  }
  .ant-modal-title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .ant-modal-close-x {
    color: white !important;
  }
  .ant-modal-footer {
    background-color: #181818;
    border-top: 2px solid #222;
    padding: 18px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
`

const MapWrapper = styled.div`
  margin-bottom: 24px;
  position: relative;
  
  .leaflet-container {
    height: 300px;
    width: 100%;
    border-radius: 12px;
    z-index: 1;
  }
`

const MapHint = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: #ff9800;
  font-size: 14px;
  
  svg {
    font-size: 20px;
  }
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormGroup = styled.div`
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
  
  &:focus {
    outline: none;
    border-color: #ff9800;
  }
  
  &::placeholder {
    color: #666;
  }
`

const TextArea = styled.textarea`
  background: #2a2a2a;
  border: 2px solid #333;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #ff9800;
  }
  
  &::placeholder {
    color: #666;
  }
`

const ErrorText = styled.span`
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
`

const CancelButton = styled.button`
  background: #222;
  color: #fff;
  border: 1px solid #555;
  border-radius: 8px;
  font-size: 16px;
  padding: 10px 24px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #444;
    color: #ff9800;
    border-color: #ff9800;
  }
`

const SaveButton = styled.button`
  background: linear-gradient(90deg, #ff9800 60%, #ffb74d 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 28px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(90deg, #ffa726 60%, #ffd54f 100%);
  }
`
