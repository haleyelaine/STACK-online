import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './themes.css';
import Layout from './components/Layout.jsx';
import Home from './Home.jsx';
import CheckInView from './features/check-in/CheckInView.jsx';
import ManifestView from './features/manifest/ManifestView.jsx';
import WaiversView from './features/waivers/WaiversView.jsx';
import SettingsDashboard from './features/settings/SettingsDashboard.jsx';
import JumpTypes from './features/settings/JumpTypes.jsx';
import TandemAltitudes from './features/settings/TandemAltitudes.jsx';
import MediaOptions from './features/settings/MediaOptions.jsx';
import StudentJumps from './features/settings/StudentJumps.jsx';
import RolesAndRatings from './features/settings/RolesAndRatings.jsx';
import CustomizeView from './features/settings/CustomizeView.jsx';
import DevTest from './features/dev/DevTest.jsx';
import CreateSTACKUser from './features/settings/CreateSTACKUser.jsx';
import SignIn from './components/SignIn.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import POSDashboard from './features/POS/POSDashboard.jsx';
import { JumpersProvider } from './contexts/JumpersContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthProvider>
    <JumpersProvider> {/* 👈 Wrap everything that needs jumper access */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="check-in" element={<CheckInView />} />
            <Route path="manifest" element={<ManifestView />} />
            <Route path="waivers" element={<WaiversView />} />
            <Route path="settings" element={<SettingsDashboard />} />
            <Route path="jump-types" element={<JumpTypes />} />
            <Route path="tandem-altitudes" element={<TandemAltitudes />} />
            <Route path="media-options" element={<MediaOptions />} />
            <Route path="student-jumps" element={<StudentJumps />} />
            <Route path="roles-and-ratings" element={<RolesAndRatings />} />
            <Route path="customize-view" element={<CustomizeView />} />
            <Route path="dev-test" element={<DevTest />} />
            <Route path="create-user" element={<CreateSTACKUser />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="POS" element={<POSDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </JumpersProvider>
  </AuthProvider>
</React.StrictMode>

);
