import { 
  findRequestById, 
  addRequest, 
  updateRequest as updateRequestModel, 
  getAllRequests,
  getRequestsByEquipmentId,
  getRequestsByType,
  MaintenanceRequest,
  RequestStatus,
  RequestType
} from '../models/request.model';
import { findEquipmentById, updateEquipment } from '../models/equipment.model';
import { supabaseAdmin } from '../config/supabase';
import { randomUUID } from 'crypto';

const REPORT_BUCKET = process.env.SUPABASE_REPORT_BUCKET || 'maintenance-reports';

interface StatusUpdatePayload {
  status: RequestStatus;
  work_notes?: string;
  report_url?: string;
  report_base64?: string;
  report_filename?: string;
  userId: string;
  userRole: 'admin' | 'manager' | 'technician';
}

const ensureDurationInterval = (value: any): string => {
  if (!value) return '02:00:00';
  if (typeof value === 'string') {
    const match = value.match(/([\d.]+)/);
    const hours = match ? parseFloat(match[1]) : 2;
    const mins = (hours % 1) * 60;
    return `${String(Math.floor(hours)).padStart(2, '0')}:${String(Math.floor(mins)).padStart(2, '0')}:00`;
  }
  const hours = Math.floor(value);
  const mins = (value % 1) * 60;
  return `${String(hours).padStart(2, '0')}:${String(Math.floor(mins)).padStart(2, '0')}:00`;
};

const uploadReportToStorage = async (base64?: string, filename?: string): Promise<string | undefined> => {
  if (!base64) return undefined;

  const dataPart = base64.includes(',') ? base64.split(',')[1] : base64;
  const buffer = Buffer.from(dataPart, 'base64');

  // Ensure the bucket exists (create if missing)
  const ensureBucketExists = async () => {
    try {
      const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
      if (!error && buckets && buckets.some((b: any) => b.name === REPORT_BUCKET)) {
        return;
      }
    } catch (e) {
      // Non-fatal, we'll still attempt creation
    }
    const { error: createError } = await supabaseAdmin.storage.createBucket(REPORT_BUCKET, { public: true });
    if (createError) {
      console.error('Failed to ensure bucket exists:', createError);
      throw new Error('Storage bucket unavailable');
    }
  };

  await ensureBucketExists();

  // Very light type guard – caller should ensure PDF only
  const targetPath = `${randomUUID()}/${filename || 'report.pdf'}`;
  const { error } = await supabaseAdmin.storage.from(REPORT_BUCKET).upload(targetPath, buffer, {
    contentType: 'application/pdf',
    upsert: false,
  });

  if (error) {
    console.error('Failed to upload report:', error);
    throw new Error('Failed to upload report PDF');
  }

  const { data } = supabaseAdmin.storage.from(REPORT_BUCKET).getPublicUrl(targetPath);
  return data.publicUrl;
};

export const createRequest = async (requestData: any): Promise<MaintenanceRequest | null> => {
  // Fetch equipment to validate it exists
  const equipment = await findEquipmentById(requestData.equipment_id);
  
  if (!equipment) {
    return null;
  }
  
  // Parse duration from string to interval format
  const durationInterval = ensureDurationInterval(requestData.duration);
  
  // Use provided values or fall back to equipment defaults
  const newRequest = {
    description: requestData.description,
    request_type: requestData.request_type || 'maintenance',
    equipment_id: requestData.equipment_id,
    maintenance_team_id: requestData.maintenance_team_id || equipment.maintenance_team_id,
    technician_id: requestData.technician_id || equipment.default_technician_id,
    priority: requestData.priority || 'medium',
    scheduled_date: requestData.scheduled_date || new Date().toISOString(),
    duration: durationInterval,
    created_by: requestData.created_by,
    status: 'pending' as RequestStatus,
  };
  
  return await addRequest(newRequest);
};

export const updateRequestStatus = async (id: string, payload: StatusUpdatePayload): Promise<MaintenanceRequest | null> => {
  const request = await findRequestById(id);

  if (!request) {
    return null;
  }

  // Technicians can only update their assigned requests
  if (payload.userRole === 'technician' && request.technician_id && request.technician_id !== payload.userId) {
    throw new Error('Technicians can only update their assigned requests');
  }

  // Auto-mark pending as delayed if overdue
  const now = new Date();
  const scheduled = new Date(request.scheduled_date);
  const isOverdue = request.status === 'pending' && scheduled.getTime() < now.getTime();
  const currentStatus: RequestStatus = isOverdue ? 'delayed' : request.status;

  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    'pending': ['in_progress', 'cancelled', 'delayed'],
    'delayed': ['in_progress', 'cancelled'],
    'in_progress': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };

  const allowedStatuses = validTransitions[currentStatus] || [];

  if (!allowedStatuses.includes(payload.status)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${payload.status}`);
  }

  if ((payload.status === 'completed' || payload.status === 'cancelled') && (!payload.work_notes || !(payload.report_url || payload.report_base64))) {
    throw new Error('Report PDF and notes are required to close or cancel a request');
  }

  let reportUrl = payload.report_url;
  if (!reportUrl && payload.report_base64) {
    const safeName = payload.report_filename || `report-${id}.pdf`;
    reportUrl = await uploadReportToStorage(payload.report_base64, safeName);
  }

  if (payload.status === 'completed') {
    await updateEquipment(request.equipment_id, { is_scrapped: false });
  }

  const updates: Partial<MaintenanceRequest> = {
    status: payload.status,
    work_notes: payload.work_notes,
    report_url: reportUrl,
    status_changed_by: payload.userId,
    status_changed_at: new Date().toISOString(),
  };

  const updated = await updateRequestModel(id, updates);
  return updated;
};

export const assignRequestTechnician = async (id: string, technicianId: string): Promise<MaintenanceRequest | null> => {
  return await updateRequestModel(id, { technician_id: technicianId });
};

export const listAllRequests = async (filters?: { 
  technicianId?: string;
  status?: RequestStatus;
  role?: string;
}): Promise<MaintenanceRequest[]> => {
  const rows = await getAllRequests(filters);

  const now = new Date();
  const updates: Promise<MaintenanceRequest | null>[] = [];

  const adjusted = rows.map((req) => {
    if (req.status === 'pending') {
      const scheduled = new Date(req.scheduled_date);
      if (scheduled.getTime() < now.getTime()) {
        updates.push(updateRequestModel(req.id, { status: 'delayed' as RequestStatus }));
        return { ...req, status: 'delayed' as RequestStatus };
      }
    }
    return req;
  });

  // Fire-and-forget updates to persist delayed status
  if (updates.length > 0) {
    Promise.all(updates).catch((err) => console.error('Failed to persist delayed statuses:', err));
  }

  return adjusted;
};

export const listRequestsByEquipment = async (equipmentId: string): Promise<MaintenanceRequest[]> => {
  return await getRequestsByEquipmentId(equipmentId);
};

export const listRequestsByType = async (type: RequestType): Promise<MaintenanceRequest[]> => {
  return await getRequestsByType(type);
};

export const getOverdueRequests = async (): Promise<MaintenanceRequest[]> => {
  const now = new Date();
  const allRequests = await getAllRequests();
  return allRequests.filter(req => {
    const scheduled = new Date(req.scheduled_date);
    return scheduled.getTime() < now.getTime() && req.status !== 'completed';
  });
};

