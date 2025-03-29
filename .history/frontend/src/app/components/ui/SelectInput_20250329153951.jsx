export default function SelectInput({ label, name, errors, value, onChange, options, placeholder }) {
    return (
        <div className="form-group">
            <label htmlFor={name} className="block text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}  // Send the currency name to the backend
                onChange={onChange}
                className="mt-1 block w-full focus:outline-none focus:ring-0 focus:shadow-none p-2 border rounded-lg dark:bg-transparent"
                placeholder={placeholder}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.id} value={option.name}>  {/* Send the name of the currency */}
                        {option.symbol} {/* Display symbol and name */}
                    </option>
                ))}
{errors && <p className="text-sm text-red-600 ">{errors}</p>}
            </select>
            
        </div>
    );
}