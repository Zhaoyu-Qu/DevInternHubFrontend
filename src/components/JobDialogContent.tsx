import DialogContent from '@mui/material/DialogContent';
import { JobForCreation } from '../types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ChipInput from './ChipInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
type DialogFormProps = {
    job: JobForCreation;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDateChange: (propertyName: string, newValue: dayjs.Dayjs | null) => void;
    handleTechnologiesChange: (chips: string[]) => void;
    handleTypeChange: (event: SelectChangeEvent<string>) => void;
}

function JobDialogContent({ job, handleChange, handleDateChange, handleTechnologiesChange, handleTypeChange }: DialogFormProps) {

    const commonSx = {
        width: { sm: 200, md: 300 },
        "& .MuiInputBase-root": {
            height: 35
        }
    };

    const commonInputLabelProps = { shrink: true };

    return (<>
        <DialogContent>
            <Stack spacing={3} mt={1}>
                <TextField label="Title" name="title" value={job.title} onChange={handleChange}
                    sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Title" />
                {/* <TextField label="Description" name="description" value={job.description} onChange={handleChange}
                    sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Job Description" /> */}
                <TextField label="Url (required)" name="url" value={job.url} onChange={handleChange}
                    sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Url" />
                <TextField label="Location" name="location" value={job.location} onChange={handleChange}
                    sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Location" />
                <TextField label="Company Name" name="companyName" value={job.companyName} onChange={handleChange}
                    sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Company Name" />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Opening Date" name="openingDate" onChange={(newValue) => handleDateChange("openingDate", newValue)}
                        value={job.openingDate ? dayjs(job.openingDate) : null}
                        sx={commonSx}
                        slotProps={{
                            textField: { InputLabelProps: { shrink: true } }
                        }}
                    />
                    <DatePicker label="Closing Date" name="closingDate" onChange={(newValue) => handleDateChange("closingDate", newValue)}
                        sx={commonSx}
                        value={job.closingDate ? dayjs(job.closingDate) : null}
                        slotProps={{
                            textField: { InputLabelProps: { shrink: true } }
                        }} />
                </LocalizationProvider>
                <TextField label="Specialisation" name="specialisation" value={job.specialisation} onChange={handleChange}
                    sx={commonSx} InputLabelProps={commonInputLabelProps} placeholder="Frontend, Backend, etc." />
                <FormControl sx={commonSx}>
                    <InputLabel id="type-label" shrink={true}>Type</InputLabel>
                    <Select
                        labelId="type-label"
                        label="Type"
                        name="type"
                        value={job.type}
                        onChange={handleTypeChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Type' }}
                    >
                        <MenuItem value="" disabled>
                        </MenuItem>
                        <MenuItem value="Graduate Job">Graduate Job</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                    </Select>
                </FormControl>
                <ChipInput
                    value={job.technologies}
                    onChange={(chips) => handleTechnologiesChange(chips)}
                />

            </Stack>
        </DialogContent>
    </>)
}

export default JobDialogContent;