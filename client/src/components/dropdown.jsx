import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dropdown({dropdownTitle, selectedOption, onOptionChange, availableOptions}){
    return(
        <FormControl size="small" sx={{width: "100%"}} >
            <InputLabel id="demo-simple-select-label">{dropdownTitle}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                onChange={onOptionChange}
                defaultValue={""}
            >
            <MenuItem value="">None</MenuItem>
            {
                availableOptions.map((option, index) => {
                    return (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                    )
                })
            }
            </Select>
        </FormControl>
    );
}