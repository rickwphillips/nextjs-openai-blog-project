import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenRuler } from '@fortawesome/free-solid-svg-icons/faPenRuler';

export const Logo = () => {
  return <div className="text-3xl text-center py-4 font-heading">
    RP.BlogStandard
    <FontAwesomeIcon icon={faPenRuler} className="text-2xl text-slate-400" />
  </div>;
}