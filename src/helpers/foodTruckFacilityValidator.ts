import {body} from 'express-validator'

const validate = (method: string) => {
    switch (method) {
        case 'create': {
            return [
                body('applicant', 'applicant is required').exists(),
                body('facilityType', 'facilityType is required').exists()
            ]
        }
        default:
            return []
    }
}

export default validate