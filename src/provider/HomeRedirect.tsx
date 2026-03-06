import { Navigate } from 'react-router-dom';
import { useProfileQuery } from '../redux/apiSlices/authSlice';
import Spinner from '../components/shared/Spinner';

const HomeRedirect = () => {
    const { data: profile, isLoading, isFetching } = useProfileQuery(undefined);

    if (isLoading || isFetching) {
        return <Spinner />;
    }

    const role = profile?.data?.role?.toLowerCase();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    let routeRole = role;

    if (role === 'super_admin') {
        routeRole = 'admin';
    }

    if (role === 'coordinator') {
        routeRole = 'mentor-coordinator';
    }

    return <Navigate to={`/${routeRole}/overview`} replace />;
};

export default HomeRedirect;
