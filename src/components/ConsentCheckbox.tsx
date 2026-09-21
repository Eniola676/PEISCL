import { Link } from "react-router-dom";

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** What the data is being used for, e.g. "process my registration". */
  purpose: string;
}

/**
 * Explicit, unticked-by-default consent required by the NDPA 2023 (s.26).
 * Also captures the age/guardian confirmation required for minors (s.31).
 */
export const ConsentCheckbox = ({ id, checked, onChange, purpose }: ConsentCheckboxProps) => (
  <label htmlFor={id} className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      required
      className="mt-0.5 w-4 h-4 flex-shrink-0 rounded border-gray-300 accent-purple-600"
    />
    <span>
      I agree to PEISCL using my details to {purpose}, as described in the{" "}
      <Link to="/privacy" target="_blank" className="text-purple-600 underline hover:text-purple-700">
        Privacy Notice
      </Link>
      . I am 18 or older, or my parent/guardian has agreed. I can withdraw consent at any time.
    </span>
  </label>
);
