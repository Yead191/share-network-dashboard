import React, { useContext, useEffect, useState } from 'react';
import { useProfileQuery } from '../redux/apiSlices/authSlice';

type UserContextType = {
    firstName: string;
    lastName: string;
    email: any;
    contactNumber: any;
    professionalTitle: any;
    preferedGroup: any;
    aviliableHours: any;
    about: any;
    linkedInProfile: any;
    githubProfile: any;
    PortfolioWebsite: any;
    address: any;
    profile: any;
    user: any | null;
    isLoading: boolean;
};

export const UserContext = React.createContext<UserContextType>({
    user: null,
    isLoading: true,
    firstName: '',
    lastName: '',
    email: undefined,
    contactNumber: undefined,
    professionalTitle: undefined,
    preferedGroup: undefined,
    aviliableHours: undefined,
    about: undefined,
    linkedInProfile: undefined,
    githubProfile: undefined,
    PortfolioWebsite: undefined,
    address: undefined,
    profile: undefined,
});

export const UserProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [_user, setUser] = useState<any | null>(null);
    const { data, isLoading } = useProfileQuery({});
    const profile = data?.data as any; // assert type if your API returns this

    useEffect(() => {
        if (profile) {
            setUser(profile);
        }
    }, [profile]);

    return (
        <UserContext.Provider
            value={{
                user: profile ?? null,
                isLoading,
                firstName: profile?.firstName ?? '',
                lastName: profile?.lastName ?? '',
                email: profile?.email,
                contactNumber: profile?.contactNumber,
                professionalTitle: profile?.professionalTitle,
                preferedGroup: profile?.preferedGroup,
                aviliableHours: profile?.aviliableHours,
                about: profile?.about,
                linkedInProfile: profile?.linkedInProfile,
                githubProfile: profile?.githubProfile,
                PortfolioWebsite: profile?.PortfolioWebsite,
                address: profile?.address,
                profile: profile,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
