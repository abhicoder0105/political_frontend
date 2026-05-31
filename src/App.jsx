import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getStoredUser, clearStoredUser } from './lib/auth'
import PublicLayout from './pages/PublicLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import NewRequest from './pages/NewRequest'
import RequestStatus from './pages/RequestStatus'
import Profile from './pages/Profile'
import NewsList from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import CampaignsList from './pages/CampaignsList'
import CampaignDetail from './pages/CampaignDetail'
import CampaignSupport from './pages/CampaignSupport'
import WorkDetail from './pages/WorkDetail'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import PopulationRecords from './pages/admin/PopulationRecords'
import AdminRequestsList from './pages/admin/RequestsList'
import AdminRequestDetail from './pages/admin/RequestDetail'
import AdminCampaignsList from './pages/admin/CampaignsList'
import AdminCampaignDetail from './pages/admin/CampaignDetail'
import WorkDone from './pages/admin/WorkDone'
import PrPosts from './pages/admin/PrPosts'
import Areas from './pages/admin/Areas'
import Team from './pages/admin/Team'
import Users from './pages/admin/Users'
import RolesPermissions from './pages/admin/RolesPermissions'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  const [user, setUser] = useState(getStoredUser())

  function handleLogout() {
    clearStoredUser()
    setUser(null)
  }

  return (
    <Routes>
      <Route element={<PublicLayout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/request/new" element={<NewRequest />} />
        <Route path="/request/status" element={<RequestStatus />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/campaigns" element={<CampaignsList />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/campaigns/:id/support" element={<CampaignSupport />} />
        <Route path="/work/:id" element={<WorkDetail />} />
      </Route>
      <Route
        path="/admin"
        element={<AdminLayout user={user} onLogout={handleLogout} />}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="population" element={<PopulationRecords />} />
        <Route path="requests" element={<AdminRequestsList />} />
        <Route path="requests/:id" element={<AdminRequestDetail />} />
        <Route path="campaigns" element={<AdminCampaignsList />} />
        <Route path="campaigns/:id" element={<AdminCampaignDetail />} />
        <Route path="work" element={<WorkDone />} />
        <Route path="pr" element={<PrPosts />} />
        <Route path="areas" element={<Areas />} />
        <Route path="team" element={<Team />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<RolesPermissions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
