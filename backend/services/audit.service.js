import { memoryStore, supabase } from '../config/database.js';

export class AuditService {
  /**
   * Logs an immutable audit event
   */
  static async log({ actorId, actorName, actorRole, action, entityType, entityId, beforeState = null, afterState = null, ipAddress = null }) {
    const logEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      actor_id: actorId,
      actor_name: actorName,
      actor_role: actorRole,
      action,
      entity_type: entityType,
      entity_id: entityId,
      before_state: beforeState,
      after_state: afterState,
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    };

    memoryStore.audit_logs.unshift(logEntry);

    if (supabase) {
      try {
        await supabase.from('audit_logs').insert([logEntry]);
      } catch (err) {
        console.warn('[AuditService] Supabase log sync warning:', err.message);
      }
    }

    return logEntry;
  }

  /**
   * Retrieves audit logs (Admin only)
   */
  static async getLogs({ page = 1, limit = 50, entityType = null } = {}) {
    let logs = [...memoryStore.audit_logs];

    if (entityType) {
      logs = logs.filter(l => l.entity_type === entityType);
    }

    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      logs: paginated
    };
  }
}
