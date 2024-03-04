import { ReactNode, createContext, useContext, useState } from 'react';

type ErrorContextType = {
    errorMessage: string;
    setErrorMessage: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [errorMessage, setErrorMessage] = useState('');
    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};