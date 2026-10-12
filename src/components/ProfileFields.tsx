import { PROFILE_MAJORS, REGIONS } from '../lib/options'

export interface ProfileFieldValues {
  gpa: string
  region: string
  major: string
}

export const fieldLabel = 'flex flex-col gap-1.5 text-[.82rem] font-bold'

/** GPA, region and major: shared by sign-up and the profile page. */
export function ProfileFields({ values, onChange }: { values: ProfileFieldValues; onChange: (values: ProfileFieldValues) => void }) {
  const set = (key: keyof ProfileFieldValues) => (event: { target: { value: string } }) => onChange({ ...values, [key]: event.target.value })
  return (
    <>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <label className={fieldLabel}>
          High-school GPA
          <input required type="number" min="0" max="4" step="0.01" placeholder="3.7" value={values.gpa} onChange={set('gpa')} />
        </label>
        <label className={fieldLabel}>
          Where you want to study
          <select value={values.region} onChange={set('region')}>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region === 'National' ? 'Anywhere in the US' : region}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={fieldLabel}>
        Intended major
        <select value={values.major} onChange={set('major')}>
          {PROFILE_MAJORS.map((major) => (
            <option key={major}>{major}</option>
          ))}
        </select>
      </label>
    </>
  )
}
