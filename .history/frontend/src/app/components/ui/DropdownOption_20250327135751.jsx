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
                className={`mt-1 block w-full  focus:outline-none focus:ring-0  focus:shadow-none  p-2 border rounded-lg dark:bg-transparent ${
          errors ? 'border-red-600' : 'border-gray-300'`}}
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