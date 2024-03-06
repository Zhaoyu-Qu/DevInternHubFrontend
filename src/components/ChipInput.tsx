import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Chip, TextField, Box, Stack } from '@mui/material';

interface ChipInputProps {
    value: string[];
    onChange: (chips: string[]) => void;
}

// React.FC stands for React Functional Component.
// It is a generic type provided by React's type definitions (when using TypeScript) that
// is used to type functional components.
const ChipInput: React.FC<ChipInputProps> = ({ value, onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (event: KeyboardEvent) => {
        if ((event.key === ',' || event.key === 'Enter') && inputValue.trim() !== '') {
            event.preventDefault(); // Prevent default to avoid the comma being added
            const newChip = inputValue.replace(',', '').trim();
            if (!value.includes(newChip)) {
                onChange([...value, newChip]);
            }
            setInputValue('');
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleDelete = (chipToDelete: string) => {
        onChange(value.filter((chip) => chip !== chipToDelete));
    };

    const commonSx = {
        width: { sm: 200, md: 300 },
        "& .MuiInputBase-root": {
            height: 35
        }
    };

    const commonInputLabelProps = { shrink: true };

    return (

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Stack>
                <TextField
                    label="Technologies"
                    variant="outlined"
                    placeholder="Type and press comma..."
                    size="small"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    sx={commonSx} InputLabelProps={commonInputLabelProps}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: commonSx.width }}>
                    {value.length > 0 && (
                        <Box component="span" sx={{ fontSize: '1rem', mr: 2 }}>Technologies:</Box>
                    )}
                    {value.map((tech, index) => (
                        <Chip
                            key={index}
                            label={tech}
                            onDelete={() => handleDelete(tech)}
                            size="small"
                        />
                    ))}
                </Box>
            </Stack>
        </Box>

    );
};

export default ChipInput;