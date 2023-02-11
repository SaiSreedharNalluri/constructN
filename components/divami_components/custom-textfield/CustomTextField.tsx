import React, { useRef } from 'react'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { styled } from "@mui/system";

interface PropTypes {
  id: any
  variant: 'outlined' | 'standard' | 'filled'
  placeholder: any
  onChange: any
  className: any
  defaultValue: any
  isError: any
  dataTestId: any
  icon?: string
  isRequired: boolean
  type: string
  isDisabled?: boolean
  minVal?: number
  maxVal?: number
  showRangeError?: boolean
  onBlur?: any
}

const StyledTextArea = styled(TextareaAutosize)({
  height: '100px !important',
  width: '392px !important',
  padding: '5px 10px',
  border: '1px solid #36415d',
  borderRadius: '4px',
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 14,
  color: '#101F4B'
})
 


export const CustomTextField = (props: PropTypes) => {
  const reff = useRef<any>(null)
  const {
    id,
    variant,
    placeholder,
    defaultValue,
    isError,
    dataTestId,
    type = 'text',
    isDisabled = false,
    onBlur,
  } = props
  return (
    <div>
      <StyledTextArea
        id={id}
        // placeholder={placeholder}
        defaultValue={defaultValue}
        value={defaultValue}
        data-testid={dataTestId}
        required={false}
        disabled={isDisabled}
        onWheel={(e: any) => e.target?.blur()}
        onBlur={onBlur}
        ref={reff}
        onClick={(e) => {
          reff?.current?.focus()
        }}
      />
      {/* {isError && (
                <div className={classes.error_message}>This is required</div>
            )} */}
    </div>
  )
}

CustomTextField.defaultProps = {
  isDisabled: false,
  minVal: '',
  maxVal: '',
  showRangeError: false,
  onBlur: '',
  onKeyDown: '',
}
