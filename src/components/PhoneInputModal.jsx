import React, { useEffect, useState, useRef } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import styled from 'styled-components'
import { auth } from '../firebase/config'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

function PhoneInputModal({ 
  open, 
  onClose, 
  phone, 
  onChange, 
  onSubmit,
  title = "Enter Phone Number",
  placeholder = "Enter phone number (e.g., 39970100)",
  buttonText = "Continue"
}) {
  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // Firebase phone auth refs
  const recaptchaRef = useRef(null)
  const confirmationRef = useRef(null)

  // Test mode flag (no SMS), uses Firebase setting if enabled
  const isAppVerificationDisabled = !!auth?.settings?.appVerificationDisabledForTesting

  useEffect(() => {
    if (open) {
      setStep('phone')
      setOtp('')
      setError('')
      setLoading(false)
      setResendTimer(0)
    }
  }, [open])

  useEffect(() => {
    if (!resendTimer) return
    const t = setInterval(() => setResendTimer((s) => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(t)
  }, [resendTimer])

  useEffect(() => {
    // Cleanup on unmount: do not clear global verifier, only local ref
    return () => {
      recaptchaRef.current = null
    }
  }, [])

  const ensureGlobalRecaptchaAnchor = () => {
    const id = 'global-recaptcha-container'
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('div')
      el.id = id
      el.style.position = 'fixed'
      el.style.bottom = '0'
      el.style.right = '0'
      el.style.width = '1px'
      el.style.height = '1px'
      el.style.overflow = 'hidden'
      el.style.opacity = '0'
      document.body.appendChild(el)
    }
    return id
  }

  const ensureRecaptcha = async () => {
    // Reuse a single global RecaptchaVerifier to avoid multiple renders and 401s
    if (window.__globalRecaptchaVerifier) {
      recaptchaRef.current = window.__globalRecaptchaVerifier
      return recaptchaRef.current
    }
    const anchorId = ensureGlobalRecaptchaAnchor()
    const verifier = new RecaptchaVerifier(auth, anchorId, {
      size: 'invisible',
      callback: () => {}
    })
    try {
      await verifier.render()
    } catch {
      // ignore
    }
    window.__globalRecaptchaVerifier = verifier
    recaptchaRef.current = verifier
    return verifier
  }

  const formatPhone = (value) => {
    let formatted = (value || '').trim()
    // Remove any non-digit characters except +
    formatted = formatted.replace(/[^\d+]/g, '')
    
    // Ensure E.164 format: +[country code][number]
    if (!formatted.startsWith('+')) {
      // Default to Bahrain +973
      formatted = '+973' + formatted
    }
    
    return formatted
  }

  const validatePhone = (phoneNumber) => {
    // E.164 format: +[1-3 digit country code][4-14 digit number]
    const e164Pattern = /^\+\d{1,3}\d{4,14}$/
    return e164Pattern.test(phoneNumber)
  }

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number')
      return
    }
    
    const formattedPhone = formatPhone(phone)
    
    if (!validatePhone(formattedPhone)) {
      setError('Invalid phone number format. Example: +97339970100')
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      if (isAppVerificationDisabled) {
        // Test mode: no SMS
        confirmationRef.current = { confirm: async (code) => ({ user: { phoneNumber: formattedPhone } }) }
        setStep('otp')
        setResendTimer(30)
      } else {
        const appVerifier = await ensureRecaptcha()
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
        confirmationRef.current = result
        setStep('otp')
        setResendTimer(60)
      }
    } catch (e) {
      // Reset recaptcha on failure
      try { 
        if (window.__globalRecaptchaVerifier?.clear) window.__globalRecaptchaVerifier.clear() 
      } catch {}
      window.__globalRecaptchaVerifier = null
      recaptchaRef.current = null
      
      // Parse Firebase error
      let errorMsg = 'Failed to send OTP. '
      if (e?.code === 'auth/invalid-phone-number') {
        errorMsg += 'Invalid phone number format.'
      } else if (e?.code === 'auth/quota-exceeded') {
        errorMsg += 'SMS quota exceeded. Try again later.'
      } else if (e?.code === 'auth/captcha-check-failed') {
        errorMsg += 'reCAPTCHA verification failed.'
      } else if (e?.message?.includes('BILLING_NOT_ENABLED')) {
        errorMsg += 'Billing not enabled. Contact support.'
      } else {
        errorMsg += e?.message || 'Please check your phone number and try again.'
      }
      
      setError(errorMsg)
      console.error('[Firebase Auth Error]', e)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter the verification code')
      return
    }
    setError('')
    setLoading(true)
    try {
      if (!confirmationRef.current) throw new Error('No verification session. Please resend the code.')
      await confirmationRef.current.confirm(otp)
      // Verified -> proceed
      onSubmit()
    } catch (e) {
      setError(e?.message || 'Verification failed. Please check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="phone-modal-title">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: '#222',
        color: 'white',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        minWidth: 320,
      }}>
        {/* Invisible reCAPTCHA anchor (required) */}
        <div id="recaptcha-container" style={{ height: 0, width: 0, overflow: 'hidden' }} />

        <ModalTitle id="phone-modal-title">
          {step === 'phone' ? title : 'Verify Code'}
        </ModalTitle>

        {step === 'phone' ? (
          <>
            <PhoneInput
              type="tel"
              placeholder={placeholder}
              value={phone}
              onChange={onChange}
            />
            {error && <ErrorText>{error}</ErrorText>}
            <SubmitButton onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending...' : buttonText}
            </SubmitButton>
          </>
        ) : (
          <>
            <HelperText>We sent a 6‑digit code to your phone.</HelperText>
            <OtpInput
              type="text"
              inputMode="numeric"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            {error && <ErrorText>{error}</ErrorText>}
            <SubmitButton onClick={handleVerifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </SubmitButton>
            <ResendRow>
              <span>Didn't receive the code?</span>
              <ResendButton 
                onClick={handleSendOtp} 
                disabled={resendTimer > 0 || loading}
                title={resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </ResendButton>
            </ResendRow>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default PhoneInputModal

const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: white;
`

const PhoneInput = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  font-size: 16px;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border: 2px solid #ff9800;
  }
`

const OtpInput = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #333;
  color: white;
  font-size: 18px;
  letter-spacing: 6px;
  text-align: center;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border: 2px solid #ff9800;
  }
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #ff9800;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f57c00;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ResendRow = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #bbb;
`

const ResendButton = styled.button`
  background: transparent;
  color: #ff9800;
  border: none;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    color: #777;
    cursor: not-allowed;
  }
`

const HelperText = styled.div`
  color: #bbb;
  font-size: 14px;
  margin-bottom: 8px;
`

const ErrorText = styled.div`
  color: #ff6b6b;
  margin-bottom: 8px;
  font-size: 14px;
`
