import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  CheckCircle2,
  ScanLine,
  User,
  Ticket,
  MapPin,
  Clock,
  RotateCcw,
  XCircle,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/adminAPI";

interface CheckInResult {
  bookingId: string;
  ticketNumber: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    location: string;
  };
  seats: {
    seatCode: string;
    category: string;
  }[];
}

const QRScanner = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const startScanner = async () => {
    try {
      setErrorMessage("");
      setResult(null);

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          console.log("QR SCANNED:", decodedText);
          try {
            await scanner.stop();
          } catch (error) {
            console.log("Scanner stop error:", error);
          }
          setIsScanning(false);
          await processQRCode(decodedText);
        },
        () => {} // Ignore continuous scanning errors
      );

      setIsScanning(true);
    } catch (error: any) {
      console.error("Camera error:", error);
      toast.error("Unable to access camera. Please allow camera permission.", {
        style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(244, 63, 94, 0.4)", borderRadius: "12px" }
      });
    }
  };

  const processQRCode = async (qrText: string) => {
    try {
      setIsCheckingIn(true);
      setErrorMessage("");
      let ticketNumber = "";

      try {
        const qrData = JSON.parse(qrText);
        ticketNumber = qrData.ticketNumber;
      } catch {
        ticketNumber = qrText.trim();
      }

      if (!ticketNumber) throw new Error("Ticket number not found in QR code");

      const response = await API.post("/booking/check-in", { ticketNumber });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Ticket check-in failed");
      }

      setResult(response.data.data);
      toast.success("Ticket checked in successfully!", {
        style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "12px" }
      });
    } catch (error: any) {
      console.error("Check-in error:", error);
      const message = error.response?.data?.message || error.message || "Invalid ticket";
      setErrorMessage(message);
      toast.error(message, {
        style: { background: "#0F172A", color: "#F8FAFC", border: "1px solid rgba(244, 63, 94, 0.4)", borderRadius: "12px" }
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (error) {
      console.log("Stop scanner error:", error);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const scanNext = async () => {
    setResult(null);
    setErrorMessage("");
    await startScanner();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    // Mobile-first dark wrapper for an immersive scanner feel
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-[#6C5CE7]/30 selection:text-white relative overflow-hidden">
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#6C5CE7]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00B4D8]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* App-like Container */}
      <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col min-h-[85vh] sm:min-h-[800px] z-10">
        
        {/* Header Area */}
        <div className="px-6 pt-8 pb-4 bg-gradient-to-b from-[#0F172A] to-[#0F172A]/90 backdrop-blur-md sticky top-0 z-10 border-b border-[#1E293B]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#6C5CE7]/20 border border-[#6C5CE7]/40 text-[#6C5CE7] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(108,92,231,0.3)]">
              <ScanLine size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-[900] text-[#F8FAFC] tracking-tight">
                Entry Scanner
              </h1>
              <p className="text-xs text-[#00B4D8] font-[700] uppercase tracking-widest mt-0.5">
                Scan TuneTix passes
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 pb-8 flex flex-col">
          
          {/* =================================================
              SCANNER SECTION
          ================================================= */}
          {(!result && !errorMessage) && (
            <div className="flex-1 flex flex-col">
              <div className="relative w-full aspect-[4/5] bg-[#020617] rounded-3xl overflow-hidden border border-[#1E293B] shadow-inner mt-4">
                
                {/* Camera View */}
                <div id="qr-reader" className="w-full h-full object-cover" />

                {/* Loading / Verifying Overlay */}
                {isCheckingIn && (
                  <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-[#6C5CE7]/30 border-t-[#6C5CE7] rounded-full animate-spin shadow-[0_0_15px_rgba(108,92,231,0.5)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-[#6C5CE7] animate-pulse" />
                      </div>
                    </div>
                    <p className="text-white font-[800] text-sm mt-4 uppercase tracking-widest animate-pulse">
                      Verifying Ticket...
                    </p>
                  </div>
                )}

                {/* Empty State Overlay */}
                {!isScanning && !isCheckingIn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0F172A]/50 z-10">
                    <div className="w-20 h-20 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center mb-4 shadow-sm">
                      <Camera size={32} className="text-[#00B4D8]" />
                    </div>
                    <h3 className="font-[900] text-[#F8FAFC] text-lg">Camera Ready</h3>
                    <p className="text-xs text-[#94A3B8] font-[500] mt-2 max-w-[200px]">
                      Position the QR code inside the frame to scan automatically.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 mb-2">
                {!isScanning && !isCheckingIn ? (
                  <button
                    onClick={startScanner}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C5CE7] to-[#8B78FF] hover:from-[#5A4BCF] hover:to-[#6C5CE7] active:scale-[0.98] text-white py-4 rounded-2xl font-[800] text-base uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(108,92,231,0.4)]"
                  >
                    <Camera size={20} />
                    Start Scanning
                  </button>
                ) : isScanning ? (
                  <button
                    onClick={stopScanner}
                    className="w-full flex items-center justify-center gap-2 bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] hover:bg-[#F43F5E]/20 active:scale-[0.98] py-4 rounded-2xl font-[800] text-base uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    <XCircle size={20} />
                    Stop Camera
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {/* =================================================
              SUCCESS RESULT (Ticket Design)
          ================================================= */}
          {result && (
            <div className="flex-1 flex flex-col mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              {/* Ticket Top */}
              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-t-3xl p-6 text-white relative shadow-lg border-t border-emerald-400/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-[900] tracking-tight">Access Granted</h2>
                    <p className="text-emerald-100 font-medium text-xs mt-0.5 opacity-90 uppercase tracking-wider">Ticket valid & checked in</p>
                  </div>
                </div>
                
                {/* Cutout circles for ticket effect */}
                <div className="absolute -bottom-3 left-0 w-6 h-6 bg-[#0F172A] rounded-r-full" />
                <div className="absolute -bottom-3 right-0 w-6 h-6 bg-[#0F172A] rounded-l-full" />
              </div>

              {/* Ticket Body */}
              <div className="bg-[#020617] border-x border-dashed border-[#1E293B] px-6 py-6 space-y-6 relative flex-1">
                
                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[#1E293B] p-2.5 rounded-xl text-[#00B4D8] border border-[#334155]"><User size={20} /></div>
                  <div>
                    <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-wider mb-1">Attendee</p>
                    <p className="font-[900] text-[#F8FAFC] text-lg leading-none">{result.user.name}</p>
                    <p className="text-xs text-[#94A3B8] mt-1 font-[500]">{result.user.email}</p>
                  </div>
                </div>

                <div className="h-px bg-[#1E293B] w-full" />

                {/* Event Info */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[#1E293B] p-2.5 rounded-xl text-[#6C5CE7] border border-[#334155]"><MapPin size={20} /></div>
                  <div>
                    <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-wider mb-1">Event Details</p>
                    <p className="font-[900] text-[#F8FAFC] text-base leading-tight">{result.event.title}</p>
                    <p className="text-xs text-[#94A3B8] mt-1 font-[500]">
                      {result.event.venue}, {result.event.location}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-[700] text-[#F8FAFC] bg-[#1E293B] border border-[#334155] w-fit px-3 py-1 rounded-lg">
                      <Clock size={14} className="text-[#00B4D8]" />
                      {formatDate(result.event.date)} • {result.event.time}
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-wider mb-3">Reserved Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {result.seats.map((seat, index) => (
                      <span key={index} className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] text-[#00B4D8] text-xs font-[800] border border-[#334155] shadow-sm">
                        {seat.category} <span className="mx-1 text-[#64748B]">|</span> {seat.seatCode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ticket Bottom */}
              <div className="bg-[#020617] border-t border-dashed border-[#1E293B] rounded-b-3xl p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-wider mb-1">Ticket ID</p>
                    <p className="font-mono font-[800] text-[#F8FAFC] text-xs">{result.ticketNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#64748B] font-[800] uppercase tracking-wider mb-1">Check-in Time</p>
                    <p className="font-[800] text-[#10B981] text-xs">{formatDateTime(result.checkedInAt)}</p>
                  </div>
                </div>

                <button
                  onClick={scanNext}
                  className="w-full flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] active:scale-[0.98] text-[#F8FAFC] py-4 rounded-xl font-[800] uppercase tracking-wider transition-all shadow-md"
                >
                  <RotateCcw size={18} />
                  Scan Next Ticket
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR STATE
          ================================================= */}
          {errorMessage && !result && (
            <div className="flex-1 flex flex-col justify-center mt-4 animate-in zoom-in-95 duration-300">
              <div className="bg-[#020617] border border-[#F43F5E]/40 rounded-3xl shadow-[0_0_30px_rgba(244,63,94,0.2)] overflow-hidden text-center relative">
                <div className="bg-[#F43F5E]/10 p-8 flex flex-col items-center border-b border-[#F43F5E]/20">
                  <div className="w-20 h-20 rounded-full bg-[#F43F5E]/20 text-[#F43F5E] flex items-center justify-center mb-4 border border-[#F43F5E]/40 shadow-inner">
                    <XCircle size={40} />
                  </div>
                  <h2 className="font-[900] text-[#F43F5E] text-2xl">Entry Denied</h2>
                  <p className="text-[#94A3B8] mt-2 font-[600] text-sm bg-[#0F172A] px-4 py-2 rounded-xl border border-[#1E293B] inline-block">
                    {errorMessage}
                  </p>
                </div>
                <div className="p-6 bg-[#020617]">
                  <button
                    onClick={scanNext}
                    className="w-full flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] active:scale-[0.98] text-[#F8FAFC] py-4 rounded-xl font-[800] uppercase tracking-wider transition-all"
                  >
                    <RotateCcw size={18} />
                    Try Scanning Again
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default QRScanner;