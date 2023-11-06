import * as React from 'react'

import { useTheme } from '@mui/material/styles'

import MobileStepper from '@mui/material/MobileStepper'

import Button from '@mui/material/Button'

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

import { ISnapshot } from '../../models/ISnapshot'

import { useEffect } from 'react'


interface IProps {

    snapshots: Partial<ISnapshot[]>

    selected?: string

    structure: string

    onSelect?: (snapshot: Partial<ISnapshot>) => void

}


export default function TimelineComponent({ snapshots, selected, structure, onSelect }: IProps) {

    const PAGE_COUNT = 10

    const theme = useTheme()

    const [activeStep, setActiveStep] = React.useState(0)

    useEffect(() => {

        if (selected) {

            const activeIndex = snapshots.findIndex((snapshot: ISnapshot | undefined) => {

                if (snapshot === undefined) return false

                else return snapshot._id == selected

            })

            if (activeIndex > -1) setActiveStep(activeIndex)
        }

    }, [snapshots])

    const handleNext = () => {

        setActiveStep((prevActiveStep) => prevActiveStep + 1)

    }

    const handleBack = () => {

        setActiveStep((prevActiveStep) => prevActiveStep - 1)

    }

    return (

        <MobileStepper

            variant='dots'

            steps={PAGE_COUNT}

            position='static'

            activeStep={activeStep}

            sx={{ maxWidth: 400, flexGrow: 1 }}

            nextButton={

                <Button size='small' onClick={handleNext} disabled={activeStep === 9}>

                    {theme.direction === 'rtl' ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}

                </Button>
            }

            backButton={

                <Button size='small' onClick={handleBack} disabled={activeStep === 0}>

                    {theme.direction === 'rtl' ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)}

                </Button>

            }

        />
    )
}
