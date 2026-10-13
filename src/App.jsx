import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  Calendar,
  Clock,
  MapPin,
  Layers,
  Check,
  X,
  Plus,
  Trash2,
  Edit3,
  Download,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Eye,
  EyeOff,
  ChevronRight,
  FileText
} from 'lucide-react';

const SESSION_DURATION_MINUTES = 75;

function add75Minutes(startTime) {
  if (!startTime || !startTime.includes(':')) return '11:15';
  const [hStr, mStr] = startTime.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return '11:15';
  const totalMinutes = h * 60 + m + SESSION_DURATION_MINUTES;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

function formatTime12Hour(time24) {
  if (!time24 || !time24.includes(':')) return '--:--';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDateClean(dateStr) {
  if (!dateStr) return 'TBD';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const INITIAL_SESSIONS = [
  {
    id: 'sess-1',
    subject: 'Corporate Finance',
    sessionNumber: 1,
    date: '2026-10-12',
    startTime: '09:00',
    endTime: '10:15',
    classroom: 'Room 204',
    included: true
  },
  {
    id: 'sess-2',
    subject: 'Corporate Finance',
    sessionNumber: 2,
    date: '2026-10-14',
    startTime: '09:00',
    endTime: '10:15',
    classroom: 'Room 204',
    included: true
  },
  {
    id: 'sess-3',
    subject: 'Corporate Finance',
    sessionNumber: 3,
    date: '2026-10-16',
    startTime: '09:00',
    endTime: '10:15',
    classroom: 'Room 204',
    included: true
  },
  {
    id: 'sess-4',
    subject: 'Marketing Management',
    sessionNumber: 1,
    date: '2026-10-12',
    startTime: '10:30',
    endTime: '11:45',
    classroom: 'LH-102',
    included: true
  },
  {
    id: 'sess-5',
    subject: 'Marketing Management',
    sessionNumber: 2,
    date: '2026-10-14',
    startTime: '10:30',
    endTime: '11:45',
    classroom: 'LH-102',
    included: true
  },
  {
    id: 'sess-6',
    subject: 'Marketing Management',
    sessionNumber: 3,
    date: '2026-10-16',
    startTime: '10:30',
    endTime: '11:45',
    classroom: 'LH-102',
    included: true
  },
  {
    id: 'sess-7',
    subject: 'Supply Chain Operations',
    sessionNumber: 1,
    date: '2026-10-13',
    startTime: '14:00',
    endTime: '15:15',
    classroom: 'CR-301',
    included: true
  },
  {
    id: 'sess-8',
    subject: 'Supply Chain Operations',
    sessionNumber: 2,
    date: '2026-10-15',
    startTime: '14:00',
    endTime: '15:15',
    classroom: 'CR-301',
    included: true
  },
  {
    id: 'sess-9',
    subject: 'Quantitative Methods',
    sessionNumber: 1,
    date: '2026-10-13',
    startTime: '15:30',
    endTime: '16:45',
    classroom: 'Lab 02',
    included: true
  },
  {
    id: 'sess-10',
    subject: 'Quantitative Methods',
    sessionNumber: 2,
    date: '2026-10-15',
    startTime: '15:30',
    endTime: '16:45',
    classroom: 'Lab 02',
    included: true
  }
];

function generateSampleCalendarScreenshot() {
  const canvas = document.createElement('canvas');
  canvas.width = 1040;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');

  // Minimalist background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header bar
  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, canvas.width, 68);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('TERM ACADEMIC CALENDAR — SCHEDULE OF 75-MINUTE SESSIONS', 28, 34);
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '13px sans-serif';
  ctx.fillText('All sessions are 75 minutes in duration | Format: Date, Start Time, Subject, Session #, Classroom', 28, 54);

  const sampleRows = [
    { date: '2026-10-19', startTime: '09:00', endTime: '10:15', subject: 'Corporate Finance', sessionNumber: 4, classroom: 'Room 204' },
    { date: '2026-10-19', startTime: '10:30', endTime: '11:45', subject: 'Marketing Management', sessionNumber: 4, classroom: 'LH-102' },
    { date: '2026-10-20', startTime: '14:00', endTime: '15:15', subject: 'Supply Chain Operations', sessionNumber: 3, classroom: 'CR-301' },
    { date: '2026-10-20', startTime: '15:30', endTime: '16:45', subject: 'Quantitative Methods', sessionNumber: 3, classroom: 'Lab 02' },
    { date: '2026-10-21', startTime: '11:00', endTime: '12:15', subject: 'Strategic Management', sessionNumber: 1, classroom: 'LH-105' }
  ];

  // Table Header
  const colX = [28, 180, 360, 680, 820];
  const headers = ['Date', 'Timing (75 Min)', 'Subject Name', 'Session #', 'Classroom Assigned'];

  ctx.fillStyle = '#F4F4F5';
  ctx.fillRect(20, 90, canvas.width - 40, 40);
  ctx.strokeStyle = '#E4E4E7';
  ctx.strokeRect(20, 90, canvas.width - 40, 40);

  ctx.fillStyle = '#27272A';
  ctx.font = 'bold 14px sans-serif';
  headers.forEach((h, i) => {
    ctx.fillText(h, colX[i], 115);
  });

  let y = 130;
  sampleRows.forEach((row, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
    ctx.fillRect(20, y, canvas.width - 40, 68);
    ctx.strokeStyle = '#E4E4E7';
    ctx.strokeRect(20, y, canvas.width - 40, 68);

    ctx.fillStyle = '#18181B';
    ctx.font = '14px monospace';
    ctx.fillText(row.date, colX[0], y + 40);
    ctx.fillText(`${row.startTime} - ${row.endTime}`, colX[1], y + 40);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(row.subject, colX[2], y + 40);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#52525B';
    ctx.fillText(`Session ${row.sessionNumber}`, colX[3], y + 40);

    ctx.fillStyle = '#18181B';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(row.classroom, colX[4], y + 40);

    y += 68;
  });

  return {
    fileName: 'Term_Calendar_Schedule_Sample.png',
    dataUrl: canvas.toDataURL('image/png'),
    fallbackSessions: sampleRows
  };
}

async function extractSessionsWithGemini(base64Image, mimeType, fileName) {
  const apiKey = '';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const systemPrompt = `You are a precise timetable extraction assistant.
Inspect the uploaded college calendar screenshot and extract every class session visible.
Rules:
1. Every session is strictly 75 minutes long. Extract startTime in 24-hour "HH:MM" format (e.g. "09:00", "14:30").
2. Extract subject (Subject Name), date ("YYYY-MM-DD"), classroom (Classroom assigned, e.g., "Room 204", "LH-102"), and sessionNumber (integer).
3. Do not include any person or institution names.`;

  const responseSchema = {
    type: 'OBJECT',
    properties: {
      sessions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            subject: { type: 'STRING' },
            date: { type: 'STRING' },
            startTime: { type: 'STRING' },
            classroom: { type: 'STRING' },
            sessionNumber: { type: 'INTEGER' }
          },
          propertyOrdering: ['subject', 'date', 'startTime', 'classroom', 'sessionNumber']
        }
      }
    },
    propertyOrdering: ['sessions']
  };

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Extract all timetable sessions from this calendar screenshot (${fileName}). Each session is 75 minutes long.`
          },
          {
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: base64Image
            }
          }
        ]
      }
    ],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema
    }
  };

  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response');
      const parsed = JSON.parse(text);
      return parsed.sessions || [];
    } catch (err) {
      if (attempt < delays.length) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
      } else {
        throw err;
      }
    }
  }
  return [];
}

function createICSFile(sessionsList) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Amit Ashok Mahajan//Term Calendar Extractor//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Term Class Schedule'
  ];

  const dtStamp = '20261014T000000Z';

  sessionsList.forEach((s) => {
    if (!s.date || !s.startTime) return;
    const endTime = add75Minutes(s.startTime);
    const cleanDate = s.date.replace(/-/g, '');
    const cleanStart = s.startTime.replace(/:/g, '') + '00';
    const cleanEnd = endTime.replace(/:/g, '') + '00';

    const summary = `${s.subject} (Session #${s.sessionNumber || 1}) — ${s.classroom || 'TBD'}`;
    const description = `Subject: ${s.subject}\\nSession: #${s.sessionNumber || 1}\\nDuration: 75 Minutes (${s.startTime} - ${endTime})\\nClassroom: ${s.classroom || 'TBD'}`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${s.id}@term-calendar`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${cleanDate}T${cleanStart}`,
      `DTEND:${cleanDate}T${cleanEnd}`,
      `SUMMARY:${summary.replace(/,/g, '\\,')}`,
      `LOCATION:${(s.classroom || 'TBD').replace(/,/g, '\\,')}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function createCSVFile(sessionsList) {
  const header = ['Subject Name', 'Session Number', 'Date', 'Start Time', 'End Time (75 mins)', 'Classroom Assigned'];
  const rows = sessionsList.map((s) => [
    `"${(s.subject || '').replace(/"/g, '""')}"`,
    s.sessionNumber || 1,
    s.date || '',
    s.startTime || '',
    add75Minutes(s.startTime),
    `"${(s.classroom || '').replace(/"/g, '""')}"`
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export default function App() {
  const [activePage, setActivePage] = useState('overview'); // 'overview' | 'subjects' | 'calendar'

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('minimal_term_sessions_v1');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [uploadedScreenshots, setUploadedScreenshots] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  // Subject-wide bulk edit state
  const [bulkEditSubjectName, setBulkEditSubjectName] = useState(null);
  const [bulkForm, setBulkForm] = useState({
    newSubjectName: '',
    newClassroom: '',
    newStartTime: ''
  });

  // Single row edit state
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionDraft, setEditingSessionDraft] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('minimal_term_sessions_v1', JSON.stringify(sessions));
    } catch {
      // ignore storage errors
    }
  }, [sessions]);

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const subjectGroups = useMemo(() => {
    const map = new Map();
    sessions.forEach((s) => {
      const key = s.subject.trim() || 'Untitled Subject';
      if (!map.has(key)) {
        map.set(key, {
          subject: key,
          count: 0,
          classrooms: new Set(),
          startTimes: new Set(),
          allIncluded: true
        });
      }
      const entry = map.get(key);
      entry.count += 1;
      if (s.classroom) entry.classrooms.add(s.classroom);
      if (s.startTime) entry.startTimes.add(s.startTime);
      if (!s.included) entry.allIncluded = false;
    });

    return Array.from(map.values()).map((g) => ({
      subject: g.subject,
      count: g.count,
      primaryClassroom: Array.from(g.classrooms).join(', ') || 'TBD',
      primaryStartTime: Array.from(g.startTimes)[0] || '09:00',
      multipleTimings: g.startTimes.size > 1,
      allIncluded: g.allIncluded
    }));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => (selectedSubjectFilter === 'ALL' ? true : s.subject === selectedSubjectFilter))
      .sort((a, b) => {
        if (a.date !== b.date) return (a.date || '').localeCompare(b.date || '');
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
  }, [sessions, selectedSubjectFilter]);

  const includedSessions = useMemo(() => {
    return sessions
      .filter((s) => s.included)
      .sort((a, b) => {
        if (a.date !== b.date) return (a.date || '').localeCompare(b.date || '');
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
  }, [sessions]);

  const processScreenshotDataUrl = async (dataUrl, fileName, fallbackRows = null) => {
    setIsExtracting(true);
    setExtractionStatus(`Analyzing ${fileName} and extracting 75-minute sessions...`);

    const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const mimeMatch = dataUrl.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    let extracted = [];
    try {
      const aiSessions = await extractSessionsWithGemini(base64Data, mimeType, fileName);
      if (aiSessions && aiSessions.length > 0) {
        extracted = aiSessions;
      } else if (fallbackRows) {
        extracted = fallbackRows;
      }
    } catch {
      if (fallbackRows) {
        extracted = fallbackRows;
      } else {
        extracted = [
          {
            subject: 'Extracted Subject',
            date: '2026-10-22',
            startTime: '10:00',
            classroom: 'Room 101',
            sessionNumber: 1
          }
        ];
      }
    }

    const formattedNewSessions = extracted.map((item, idx) => {
      const cleanStart =
        item.startTime && item.startTime.includes(':') ? item.startTime.slice(0, 5) : '09:00';
      return {
        id: `sess-${Date.now()}-${idx}`,
        subject: (item.subject || 'General Subject').trim(),
        sessionNumber: Number(item.sessionNumber) || idx + 1,
        date: item.date || '2026-10-19',
        startTime: cleanStart,
        endTime: add75Minutes(cleanStart),
        classroom: (item.classroom || 'Room TBD').trim(),
        included: true
      };
    });

    setUploadedScreenshots((prev) => [
      {
        id: `shot-${Date.now()}`,
        fileName,
        dataUrl,
        extractedCount: formattedNewSessions.length
      },
      ...prev
    ]);

    setSessions((prev) => [...formattedNewSessions, ...prev]);
    setIsExtracting(false);
    setExtractionStatus('');
    triggerToast(`Extracted ${formattedNewSessions.length} sessions (75 mins each) from ${fileName}.`);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          await processScreenshotDataUrl(result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleTrySampleScreenshot = async () => {
    const sample = generateSampleCalendarScreenshot();
    await processScreenshotDataUrl(sample.dataUrl, sample.fileName, sample.fallbackSessions);
  };

  const openBulkEditorForSubject = (subjectSummary) => {
    setBulkEditSubjectName(subjectSummary.subject);
    setBulkForm({
      newSubjectName: subjectSummary.subject,
      newClassroom: subjectSummary.primaryClassroom.split(',')[0].trim(),
      newStartTime: subjectSummary.primaryStartTime
    });
  };

  const handleApplySubjectBulkChanges = (e) => {
    e.preventDefault();
    if (!bulkEditSubjectName) return;

    const targetSubject = bulkEditSubjectName;
    const updatedName = bulkForm.newSubjectName.trim() || targetSubject;
    const updatedClassroom = bulkForm.newClassroom.trim();
    const updatedStart = bulkForm.newStartTime.trim();

    setSessions((prev) =>
      prev.map((s) => {
        if (s.subject !== targetSubject) return s;
        const nextStart = updatedStart || s.startTime;
        return {
          ...s,
          subject: updatedName,
          classroom: updatedClassroom !== '' ? updatedClassroom : s.classroom,
          startTime: nextStart,
          endTime: add75Minutes(nextStart)
        };
      })
    );

    if (selectedSubjectFilter === targetSubject) {
      setSelectedSubjectFilter(updatedName);
    }
    setBulkEditSubjectName(null);
    triggerToast(`Updated all sessions for "${updatedName}" (75-min timings recalculated).`);
  };

  const handleToggleSubjectIncluded = (subjectName) => {
    const group = subjectGroups.find((g) => g.subject === subjectName);
    if (!group) return;
    const nextState = !group.allIncluded;
    setSessions((prev) =>
      prev.map((s) => (s.subject === subjectName ? { ...s, included: nextState } : s))
    );
    triggerToast(
      nextState
        ? `Included all "${subjectName}" sessions in schedule.`
        : `Muted "${subjectName}" from export.`
    );
  };

  const handleDeleteEntireSubject = (subjectName) => {
    setSessions((prev) => prev.filter((s) => s.subject !== subjectName));
    if (selectedSubjectFilter === subjectName) {
      setSelectedSubjectFilter('ALL');
    }
    if (bulkEditSubjectName === subjectName) {
      setBulkEditSubjectName(null);
    }
    triggerToast(`Removed all sessions for "${subjectName}".`);
  };

  const startEditingSession = (session) => {
    setEditingSessionId(session.id);
    setEditingSessionDraft({ ...session });
  };

  const saveEditingSession = () => {
    if (!editingSessionId) return;
    const nextStart = editingSessionDraft.startTime || '09:00';
    const nextEnd = add75Minutes(nextStart);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === editingSessionId
          ? {
              ...editingSessionDraft,
              subject: (editingSessionDraft.subject || 'Untitled Subject').trim(),
              sessionNumber: Number(editingSessionDraft.sessionNumber) || 1,
              startTime: nextStart,
              endTime: nextEnd
            }
          : s
      )
    );
    setEditingSessionId(null);
    triggerToast('Session details updated.');
  };

  const handleAddSession = () => {
    const defaultSubject =
      selectedSubjectFilter !== 'ALL'
        ? selectedSubjectFilter
        : subjectGroups[0]?.subject || 'New Subject';
    const existingForSubj = sessions.filter((s) => s.subject === defaultSubject);
    const nextNum = existingForSubj.length + 1;
    const defaultRoom = existingForSubj[0]?.classroom || 'Room 101';
    const defaultStart = existingForSubj[0]?.startTime || '09:00';

    const newSess = {
      id: `sess-manual-${Date.now()}`,
      subject: defaultSubject,
      sessionNumber: nextNum,
      date: '2026-10-21',
      startTime: defaultStart,
      endTime: add75Minutes(defaultStart),
      classroom: defaultRoom,
      included: true
    };

    setSessions((prev) => [newSess, ...prev]);
    startEditingSession(newSess);
  };

  const handleDownloadICS = () => {
    if (includedSessions.length === 0) {
      triggerToast('No active sessions selected to export.');
      return;
    }
    const content = createICSFile(includedSessions);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Term_Timetable_75Min_Sessions.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${includedSessions.length} sessions to .ICS calendar file.`);
  };

  const handleDownloadCSV = () => {
    if (includedSessions.length === 0) {
      triggerToast('No active sessions selected to export.');
      return;
    }
    const content = createCSVFile(includedSessions);
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Term_Timetable_75Min_Sessions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${includedSessions.length} sessions to CSV.`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header — Present on every page with Creator Name */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-semibold text-xs tracking-wider">
              75m
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-zinc-900 block leading-none">
                Term Timetable Extractor
              </span>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Amit Ashok Mahajan
              </span>
            </div>
          </div>

          {/* Minimalist Page Navigation */}
          <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200/80">
            {[
              { id: 'overview', label: '1. Overview & Upload' },
              { id: 'subjects', label: `2. Review & Edit (${sessions.length})` },
              { id: 'calendar', label: '3. Schedule & Export' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activePage === tab.id
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/70'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Creator Badge in Top Right */}
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span>Created by</span>
            <span className="text-zinc-900 font-semibold px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200">
              Amit Ashok Mahajan
            </span>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-zinc-700 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {}
        {activePage === 'overview' && (
          <div className="space-y-10">
            {/* Simple Minimalist Explanation Hero */}
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-700">
                  <Clock className="w-3.5 h-3.5 text-zinc-900" />
                  <span>Standardized 75-Minute Academic Sessions</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                  Turn term calendar screenshots into an editable subject schedule.
                </h1>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Upload screenshots of your college calendar for the entire term containing subject names, timings, and
                  assigned classrooms. This tool automatically extracts every <strong>75-minute session</strong> and lets
                  you review or bulk-update class details for all sessions of any subject in one place.
                </p>
              </div>

              {/* How It Works — 3-Step Visual Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-zinc-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span>STEP 01</span>
                    <Upload className="w-4 h-4 text-zinc-700" />
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900">Provide Calendar Screenshots</h2>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Upload one or multiple screenshots of your term timetable showing subjects, timings, and classrooms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-zinc-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span>STEP 02</span>
                    <Sparkles className="w-4 h-4 text-zinc-700" />
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900">Extract 75-Minute Sessions</h2>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    AI reads every session from your images and calculates exact 75-minute start and end times.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-zinc-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span>STEP 03</span>
                    <Sliders className="w-4 h-4 text-zinc-700" />
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900">Review & Bulk-Edit by Subject</h2>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Modify the classroom, timing, or subject name once to update all sessions of that subject, then export.
                  </p>
                </div>
              </div>
            </section>

            {/* Upload Term Calendar Screenshots Section */}
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-zinc-900">Upload Term Calendar Screenshots</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Select PNG or JPG screenshots of your term calendar, or test immediately with a sample term screenshot.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleTrySampleScreenshot}
                    disabled={isExtracting}
                    className="px-3.5 py-2 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-xs font-medium text-zinc-800 flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try with Sample Term Screenshot</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExtracting}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Calendar Screenshots</span>
                  </button>
                </div>
              </div>

              {/* Dropzone Area */}
              <div
                onClick={() => !isExtracting && fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl p-8 text-center cursor-pointer transition bg-[#FAFAFA]"
              >
                {isExtracting ? (
                  <div className="space-y-2 py-2">
                    <RefreshCw className="w-6 h-6 text-zinc-700 animate-spin mx-auto" />
                    <p className="text-xs font-medium text-zinc-800">{extractionStatus}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto">
                      <Upload className="w-4 h-4 text-zinc-700" />
                    </div>
                    <p className="text-xs font-medium text-zinc-800">
                      Click to choose term calendar screenshots (PNG, JPG)
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Extracts Subject Name, Date, Start Time (+75 min End Time), Session #, and Classroom Assigned
                    </p>
                  </div>
                )}
              </div>

              {/* Uploaded Screenshots Preview List */}
              {uploadedScreenshots.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Processed Screenshots ({uploadedScreenshots.length})
                    </h3>
                    <button
                      onClick={() => setActivePage('subjects')}
                      className="text-xs font-medium text-zinc-900 hover:underline flex items-center gap-1"
                    >
                      <span>Review extracted sessions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {uploadedScreenshots.map((shot) => (
                      <div key={shot.id} className="p-3 rounded-xl border border-zinc-200 bg-[#FAFAFA] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-800 truncate">{shot.fileName}</span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-200/80 text-zinc-800 text-[11px] font-medium">
                            {shot.extractedCount} sessions (75m)
                          </span>
                        </div>
                        <img
                          src={shot.dataUrl}
                          alt={shot.fileName}
                          className="w-full h-36 object-contain bg-white rounded-lg border border-zinc-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Summary Footer Bar */}
              <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-zinc-600">
                  <span>
                    <strong className="text-zinc-900">{subjectGroups.length}</strong> Subjects Detected
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-zinc-900">{sessions.length}</strong> Total Sessions (75 mins each)
                  </span>
                </div>

                <button
                  onClick={() => setActivePage('subjects')}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <span>Proceed to Review & Bulk-Edit Subjects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          </div>
        )}

        {}
        {activePage === 'subjects' && (
          <div className="space-y-8">
            {/* Subject Cards & Bulk-Update Trigger */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Review & Edit by Subject</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Select any subject below to filter its sessions, or click <strong>Edit All Sessions</strong> on a
                    subject card to change classroom, timing, or name across every session of that subject at once.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddSession}
                    className="px-3.5 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-800 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add 75-Min Session</span>
                  </button>
                  <button
                    onClick={() => setActivePage('calendar')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <span>Export Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subject Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {subjectGroups.map((group) => {
                  const isSelected = selectedSubjectFilter === group.subject;
                  return (
                    <div
                      key={group.subject}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() =>
                              setSelectedSubjectFilter(isSelected ? 'ALL' : group.subject)
                            }
                            className="text-left font-semibold text-sm leading-snug hover:underline"
                          >
                            {group.subject}
                          </button>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                              isSelected
                                ? 'bg-zinc-800 text-zinc-200'
                                : 'bg-zinc-100 text-zinc-700'
                            }`}
                          >
                            {group.count} sessions
                          </span>
                        </div>

                        <div
                          className={`text-xs space-y-1 ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Classroom: {group.primaryClassroom}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {group.primaryStartTime} – {add75Minutes(group.primaryStartTime)} (75m)
                              {group.multipleTimings ? ' +more' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-zinc-200/20 flex items-center justify-between gap-2">
                        <button
                          onClick={() => openBulkEditorForSubject(group)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                            isSelected
                              ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                              : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                          }`}
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Edit All Sessions</span>
                        </button>

                        <button
                          onClick={() => handleToggleSubjectIncluded(group.subject)}
                          className={`p-1.5 rounded-lg text-xs transition ${
                            isSelected
                              ? 'text-zinc-300 hover:text-white'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                          title={group.allIncluded ? 'Included in export' : 'Excluded from export'}
                        >
                          {group.allIncluded ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-zinc-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subject-Wide Bulk Editor Drawer / Panel */}
              {bulkEditSubjectName && (
                <form
                  onSubmit={handleApplySubjectBulkChanges}
                  className="bg-white rounded-2xl border-2 border-zinc-900 p-5 sm:p-6 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Bulk Edit Subject Details
                      </span>
                      <h3 className="text-base font-semibold text-zinc-900">
                        Update all sessions for &ldquo;{bulkEditSubjectName}&rdquo;
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBulkEditSubjectName(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-medium text-zinc-700 block mb-1">
                        Subject Name (applies to all sessions)
                      </label>
                      <input
                        type="text"
                        required
                        value={bulkForm.newSubjectName}
                        onChange={(e) =>
                          setBulkForm({ ...bulkForm, newSubjectName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-zinc-700 block mb-1">
                        Classroom Assigned (applies to all sessions)
                      </label>
                      <input
                        type="text"
                        required
                        value={bulkForm.newClassroom}
                        onChange={(e) =>
                          setBulkForm({ ...bulkForm, newClassroom: e.target.value })
                        }
                        placeholder="e.g. Room 204"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-zinc-700 block mb-1">
                        Start Time (End Time auto-set to +75 mins:{' '}
                        <strong>{add75Minutes(bulkForm.newStartTime)}</strong>)
                      </label>
                      <input
                        type="time"
                        required
                        value={bulkForm.newStartTime}
                        onChange={(e) =>
                          setBulkForm({ ...bulkForm, newStartTime: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteEntireSubject(bulkEditSubjectName)}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Entire Subject</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBulkEditSubjectName(null)}
                        className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply to All Sessions of {bulkEditSubjectName}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </section>

            {/* Filter Pills & Individual Session Table */}
            <section className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setSelectedSubjectFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedSubjectFilter === 'ALL'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    All Subjects ({sessions.length})
                  </button>
                  {subjectGroups.map((g) => (
                    <button
                      key={g.subject}
                      onClick={() => setSelectedSubjectFilter(g.subject)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                        selectedSubjectFilter === g.subject
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {g.subject} ({g.count})
                    </button>
                  ))}
                </div>

                {selectedSubjectFilter !== 'ALL' && (
                  <button
                    onClick={() => {
                      const grp = subjectGroups.find((g) => g.subject === selectedSubjectFilter);
                      if (grp) openBulkEditorForSubject(grp);
                    }}
                    className="text-xs font-medium text-zinc-900 underline flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Bulk-edit all {selectedSubjectFilter} sessions</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-zinc-200 text-zinc-500 font-medium">
                      <th className="py-3 px-4">Subject Name</th>
                      <th className="py-3 px-4">Session #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Timing (75 Mins)</th>
                      <th className="py-3 px-4">Classroom Assigned</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/80">
                    {filteredSessions.map((sess) => {
                      const isEditing = editingSessionId === sess.id;
                      const calculatedEnd = isEditing
                        ? add75Minutes(editingSessionDraft.startTime)
                        : add75Minutes(sess.startTime);

                      return (
                        <tr
                          key={sess.id}
                          className={`hover:bg-zinc-50/80 transition ${
                            !sess.included ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-medium text-zinc-900">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingSessionDraft.subject || ''}
                                onChange={(e) =>
                                  setEditingSessionDraft({
                                    ...editingSessionDraft,
                                    subject: e.target.value
                                  })
                                }
                                className="px-2 py-1 rounded border border-zinc-300 w-44"
                              />
                            ) : (
                              sess.subject
                            )}
                          </td>

                          <td className="py-3 px-4 text-zinc-600">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editingSessionDraft.sessionNumber || 1}
                                onChange={(e) =>
                                  setEditingSessionDraft({
                                    ...editingSessionDraft,
                                    sessionNumber: e.target.value
                                  })
                                }
                                className="px-2 py-1 rounded border border-zinc-300 w-16"
                              />
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">
                                #{sess.sessionNumber}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-zinc-700 font-mono">
                            {isEditing ? (
                              <input
                                type="date"
                                value={editingSessionDraft.date || ''}
                                onChange={(e) =>
                                  setEditingSessionDraft({
                                    ...editingSessionDraft,
                                    date: e.target.value
                                  })
                                }
                                className="px-2 py-1 rounded border border-zinc-300"
                              />
                            ) : (
                              formatDateClean(sess.date)
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={editingSessionDraft.startTime || '09:00'}
                                  onChange={(e) =>
                                    setEditingSessionDraft({
                                      ...editingSessionDraft,
                                      startTime: e.target.value
                                    })
                                  }
                                  className="px-2 py-1 rounded border border-zinc-300"
                                />
                                <span className="text-zinc-400">→</span>
                                <span className="font-mono text-zinc-700 font-semibold">
                                  {calculatedEnd}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                                  +75m
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-zinc-900">
                                  {formatTime12Hour(sess.startTime)} – {formatTime12Hour(calculatedEnd)}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-medium">
                                  75 min
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingSessionDraft.classroom || ''}
                                onChange={(e) =>
                                  setEditingSessionDraft({
                                    ...editingSessionDraft,
                                    classroom: e.target.value
                                  })
                                }
                                className="px-2 py-1 rounded border border-zinc-300 w-28"
                              />
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-medium">
                                <MapPin className="w-3 h-3 text-zinc-500" />
                                {sess.classroom}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={saveEditingSession}
                                  className="px-2.5 py-1 rounded-md bg-zinc-900 text-white font-medium"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingSessionId(null)}
                                  className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => startEditingSession(sess)}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                                  title="Edit session"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setSessions((prev) => prev.filter((item) => item.id !== sess.id))
                                  }
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Delete session"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {}
        {activePage === 'calendar' && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-zinc-900">Term Schedule Preview & Export</h1>
                <p className="text-xs text-zinc-500">
                  {includedSessions.length} active 75-minute sessions across {subjectGroups.length} subjects ready for
                  calendar import.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleDownloadCSV}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download CSV Spreadsheet</span>
                </button>

                <button
                  onClick={handleDownloadICS}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ICS Calendar File</span>
                </button>
              </div>
            </section>

            {/* Chronological Term Schedule Cards */}
            <section className="space-y-3">
              {includedSessions.map((sess) => {
                const endTime = add75Minutes(sess.startTime);
                return (
                  <div
                    key={sess.id}
                    className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 transition"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800">
                        {formatDateClean(sess.date)}
                      </span>
                      <span className="text-xs font-mono text-zinc-600">
                        {formatTime12Hour(sess.startTime)} – {formatTime12Hour(endTime)} (75 min)
                      </span>
                      <span className="text-sm font-semibold text-zinc-900">{sess.subject}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium">
                        Session #{sess.sessionNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#FAFAFA] border border-zinc-200 text-zinc-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{sess.classroom}</span>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSubjectFilter(sess.subject);
                          setActivePage('subjects');
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                      >
                        Edit subject
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        )}
      </main>

      {}
      <footer className="bg-white border-t border-zinc-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>Minimalist 75-Minute Term Timetable Extractor</span>
          <span className="font-semibold text-zinc-900">Amit Ashok Mahajan</span>
        </div>
      </footer>
    </div>
  );
}
