export const MAJORS = ['Computer Science', 'Education', 'Environmental Science', 'Business', 'Arts & Design'] as const
export const REGIONS = ['National', 'Midwest', 'West', 'South', 'Northeast'] as const

/** Majors offered in the search filter. */
export const FILTER_MAJORS = [...MAJORS, 'Any major']
/** Majors offered on the profile form. */
export const PROFILE_MAJORS = [...MAJORS, 'Undecided']
