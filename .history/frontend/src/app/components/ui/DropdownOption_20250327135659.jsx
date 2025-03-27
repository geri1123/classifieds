export default function SelectInput({ label, name, value, onChange, options, placeholder }) {
    return (
        <div className="form-group">
            <label htmlFor={name} className="block text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="form-control border rounded-lg p-2 w-full"
                placeholder={placeholder}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}