import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { apiRequest } from '../../lib/api'
import { TableSkeleton } from '../../components/Skeleton'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import { USER_ROLES } from '../../constants'
import { humanizeEnum } from '../../utils/enums'

export default function RolesPermissions() {
  const [permissions, setPermissions] = useState([])
  const [rolePermissions, setRolePermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [perms, rolePerms] = await Promise.all([
        apiRequest('/api/permissions'),
        apiRequest('/api/role_permissions'),
      ])
      setPermissions(perms)
      setRolePermissions(rolePerms)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function getRolePerm(role, permissionId) {
    return rolePermissions.find((rp) => rp.role === role && rp.permission_id === permissionId)
  }

  async function togglePermission(role, permissionId) {
    const existing = getRolePerm(role, permissionId)
    try {
      if (existing) {
        await apiRequest(`/api/role_permissions/${existing.id}`, { method: 'DELETE' })
        toast.success('अनुमति हटाई गई')
      } else {
        await apiRequest('/api/role_permissions', {
          method: 'POST',
          body: JSON.stringify({ role_permission: { role, permission_id: permissionId } }),
        })
        toast.success('अनुमति जोड़ी गई')
      }
      load()
    } catch {
      toast.error('अनुमति अपडेट करने में त्रुटि')
    }
  }

  if (error) return <div className="p-5"><ErrorMessage message={error} /></div>
  if (loading) return <div className="p-5"><h1 className="mb-5 text-xl font-black">भूमिका अनुमतियां</h1><TableSkeleton columns={permissions.length || 6} /></div>
  if (permissions.length === 0) return <div className="p-5"><h1 className="mb-5 text-xl font-black">भूमिका अनुमतियां</h1><EmptyState message="कोई अनुमति नहीं मिली" /></div>

  return (
    <div className="p-5">
      <h1 className="mb-5 text-xl font-black">भूमिका अनुमतियां</h1>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                भूमिका
              </th>
              {permissions.map((permission) => (
                <th key={permission.id} className="min-w-[120px] px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500" title={permission.key}>
                  {humanizeEnum(permission.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USER_ROLES.map((role) => (
              <tr key={role} className="border-t">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-700">
                  {humanizeEnum(role)}
                </td>
                {permissions.map((permission) => {
                  const has = getRolePerm(role, permission.id)
                  return (
                    <td key={permission.id} className="px-3 py-3 text-center">
                      <button
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-bold transition-colors ${
                          has
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-600'
                            : 'border-slate-200 text-slate-300 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                        onClick={() => togglePermission(role, permission.id)}
                        title={has ? 'हटाने के लिए क्लिक करें' : 'जोड़ने के लिए क्लिक करें'}
                      >
                        {has ? '✓' : '○'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
