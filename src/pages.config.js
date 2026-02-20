import Onboarding from './pages/Onboarding';
import VehicleSelection from './pages/VehicleSelection';
import Home from './pages/Home';
import Learning from './pages/Learning';
import AIAssistant from './pages/AIAssistant';
import Certifications from './pages/Certifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Onboarding": Onboarding,
    "VehicleSelection": VehicleSelection,
    "Home": Home,
    "Learning": Learning,
    "AIAssistant": AIAssistant,
    "Certifications": Certifications,
    "Profile": Profile,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};