import { ReactNode, createContext, useContext, useEffect, useState } from "react";

// This is the type definition for the context
// Note the type definition is reusable and can be used to create
// multiple contexts.
type AuthContextType = {
    role: string;
    setRole: (role: string) => void;
    username: string;
    setUsername: (username: string) => void;
}

// the context object contains two components by itself, a provider and a consumer
// the argument `undefined` is the default value of the context. It is used when
// a component that is not wrapped in a provider attempts to consume this context.
// Notice that the generic type is <AuthContextType | undefined>, which is why we can
// use undefined as the initial value.

// Note the context object itself does not store the context value.
// Instead, the context value is managed by React.
// The context object is more like a token or reference.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// note the curly brackets in { children } are for destructuring
// The AuthProvider function expects a Javascript object as its argument, and
// the object should have a property called children. The property named children
// is directly extracted and become usable. 
// When you use a component in JSX, like <AuthProvider>...</AuthProvider>,
// , React transforms the tags and the content between them into a JavaScript object 
// representation behind the scenes. The actual object that gets created and passed 
// to your component function (AuthProvider in this case) is a props object.
// Any attributes you might have added to <AuthProvider attribute="value"> become
// properties of this object. The children between the opening and closing tags become
// the value of the children property of this object.
// Note if you use <AuthProvider> multiple times, you also create multiple
// instances of AuthProvider, each having their own internal state. Although,
// the AuthContext.Provider object has only one instance across the whole application.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // the `useState` hook creates a state that is associated with the component
    // whenever the state changes, the `AuthProvider` component re-renders
    // that causes all sub-components that consumes the context also re-renders.

    // Note whenever the page is refreshed, the entire environment is reinitialized from scratch
    // so you must intialize the state appropriately
    const [role, setRole] = useState(sessionStorage.getItem("role") || '');
    const [username, setUsername] = useState(sessionStorage.getItem("username") || '');
    // Whenever `role` and `username` changes, the sessionStorage is updated too.
    useEffect(() => {
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('username', username);
    }, [role, username]);
    return (
        <AuthContext.Provider value={{ role, setRole, username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

// when a child component invokes `useAuth` or `useContext(AuthContext)`,
// we say the child consumes the context, and only then does the child
// react to changes in the `AuthContext` value.
export const useAuth = () => {
    const context = useContext(AuthContext);
    // `AuthContext` has been created with `undefined` as its default value.
    // Therefore, if a component attempts to consume the context without
    // being wrapped in a provider, the context will be undefined.
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}