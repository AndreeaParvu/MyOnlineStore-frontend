import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

export default function PrivateRoutes() {
    const { user } = useAppSelector(state => state.account);

    return (
        user ? <Outlet /> : <Navigate to='/login' />
    );
}