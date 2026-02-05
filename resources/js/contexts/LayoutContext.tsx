import { createContext, ReactNode, useContext, useState } from "react";

// Define the layout position type
export type LayoutPosition = 'left' | 'right';

// Define the context type
type LayoutContextType = {
    // Current layout position
    position: LayoutPosition;

    // Function to update the layout position
    updatePosition: (val: LayoutPosition) => void;
};

// Create the context, initially undefined
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Create the provider component, the 'LayoutProvider' will be called in the main app component ('resources/js/app.tsx')
export const LayoutProvider = ({ children }: { children: ReactNode }) => {

    // State to hold the current layout position, defaulting to 'left' or the value from localStorage
    const [position, setPosition] = useState<LayoutPosition>(() => {
        // Try to get the stored position from localStorage
        const storedPosition = localStorage.getItem('layoutPosition') as LayoutPosition;

        // Safely return the stored position if valid, otherwise default to 'left'
        return (storedPosition === 'left' || storedPosition === 'right') ? storedPosition : 'left';
    });

    // Function to update the layout position and store it in localStorage
    const updatePosition = (val: LayoutPosition) => {
        // Update the state value
        setPosition(val);

        // Store the new position in localStorage
        localStorage.setItem('layoutPosition', val);
    }

    // Provide the context value to children components
    return <LayoutContext.Provider value={{ position, updatePosition }}>{children}</LayoutContext.Provider>;
};

// Custom hook to use the LayoutContext. "useLayout" can be called in parts to check the position of sidebar
export const useLayout = () => {
    // Get the context value
    const context = useContext(LayoutContext);

    // If context is undefined, it means the hook is used outside of a LayoutProvider
    if (!context) throw new Error("useLayout must be used within a LayoutProvider");

    // Otherwise, return the context value
    return context;
};