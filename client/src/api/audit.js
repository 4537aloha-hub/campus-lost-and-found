import request from '@/utils/request.js'

// 审核通过
export const auditPass = (id) => request.put(`/admin/audit/auditPass/${id}`)

// 审核拒绝
export const auditReject = (id) => request.put(`/admin/audit/auditReject/${id}`)
