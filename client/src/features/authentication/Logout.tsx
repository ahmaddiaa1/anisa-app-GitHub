import ButtonIcon from "../../ui/ButtonIcon.tsx";
import {HiArrowRightOnRectangle} from "react-icons/hi2";
import {useLogout} from "../../hooks/useLogout.ts";
import SpinnerMini from "../../ui/SpinnerMini.tsx";

const Logout = () => {
    const {isPending, logout} = useLogout();
    return (
        <ButtonIcon disabled={isPending} onClick={() => logout()}>
            {!isPending ? <HiArrowRightOnRectangle/> : <SpinnerMini/>}
        </ButtonIcon>
    );
};

export default Logout;
